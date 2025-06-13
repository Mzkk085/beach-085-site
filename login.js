document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const abasAutenticacao = document.querySelectorAll(".aba-autenticacao")
  const formulariosAutenticacao = document.querySelectorAll(".formulario-autenticacao")
  const linkEsqueceuSenha = document.getElementById("link-esqueceu-senha")

  // Verificar se os elementos existem
  if (abasAutenticacao.length === 0 || formulariosAutenticacao.length === 0) {
    console.error("Elementos de autenticação não encontrados")
    return
  }

  // Alternar entre formulários de login e cadastro
  abasAutenticacao.forEach((aba) => {
    aba.addEventListener("click", function () {
      const abaId = this.getAttribute("data-aba")

      if (!abaId) return

      // Remover classe ativa de todas as abas e formulários
      abasAutenticacao.forEach((t) => t.classList.remove("ativo"))
      formulariosAutenticacao.forEach((f) => f.classList.remove("ativo"))

      // Adicionar classe ativa à aba clicada e ao formulário correspondente
      this.classList.add("ativo")
      const formularioAlvo = document.getElementById(`formulario-${abaId}`)
      if (formularioAlvo) {
        formularioAlvo.classList.add("ativo")
      }
    })
  })

  // Link "Esqueceu a senha" - alternar para cadastro
  if (linkEsqueceuSenha) {
    linkEsqueceuSenha.addEventListener("click", (e) => {
      e.preventDefault()
      const abaCadastro = document.querySelector('[data-aba="cadastro"]')
      if (abaCadastro) {
        abaCadastro.click()
      }
    })
  }

  // Formulário de login
  const formularioLogin = document.querySelector("#formulario-login form")
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("login-email")?.value
      const senha = document.getElementById("login-senha")?.value
      const lembrarMe = document.getElementById("lembrar-me")?.checked

      // Validação
      if (!validarEmail(email)) {
        mostrarMensagem("Por favor, insira um e-mail válido.", "erro")
        return
      }

      if (!senha || senha.length < 6) {
        mostrarMensagem("A senha deve ter pelo menos 6 caracteres.", "erro")
        return
      }

      // Simulação de login
      console.log("Login:", { email, senha, lembrarMe })

      // Salvar dados se "lembrar-me" estiver marcado
      if (lembrarMe) {
        localStorage.setItem("lembrarEmail", email)
      } else {
        localStorage.removeItem("lembrarEmail")
      }

      mostrarMensagem("Login realizado com sucesso! Redirecionando...", "sucesso")

      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    })
  }

  // Formulário de cadastro
  const formularioCadastro = document.querySelector("#formulario-cadastro form")
  if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", (e) => {
      e.preventDefault()

      const nome = document.getElementById("cadastro-nome")?.value
      const email = document.getElementById("cadastro-email")?.value
      const senha = document.getElementById("cadastro-senha")?.value
      const confirmarSenha = document.getElementById("cadastro-confirmar-senha")?.value
      const termos = document.getElementById("termos")?.checked

      // Validações
      if (!nome || nome.trim().length < 2) {
        mostrarMensagem("Por favor, insira um nome válido.", "erro")
        return
      }

      if (!validarEmail(email)) {
        mostrarMensagem("Por favor, insira um e-mail válido.", "erro")
        return
      }

      if (!senha || senha.length < 6) {
        mostrarMensagem("A senha deve ter pelo menos 6 caracteres.", "erro")
        return
      }

      if (senha !== confirmarSenha) {
        mostrarMensagem("As senhas não coincidem.", "erro")
        return
      }

      if (!termos) {
        mostrarMensagem("Você precisa aceitar os termos de serviço.", "erro")
        return
      }

      // Simulação de cadastro
      console.log("Cadastro:", { nome, email, senha })

      mostrarMensagem("Cadastro realizado com sucesso! Redirecionando...", "sucesso")

      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    })
  }

  // Função para validar e-mail
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email && regex.test(email)
  }

  // Função para mostrar mensagens
  function mostrarMensagem(texto, tipo = "info") {
    // Remover mensagem anterior se existir
    const mensagemAnterior = document.querySelector(".mensagem-login")
    if (mensagemAnterior) {
      mensagemAnterior.remove()
    }

    const mensagem = document.createElement("div")
    mensagem.className = `mensagem-login mensagem-${tipo}`
    mensagem.textContent = texto
    mensagem.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 4px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 0.3s ease;
    `

    // Cores baseadas no tipo
    const cores = {
      sucesso: "#28a745",
      erro: "#dc3545",
      aviso: "#ffc107",
      info: "#17a2b8",
    }

    mensagem.style.backgroundColor = cores[tipo] || cores.info

    document.body.appendChild(mensagem)

    // Remover após 4 segundos
    setTimeout(() => {
      if (mensagem.parentNode) {
        mensagem.style.animation = "slideOut 0.3s ease"
        setTimeout(() => mensagem.remove(), 300)
      }
    }, 4000)
  }

  // Carregar e-mail salvo se existir
  const emailSalvo = localStorage.getItem("lembrarEmail")
  if (emailSalvo) {
    const inputEmail = document.getElementById("login-email")
    const checkboxLembrar = document.getElementById("lembrar-me")

    if (inputEmail) inputEmail.value = emailSalvo
    if (checkboxLembrar) checkboxLembrar.checked = true
  }

  // Adicionar estilos para animações se não existirem
  if (!document.querySelector("#login-animations")) {
    const style = document.createElement("style")
    style.id = "login-animations"
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }
})
