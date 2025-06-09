// ---------------------- NAVEGAÇÃO SPA ----------------------
function navigate(page) {
  window.location.hash = page;
  renderPage(page);
}

window.addEventListener("load", () => {
  const hash = window.location.hash.replace("#", "") || "home";
  renderPage(hash);
  atualizarContadorCarrinho();
  atualizarUIUsuario();

  const tema = localStorage.getItem("tema");
  if (tema === "escuro") {
    document.body.classList.add("dark-theme");
    document.getElementById("theme-icon")?.classList.replace("fa-sun", "fa-moon");
  }
});

// ---------------------- TEMA CLARO/ESCURO ----------------------
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById("theme-icon");
  const isDark = body.classList.toggle("dark-theme");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
  localStorage.setItem("tema", isDark ? "escuro" : "claro");
}

// ---------------------- MENU MOBILE ----------------------
function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("show");
}

// ---------------------- FAVORITOS ----------------------
function getFavoritos() {
  const favs = localStorage.getItem("favoritos");
  return favs ? JSON.parse(favs) : [];
}

function setFavoritos(favs) {
  localStorage.setItem("favoritos", JSON.stringify(favs));
}

function toggleFavorito(id) {
  let favs = getFavoritos();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }
  setFavoritos(favs);
  const searchInput = document.getElementById("search");
  renderLoja(searchInput ? searchInput.value : "");
}

function isFavorito(id) {
  return getFavoritos().includes(id);
}

