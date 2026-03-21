---
layout: post
title: "Utilizando Docker sem sudo"
date: 2021-11-09
categories: [Tecnologia]
---

É um pouco chato ter que utilizar o **sudo** toda hora que você quer executar um container ou um compando do docker, mas é bem simples de resolver esse problema.

Abaixo seguem os comandos que devem ser executados para resolução desse problema:

```
$ sudo groupadd docker
$ sudo usermod -aG docker $USER
$ newgrp docker
$ docker run hello-world
```

Depois disso, talvez seja necessário reiniciar o seu computador, mas assim que ele reiniciar, você já poderá executar os comandos sem o **sudo**.

Obrigado, Brasil. Bebam água, Bjos. ❤️
