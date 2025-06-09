const params = new URLSearchParams(window.location.search);
const titulo = params.get("titulo") || "Jogo Desconhecido";
const valor = params.get("valor") || "0.00";

document.getElementById("game-title").textContent = titulo;
document.getElementById("game-price").textContent = `R$ ${parseFloat(valor).toFixed(2)}`;

function mostrarMetodo() {
  const metodo = document.getElementById("payment-method").value;
  document.querySelectorAll(".metodo-extra").forEach(div => div.style.display = "none");
  if (metodo) {
    document.getElementById(`${metodo}-fields`).style.display = "block";
  }
}

function processarPagamento() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const metodo = document.getElementById("payment-method").value;

  if (!nome || !email || !metodo) {
    alert("Preencha todos os campos.");
    return;
  }

  document.getElementById("success-message").style.display = "none";
  document.getElementById("loading-msg").style.display = "block";

  setTimeout(() => {
    document.getElementById("loading-msg").style.display = "none";
    document.getElementById("success-message").style.display = "block";
  }, 2500);
}








// Inicialize o EmailJS com sua Public Key
emailjs.init("HDXa-pmayymGkAP56");

document.getElementById("payment-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const dados = {
    nome_cliente: document.getElementById("nome").value,
    email_cliente: document.getElementById("email").value,
    metodo_pagamento: document.getElementById("metodo_pagamento").value,
    produto: document.getElementById("produto").value,
    valor: document.getElementById("valor").value,
    mensagem: document.getElementById("mensagem").value || "Sem observações"
  };

  // Mostra processamento
  const btn = this.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Processando...";

  emailjs.send("service_0p2bc9q", "template_vs8xmjp", dados)
    .then(() => {
      alert("Pagamento enviado! Você receberá a confirmação por e-mail.");
      this.reset();
      btn.disabled = false;
      btn.textContent = "Enviar Pagamento";
    })
    .catch((err) => {
      alert("Erro ao enviar o pagamento: " + JSON.stringify(err));
      btn.disabled = false;
      btn.textContent = "Enviar Pagamento";
    });
});














function mostrarMetodo() {
  const metodo = document.getElementById('payment-method').value;
  const metodosExtras = document.querySelectorAll('.metodo-extra');

  metodosExtras.forEach(div => div.classList.remove('active'));

  if(metodo) {
    const divAtiva = document.getElementById(`${metodo}-fields`);
    if(divAtiva) divAtiva.classList.add('active');
  }
}

function processarPagamento() {
  const btn = document.querySelector('button');
  const loadingMsg = document.getElementById('loading-msg');
  const successMsg = document.getElementById('success-message');

  btn.disabled = true;
  loadingMsg.style.display = 'block';
  successMsg.style.display = 'none';

  // Simula um processamento (15 segundos)
  setTimeout(() => {
    loadingMsg.style.display = 'none';
    successMsg.style.display = 'block';
    btn.disabled = false;
  }, 3000);
}


