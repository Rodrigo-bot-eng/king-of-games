const form = document.getElementById('form');
const email = document.getElementById('email');
const senha = document.getElementById('senha');
const nome = document.getElementById('nome');
const confirmarSenha = document.getElementById('confirmarSenha');
const campoNome = document.getElementById('campo-nome');
const campoConfirmar = document.getElementById('campo-confirmar');
const mensagem = document.getElementById('mensagem');
const btn = document.getElementById('btn');
const titulo = document.getElementById('titulo');
const trocarModo = document.getElementById('trocarModo');

let modoCadastro = false;

trocarModo.addEventListener('click', () => {
  modoCadastro = !modoCadastro;

  if (modoCadastro) {
    titulo.textContent = 'Cadastro';
    btn.textContent = 'Cadastrar';
    campoNome.style.display = 'block';
    campoConfirmar.style.display = 'block';
    trocarModo.textContent = 'Já tem conta? Faça login';
  } else {
    titulo.textContent = 'Login';
    btn.textContent = 'Entrar';
    campoNome.style.display = 'none';
    campoConfirmar.style.display = 'none';
    trocarModo.textContent = 'Ainda não tem conta? Cadastre-se';
  }

  mensagem.textContent = '';
  form.reset();
});

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (modoCadastro) {
    if (!nome.value || !email.value || !senha.value || !confirmarSenha.value) {
      mensagem.textContent = '⚠️ Preencha todos os campos.';
      mensagem.style.color = 'orange';
      return;
    }

    if (senha.value !== confirmarSenha.value) {
      mensagem.textContent = '❌ As senhas não coincidem!';
      mensagem.style.color = 'red';
      return;
    }

    mensagem.textContent = '✅ Cadastro realizado com sucesso!';
    mensagem.style.color = 'green';
  } else {
    if (!email.value || !senha.value) {
      mensagem.textContent = '⚠️ Preencha o email e a senha.';
      mensagem.style.color = 'orange';
      return;
    }

    mensagem.textContent = '✅ Login bem-sucedido!';
    mensagem.style.color = 'lightgreen';
  }
});
