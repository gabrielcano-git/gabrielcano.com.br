// Função para atualizar as estrelas
function setRating(nota) {
  // Converte nota de 0-10 para porcentagem (0-100%)
  const starPercentage = (nota / 10) * 100;
  
  // Arredonda para o 10% mais próximo para um visual mais limpo
  const starPercentageRounded = `${Math.round(starPercentage)}%`;
  
  // Define a largura do elemento interno
  document.getElementById('stars-inner').style.width = starPercentageRounded;
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.header-nav-toggle');
  const nav = document.querySelector('.header-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setRating(7.5);

  console.log('OK');
});
