const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const site = path.resolve(process.env.SITE_DIR || "_site");
const output = path.resolve("test-results");
fs.mkdirSync(output, { recursive: true });
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".xml": "application/xml",
};
const server = http.createServer((req, res) => {
  let requested = path.resolve(
    site,
    `.${decodeURIComponent(new URL(req.url, "http://localhost").pathname)}`,
  );
  if (!requested.startsWith(site + path.sep) && requested !== site) {
    res.writeHead(403).end();
    return;
  }
  if (fs.existsSync(requested) && fs.statSync(requested).isDirectory())
    requested = path.join(requested, "index.html");
  if (!fs.existsSync(requested)) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.setHeader(
    "Content-Type",
    types[path.extname(requested)] || "application/octet-stream",
  );
  fs.createReadStream(requested).pipe(res);
});
(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const report = { pages: [], responsive: [], interactions: [] };
  try {
    const walk = (dir) =>
      fs
        .readdirSync(dir, { withFileTypes: true })
        .flatMap((item) =>
          item.isDirectory()
            ? walk(path.join(dir, item.name))
            : [path.join(dir, item.name)],
        );
    const pages = walk(site).filter((file) => file.endsWith(".html"));
    const errors = [];
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    // External players are checked separately; site checks must work offline.
    await page.route("https://speakerdeck.com/player/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>Slides</title>",
      }),
    );
    page.on("pageerror", (error) => errors.push(error.message));
    // Every generated page, local link, fragment and asset must exist. Also catch metadata regressions.
    for (const file of pages) {
      const route =
        "/" +
        path
          .relative(site, file)
          .split(path.sep)
          .join("/")
          .replace(/index\.html$/, "");
      const response = await page.goto(origin + route);
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator("h1").count(), 1, `${route}: one H1`);
      assert.equal(
        await page.locator("title").count(),
        1,
        `${route}: one title`,
      );
      assert.equal(
        await page.locator('meta[name="description"]').count(),
        1,
        `${route}: one description`,
      );
      assert.equal(
        await page
          .locator('meta[property="og:locale"]')
          .getAttribute("content"),
        "pt_BR",
      );
      assert.equal(
        await page.locator('a[href="#"]').count(),
        0,
        `${route}: empty links`,
      );
      assert.equal(
        await page.locator('form[action="#"]').count(),
        0,
        `${route}: dead forms`,
      );
      assert.ok(
        (await page.locator(".post-related-item").count()) <= 3,
        `${route}: related cap`,
      );
      const references = await page.evaluate(() =>
        [
          ...document.querySelectorAll(
            "a[href],img[src],script[src],link[href]",
          ),
        ].map((el) => ({
          value: el.href || el.src,
          fragment: el.tagName === "A",
        })),
      );
      for (const reference of references) {
        const url = new URL(reference.value);
        if (
          url.origin !== origin &&
          url.origin !== "https://gabrielcano.com.br"
        )
          continue;
        let target = path.join(site, decodeURIComponent(url.pathname));
        if (fs.existsSync(target) && fs.statSync(target).isDirectory())
          target = path.join(target, "index.html");
        assert.ok(fs.existsSync(target), `${route}: missing ${url.pathname}`);
        if (reference.fragment && url.hash && target.endsWith(".html")) {
          const id = decodeURIComponent(url.hash.slice(1));
          const html = fs.readFileSync(target, "utf8");
          assert.ok(
            html.includes(`id="${id}"`) || html.includes(`id='${id}'`),
            `${route}: missing fragment ${url.hash}`,
          );
        }
      }
      report.pages.push(route);
    }
    for (const width of [320, 360, 390, 768, 820, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      for (const route of [
        "/",
        "/blog/",
        "/palestras/",
        "/contato/",
        "/busca/",
        "/2024/08/20/palestra-gerenciando-projetos-com-ia/",
        "/2026/03/17/a-essencia-do-caos-em-adeus-eri/",
      ]) {
        await page.goto(origin + route);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${route}: overflow at ${width}`,
        );
        if (route === "/palestras/") {
          await page.locator(".talk-description").evaluateAll((items) =>
            items.forEach((item) => {
              item.open = true;
            }),
          );
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth > innerWidth,
            ),
            false,
            `expanded descriptions: overflow at ${width}`,
          );
        }
        await page.addScriptTag({
          path: require.resolve("axe-core/axe.min.js"),
        });
        const violations = await page.evaluate(async () =>
          (
            await axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
              },
            })
          ).violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        );
        report.responsive.push({ width, route, violations });
        assert.deepEqual(violations, [], `${route}: axe at ${width}`);
      }
      await page.goto(origin);
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: path.join(output, `home-${width}.png`),
          fullPage: true,
        });
    }
    await page.goto(origin + "/contato/");
    const github = page.getByRole("link", { name: "Meu perfil no GitHub" });
    const assertButtonContrast = async (state) => {
      const contrast = await github.evaluate((el) => {
        const style = getComputedStyle(el);
        const luminance = (color) => {
          const values = color
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map((v) => {
              const channel = Number(v) / 255;
              return channel <= 0.04045
                ? channel / 12.92
                : ((channel + 0.055) / 1.055) ** 2.4;
            });
          return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
        };
        const text = luminance(style.color);
        const background = luminance(style.backgroundColor);
        return (
          (Math.max(text, background) + 0.05) /
          (Math.min(text, background) + 0.05)
        );
      });
      assert.ok(
        contrast >= 4.5,
        `GitHub button ${state}: contrast ${contrast}`,
      );
    };
    await assertButtonContrast("normal");
    await github.hover();
    await assertButtonContrast("hover");
    await github.focus();
    await assertButtonContrast("focus");
    report.interactions.push(
      "GitHub contact button contrast >= 4.5:1 in normal, hover and focus states",
    );
    await page.goto(origin + "/palestras/");
    assert.equal(await page.locator(".talk").count(), 7);
    assert.equal(await page.locator(".talk-embed").count(), 7);
    for (const talk of await page.locator(".talk").all()) {
      const slides = talk.getByRole("link", {
        name: "Ver slides no Speaker Deck",
      });
      assert.match(
        await slides.getAttribute("href"),
        /^https:\/\/speakerdeck\.com\/gabrielcano\//,
      );
      const frame = talk.locator("iframe");
      assert.match(
        await frame.getAttribute("src"),
        /^https:\/\/speakerdeck\.com\/player\/[a-f0-9]{32}$/,
      );
      assert.equal(
        await frame.getAttribute("title"),
        `Slides: ${await talk.locator("h2").innerText()}`,
      );
      assert.equal(await frame.getAttribute("loading"), "lazy");
    }
    const description = page.locator(".talk-description").first();
    await description.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await description.evaluate((el) => el.open), true);
    report.interactions.push(
      "seven Speaker Deck talks, accessible responsive lazy players, direct slide links and keyboard descriptions",
    );
    await page.goto(origin);
    assert.equal(await page.locator(".talk").count(), 2);
    assert.equal(await page.locator(".talk-embed").count(), 0);
    await page.getByRole("button", { name: "Cultura & leituras" }).click();
    assert.equal(await page.locator("[data-topic]:visible").count(), 1);
    await page.getByRole("button", { name: "Tecnologia", exact: true }).click();
    assert.equal(await page.locator("[data-topic]:visible").count(), 2);
    await page.getByRole("button", { name: "Tudo", exact: true }).click();
    assert.equal(await page.locator("[data-topic]:visible").count(), 3);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Abrir menu" }).focus();
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator(".nav-toggle").getAttribute("aria-expanded"),
      "true",
    );
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(".nav-toggle").getAttribute("aria-expanded"),
      "false",
    );
    assert.equal(
      await page.evaluate(() => document.activeElement.className),
      "nav-toggle",
    );
    report.interactions.push("home filters, keyboard menu and Escape");
    const index = JSON.parse(fs.readFileSync(path.join(site, "search.json")));
    assert.equal(index.length, 22);
    assert.equal(
      index.some((item) => item.url.includes("wordcamp-brasil-2025")),
      false,
    );
    // The oldest article is on archive page 3; it must be found by global search.
    await page.goto(origin + "/busca/?q=Odin");
    await page.waitForFunction(() =>
      document
        .querySelector("#search-status")
        .textContent.includes("encontrado"),
    );
    assert.ok((await page.locator("#search-results a").count()) > 0);
    await page.locator("#search-query").fill("naoexistezzzz");
    await page.waitForFunction(() =>
      document.querySelector("#search-status").textContent.startsWith("Nenhum"),
    );
    await page.locator("#search-query").fill("ESSENCIA");
    await page.waitForFunction(() =>
      document.querySelector("#search-results").textContent.includes("Eri"),
    );
    await page.locator("#search-query").fill("<img src=x onerror=alert(1)>");
    await page.waitForFunction(() =>
      document.querySelector("#search-status").textContent.startsWith("Nenhum"),
    );
    assert.equal(await page.locator("#search-results img").count(), 0);
    await page.route("**/search.json", (route) =>
      route.fulfill({ status: 503, body: "" }),
    );
    await page.goto(origin + "/busca/?q=wordpress");
    await page.waitForFunction(() =>
      document
        .querySelector("#search-status")
        .textContent.includes("Não foi possível"),
    );
    await page.unroute("**/search.json");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    await page.waitForFunction(() =>
      document
        .querySelector("#search-status")
        .textContent.includes("encontrado"),
    );
    report.interactions.push(
      "global search, accents, empty state, inert input, failure and retry",
    );
    await page.goto(origin + "/2026/03/17/a-essencia-do-caos-em-adeus-eri/");
    assert.equal(
      await page.locator(".stars-inner").evaluate((el) => el.style.width),
      "100%",
    );
    assert.ok(
      (await page.locator(".review-rating").innerText()).includes("10/10"),
    );
    report.interactions.push("single-source 10/10 review rating");
    const noJS = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    await noJS.route("https://speakerdeck.com/player/**", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>Slides</title>",
      }),
    );
    const plain = await noJS.newPage();
    await plain.goto(origin);
    assert.equal(await plain.locator("[data-topic]:visible").count(), 3);
    assert.ok(await plain.locator(".site-nav").isVisible());
    await plain.goto(origin + "/palestras/");
    assert.equal(await plain.locator(".talk").count(), 7);
    await plain.locator(".talk-description summary").first().click();
    assert.equal(
      await plain
        .locator(".talk-description")
        .first()
        .evaluate((el) => el.open),
      true,
    );
    assert.equal(
      await plain
        .getByRole("link", { name: "Ver slides no Speaker Deck" })
        .count(),
      7,
    );
    await noJS.close();
    assert.deepEqual(errors, []);
    report.interactions.push(
      "navigation and highlights without JavaScript; zero page exceptions",
    );
    console.log(
      JSON.stringify(
        {
          pages: report.pages.length,
          responsiveChecks: report.responsive.length,
          interactions: report.interactions,
        },
        null,
        2,
      ),
    );
  } finally {
    fs.writeFileSync(
      path.join(output, "verification.json"),
      JSON.stringify(report, null, 2),
    );
    await browser.close();
    server.close();
  }
})().catch((error) => {
  console.error(error);
  server.close();
  process.exitCode = 1;
});
