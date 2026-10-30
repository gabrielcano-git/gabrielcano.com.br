# Keep the reviewed PNG portable as text; Jekyll emits the real binary at build time.
require "base64"
require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  encoded = File.join(site.source, "_data", "social-card.b64")
  destination = File.join(site.dest, "assets", "images", "social-card.png")
  FileUtils.mkdir_p(File.dirname(destination))
  File.binwrite(destination, Base64.strict_decode64(File.read(encoded).strip))
end
