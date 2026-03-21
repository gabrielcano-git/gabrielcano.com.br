---
layout: post
title: "Erro ao criar postagem WordPress"
date: 2023-09-12
categories: [Tecnologia]
---

Sabe quando você está tentando fazer algo que parece fácil, mas aí…

![](https://gabrielcano.com.br/wp-content/uploads/2023/09/image-1.png)

Bom, foi mais ou menos o que aconteceu quando decidi migrar um site outro dia.

Primeiro, pensei: “Vou compactar todos os arquivos do site, assim não esqueço de nada”.

[Solar Highway Great Success GIF](https://tenor.com/view/solar-highway-great-success-cryptid-friendclub-gif-25005258)from [Solar Highway GIFs](https://tenor.com/search/solar+highway-gifs)

Depois, com uma ajudinha do [PHPMyAdmin](https://www.phpmyadmin.net/), dei aquele export maroto no banco de dados. Aí, para não perder o ritmo, corri para importar tudo na [Digital Ocean](https://www.digitalocean.com/). Parece que foi tranquilo até aqui, né? Só que não!

Quando fui criar um post no WordPress, me deparo com umas mensagens nada amigáveis. Ao tentar postar algo novo, vem a pérola: “Erro ao criar postagem no WordPress”, em outras vezes a mensagem era “Você já está efetuando uma atualização agora”.

Dando uma boa pesquisada, achei um [link do Stack Overflow em Português](https://pt.stackoverflow.com/questions/165870/erro-ao-criar-postagem-wordpress) me ajudando a corrigir.

Então, executando os códigos abaixo diretamente no banco de dados, consegui resolver o bug:

```
-- Deleta entradas com ID 0
DELETE FROM wp_termmeta WHERE meta_id=0; 
DELETE FROM wp_terms WHERE term_id=0; 
DELETE FROM wp_term_taxonomy WHERE term_taxonomy_id=0; 
DELETE FROM wp_commentmeta WHERE meta_id=0; 
DELETE FROM wp_comments WHERE comment_ID=0; 
DELETE FROM wp_links WHERE link_id=0; 
DELETE FROM wp_options WHERE option_id=0; 
DELETE FROM wp_postmeta WHERE meta_id=0; 
DELETE FROM wp_users WHERE ID=0; 
DELETE FROM wp_posts WHERE ID=0; 
DELETE FROM wp_usermeta WHERE umeta_id=0;

-- Altera as chaves primárias
ALTER TABLE wp_termmeta ADD PRIMARY KEY(meta_id); 
ALTER TABLE wp_terms ADD PRIMARY KEY(term_id); 
ALTER TABLE wp_term_taxonomy ADD PRIMARY KEY(term_taxonomy_id); 
ALTER TABLE wp_commentmeta ADD PRIMARY KEY(meta_id); 
ALTER TABLE wp_comments ADD PRIMARY KEY(comment_ID); 
ALTER TABLE wp_links ADD PRIMARY KEY(link_id); 
ALTER TABLE wp_options ADD PRIMARY KEY(option_id); 
ALTER TABLE wp_postmeta ADD PRIMARY KEY(meta_id); 
ALTER TABLE wp_users ADD PRIMARY KEY(ID); 
ALTER TABLE wp_posts ADD PRIMARY KEY(ID); 
ALTER TABLE wp_usermeta ADD PRIMARY KEY(umeta_id);

-- Define o auto-increment de novo
ALTER TABLE wp_termmeta CHANGE meta_id meta_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_terms CHANGE term_id term_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_term_taxonomy CHANGE term_taxonomy_id term_taxonomy_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_commentmeta CHANGE meta_id meta_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_comments CHANGE comment_ID comment_ID BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_links CHANGE link_id link_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_options CHANGE option_id option_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_postmeta CHANGE meta_id meta_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_users CHANGE ID ID BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_posts CHANGE ID ID BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT; 
ALTER TABLE wp_usermeta CHANGE umeta_id umeta_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT;
```

Obrigado, Brasil. Bebam água, Bjos. ❤️
