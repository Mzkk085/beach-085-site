// Lista dos acessórios
const acessorios = [
    {
      id: "1001",
      nome: "Pulseira de Conchas",
      descricao: "Pulseira artesanal feita com conchas naturais.",
      preco: 39.9,
      imagem: "img/acessorio1.png",
      categoria: "joias",
      avaliacao: 5,
      cor: "branco",
      etiquetas: ["novo"],
    },
    {
      id: "1002",
      nome: "Protetor Solar Facial FPS 50",
      descricao: "Proteção UVA/UVB com fórmula oil-free",
      preco: 69.9,
      imagem: "img/acessorio2.png",
      categoria: "protetores",
      avaliacao: 4,
      cor: "branco",
      etiquetas: ["mais-vendido"],
    },
    {
      id: "1003",
      nome: "Garrafa Térmica 500ml",
      descricao: "Mantém sua bebida gelada por até 24 horas.",
      preco: 89.9,
      imagem: "img/acessorio3.png",
      categoria: "garrafas",
      avaliacao: 4,
      cor: "azul",
      etiquetas: [],
    },
    {
      id: "1004",
      nome: "Mikasa",
      descricao: "Bola profissional de altinha e futevôlei.",
      preco: 199.99,
      precoAntigo: 250.0,
      imagem: "img/acessorio4.png",
      categoria: "jogos",
      avaliacao: 5,
      cor: "amarelo",
      etiquetas: ["promocao"],
    },
    {
      id: "1005",
      nome: "Prancha de Surf",
      descricao: "Ótima para ondas de pequenas a médias.",
      preco: 399.99,
      imagem: "img/acessorio5.png",
      categoria: "jogos",
      avaliacao: 4,
      cor: "azul",
      etiquetas: [],
    },
    {
      id: "1006",
      nome: "Kit Frescobol",
      descricao: "Kit para se divertir e jogar.",
      preco: 89.99,
      imagem: "img/acessorio6.png",
      categoria: "jogos",
      avaliacao: 4,
      cor: "branco",
      etiquetas: [],
    },
    {
      id: "1007",
      nome: "Guarda-Sol",
      descricao: "Elegante para manter você sombreado",
      preco: 79.9,
      imagem: "img/acessorio7.png",
      categoria: "outros",
      avaliacao: 5,
      cor: "verde",
      etiquetas: ["novo"],
    },
    {
      id: "1008",
      nome: "Almofada Inflável",
      descricao: "Maior conforto na areia ou na cadeira de praia.",
      preco: 49.9,
      imagem: "img/acessorio8.png",
      categoria: "outros",
      avaliacao: 3,
      cor: "azul",
      etiquetas: [],
    },
    {
      id: "1009",
      nome: "Colar de Conchas",
      descricao: "Colar artesanal com conchas naturais.",
      preco: 59.9,
      imagem: "img/acessorio9.png",
      categoria: "joias",
      avaliacao: 4,
      cor: "branco",
      etiquetas: [],
    },
    {
      id: "1010",
      nome: "Porta-Copos Inflável",
      descricao: "Flutuante para manter sua bebida sempre à mão",
      preco: 24.9,
      imagem: "img/acessorio10.png",
      categoria: "outros",
      avaliacao: 5,
      cor: "rosa",
      etiquetas: ["mais-vendido"],
    },
  ]
  
  // Filtros atuais
  const filtros = {
    categoria: "todos",
    cores: [],
    precoMin: 0,
    precoMax: 999999,
    avaliacao: 0,
    ordenacao: "relevancia",
  }
  
  // Quando a página carregar
  document.addEventListener("DOMContentLoaded", () => {
    const grade = document.querySelector(".grade-acessorios")
    if (!grade) {
      console.error("Elemento .grade-acessorios não encontrado!")
      return
    }
  
    mostrarAcessorios()
    configurarFiltros()
    verificarCategoriaURL()
  })
  
  // Configurar filtros
  function configurarFiltros() {
    // Filtros de categoria
    const filtrosCat = document.querySelectorAll(".filtro-categoria a")
    for (let i = 0; i < filtrosCat.length; i++) {
      filtrosCat[i].onclick = function (e) {
        e.preventDefault()
        const posicaoAtual = window.pageYOffset
        for (let j = 0; j < filtrosCat.length; j++) {
          filtrosCat[j].classList.remove("ativo")
        }
        this.classList.add("ativo")
        filtros.categoria = this.getAttribute("data-categoria") || "todos"
        mostrarAcessorios()
        window.scrollTo(0, posicaoAtual)
      }
    }
  
    // Filtros de cor
    const filtrosCor = document.querySelectorAll(".filtro-cor input[type='checkbox']")
    for (let i = 0; i < filtrosCor.length; i++) {
      filtrosCor[i].onchange = function () {
        const posicaoAtual = window.pageYOffset
        const cor = this.value
        if (this.checked) {
          if (filtros.cores.indexOf(cor) === -1) {
            filtros.cores.push(cor)
          }
        } else {
          const index = filtros.cores.indexOf(cor)
          if (index > -1) {
            filtros.cores.splice(index, 1)
          }
        }
        mostrarAcessorios()
        window.scrollTo(0, posicaoAtual)
      }
    }
  
    // Filtro de preço
    const botaoPreco = document.getElementById("aplicar-preco")
    if (botaoPreco) {
      botaoPreco.onclick = () => {
        const posicaoAtual = window.pageYOffset
        const inputMin = document.getElementById("preco-min")
        const inputMax = document.getElementById("preco-max")
        filtros.precoMin = inputMin && inputMin.value ? Number.parseFloat(inputMin.value) : 0
        filtros.precoMax = inputMax && inputMax.value ? Number.parseFloat(inputMax.value) : 999999
        if (filtros.precoMin < 0 || filtros.precoMax < 0) {
          alert("Os preços devem ser positivos.")
          return
        }
        if (filtros.precoMin > filtros.precoMax) {
          alert("Preço mínimo não pode ser maior que o máximo.")
          return
        }
        mostrarAcessorios()
        window.scrollTo(0, posicaoAtual)
      }
    }
  
    // Filtro de avaliação
    const avaliacoes = document.querySelectorAll(".filtro-avaliacao input")
    for (let i = 0; i < avaliacoes.length; i++) {
      avaliacoes[i].onchange = function () {
        if (this.checked) {
          const posicaoAtual = window.pageYOffset
          filtros.avaliacao = Number.parseInt(this.value)
          mostrarAcessorios()
          window.scrollTo(0, posicaoAtual)
        }
      }
    }
  
    // Ordenação
    const selectOrdem = document.getElementById("ordenar-por")
    if (selectOrdem) {
      selectOrdem.onchange = function () {
        const posicaoAtual = window.pageYOffset
        filtros.ordenacao = this.value
        mostrarAcessorios()
        window.scrollTo(0, posicaoAtual)
      }
    }
  }
  
  // Mostrar acessórios
  function mostrarAcessorios() {
    const grade = document.querySelector(".grade-acessorios")
    const contador = document.getElementById("total-acessorios")
  
    const acessoriosFiltrados = acessorios.filter((acessorio) => {
      let passou = true
  
      // Filtro por categoria
      if (filtros.categoria !== "todos" && acessorio.categoria !== filtros.categoria) {
        passou = false
      }
  
      // Filtro por preço
      if (acessorio.preco < filtros.precoMin || acessorio.preco > filtros.precoMax) {
        passou = false
      }
  
      // Filtro por avaliação
      if (acessorio.avaliacao < filtros.avaliacao) {
        passou = false
      }
  
      // Filtro por cor
      if (filtros.cores.length > 0) {
        if (filtros.cores.indexOf(acessorio.cor) === -1) {
          passou = false
        }
      }
  
      return passou
    })
  
    // Ordenação
    if (filtros.ordenacao === "preco-menor") {
      acessoriosFiltrados.sort((a, b) => a.preco - b.preco)
    } else if (filtros.ordenacao === "preco-maior") {
      acessoriosFiltrados.sort((a, b) => b.preco - a.preco)
    } else if (filtros.ordenacao === "mais-recentes") {
      acessoriosFiltrados.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
    }
  
    // Atualizar contador
    if (contador) {
      contador.textContent = acessoriosFiltrados.length
    }
  
    // Renderizar resultados
    grade.innerHTML = ""
    if (acessoriosFiltrados.length === 0) {
      grade.innerHTML =
        '<div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;"><h3>Nenhum acessório encontrado</h3><p>Tente ajustar os filtros.</p></div>'
    } else {
      acessoriosFiltrados.forEach((acessorio) => {
        grade.appendChild(criarCard(acessorio))
      })
    }
  
    configurarBotoesCarrinho()
  }
  
  // Criar card do acessório
  function criarCard(acessorio) {
    const card = document.createElement("div")
    card.className = "card-acessorio"
    card.setAttribute("data-categoria", acessorio.categoria)
    card.setAttribute("data-avaliacao", acessorio.avaliacao)
    card.setAttribute("data-cor", acessorio.cor)
  
    let etiquetas = ""
    if (acessorio.etiquetas && acessorio.etiquetas.length > 0) {
      etiquetas = '<div class="etiquetas-acessorio">'
      for (let i = 0; i < acessorio.etiquetas.length; i++) {
        const nomeEtiqueta = obterNomeEtiqueta(acessorio.etiquetas[i])
        etiquetas += '<span class="etiqueta ' + acessorio.etiquetas[i] + '">' + nomeEtiqueta + "</span>"
      }
      etiquetas += "</div>"
    }
  
    let precoHTML = ""
    if (acessorio.precoAntigo) {
      precoHTML =
        '<p class="preco-acessorio"><span class="preco-antigo">R$ ' +
        acessorio.precoAntigo.toFixed(2).replace(".", ",") +
        "</span> R$ " +
        acessorio.preco.toFixed(2).replace(".", ",") +
        "</p>"
    } else {
      precoHTML = '<p class="preco-acessorio">R$ ' + acessorio.preco.toFixed(2).replace(".", ",") + "</p>"
    }
  
    card.innerHTML =
      '<div class="imagem-acessorio">' +
      '<img src="' +
      acessorio.imagem +
      '" alt="' +
      acessorio.nome +
      '">' +
      etiquetas +
      "</div>" +
      '<div class="info-acessorio">' +
      "<h3>" +
      acessorio.nome +
      "</h3>" +
      '<p class="descricao-acessorio">' +
      acessorio.descricao +
      "</p>" +
      '<div class="rodape-acessorio">' +
      precoHTML +
      '<button class="botao-adicionar-carrinho" data-id="' +
      acessorio.id +
      '" data-nome="' +
      acessorio.nome +
      '" data-preco="' +
      acessorio.preco +
      '">' +
      '<i class="fas fa-shopping-cart"></i> Adicionar' +
      "</button>" +
      "</div>" +
      "</div>"
  
    return card
  }
  
  // Configurar botões do carrinho
  function configurarBotoesCarrinho() {
    // Primeiro removemos todos os listeners existentes
    const botoesExistentes = document.querySelectorAll(".botao-adicionar-carrinho");
    botoesExistentes.forEach(botao => {
        botao.replaceWith(botao.cloneNode(true));
    });

    // Agora configuramos os novos listeners
    const botoes = document.querySelectorAll(".botao-adicionar-carrinho");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", function(e) {
            e.preventDefault();
            
            // Verifica se já foi processado
            if (this.classList.contains('processando')) {
                return;
            }
            
            this.classList.add('processando');
            
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = Number.parseFloat(this.getAttribute("data-preco"));
            const acessorio = { id, nome, preco };

            // Feedback visual
            const textoOriginal = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
            this.disabled = true;

            if (window.carrinhoManager) {
                window.carrinhoManager.adicionarItem(acessorio);
            }

            // Restaura o botão após 1.5 segundos
            setTimeout(() => {
                this.innerHTML = textoOriginal;
                this.disabled = false;
                this.classList.remove('processando');
            }, 1500);
        }, { once: true }); // Garante que o listener só execute uma vez
    }
}
  
  // Obter nome da etiqueta
  function obterNomeEtiqueta(etiqueta) {
    if (etiqueta === "novo") return "Novo"
    if (etiqueta === "promocao") return "Promoção"
    if (etiqueta === "mais-vendido") return "Mais Vendido"
    return etiqueta
  }
  
  // Verificar categoria na URL
  function verificarCategoriaURL() {
    const url = window.location.search
    if (url.indexOf("categoria=") !== -1) {
      let categoria = url.split("categoria=")[1]
      if (categoria.indexOf("&") !== -1) {
        categoria = categoria.split("&")[0]
      }
      const filtroCategoria = document.querySelector('[data-categoria="' + categoria + '"]')
      if (filtroCategoria) {
        filtroCategoria.click()
      }
    }
  }
  
