// Botão para entrar na loja
const btnLoja = document.getElementById('btnLoja');

btnLoja.addEventListener('click', () => {
  // Troque 'sua-loja.html' pelo link real da sua loja
  window.location.href = 'index.html';
});



const video = document.querySelector('.video-fundo');

document.body.addEventListener('click', () => {
  if (video.muted) {
    video.muted = false;
    video.play();
  }
}, { once: true });
