require "jekyll-import"

# Encontra o arquivo XML exportado do WordPress
xml_file = Dir.glob("/srv/jekyll/*.xml").first

if xml_file.nil?
  puts "ERRO: Nenhum arquivo XML encontrado!"
  puts "Coloque o arquivo exportado do WordPress (.xml) na raiz do projeto."
  exit 1
end

puts "Importando de: #{xml_file}"

JekyllImport::Importers::WordpressDotCom.run({
  "source"        => xml_file,
  "no_fetch_images" => false,
  "assets_folder"   => "assets/images"
})

puts "Importação concluída!"
puts "Posts importados para: _posts/"
puts "Imagens salvas em: assets/images/"
