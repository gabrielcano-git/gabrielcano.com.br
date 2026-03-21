---
layout: post
title: "Criando um usuário FTP no WordOps"
date: 2023-09-19
categories: [Tecnologia]
---

Quando eu trabalhava com o Easy Engine, sempre enfrentava desafios ao fornecer acesso FTP aos meus clientes. Tinha dificuldade em criar, de forma simples e descomplicada, os dados de acesso para que eles pudessem acessar seus conteúdos.

No entanto, ao usar o Wordops, isso tornou-se muito mais fácil.

O primeiro passo é instalar a Stack de FTP. O Wordops é extremamente customizável. Para aproveitar essa customização, você instalará cada stack de acordo com as necessidades do seu servidor, permitindo que ele cresça na proporção adequada.

Para instalar a stack de FTP, execute o comando abaixo:

wo stack install --proftpd

Após a instalação da stack, execute o seguinte comando no seu terminal:

adduser --home /var/www/wordops.net/htdocs/ --shell /bin/false --ingroup www-data wordops

No comando acima, `/var/www/wordops.net/htdocs/` representa o diretório do seu site no servidor (normalmente criado automaticamente com a URL definida para o site), e `wordops` é o nome de usuário FTP que você está criando.

Depois de executar esse comando, você será solicitado a criar uma senha. Em seguida, aparecerão alguns campos para preenchimento. É possível deixar todos em branco, pois não são essenciais.

Concluído esse passo, dê permissão de acesso ao usuário que acabou de criar com o comando:

chmod -R g+rw /var/www/wordops.net/htdocs

Novamente, `/var/www/wordops.net/htdocs` é o diretório do seu site no servidor.

Obrigado, Brasil. Bebam água, Bjos. ❤️
