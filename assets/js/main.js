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
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }

  setRating(7.5);

  console.log('OK');
});
