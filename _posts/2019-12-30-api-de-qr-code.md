---
layout: post
title: "API de QR Code"
date: 2019-12-30
categories: [Tecnologia]
---

Existe um jeito simples e fácil de usar uma API de QR code para seus projetos.

Em uma trudução livre do próprio site:

> O [goQR.me](http://goqr.me/) é um dos principais sites da Web para códigos QR, marketing com QR Code e QR em geral. Estamos oferecendo aos nossos clientes experiência em tudo que se refere ao uso correto dos códigos QR. Além disso, somos as pessoas por trás do QR Server, uma plataforma de marketing profissional para gerenciamento de código QR direcionado (campanhas, códigos QR editáveis etc.)

Para utilizar a API deles é bem simples. Precisamos apenas passar os parametros na URL, que essa URL poderá ser utilizada como uma URL de uma imagem.

Vamos lá:

> https://api.qrserver.com/v1/create-qr-code/?**size**=150x150&**data**=Example

Em frente ao parametro **SIZE**, precisamos inserir o tamanho do QR Code. No exemplo, 150×150. Todo o QR Code tem que ser quadrado, então deve-se manter tamanhos iguais entre o X, por exemplo: 150×150, 300×300, etc.

O segundo parâmetro **DATA** será o conteudo que exibiremos. Seja uma mensagem, uma URL para qual redirecionaremos o usuário, etc.

Um exemplo bacana de utilização dessa API do QR Code:

Imagine que temos uma página de cadastro.

Nessa página nós colocamos um formulário, que seria preenchido com Nome e E-mail.

Ao enviar esse formulário, nós automaticamente enviamos uma cópia de um e-mail para o quem o preencheu, no e-mail preenchido com um HTML onde temos uma imagem com o seguinte código:

> https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Bem Vindo Fuluano

Imagine que **Fulano** é o nome preenchido. Ao ser escaneado o código em um evento, por exemplo, veremos escrito “Bem Vindo Fulano” e a pessoa responsável pela recepção poderia dar as boas vindas corretamente para o convidado.

É um exemplo simples e besta, mas mostra que isso pode ser muito útil para todos nós no dia a dia.

Então…

![API QR Code gerando uma mensagem de exemplo. Mensagem: Espero que tenham gostado do post e aproveitado bastante!](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Espero%20que%20tenham%20gostado%20do%20post%20e%20aproveitado%20bastante!)

Obrigado, Brasil. Bebam água, Bjos. ❤️
