---
layout: post
title: "Docker para iniciantes"
date: 2019-12-28
categories: [Tecnologia]
---

Esse post é para pessoas que são iniciantes no Docker, como eu.

A minha ideia é colocar aqui um passo a passo de tutoriais que compilei na internet e como consegui instalar e fazer rodar o docker no Linux Mint.

Também sou “novo no linux” e estou terminando de escrever um artigo sobre isso.

Se alguém que ler esse post quiser uma ajuda para instalação no Mac ou no Windows, é só comentar que eu ajudo 🙂

## Be a Ba do Docker para inciantes

Bom, então vamos lá. Eu basicamente segui o passo a passo do site do docker, resolvendo alguns bugs que foram ocorrendo comigo e o que irei descrever aqui nesse tutorial será exatamente a resolução desses bugs.

Esse tutorial está focado também em uma instalação WordPress, mas escreverei mais artigos sobre o docker para iniciantes, afim de “mastigar” informação e, é claro, tudo em português.

Esse é o link do site do docker: [https://docs.docker.com/install/linux/docker-ce/ubuntu/](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

Esse link cita que as configurações são todas para o Linux Ubuntu, então se você estiver com essa versão do sistema, talvez você tenha até um caminho menos ardo. Como já falei, eu utilizo o Linux Mint. Então, apesar de ser parecido, teremos algumas diferenças no meio deste tutorial.

> **Antes de tudo. Abra o seu terminal.**

Primeiro, precisamos atualizar as fontes já configuradas no sistema, usando o comando abaixo:

sudo apt-get update

Se você, como eu, não sabia/sabe para que serve esse comando que sempre executamos, no fórum [Viva ao Liunux](https://www.vivaolinux.com.br/), tem uma discussão que explica para que ele funciona e qual a [diferença do comando **update** para o **upgrade**](https://www.vivaolinux.com.br/topico/Perguntas-Frequentes/Qual-a-diferenca-entre-apt-get-update-e-apt-get-upgrade).

Feito isso, você precisará instalar os pacotes abaixo:

```bash
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
```

Esses pacotes são dependências que você precisará usar para instalar e fazer rodar o docker.

Depois, você executa este comando:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Ao executar esse comando no meu computador, ele apareceu apenas “OK” e não um código doido que teoricamente deveria aparecer. Sendo assim, apenas continuei seguindo. E o próximo comando a ser executado foi esse:

```bash
sudo apt-key fingerprint 0EBFCD88
```

O resultado do seu terminal deve ser igual ao abaixo, ou algo bem parecido:

```bash
pub rsa4096 2017-02-22 [SCEA]
9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88
uid [ unknown] Docker Release (CE deb) [docker@docker.com](mailto:docker@docker.com)
sub rsa4096 2017-02-22 [S]
```

Depois desse passo, seria muito simples seguir com a instalação, mas eu tive bastante dor de cabeça pelo fato de usar o Linux Mint.

Então, o que tive de fazer?

No tutorial original, você adiciona uma nova fonte de repositórios no seu Linux, mas todos os comandos do tutorial original do docker não funcionaram para mim, então tive de vasculhar a internet e o stackoverflow para encontrar essa solução que basicamente foi: adicionar o novo repositório de fontes, manualmente.

Para isso, executei primeiro o seguinte comando:

```bash
sudo nano /etc/apt/sources.list.d/addtional-repositories.list
```

Nesse comando, abrimos como root o arquivo que é responsável pelas fontes de repositórios e nele iremos colocar o caminho dessa nova fonte.

Com o arquivo aberto em seu terminal, cole o código abaixo:

```bash
deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable
```

Se você não tem muita experiência com terminal, para fechar o nano você irá apertar **CTRL + X**, depois **CTRL + Y** e por fim **ENTER**.

Agora, a gente segue o tutorial como se nada tivesse acontecido e atualiza os repositórios fontes novamente:

```bash
sudo apt-get update
```

E agora estamos puxando coisas do repositório do docker também e isso que fará com que a instalação ocorra normalmente.

Então, executamos a instalaçao do Docker:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Depois que executou tudo no seu terminal, precisamos saber se deu certo.

Será que rodou?

Execute:

```bash
docker --version
```

Parece que foi? Então execute o comando abaixo:

```bash
sudo docker run hello-world
```

Você deverá ver algo como na imagem abaixo:

![Docker para Iniciantes - Hello World Docker](https://gabrielcano.com.br/wp-content/uploads/2019/12/hello-world-docker.png)

Hello World Docker

Agora com o Docker instalado e rodando certinho, podemos criar nosso ambiente WordPress.

## Subindo um ambiente WordPress com Docker

Agora vamos criar um ambiente com o Docker, ideal para o WordPress.

Pesquisando no Google “Docker WordPress” o primeiro resultado será de uma maquina Docker que tem uma configuração legal para WordPress. Se você quiser pegar a maquina oficial do WordPress, tem um canal oficial no [Docker Hub](https://hub.docker.com/) nesse link: [https://hub.docker.com/\_/wordpress/](https://hub.docker.com/_/wordpress/).

A máquina que eu utilizei foi essa: [https://docs.docker.com/compose/wordpress/](https://docs.docker.com/compose/wordpress/).

Agora é relativamente simples. Você precisa criar uma pasta onde irá rodar o seu WordPress, por exemplo:

# Cria uma pasta na pasta atual que você está

```bash
mkdir wordpress
```

# Entra na pasta criada

```bash
cd wordpress
```

Nessa pasta você criará um arquivo com o nome docker-compose.yml

# Cria o arquivo e já abre ele para você editar

```bash
nano docker-compose.yml
```

Com a tela para editar o arquivo aberta, copie e cole o código abaixo:

```yaml
version: "3.3"

services:
  db:
    image: mysql:5.7
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: somewordpress
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress

  wordpress:
    depends_on:
      - db
    image: wordpress:latest
    ports:
      - "8000:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
  volumes:
    db_data: {}
```

Depois disso, é só escrever o código abaixo, dar enter e esperar a mágica:

```bash
docker-compose up -d
```

Se não for com o código acima, coloque o **sudo** na frente que vai dar tudo certo!

Se sua configuração está igual a minha, você irá acessar seu site por “http://localhost:8000”, sem as aspas.

Para você for rodar outra coisa no docker, será necessário desligar essa máquina e ligar outra.

Para desligar a máquina, você pode usar o comando abaixo:

```bash
docker-compose down --volumes
```

Em um proximo post vou ensinar como faço para criar um ambiente que é igual ao da minha hospedagem e outras maquinas “padroes” que serão utilizadas em diversos projetos em que atuo.

Obrigado, Brasil. Bebam água, Bjos. ❤️
