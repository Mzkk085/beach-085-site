// Lista dos produtos
let produtos = [
    {
        id: "1",
        nome: "Chapéu de Palha Premium",
        descricao: "Proteção elegante contra o sol",
        preco: 89.9,
        imagem: "img/produto1.png",
        categoria: "chapeus",
        avaliacao: 5,
        etiquetas: ["novo"]
    },
    {
        id: "2",
        nome: "Óculos de Sol Polarizado",
        descricao: "Proteção UV com estilo moderno e conforto.",
        preco: 149.9,
        imagem: "img/produto2.png",
        categoria: "oculos",
        avaliacao: 4,
        etiquetas: ["mais-vendido"]
    },
    {
        id: "3",
        nome: "Bolsa de Praia Tropical",
        descricao: "Perfeita para carregar seus itens de praia.",
        preco: 119.9,
        imagem: "img/produto3.png",
        categoria: "bolsas",
        avaliacao: 4,
        etiquetas: []
    },
    {
        id: "4",
        nome: "Canga de Praia Mandala",
        descricao: "Versátil e colorida, pode ser usada como toalha.",
        preco: 59.9,
        precoAntigo: 79.9,
        imagem: "img/produto4.png",
        categoria: "toalhas",
        avaliacao: 5,
        etiquetas: ["promocao"]
    },
    {
        id: "5",
        nome: "Chapéu Bucket Proteção UV",
        descricao: "Chapéu estilo bucket com proteção UV",
        preco: 69.9,
        imagem: "img/produto5.png",
        categoria: "chapeus",
        avaliacao: 4,
        etiquetas: []
    },
    {
        id: "6",
        nome: "Óculos de Sol Espelhado",
        descricao: "Óculos com lentes espelhadas e armação leve, ideal para esportes aquáticos.",
        preco: 129.9,
        imagem: "img/produto6.png",
        categoria: "oculos",
        avaliacao: 5,
        etiquetas: ["novo"]
    },
    {
        id: "7",
        nome: "Bolsa Térmica de Praia",
        descricao: "Mantenha suas bebidas geladas por horas!",
        preco: 89.9,
        imagem: "img/produto7.png",
        categoria: "bolsas",
        avaliacao: 4,
        etiquetas: []
    },
    {
        id: "8",
        nome: "Toalha de Praia Redonda",
        descricao: "Toalha redonda com franjas.",
        preco: 79.9,
        imagem: "img/produto8.png",
        categoria: "toalhas",
        avaliacao: 3,
        etiquetas: []
    },
    {
        id: "9",
        nome: "Chapéu de Praia Aba Larga",
        descricao: "Chapéu com aba larga para proteção do rosto",
        preco: 99.9,
        imagem: "img/produto9.png",
        categoria: "chapeus",
        avaliacao: 5,
        etiquetas: []
    },
    {
        id: "10",
        nome: "Óculos Flutuantes",
        descricao: "Perfeitos para esportes aquáticos.",
        preco: 159.9,
        imagem: "img/produto10.png",
        categoria: "oculos",
        avaliacao: 4,
        etiquetas: ["mais-vendido"]
    },
    {
        id: "11",
        nome: "Bolsa Impermeável",
        descricao: "Para proteger seus pertences na praia.",
        preco: 139.9,
        precoAntigo: 169.9,
        imagem: "img/produto11.png",
        categoria: "bolsas",
        avaliacao: 5,
        etiquetas: ["promocao"]
    },
    {
        id: "12",
        nome: "Canga Dupla Face",
        descricao: "Dois designs diferentes para combinar com look.",
        preco: 69.9,
        imagem: "img/produto12.png",
        categoria: "toalhas",
        avaliacao: 4,
        etiquetas: []
    }
];

// Filtros atuais
let filtros = {
    categoria: "todos",
    precoMin: 0,
    precoMax: 999999,
    avaliacao: 0,
    ordenacao: "relevancia"
};

// Quando a página carregar
window.onload = function () {
    let grade = document.querySelector(".grade-produtos");
    if (!grade) {
        console.error("Elemento .grade-produtos não encontrado!");
        return;
    }

    mostrarProdutos();
    configurarFiltros();
    verificarCategoriaURL();
};

// Configurar filtros
function configurarFiltros() {
    let filtrosCat = document.querySelectorAll(".filtro-categoria a");
    for (let i = 0; i < filtrosCat.length; i++) {
        filtrosCat[i].onclick = function (e) {
            e.preventDefault();
            let posicaoAtual = window.pageYOffset;
            for (let j = 0; j < filtrosCat.length; j++) {
                filtrosCat[j].classList.remove("ativo");
            }
            this.classList.add("ativo");
            filtros.categoria = this.getAttribute("data-categoria") || "todos";
            mostrarProdutos();
            window.scrollTo(0, posicaoAtual);
        };
    }

    let botaoPreco = document.getElementById("aplicar-preco");
    if (botaoPreco) {
        botaoPreco.onclick = function () {
            let posicaoAtual = window.pageYOffset;
            let inputMin = document.getElementById("preco-min");
            let inputMax = document.getElementById("preco-max");
            filtros.precoMin = inputMin && inputMin.value ? parseFloat(inputMin.value) : 0;
            filtros.precoMax = inputMax && inputMax.value ? parseFloat(inputMax.value) : 999999;
            mostrarProdutos();
            window.scrollTo(0, posicaoAtual);
        };
    }

    let avaliacoes = document.querySelectorAll(".filtro-avaliacao input");
    for (let i = 0; i < avaliacoes.length; i++) {
        avaliacoes[i].onchange = function () {
            if (this.checked) {
                let posicaoAtual = window.pageYOffset;
                filtros.avaliacao = parseInt(this.value);
                mostrarProdutos();
                window.scrollTo(0, posicaoAtual);
            }
        };
    }

    let selectOrdem = document.getElementById("ordenar-por");
    if (selectOrdem) {
        selectOrdem.onchange = function () {
            let posicaoAtual = window.pageYOffset;
            filtros.ordenacao = this.value;
            mostrarProdutos();
            window.scrollTo(0, posicaoAtual);
        };
    }
}

