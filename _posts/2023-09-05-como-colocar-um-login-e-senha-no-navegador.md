---
layout: post
title: "Como colocar um login e senha no navegador"
date: 2023-09-05
categories: [Tecnologia]
---

Em determinados projetos, é crucial implementar um sistema de Login e Senha diretamente no navegador para restringir o acesso ao seu site.

Isso é comum (ou pelo menos deveria ser!) em sites que estão em fase de homologação.

Quando temos dois sites com conteúdo idêntico, é necessário bloquear um deles para evitar a indexação pelo Google. Se o Google indexar ambos os sites, o de produção e o de homologação, você pode receber notificações por conteúdo duplicado ou plágio. Resolver essa situação pode ser uma grande dor de cabeça.

Por isso, elaborei este tutorial prático sobre como criar um login e senha para o site diretamente pelo navegador, utilizando o **HTPASSWD**.

Para gerar o código que usaremos no .htpasswd, você pode visitar o site: [https://hostingcanada.org/htpasswd-generator/](https://hostingcanada.org/htpasswd-generator/). Insira o Login, a Senha e mantenha a opção de mode em SHA1.

Após preencher os campos, clique em “Create .htpasswd file”. Um código será gerado, e você deve copiá-lo e colá-lo no seu arquivo .htpasswd.

Se, por algum motivo, o site mencionado não estiver acessível, basta pesquisar no Google por “Gerador de HTPASSWD” para encontrar uma alternativa.

Coloque o arquivo gerado na raiz do seu site.

A partir daqui, temos dois caminhos a seguir, dependendo do servidor: Apache ou NGINX.

## Configurando no Apache

No seu arquivo .htaccess principal, localizado na raiz do site, adicione as seguintes linhas de código:

```
#Protect Directory
AuthName "Dialog prompt"
AuthType Basic
AuthUserFile /var/www/htdocs/.htpasswd
Require valid-user
```

## Configurando no NGINX

Dentro do bloco `location` principal, adicione:

```
auth_basic           "Administrator’s Area";
auth_basic_user_file /var/www/htdocs/.htpasswd;
```

**OBS.:** Lembre-se de substituir `/var/www/htdocs/` pelo caminho correto da raiz da sua aplicação, onde você colocou o arquivo .htpasswd.

E é isso, pessoal!

Obrigado, Brasil. Bebam água, Bjos. ❤️
