---
layout: post
title: "Adicionando itens como pendente no WordPress"
date: 2021-07-19
categories: [Tecnologia]
---
Fala Pessoal! Tudo certo?

Gostaria de compartilhar um snippet muito legal com vocês.

Eu criei um portal para uma cliente que ela recebia notícias dos seus leitores. Essas notícias entravam como um post type DICA.

Esses posts entravam sempre como rascunho e a cliente precisava saber quantos posts em rascunho tinham para ela aprovar. Igual a bolinha que mostra a quantidade de plugins que você precisa atualizar no menu do WordPress. O Snippet é basicamente esse:

```php
function add_pending_count_filter() {
	add_filter( 'attribute_escape', 'remove_esc_attr_and_count', 20, 2 );
}

function esc_attr_restore() {
	remove_filter( 'attribute_escape', 'remove_esc_attr_and_count', 20, 2 );
}

function remove_esc_attr_and_count( $safe_text = '', $text = '' ) {
	if ( substr_count( $text, '%%PENDING_COUNT%%' ) ) {
		$text = trim( str_replace('%%PENDING_COUNT%%', '', $text) );

		remove_filter( 'attribute_escape', 'remove_esc_attr_and_count', 20, 2 );

		$safe_text = esc_attr( $text );

		$count_posts = wp_count_posts( 'dica' );

		$draft_posts = $count_posts->draft;

		$count = $draft_posts;

		if ( $count > 0 ) {
			$text = esc_attr($text) . '<span class="awaiting-mod count-' . $count . '"><span class="pending-count">' . $count . '</span></span>';

			return $text;
		}
	}

	return $safe_text;
}

add_action( 'auth_redirect', 'add_pending_count_filter' );

add_action( 'admin_menu', 'esc_attr_restore' );
```

Ele é facilmente adaptável para diversas necessidades parecidas.

Se tiverem dúvidas de como utilizar, basta comentar nesse post.

Obrigado, Brasil. Bebam água, Bjos. ❤️