// Mostrar produtos
function mostrarProdutos() {
    let grade = document.querySelector(".grade-produtos");
    let contador = document.getElementById("total-produtos");

    let produtosFiltrados = [];
    for (let i = 0; i < produtos.length; i++) {
        let produto = produtos[i];
        let passou = true;
        if (filtros.categoria !== "todos" && produto.categoria !== filtros.categoria) {
            passou = false;
        }
        if (produto.preco < filtros.precoMin || produto.preco > filtros.precoMax) {
            passou = false;
        }
        if (produto.avaliacao < filtros.avaliacao) {
            passou = false;
        }
        if (passou) {
            produtosFiltrados.push(produto);
        }
    }

    if (filtros.ordenacao === "preco-menor") {
        produtosFiltrados.sort((a, b) => a.preco - b.preco);
    } else if (filtros.ordenacao === "preco-maior") {
        produtosFiltrados.sort((a, b) => b.preco - a.preco);
    } else if (filtros.ordenacao === "mais-recentes") {
        produtosFiltrados.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }

    if (contador) {
        contador.textContent = produtosFiltrados.length;
    }

    grade.innerHTML = "";
    if (produtosFiltrados.length === 0) {
        grade.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #666;"><h3>Nenhum produto encontrado</h3><p>Tente ajustar os filtros.</p></div>';
    } else {
        for (let i = 0; i < produtosFiltrados.length; i++) {
            let card = criarCard(produtosFiltrados[i]);
            grade.appendChild(card);
        }
    }

    configurarBotoesCarrinho();
}

// Criar card do produto
function criarCard(produto) {
    let card = document.createElement("div");
    card.className = "card-produto";

    let etiquetas = "";
    if (produto.etiquetas && produto.etiquetas.length > 0) {
        etiquetas = '<div class="etiquetas-produto">';
        for (let i = 0; i < produto.etiquetas.length; i++) {
            let nomeEtiqueta = obterNomeEtiqueta(produto.etiquetas[i]);
            etiquetas += '<span class="etiqueta ' + produto.etiquetas[i] + '">' + nomeEtiqueta + '</span>';
        }
        etiquetas += '</div>';
    }

    let precoHTML = "";
    if (produto.precoAntigo) {
        precoHTML = '<p class="preco-produto"><span class="preco-antigo">R$ ' + produto.precoAntigo.toFixed(2).replace(".", ",") + '</span> R$ ' + produto.preco.toFixed(2).replace(".", ",") + '</p>';
    } else {
        precoHTML = '<p class="preco-produto">R$ ' + produto.preco.toFixed(2).replace(".", ",") + '</p>';
    }

    card.innerHTML =
        '<div class="imagem-produto">' +
        '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +
        etiquetas +
        '</div>' +
        '<div class="info-produto">' +
        '<h3>' + produto.nome + '</h3>' +
        '<p class="descricao-produto">' + produto.descricao + '</p>' +
        '<div class="rodape-produto">' +
        precoHTML +
        '<button class="botao-adicionar-carrinho" data-id="' + produto.id + '" data-nome="' + produto.nome + '" data-preco="' + produto.preco + '">' +
        '<i class="fas fa-shopping-cart"></i> Adicionar' +
        '</button>' +
        '</div>' +
        '</div>';

    return card;
}

// Configurar botões do carrinho
function configurarBotoesCarrinho() {
    // Primeiro removemos event listeners duplicados
    const botoesExistentes = document.querySelectorAll(".botao-adicionar-carrinho");
    botoesExistentes.forEach(botao => {
        botao.replaceWith(botao.cloneNode(true));
    });

    // Agora configuramos os novos listeners
    const botoes = document.querySelectorAll(".botao-adicionar-carrinho");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].addEventListener("click", function(e) {
            e.preventDefault();
            
            // Evita múltiplos cliques
            if (this.classList.contains('adicionado')) {
                return;
            }
            
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            const preco = parseFloat(this.getAttribute("data-preco"));
            const produto = { id, nome, preco };

            // Feedback visual
            const textoOriginal = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Adicionado';
            this.classList.add('adicionado');
            this.disabled = true;

            if (window.carrinhoManager) {
                window.carrinhoManager.adicionarItem(produto);
            }

            // Restaura o botão após 1.5 segundos
            setTimeout(() => {
                this.innerHTML = textoOriginal;
                this.disabled = false;
                this.classList.remove('adicionado');
            }, 1500);
        });
    }
}
// Obter nome da etiqueta
function obterNomeEtiqueta(etiqueta) {
    if (etiqueta === "novo") return "Novo";
    if (etiqueta === "promocao") return "Promoção";
    if (etiqueta === "mais-vendido") return "Mais Vendido";
    return etiqueta;
}

// Verificar categoria na URL
function verificarCategoriaURL() {
    let url = window.location.search;
    if (url.indexOf("categoria=") !== -1) {
        let categoria = url.split("categoria=")[1];
        if (categoria.indexOf("&") !== -1) {
            categoria = categoria.split("&")[0];
        }
        let filtroCategoria = document.querySelector('[data-categoria="' + categoria + '"]');
        if (filtroCategoria) {
            filtroCategoria.click();
        }
    }
}
