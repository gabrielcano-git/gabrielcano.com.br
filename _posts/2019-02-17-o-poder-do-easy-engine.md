---
layout: post
title: "O poder do Easy Engine"
date: 2019-02-17
categories: [Tecnologia]
---

Olá pessoas!

Esse é um post para falar sobre minha experiência recente configurando um servidor do zero com Easy Engine e colocando 5 aplicações web online com apenas 5 dólares. Eu nunca tive vontade de mexer com essa parte de servidor e tals.

Sempre achei muito complexo, mexer no terminal, etc. São coisas que nos assustam um pouco, então quando tinha que mexer com essa parte, contratava uma boa e velha revenda, cheia de buracos e vulnerabilidades que me dava só dor de cabeça.

Assisti em dezembro do ano passado um meetup onde o [Junior Rocha](https://twitter.com/rotchajunior) explicava uma stack com VCCW e Easy Engine.

Depois disso me despertou um pouco a curiosidade de mexer nisso e talvez abandonar minha hospedagem antiga e começar a gerenciar minha própria hospedagem.

Bom, lá fui eu me aventurar então.

Vou dividir minha jornada em alguns passos.

## Contratando um servidor

Eu sempre tive umas hospedagens na Digital Ocean que nunca conseguia configurar nada e só gastava dinheiro.

Bom, dessa vez precisava ser sério. Eu precisava rodar a aplicação lá, então cacei um cupom de desconto da Digital ocean e achei nesse link: [https://gist.github.com/dexbyte/fb13e994ad180ce86c654cae1ce7d14f](https://gist.github.com/dexbyte/fb13e994ad180ce86c654cae1ce7d14f).

Contratei a hospedagem novamente e dei a cara a tapa.

Fiz aquelas configurações básicas de servidor, aquele basicão de U$5.

Acessei ele através do SSH no meu terminal e dai começou a aventura.

Me esforçando bastante, batendo cabeça, etc.

Basicamente depois de testes, configurações, etc. Você vai conseguir acessar sua hospedagem através do SSH dessa forma:

ssh root@SEUIP

Vai pedir sua senha que você recebeu por e-mail lá da Digital Ocean. Coloca essa senha, redefine por uma que seja segura, porém fácil de digitar, porque você vai ficar acessando e digitando ela bastante.

Acessando seu servidor, vu a LA. Agora é instalar o Easy Engine e começar os próximos passos.

## Instalando o Easy Engine

Para instalar o Easy Engine no servidor é fácil e simples.

Execute esses comandos:

# Install EasyEngine on Linux

wget -qO ee rt.cx/ee4 && sudo bash ee

Pronto! É só esperar alguns minutos e ele já irá estar instalado e funcionando. Ai que vem todos os perrengues.

Como eu não sou nenhum poliglota e meu inglês é meio falho, fui muito na tentativa e erro para conseguir fazer algumas configurações e adaptar toda essa maravilha ao meu uso.

## Criando seu primeiro Site

Para criar um site é simples até. Você consegue se guiar bem seguindo essa lista de comandos: [https://easyengine.io/commands/site](https://easyengine.io/commands/site).

No meu caso eu sai criando sites WordPress a dar com pau. Então os comandos eram até que bem básicos:

ee site create seusite.com.br --wp --locale=pt_BR --le

> **ee** = É o comando que chama o EasyEngine. Através desse prefixo você irá conseguir executar o conjunto de funções que ele te fornece.

> **site** = Sub-comando que te disponibiliza uma gama de outros comando para fazer configurações e alterações nos sites

> **create** = Comando que diz que você irá criar um site. Na lista de comando que passei lá em cima, tem delete, update, enable, disable, entre outros comandos que serão base para você fazer suas alterações.

> **seusite.com.br** = Aqui é o domínio que você vai definir que esse site funcione.

> **–wp** = Esse pequeno parâmetro é o que define que será uma “hospedagem wordpress”. Ele é uma abreviação de _–type=wp_ e você pode usar –type=html e outros formatos que estão na listinha de comandos.

> **–locale** = Esse comando fez com que eu deletasse e recriasse os sites várias vezes, pois o site ficava sempre em inglês e eu precisava do painel em português. Acho de extrema importância a definição do idioma para que você tenha mais facilidade nos acessos e para facilitar também para seus clientes. **pt_BR** é a configuração do nosso idioma.

> **–le** = Ativa o Lets Encrypt SSL na sua hospedagem. Na parte do Lets Encrypt vou explicar melhor, mas adianto. Esse comando pode não funcionar logo de cara.

Feito isso, você provavelmente já terá seu site criado e se o DNS A estiver apontando para o IP da sua nuvem. basta acessar o site e já vera uma instalação do WordPress limpa para você acessar e começar a se divertir.

## Configurando com Git

Sempre fui o cara mais Vida Loka do universo, fazendo site sem nem se quer um backup. O clássico “editando no FileZilla”.

Bom, de uns tempos pra ca, fui me profissionalizando e aproximadamente 1 ano fazendo o que é certo. Usando GIT.

Estou versionando todos os meus códigos e isso tem me ocupado “mais tempo” mas sido muito vantajoso em diversos níveis. Porém posso explicar isso em outro artigo.

Bom, resumindo a história, como não sou nenhum expert nem em GIT e nem em Easy Engine, quis fazer uma sincronização com o GIT no servidor e tive alguns problemas.

1 – Já tinha uma instalação WordPress lá e isso data umas merdas quando eu tentava sincronizar;

2 – Eu baixava o projeto e ele criava a pasta com o nome do projeto ai tinha que mover arquivos e era meio um parto.

Perante esses problemas, consegui achar uma solução “fácil”.

Bom para que não sabe, o arquivo wp-config.php não precisa estar na mesma pasta do WordPress para funcionar, ele pode estar uma pasta antes, inclusive é uma dica de segurança que isso seja feito. E advinha? O Easy Engine quando cria o site site já faz isso!

Então dentro do servidor, já com o site criado, o que eu fiz foi o seguinte:

ee site info seusite.com.br

Você receberá uma tabelinha com as informações do site. Uma delas é o caminho físico de onde a aplicação está que fica em “Site Root”.

Pegue esse caminho e vá até ele. Exemplo:

cd /opt/easyengine/sites/seusite.com.br/**app**

Lá você vai ter 2 arquivos e 1 diretório:

- dead.letter
- wp-config.php
- **htdocs**

htdocs é a pasta onde ficam os arquivos do site. Você vai baixar seu projeto do site no git

git clone <seudiretorioremoto>

Se você tiver um acesso remoto fechado, vai precisar configurar uma chave SSH no servidor. O que foi o meu caso e que penei bastante para isso. Mas seria outro artigo, mais focado em GIT.

Bom, com tudo isso feito, ai vai minha “dica”:

rm -r htdocs

Sim, deleta tudo sem dó, vamos pegar nosso projeto do GIT

mv seudiretorioremoto htdocs

A gente muda o nome da pasta onde estão as coisas do git para htdocs e como essa já era a pasta de configuração do EasyEngine vai funcionar tudo normal e caso você atualize localmente seu projeto no GIT. Quando estiver tudo online é só usar os comandos abaixo para manter tudo sincronizado:

cd htdocs
git pull

Com essas configurações, consegui algo bem legal de trabalhar. Tudo sincronizado, sem precisar de FTP (Ou não, já vão saber kkkkk) e com mais profissionalismo do que eu já tinha trabalhado nos meus últimos quase 11 anos de carreira.

## Lets Encrypt e outras coisinhas

Para efetuar as configurações de SSL no Easy Engine você precisa primeiro configurar um e-mail padrão para o Lets Encrypt. O comando é:

ee config set le-mail seu@email.com.br

Lembrando que o o site já deve estar apontando para o servidor para que funcione certinho.

No meu caso toda vez que eu tentava criar um novo site já com SSL não funcionava, porque o DNS A não estava apontando para o IP do meu servidor ainda, então ele iniciava o processo e depois não criava o site.

Se estiver tudo certo, de cara o comando abaixo vai resolver sua vida na hora de criar um novo site:

ee site create seusite.com.br --wp --locale=pt_BR --le

Caso contrário, crie o site sem SSL e use o update para adicionar o Let Encrypt:

ee site update seusite.com.br --le

## WP CLI boladão!

Bom, além de tudo que já é e foi lindo e maravilhoso até agora, o Easy Engine já vem com o WP-CLI instalado.

Ele te ajuda a fazer algumas funções do WordPress pela linha de comando, como instalação de plugins, atualização do WordPress e dos plugins, etc.

Para isso, antes de começar a usá-lo é bom acertar as permissões da pasta.

Acesse o diretório do seu projeto ( Pode usar o site info para lembrar o caminho ) e depois redefinir as permissões:

cd /opt/easyengine/sites/seusite.com.br/app/htdocs

chown www-data:www-data -R \* # Let Apache be owner
find . -type d -exec chmod 755 {} \; # Change directory permissions rwxr-xr-x
find . -type f -exec chmod 644 {} \; # Change file permissions rw-r--r--

Bom, depois disso é só pinga farra e foguete, com tanto que saiba os comando do [WP-CLI](https://developer.wordpress.org/cli/commands/). Para acessar o Shell da sua aplicação WordPress você digitará:

ee shell seusite.com.br

## Ferramentas auxiliares

Pelo menos até o presente momento eu não consegui me desvincular de algumas coisas, como phpMyAdmin, e o Easy Engine te da algumas dessas ferramentas.

Para acessá-las, basta utilizar o comando abaixo:

ee admin-tools enable seudominio.com.br

Assim já vai liberar as ferramentas abaixo para você:

- nginx_status
- opcache-gui.php
- phpinfo.php
- ping
- pma
- status

Para você acessar as ferramentas antes, deverá executar esse comando:

ee auth list global

Assim você receberá um login e senha. Após pegar essas dados, vá para www.seusite.com.br/ee-admin/.

## Melhore sua stack

Ainda utilizo práticas pouco profissionais em minha stack de desenvolvimento como subir coisas via FTP, usar o MAMP, etc.

Pretendo melhorar e “afinar” isso para deixar tudo com a maior qualidade, segurança e automação dentro das minhas necessidades.

Mas de modo geral o EasyEngine não só me deu ótimas possibilidades como também me incentivou a procurar melhores soluções para o meu dia a dia no trabalho.
