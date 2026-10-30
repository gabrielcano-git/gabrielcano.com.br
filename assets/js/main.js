"use strict";

// Every interactive feature enhances links or content that also work without JavaScript.
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  const closeMenu = (restoreFocus = false) => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    if (restoreFocus) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open"))
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target))
      closeMenu();
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("focusin", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target))
      closeMenu();
  });
  matchMedia("(min-width: 951px)").addEventListener("change", () =>
    closeMenu(),
  );
}

const filters = document.querySelector(".filters");
if (filters) {
  filters.hidden = false;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    filters
      .querySelectorAll("button")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
    const articles = [...document.querySelectorAll("[data-topic]")];
    articles.forEach((article) => {
      article.hidden =
        button.dataset.filter !== "all" &&
        article.dataset.topic !== button.dataset.filter;
    });
    const count = articles.filter((article) => !article.hidden).length;
    document.querySelector("#filter-count").textContent =
      `${count} ${count === 1 ? "artigo selecionado" : "artigos selecionados"}`;
  });
}

// Make long examples keyboard-scrollable. Copy uses the original text, with a visible failure path.
document.querySelectorAll("pre").forEach((pre) => {
  pre.tabIndex = 0;
  pre.setAttribute("aria-label", "Exemplo de código; use as setas para rolar");
  if (!navigator.clipboard || !pre.closest(".post-content")) return;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-code";
  button.textContent =
    pre.textContent.length > 2000 ? "Copiar prompt" : "Copiar código";
  const label = button.textContent;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.textContent);
      button.textContent = "Copiado!";
    } catch {
      button.textContent = "Selecione o texto para copiar";
    }
    setTimeout(() => {
      button.textContent = label;
    }, 2500);
  });
  pre.before(button);
});

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
const search = document.querySelector(".search-form");
if (search) {
  const input = search.querySelector("input");
  const status = document.querySelector("#search-status");
  const results = document.querySelector("#search-results");
  let indexPromise;
  let requestNumber = 0;
  let debounce;
  const getIndex = () => {
    if (!indexPromise) {
      indexPromise = fetch(search.dataset.index, {
        signal: AbortSignal.timeout(8000),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Índice indisponível");
          return response.json();
        })
        .then((items) =>
          items.map((item) => ({
            ...item,
            searchable: normalize(
              [
                item.title,
                item.description,
                item.text,
                ...item.categories,
              ].join(" "),
            ),
          })),
        )
        .catch((error) => {
          indexPromise = undefined;
          throw error;
        });
    }
    return indexPromise;
  };
  const runSearch = async () => {
    const ownRequest = ++requestNumber;
    const query = input.value.trim();
    const url = new URL(location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    history.replaceState(null, "", url);
    results.replaceChildren();
    if (!query) {
      status.textContent = "Digite um assunto para buscar no acervo.";
      return;
    }
    status.textContent = "Buscando…";
    try {
      const index = await getIndex();
      if (ownRequest !== requestNumber) return;
      const terms = normalize(query).split(/\s+/);
      const matches = index.filter((item) =>
        terms.every((term) => item.searchable.includes(term)),
      );
      status.textContent = matches.length
        ? `${matches.length} ${matches.length === 1 ? "artigo encontrado" : "artigos encontrados"}.`
        : "Nenhum artigo encontrado. Tente outro assunto.";
      const fragment = document.createDocumentFragment();
      matches.forEach((item) => {
        const article = document.createElement("article");
        const heading = document.createElement("h2");
        const link = document.createElement("a");
        // The index is local; require a same-origin destination before using it.
        const destination = new URL(item.url, location.origin);
        if (
          destination.origin !== location.origin ||
          !/^https?:$/.test(destination.protocol)
        )
          return;
        link.href = destination.href;
        link.textContent = item.title;
        heading.append(link);
        const description = document.createElement("p");
        description.textContent = item.description;
        const date = document.createElement("p");
        date.className = "post-meta";
        date.textContent = item.date;
        article.append(heading, date, description);
        fragment.append(article);
      });
      results.replaceChildren(fragment);
    } catch {
      if (ownRequest === requestNumber)
        status.textContent =
          "Não foi possível carregar a busca. Tente novamente ou explore o blog pelo menu.";
    }
  };
  search.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(debounce);
    runSearch();
  });
  input.addEventListener("input", () => {
    ++requestNumber;
    clearTimeout(debounce);
    debounce = setTimeout(runSearch, 180);
  });
  input.value = new URLSearchParams(location.search).get("q") || "";
  if (input.value) runSearch();
}

// Optional social feed: disabled by default, isolated from the core reading experience.
const social = document.querySelector("[data-social-url]");
if (social) {
  const list = social.querySelector("ul");
  const render = (items) => {
    const entries = items.slice(0, 3).flatMap((item) => {
      try {
        const url = new URL(item.link);
        if (!/^https?:$/.test(url.protocol)) return [];
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = url.href;
        link.textContent = String(item.text || "Ver publicação");
        link.rel = "noopener noreferrer";
        const time = document.createElement("span");
        time.textContent = String(item.time || "");
        li.append(link, time);
        return [li];
      } catch {
        return [];
      }
    });
    list.replaceChildren(...entries);
    social.hidden = entries.length === 0;
  };
  (async () => {
    const key = `social:${social.dataset.socialUrl}`;
    try {
      let cached;
      try {
        cached = JSON.parse(sessionStorage.getItem(key));
      } catch {
        /* Storage may be blocked. */
      }
      if (
        cached &&
        Date.now() - cached.time < 300000 &&
        Array.isArray(cached.items)
      ) {
        render(cached.items);
        return;
      }
      const response = await fetch(social.dataset.socialUrl, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return;
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.data;
      if (!Array.isArray(items)) return;
      render(items);
      try {
        sessionStorage.setItem(
          key,
          JSON.stringify({ time: Date.now(), items }),
        );
      } catch {
        /* Feed remains usable. */
      }
    } catch {
      social.hidden = true;
    }
  })();
}
