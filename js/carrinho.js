class CarrinhoManager {
    constructor() {
      this.carrinho = this.carregarCarrinho()
      this.cupomAplicado = null
      this.descontoPercentual = 0
      this.init()
    }
  
    init() {
      this.atualizarContadorCarrinho()
      if (window.location.pathname.includes("carrinho.html")) {
        this.renderizarCarrinho()
        this.configurarEventListeners()
      }
      if (
        window.location.pathname.includes("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/")
      ) {
        this.inicializarBotoesCarrinhoHome()
      }
    }
  
    inicializarBotoesCarrinhoHome() {
        // Remove event listeners existentes primeiro para evitar duplicação
        let botoesExistentes = document.querySelectorAll(".botao-adicionar-carrinho");
        botoesExistentes.forEach(botao => {
            botao.replaceWith(botao.cloneNode(true));
        });
    
        // Agora adiciona os novos listeners
        let botoesAdicionar = document.querySelectorAll(".botao-adicionar-carrinho");
        botoesAdicionar.forEach((botao) => {
            botao.addEventListener("click", (e) => {
                e.preventDefault();
                let id = botao.getAttribute("data-id");
                let nome = botao.getAttribute("data-nome");
                let preco = Number.parseFloat(botao.getAttribute("data-preco"));
                
                // Verifica se já foi adicionado nesta sessão
                if (botao.classList.contains('adicionado')) {
                    return;
                }
                
                let produto = { id, nome, preco };
                this.adicionarItem(produto);
                
                // Marca como adicionado
                botao.classList.add('adicionado');
                
                let textoOriginal = botao.innerHTML;
                botao.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
                botao.disabled = true;
                
                setTimeout(() => {
                    botao.innerHTML = textoOriginal;
                    botao.disabled = false;
                    botao.classList.remove('adicionado');
                }, 1500);
            }, { once: true }); // O parâmetro {once: true} faz o listener ser executado apenas uma vez
        });
    }
  
    carregarCarrinho() {
      try {
        const carrinhoSalvo = localStorage.getItem("beach085_carrinho")
        if (!carrinhoSalvo) return []
        const carrinho = JSON.parse(carrinhoSalvo)
        if (!Array.isArray(carrinho)) {
          console.warn("Carrinho corrompido, reinicializando...")
          localStorage.removeItem("beach085_carrinho")
          return []
        }
        return carrinho.filter((item) => item.id && item.nome && !isNaN(item.preco) && item.quantidade > 0)
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error)
        localStorage.removeItem("beach085_carrinho")
        return []
      }
    }
  
    salvarCarrinho() {
      try {
        localStorage.setItem("beach085_carrinho", JSON.stringify(this.carrinho))
        this.atualizarContadorCarrinho()
      } catch (error) {
        console.error("Erro ao salvar carrinho:", error)
      }
    }
  
    adicionarItem(produto) {
      if (!produto.id || !produto.nome || isNaN(produto.preco)) {
        console.error("Produto inválido:", produto)
        return
      }
      const itemExistente = this.carrinho.find((item) => item.id === produto.id)
      if (itemExistente) {
        if (itemExistente.quantidade < 99) {
          itemExistente.quantidade += 1
          this.salvarCarrinho()
          this.mostrarNotificacao(`${produto.nome} quantidade atualizada!`, "sucesso")
        } else {
          this.mostrarNotificacao("Quantidade máxima atingida para este item", "aviso")
        }
      } else {
        this.carrinho.push({
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
        })
        this.salvarCarrinho()
        this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`, "sucesso")
      }
      this.atualizarContadorCarrinho()
      if (window.location.pathname.includes("carrinho.html")) {
        this.renderizarCarrinho()
      }
    }
  
    removerItem(id) {
      this.carrinho = this.carrinho.filter((item) => item.id !== id)
      this.salvarCarrinho()
      if (window.location.pathname.includes("carrinho.html")) {
        this.renderizarCarrinho()
      }
    }
  
    atualizarQuantidade(id, novaQuantidade) {
      const item = this.carrinho.find((item) => item.id === id)
      if (item) {
        item.quantidade = Math.max(1, Math.min(99, novaQuantidade))
        this.salvarCarrinho()
      }
    }
  
    limparCarrinho() {
      this.carrinho = []
      this.cupomAplicado = null
      this.descontoPercentual = 0
      this.salvarCarrinho()
      if (window.location.pathname.includes("carrinho.html")) {
        this.renderizarCarrinho()
      }
    }
  
    getSubtotal() {
      return this.carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0)
    }
  
    getFrete() {
      return 0
    }
  
    getDesconto() {
      const subtotal = this.getSubtotal()
      return subtotal * (this.descontoPercentual / 100)
    }
  
    getTotal() {
      const subtotal = this.getSubtotal()
      const frete = this.getFrete()
      const desconto = this.getDesconto()
      return Math.max(0, subtotal + frete - desconto)
    }
  
    aplicarCupom(codigo) {
      if (!codigo || codigo.trim() === "") {
          this.mostrarNotificacao("Insira um código de cupom válido", "aviso");
          return false;
      }
  
      const cupons = {
          BEACH085: 20,
          PRAIANO: 15,
          ALOISIOLINDO: 35,
      };
  
      const codigoUpper = codigo.toUpperCase();
      
      if (cupons[codigoUpper]) {
          this.cupomAplicado = codigoUpper;
          this.descontoPercentual = cupons[codigoUpper];
          
          // 1. Mostra notificação customizada
          this.mostrarNotificacao(
              `Cupom ${codigoUpper} aplicado! ${this.descontoPercentual}% de desconto`, 
              "sucesso"
          );
          
          // 2. Atualiza imediatamente o resumo do carrinho
          this.atualizarResumo();
          
          // 3. Opcional: Mostra também em alert (se necessário)
          alert(`Cupom ${codigoUpper} aplicado com sucesso!`);
          
          return true;
      } else {
          this.mostrarNotificacao("Cupom inválido. Tente BEACH085, EQUIPE10 ou ALOISIOLINDO", "erro");
          return false;
      }
  }
  
    atualizarContadorCarrinho() {
      const contadores = document.querySelectorAll(".contador-carrinho")
      const totalItens = this.carrinho.reduce((total, item) => total + item.quantidade, 0)
      contadores.forEach((contador) => {
        contador.textContent = totalItens > 99 ? "99+" : totalItens
        contador.style.display = totalItens > 0 ? "flex" : "none"
      })
    }
  
    mostrarNotificacao(mensagem, tipo = "sucesso") {
      const notificacaoExistente = document.querySelector(".notificacao-carrinho-ativa")
      if (notificacaoExistente) {
        notificacaoExistente.remove()
      }
      const notificacao = document.createElement("div")
      notificacao.className = `notificacao-carrinho notificacao-carrinho-ativa notificacao-${tipo}`
      notificacao.innerHTML = `
            <div class="conteudo-notificacao">
                <i class="fas ${tipo === "sucesso" ? "fa-check-circle" : tipo === "erro" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
                <p>${mensagem}</p>
            </div>
        `
      notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === "sucesso" ? "#28a745" : tipo === "erro" ? "#dc3545" : "#ffc107"};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `
      document.body.appendChild(notificacao)
      setTimeout(() => {
        notificacao.style.transform = "translateX(0)"
      }, 100)
      setTimeout(() => {
        notificacao.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (notificacao.parentNode) {
            notificacao.remove()
          }
        }, 300)
      }, 3000)
    }
  
    renderizarCarrinho() {
      const containerItensCarrinho = document.getElementById("container-itens-carrinho")
      if (!containerItensCarrinho) return
      if (this.carrinho.length === 0) {
        containerItensCarrinho.innerHTML = `
                <div class="carrinho-vazio">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <a href="produtos.html" class="botao botao-primario">Continuar Comprando</a>
                </div>
            `
        this.atualizarResumo()
        return
      }
      containerItensCarrinho.innerHTML = ""
      this.carrinho.forEach((item) => {
        const itemTotal = item.preco * item.quantidade
        const elementoItem = document.createElement("div")
        elementoItem.className = "item-carrinho"
        let imagemSrc = "img/placeholder.svg"
  
        // Produtos (IDs de 1-9 ou 10-99)
        if (/^[1-9]$/.test(item.id) || /^[1-9][0-9]$/.test(item.id)) {
          imagemSrc = `img/produto${item.id}.png`
        }
        // Acessórios (IDs começando com 100)
        else if (item.id.startsWith("100")) {
          const numeroAcessorio = item.id.substring(3) // pega o último dígito
          imagemSrc = `img/acessorio${numeroAcessorio}.png`
        }
  
        elementoItem.innerHTML = `
                <div class="info-produto-carrinho">
                    <img src="${imagemSrc}" alt="${item.nome}" class="imagem-produto-carrinho" 
                         onerror="this.src='img/placeholder.svg'">
                    <div class="detalhes-produto-carrinho">
                        <h3>${item.nome}</h3>
                    </div>
                </div>
                <div class="preco-carrinho">R$ ${item.preco.toFixed(2).replace(".", ",")}</div>
                <div class="quantidade-carrinho">
                    <div class="controles-quantidade-carrinho">
                        <button class="botao-quantidade diminuir" data-id="${item.id}" ${item.quantidade <= 1 ? "disabled" : ""}>-</button>
                        <input type="number" class="input-quantidade" value="${item.quantidade}" min="1" max="99" data-id="${item.id}">
                        <button class="botao-quantidade aumentar" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="total-carrinho">R$ ${itemTotal.toFixed(2).replace(".", ",")}</div>
                <div class="remover-carrinho">
                    <button class="botao-remover-carrinho" data-id="${item.id}" title="Remover item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `
        containerItensCarrinho.appendChild(elementoItem)
      })
      this.adicionarEventListenersCarrinho()
      this.atualizarResumo()
    }
  
    adicionarEventListenersCarrinho() {
      document.querySelectorAll(".botao-quantidade.diminuir").forEach((botao) => {
        botao.addEventListener("click", () => {
          const id = botao.getAttribute("data-id")
          const item = this.carrinho.find((item) => item.id === id)
          if (item && item.quantidade > 1) {
            this.atualizarQuantidade(id, item.quantidade - 1)
            this.renderizarCarrinho()
          }
        })
      })
      document.querySelectorAll(".botao-quantidade.aumentar").forEach((botao) => {
        botao.addEventListener("click", () => {
          const id = botao.getAttribute("data-id")
          const item = this.carrinho.find((item) => item.id === id)
          if (item && item.quantidade < 99) {
            this.atualizarQuantidade(id, item.quantidade + 1)
            this.renderizarCarrinho()
          }
        })
      })
      document.querySelectorAll(".input-quantidade").forEach((input) => {
        input.addEventListener("change", () => {
          const id = input.getAttribute("data-id")
          let quantidade = Number.parseInt(input.value)
          if (isNaN(quantidade) || quantidade < 1) quantidade = 1
          if (quantidade > 99) quantidade = 99
          input.value = quantidade
          this.atualizarQuantidade(id, quantidade)
          this.renderizarCarrinho()
        })
      })
      document.querySelectorAll(".botao-remover-carrinho").forEach((botao) => {
        botao.addEventListener("click", () => {
          const id = botao.getAttribute("data-id")
          const item = this.carrinho.find((item) => item.id === id)
          if (item && confirm(`Remover ${item.nome} do carrinho?`)) {
            this.removerItem(id)
          }
        })
      })
    }
  
    configurarEventListeners() {
        let aplicarCupomBtn = document.getElementById("aplicar-cupom");
        let codigoCupomInput = document.getElementById("codigo-cupom");
        let botaoFinalizar = document.getElementById("botao-finalizar");
    
        if (botaoFinalizar) {
            botaoFinalizar.addEventListener("click", () => {
                if (this.carrinho.length === 0) {
                    alert("Seu carrinho está vazio", "aviso");
                    return;
                }
                
                // Usando a notificação customizada do sistema
                alert("Compra finalizada! Obrigado por escolher a Beach085 :) Redirecionando...", "sucesso");
                
                // Limpa o carrinho
                this.limparCarrinho();
                
                // Opcional: Redirecionamento
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 3000);
            });
        }
    
        if (aplicarCupomBtn && codigoCupomInput) {
            aplicarCupomBtn.addEventListener("click", () => {
                this.aplicarCupom(codigoCupomInput.value);
            });
            
            codigoCupomInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    this.aplicarCupom(codigoCupomInput.value);
                }
            });
        }
    }
  
    atualizarResumo() {
      const subtotal = this.getSubtotal()
      const frete = this.getFrete()
      const desconto = this.getDesconto()
      const total = this.getTotal()
      const subtotalElement = document.getElementById("subtotal-carrinho")
      const freteElement = document.getElementById("frete-carrinho")
      const descontoElement = document.getElementById("desconto-carrinho")
      const totalElement = document.getElementById("total-carrinho")
  
      if (subtotalElement) {
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`
      }
      if (freteElement) {
        freteElement.textContent = frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2).replace(".", ",")}`
      }
      if (descontoElement) {
        descontoElement.textContent = `-R$ ${desconto.toFixed(2).replace(".", ",")}`
      }
      if (totalElement) {
        totalElement.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`
      }
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.carrinhoManager) {
      window.carrinhoManager = new CarrinhoManager()
    }
  })
  
