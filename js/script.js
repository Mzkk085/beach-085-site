window.onload = function () {
    // Efeito da barra de navegação no scroll
    window.onscroll = function () {
        let barra = document.querySelector(".barra-nav");
        let botaoTopo = document.getElementById("voltar-ao-topo");

        if (window.scrollY > 100) {
            if (barra) {
                barra.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }
            if (botaoTopo) {
                botaoTopo.classList.add("visivel");
            }
        } else {
            if (barra) {
                barra.style.boxShadow = "none";
            }
            if (botaoTopo) {
                botaoTopo.classList.remove("visivel");
            }
        }
        animarElementos();
    };

    // Menu mobile
    let botaoMenu = document.querySelector(".botao-menu-mobile");
    let menuMobile = document.querySelector(".menu-mobile");

    if (botaoMenu && menuMobile) {
        botaoMenu.onclick = function () {
            menuMobile.classList.toggle("ativo");
        };

        let links = menuMobile.querySelectorAll("a");
        for (let i = 0; i < links.length; i++) {
            links[i].onclick = function () {
                menuMobile.classList.remove("ativo");
            };
        }
    }

    // Botão voltar ao topo
    let botaoTopo = document.getElementById("voltar-ao-topo");
    if (botaoTopo) {
        botaoTopo.onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

    // Carrinho (só se não estiver na página do carrinho)
    if (window.location.pathname.indexOf('carrinho.html') === -1) {
        if (window.carrinhoManager) {
            window.carrinhoManager.inicializarBotoesCarrinhoHome();
        } else {
            console.warn("CarrinhoManager não inicializado na página inicial.");
        }
    }

    // Slider de depoimentos
    let slides = document.querySelectorAll(".slide-feedback");
    if (slides.length > 0) {
        iniciarSlider();
    }

    // Newsletter
    let formNewsletter = document.getElementById("formulario-newsletter");
    if (formNewsletter) {
        configurarNewsletter();
    }

    // Animações
    prepararAnimacoes();
};

// Slider de depoimentos
let slideAtual = 0;
let intervalo;

function iniciarSlider() {
    let slides = document.querySelectorAll(".slide-feedback");
    let pontos = document.querySelectorAll(".ponto");
    let botaoAnt = document.querySelector(".botao-feedback.anterior");
    let botaoProx = document.querySelector(".botao-feedback.proximo");

    function mostrarSlide(num) {
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove("ativo");
        }
        for (let i = 0; i < pontos.length; i++) {
            pontos[i].classList.remove("ativo");
        }

        if (slides[num] && pontos[num]) {
            slides[num].classList.add("ativo");
            pontos[num].classList.add("ativo");
            slideAtual = num;
        }
    }

    // Pontos
    for (let i = 0; i < pontos.length; i++) {
        pontos[i].onclick = function () {
            let indice = Array.prototype.indexOf.call(pontos, this);
            mostrarSlide(indice);
            reiniciarTimer();
        };
    }

    // Botões
    if (botaoAnt) {
        botaoAnt.onclick = function () {
            slideAtual = slideAtual - 1;
            if (slideAtual < 0) {
                slideAtual = slides.length - 1;
            }
            mostrarSlide(slideAtual);
            reiniciarTimer();
        };
    }

    if (botaoProx) {
        botaoProx.onclick = function () {
            slideAtual = slideAtual + 1;
            if (slideAtual >= slides.length) {
                slideAtual = 0;
            }
            mostrarSlide(slideAtual);
            reiniciarTimer();
        };
    }

    function reiniciarTimer() {
        clearInterval(intervalo);
        intervalo = setInterval(function () {
            slideAtual = slideAtual + 1;
            if (slideAtual >= slides.length) {
                slideAtual = 0;
            }
            mostrarSlide(slideAtual);
        }, 5000);
    }

    reiniciarTimer();
}

// Animações
function prepararAnimacoes() {
    let elementos = document.querySelectorAll("[data-aos]");

    for (let i = 0; i < elementos.length; i++) {
        elementos[i].style.opacity = "0";
        elementos[i].style.transform = "translateY(50px)";
        elementos[i].style.transition = "opacity 0.6s ease, transform 0.6s ease";
    }

    animarElementos();
}

function animarElementos() {
    let elementos = document.querySelectorAll("[data-aos]");

    for (let i = 0; i < elementos.length; i++) {
        let posicao = elementos[i].getBoundingClientRect().top;
        let altura = window.innerHeight;

        if (posicao < altura - 100) {
            let atraso = elementos[i].getAttribute("data-aos-delay") || 0;

            setTimeout(function (el) {
                return function () {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                };
            }(elementos[i]), parseInt(atraso));
        }
    }
}
