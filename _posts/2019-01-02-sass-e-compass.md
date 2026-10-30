---
layout: post
title: "SASS e Compass"
date: 2019-01-02
categories: [Tecnologia, Tips and Tricks]
historical: true
---

Fala Galera, beleza?

Hoje meu post é para falar um pouco do pré-processador que ando utilizando.

Bom rapidamente, o que é um pré-processador? Pré-processador é um programa que interpreta determinado texto escrito e converte para um outro tipo.

Poderíamos criar um pré-processador de Lorem Ipsum. Que interpretaria cada palavra de um parágrafo e transformasse ela em uma lingua escolhida.

Um exemplo inventado de minha própria cabeça:

`# Convert Lorem Italiano`

`# Convert(Comando de conversão) Lorem(O que irá ser convertido) Italiano(Linguagem da conversão)`

Bom então, SASS é uma linguagem de programação e também um Framework. Com essa linguagem nós escrevemos CSS de uma maneira mais dinâmica e interessante.

O SASS nos da a possibilidade de utilizar variáveis no CSS, dessa forma definimos um valor X apenas uma vez e setamos as variáveis nas classes, IDs, etc.

## Exemplo real de uso do SASS:

```scss
$screen-sm-min: 768px; // Definindo a variável

#header {
  .logo {
    // A herança pode ser feita apenas colocando uma classe dentro da outra
    margin: 10px 0px;
    display: block;

    @media (min-width: $screen-sm-min) and (max-width: $screen-sm-max) {
      // As variáveis são definidas com o Dolar na frente
      text-align: center;
    }

    @media (max-width: $screen-xs-max) {
      // As variáveis tem seus valores definidos antes
      text-align: center;

      img {
        max-width: 100%;
      }
    }
  }
}
```

Os comentários explicam algumas funções e qualidades básicas de usar o SASS.

Após isso para processar o SASS costumo utilizar o Compass. Ele é muito massa!

Para comprimir é basicamente acessar o diretório de configuração do COMPASS e compilá-lo.

<!-- Mídia original a recuperar: https://gabrielcano.com.br/wp-content/uploads/2014/12/fazendo-a-compilacao-do-sass-com-compass-via-shell.png -->

<aside class="notice" aria-label="Nota sobre a imagem">A imagem original deste trecho não está disponível no acervo migrado.</aside>

Bom, é isso! Vou trazer novidades sobre [Odin](http://wpod.in/), [SASS](http://sass-lang.com/), [COMPASS](http://compass-style.org/) e etc em breve!