function filtrarFavoritos() {
  const favs = getFavoritos();
  const favoritos = games.filter(game => favs.includes(game.id));
  const list = document.getElementById("gameList");
  list.innerHTML = "";

  if (favoritos.length === 0) {
    list.innerHTML = `<p class="neon-text">Nenhum favorito encontrado.</p>`;
    return;
  }

  favoritos.forEach(game => {
    const isFav = isFavorito(game.id);
    const favoritoIcon = isFav ? "❤️" : "🤍";

    const card = document.createElement("div");
    card.className = "game-card glow-card";

    card.innerHTML = `
      <div class="game-image-wrapper">
        <img src="${game.image}" alt="${game.title}" loading="lazy" class="game-image" />
        <button class="btn-fav btn-glow" onclick="toggleFavorito(${game.id})">${favoritoIcon}</button>
      </div>
      <div class="game-info">
        <h3 class="game-title neon-text">${game.title}</h3>
        <p class="game-price neon-text">R$ ${game.price.toFixed(2)}</p>
        <div class="game-actions">
          <button class="btn-detalhes btn-glow" onclick="renderDetalhes(${game.id})">Ver mais</button>
          <button class="btn-pagamento btn-glow" onclick="realizarPagamento(${game.id})">💳 Comprar</button>
          <button class="btn-glow" onclick="adicionarAoCarrinho(${game.id})">🛒</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });
}

// ---------------------- CARRINHO ----------------------
function getCarrinho() {
  const carrinho = localStorage.getItem("carrinho");
  return carrinho ? JSON.parse(carrinho) : [];
}

function setCarrinho(itens) {
  localStorage.setItem("carrinho", JSON.stringify(itens));
  atualizarContadorCarrinho();
}

function adicionarAoCarrinho(id) {
  const carrinho = getCarrinho();
  if (!carrinho.includes(id)) {
    carrinho.push(id);
    setCarrinho(carrinho);
    alert("Jogo adicionado ao carrinho!");
  } else {
    alert("Este jogo já está no carrinho.");
  }
}

function removerDoCarrinho(id) {
  let carrinho = getCarrinho();
  carrinho = carrinho.filter(itemId => itemId !== id);
  setCarrinho(carrinho);
  renderCarrinho();
}

function atualizarContadorCarrinho() {
  const badge = document.getElementById("carrinho-count");
  if (badge) badge.textContent = getCarrinho().length;
}

function finalizarCompra() {
  const carrinho = getCarrinho();
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  if (confirm("Deseja finalizar a compra?")) {
    alert("Compra realizada com sucesso! Obrigado.");
    setCarrinho([]);
    navigate("home");
  }
}

function renderCarrinho() {
  const carrinhoIds = getCarrinho();
  const app = document.getElementById("app");

  if (carrinhoIds.length === 0) {
    app.innerHTML = `
      <section class="carrinho-section">
        <h1 class="section-title neon-text">Carrinho</h1>
        <p class="neon-text">Seu carrinho está vazio.</p>
        <button class="btn-voltar btn-glow" onclick="navigate('loja')">← Voltar à loja</button>
      </section>
    `;
    return;
  }

  const jogosNoCarrinho = games.filter(game => carrinhoIds.includes(game.id));

  const itemsHTML = jogosNoCarrinho.map(game => `
    <div class="carrinho-item glow-card">
      <img src="${game.image}" alt="${game.title}" class="carrinho-img" />
      <div>
        <h3 class="neon-text">${game.title}</h3>
        <p class="neon-text">R$ ${game.price.toFixed(2)}</p>
        <button onclick="removerDoCarrinho(${game.id})" class="btn-glow">Remover</button>
      </div>
    </div>
  `).join("");

  const total = jogosNoCarrinho.reduce((sum, game) => sum + game.price, 0);

  app.innerHTML = `
    <section class="carrinho-section">
      <h1 class="section-title neon-text">Carrinho</h1>
      ${itemsHTML}
      <h2 class="neon-text">Total: R$ ${total.toFixed(2)}</h2>
      <button class="btn-voltar btn-glow" onclick="navigate('loja')">← Continuar comprando</button>
      <button class="btn-finalizar btn-glow" onclick="finalizarCompra()">✅ Finalizar Compra</button>
    </section>
  `;
}

// ---------------------- PÁGINAS SPA ----------------------
function renderPage(page) {
  const app = document.getElementById("app");

  const homeContent = `
    <section class="home-section">
      <h1 class="section-title neon-text">Bem-vindo à KING OF GAMES</h1>
      <p class="neon-text">Sua plataforma de jogos favorita.</p>
    </section>
  `;

  const lojaContent = `
    <section class="loja-section">
      <h1 class="section-title neon-text">Loja</h1>
      <div class="loja-actions">
        <button class="btn-glow" onclick="navigate('carrinho')">🛒 Ver Carrinho</button>
        <button class="btn-glow" onclick="filtrarFavoritos()">❤️ Meus Favoritos</button>
        <select onchange="ordenarLoja(this.value)" class="glow-input">
          <option disabled selected>Ordenar por...</option>
          <option value="nome">Nome</option>
          <option value="preco">Preço</option>
        </select>
        <input
          type="text"
          id="search"
          placeholder="Buscar jogos..."
          autocomplete="off"
          class="search-input glow-input"
        />
      </div>
      <div class="game-grid" id="gameList"></div>
    </section>
  `;

  const suporteContent = `
    <section class="suporte-section">
      <h1 class="section-title neon-text">Suporte</h1>
      <p class="neon-text">Entre em contato conosco para ajuda ou dúvidas.</p>
    </section>
  `;

  const reclamacoesContent = `
    <section class="reclamacoes-section">
      <h1 class="section-title neon-text">Reclamações</h1>
      <p class="neon-text">Deixe seu feedback e nos ajude a melhorar.</p>
    </section>
  `;

  const pages = {
    home: homeContent,
    loja: lojaContent,
    suporte: suporteContent,
    reclamacoes: reclamacoesContent,
    carrinho: "", // renderiza depois
  };

  app.innerHTML = pages[page] ?? `<p class="error-text">Página não encontrada.</p>`;

  if (page === "loja") {
    setupSearch();
    renderLoja();
  }

  if (page === "carrinho") {
    renderCarrinho();
  }
}

// ---------------------- LOJA ----------------------
function aplicarPromocao(jogos, criterio, descontoPercentual) {
  return jogos.map(jogo => {
    const atendeCriterio =
      typeof criterio === "function" ? criterio(jogo) :
      typeof criterio === "string" ? jogo.category === criterio :
      false;

    if (atendeCriterio) {
      return {
        ...jogo,
        promo: true,
        desconto: descontoPercentual,
        originalPrice: jogo.price,
        price: parseFloat((jogo.price * (1 - descontoPercentual / 100)).toFixed(2))
      };
    }

    return {
      ...jogo,
      promo: false,
      desconto: 0
    };
  });
}

function renderLoja(filtro = "") {
  const list = document.getElementById("gameList");
  if (!list) return;

  list.innerHTML = "";

  const filtroLower = filtro.toLowerCase();

  // Aplicar promoção ANTES de filtrar
  const jogosComPromocao = aplicarPromocao(games, jogo => jogo.price > 200, 30);

  const filteredGames = jogosComPromocao.filter(game =>
    game.title.toLowerCase().includes(filtroLower)
  );

  if (filteredGames.length === 0) {
    list.innerHTML = `<p class="no-results neon-text">Nenhum jogo encontrado.</p>`;
    return;
  }

  filteredGames.forEach(game => {
    const isFav = isFavorito(game.id);
    const favoritoIcon = isFav ? "❤️" : "🤍";

    const precoOriginal = game.originalPrice ?? game.price;
    const precoFinal = game.price;
    const promoLabel = game.promo ? `<span class="promo-label">PROMOÇÃO -${game.desconto}%</span>` : "";

    const card = document.createElement("div");
    card.className = "game-card glow-card";

    card.innerHTML = `
      <div class="game-image-wrapper">
        <img src="${game.image}" alt="${game.title}" loading="lazy" class="game-image" />
        <button class="btn-fav btn-glow" onclick="toggleFavorito(${game.id})">${favoritoIcon}</button>
        ${promoLabel}
      </div>
      <div class="game-info">
        <h3 class="game-title neon-text">${game.title}</h3>
        <p class="game-price neon-text">
          ${game.promo ? `<span class="preco-original">R$ ${precoOriginal.toFixed(2)}</span>` : ""}
          R$ ${precoFinal.toFixed(2)}
        </p>
        <div class="game-actions">
          <button class="btn-detalhes btn-glow" onclick="renderDetalhes(${game.id})">Ver mais</button>
          <button class="btn-pagamento btn-glow" onclick="realizarPagamento(${game.id})">💳 Comprar</button>
          <button class="btn-glow" onclick="adicionarAoCarrinho(${game.id})">🛒</button>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}
   


function ordenarLoja(criterio) {
  games.sort((a, b) => {
    if (criterio === "nome") return a.title.localeCompare(b.title);
    if (criterio === "preco") return a.price - b.price;
  });
  renderLoja(document.getElementById("search")?.value || "");
}

// ---------------------- DETALHES E COMENTÁRIOS ----------------------
function renderDetalhes(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;

  const isFav = isFavorito(game.id);
  const favoritoIcon = isFav ? "❤️" : "🤍";

  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="detalhes-section neon-glow">
      <button class="btn-voltar btn-glow" onclick="navigate('loja')">← Voltar à loja</button>
      <h1 class="neon-text">${game.title}</h1>
      <div class="detalhes-content">
        <img src="${game.image}" alt="${game.title}" loading="lazy" class="detalhes-image" />
        <div class="detalhes-text">
          <p><strong>Preço:</strong> <span class="neon-text">R$ ${game.price.toFixed(2)}</span></p>
          <p>${game.description}</p>
          <div class="detalhes-actions">
            <button onclick="toggleFavorito(${game.id})" class="btn-fav-det btn-glow">${favoritoIcon} Favoritar</button>
            <button onclick="realizarPagamento(${game.id})" class="btn-pagamento btn-glow">💳 Comprar</button>
            <button onclick="adicionarAoCarrinho(${game.id})" class="btn-glow">🛒 Adicionar ao Carrinho</button>
          </div>
          <div class="comentarios">
            <h3 class="neon-text">Comentários</h3>
            <div id="comentarios"></div>
            <input type="text" id="comentarioInput" class="glow-input" placeholder="Deixe um comentário" />
            <button onclick="salvarComentario(${game.id}, document.getElementById('comentarioInput').value)" class="btn-glow">Enviar</button>
          </div>
        </div>
      </div>
    </section>
  `;
  renderComentarios(game.id);
}

function salvarComentario(gameId, comentario) {
  const comentarios = JSON.parse(localStorage.getItem("comentarios") || "{}");
  if (!comentarios[gameId]) comentarios[gameId] = [];
  comentarios[gameId].push(comentario);
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
  renderComentarios(gameId);
}

function renderComentarios(gameId) {
  const comentarios = JSON.parse(localStorage.getItem("comentarios") || "{}")[gameId] || [];
  const container = document.getElementById("comentarios");
  container.innerHTML = comentarios.map(c => `<p class="neon-text">💬 ${c}</p>`).join("");
}

// ---------------------- PAGAMENTO ----------------------
function realizarPagamento(id) {
  const game = games.find(g => g.id === id);
  if (!game) return;

  const url = `lojakinggames.html?titulo=${encodeURIComponent(game.title)}&valor=${game.price}`;
  alert(`Redirecionando para pagamento de "${game.title}" por R$ ${game.price.toFixed(2)}`);
  window.open(url, "_blank");
}

// ---------------------- BUSCA COM DEBOUNCE ----------------------
function setupSearch() {
  const input = document.getElementById("search");
  if (!input) return;

  let timeout = null;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      renderLoja(input.value);
    }, 300);
  });
}

// ---------------------- LOGIN / USUÁRIO MODERNO COM LOGIN E CADASTRO ----------------------

function abrirModalLogin(cadastroAtivo = false) {
  const modal = document.createElement("div");
  modal.id = "modal-login";
  modal.innerHTML = `
    <div class="modal-content glow-card">
      <div class="tabs">
        <button id="tab-login" class="tab-btn ${!cadastroAtivo ? "active" : ""}">Login</button>
        <button id="tab-cadastro" class="tab-btn ${cadastroAtivo ? "active" : ""}">Cadastrar</button>
      </div>

      <form id="form-login" style="display: ${cadastroAtivo ? "none" : "block"};">
        <input id="login-email" type="email" placeholder="E-mail" class="glow-input" required />
        <input id="login-senha" type="password" placeholder="Senha" class="glow-input" required />
        <button type="submit" class="btn-glow">Entrar</button>
      </form>

      <form id="form-cadastro" style="display: ${cadastroAtivo ? "block" : "none"};">
        <input id="cadastro-nome" type="text" placeholder="Nome completo" class="glow-input" required />
        <input id="cadastro-email" type="email" placeholder="E-mail" class="glow-input" required />
        <input id="cadastro-senha" type="password" placeholder="Senha" class="glow-input" required />
        <button type="submit" class="btn-glow">Cadastrar</button>
      </form>

      <button onclick="fecharModalLogin()" class="btn-glow">Cancelar</button>
    </div>
  `;
  modal.classList.add("modal-overlay");
  document.body.appendChild(modal);

  // Eventos das abas
  document.getElementById("tab-login").onclick = () => {
    document.getElementById("tab-login").classList.add("active");
    document.getElementById("tab-cadastro").classList.remove("active");
    document.getElementById("form-login").style.display = "block";
    document.getElementById("form-cadastro").style.display = "none";
  };
  document.getElementById("tab-cadastro").onclick = () => {
    document.getElementById("tab-cadastro").classList.add("active");
    document.getElementById("tab-login").classList.remove("active");
    document.getElementById("form-login").style.display = "none";
    document.getElementById("form-cadastro").style.display = "block";
  };

  // Eventos dos formulários
  document.getElementById("form-login").onsubmit = e => {
    e.preventDefault();
    loginUsuario();
  };

  document.getElementById("form-cadastro").onsubmit = e => {
    e.preventDefault();
    cadastrarUsuario();
  };
}

function fecharModalLogin() {
  const modal = document.getElementById("modal-login");
  if (modal) modal.remove();
}

function cadastrarUsuario() {
  const nome = document.getElementById("cadastro-nome").value.trim();
  const email = document.getElementById("cadastro-email").value.trim().toLowerCase();
  const senha = document.getElementById("cadastro-senha").value;

  if (!nome || !email || !senha) {
    alert("Por favor, preencha todos os campos para cadastro.");
    return;
  }

  // Pega usuários cadastrados (array)
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Verifica se email já está cadastrado
  if (usuarios.some(u => u.email === email)) {
    alert("Este e-mail já está cadastrado.");
    return;
  }

  usuarios.push({
    nome,
    email,
    senha,
    avatar: gerarAvatar(nome),
  });

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Cadastro realizado com sucesso! Agora faça login.");
  
  // Limpa campos e alterna para aba login
  document.getElementById("cadastro-nome").value = "";
  document.getElementById("cadastro-email").value = "";
  document.getElementById("cadastro-senha").value = "";
  document.getElementById("tab-login").click();
}

function loginUsuario() {
  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const senha = document.getElementById("login-senha").value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos para login.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (!usuario) {
    alert("Usuário ou senha inválidos.");
    return;
  }

  localStorage.setItem("usuario", JSON.stringify(usuario));
  fecharModalLogin();
  desbloquearSite();
  atualizarUIUsuario();
}

function logout() {
  localStorage.removeItem("usuario");
  atualizarUIUsuario();
  bloquearSite();
}

function getUsuario() {
  const userStr = localStorage.getItem("usuario");
  return userStr ? JSON.parse(userStr) : null;
}

function atualizarUIUsuario() {
  const userBox = document.getElementById("user-box");
  const usuario = getUsuario();

  if (userBox) {
    userBox.innerHTML = usuario
      ? `
        <div class="user-logged">
          <img src="${usuario.avatar}" alt="Avatar" class="avatar-img" />
          <span class="user-name neon-text">${usuario.nome}</span>
          <button onclick="logout()" class="btn-glow">Sair</button>
        </div>
      `
      : `<button onclick="abrirModalLogin()" class="btn-glow">Entrar</button>`;
  }
}

// Gera avatar com iniciais
function gerarAvatar(nome) {
  const initials = nome
    .split(" ")
    .map(n => n[0].toUpperCase())
    .slice(0, 2)
    .join("");
  return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`;
}

// ---------------------- BLOQUEIO DO SITE SE NÃO LOGADO ----------------------
function bloquearSite() {
  if (!document.getElementById("bloqueio-login")) {
    const bloqueio = document.createElement("div");
    bloqueio.id = "bloqueio-login";
    bloqueio.style.position = "fixed";
    bloqueio.style.top = 0;
    bloqueio.style.left = 0;
    bloqueio.style.width = "100vw";
    bloqueio.style.height = "100vh";
    bloqueio.style.backgroundColor = "rgba(0,0,0,0.85)";
    bloqueio.style.zIndex = 9998;
    bloqueio.style.cursor = "not-allowed";
    bloqueio.title = "Faça login para acessar o site";
    document.body.appendChild(bloqueio);
  }
  abrirModalLogin(false);
}

function desbloquearSite() {
  const bloqueio = document.getElementById("bloqueio-login");
  if (bloqueio) bloqueio.remove();
}

// ---------------------- INICIALIZAÇÃO ----------------------
window.addEventListener("load", () => {
  atualizarUIUsuario();

  const usuario = getUsuario();
  if (!usuario) {
    bloquearSite();
  } else {
    desbloquearSite();
  }
});



