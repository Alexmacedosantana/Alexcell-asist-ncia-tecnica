"use strict";

/**
 * script principal da página
 * - efeito de "reveal" por IntersectionObserver
 * - tratamento do formulário de contato
 * - menu hambúrguer para dispositivos móveis
 *
 * Observações de HTML esperadas (exemplos):
 * - Botão hambúrguer: <button id="hamburger" aria-expanded="false">☰</button>
 * - Menu de navegação: <nav id="navMenu" class="nav-menu">...</nav>
 * - Formulário: <form id="formContato">...</form>
 */

document.addEventListener("DOMContentLoaded", () => {
  // ---- REVEAL: adiciona a classe "active" quando o elemento entra na viewport ----
  const sections = document.querySelectorAll(".reveal");

  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 } // Ativa quando 100% do elemento estiver visível,
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ---- FORMULÁRIO WHATSAPP ----
  const form = document.getElementById("formContato");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const endereco = document.getElementById("endereco").value;
      const mensagem = document.getElementById("mensagem").value;

      const texto = ` Olá como posso ajudar? Nome: ${nome}
	  E-mail: ${email}
     Endereço: ${endereco}
     Mensagem: ${mensagem}`;

      const numero = "5568000000000";

      window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`,
        "_blank",
      );

      form.reset();
    });
  }

  // ---- HAMBÚRGUER (mobile): procura seletores comuns e ativa/desativa o menu ----
  const hamburgerSelectors = [
    "#hamburger",
    "#btnHamburger",
    ".hamburger",
    "[data-hamburger]",
  ];
  const menuSelectors = ["#navMenu", ".nav-menu", ".nav", "[data-menu]"];

  const hamburger = hamburgerSelectors
    .map((s) => document.querySelector(s))
    .find(Boolean);
  const navMenu = menuSelectors
    .map((s) => document.querySelector(s))
    .find(Boolean);

  if (hamburger && navMenu) {
    // Garante atributos ARIA para acessibilidade
    if (!hamburger.hasAttribute("aria-expanded")) {
      hamburger.setAttribute("aria-expanded", "false");
    }

    const setMenuState = (open) => {
      hamburger.setAttribute("aria-expanded", String(Boolean(open)));// Atualiza o atributo ARIA
      navMenu.classList.toggle("open", Boolean(open));
      document.body.classList.toggle("no-scroll", Boolean(open));
    };

    const toggleMenu = () =>
      setMenuState(hamburger.getAttribute("aria-expanded") !== "true");// Alterna o estado do menu

    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Fecha o menu ao clicar em um link interno (útil em mobile)
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) setMenuState(false);
      });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", (evt) => {
      if (
        !navMenu.contains(evt.target) &&
        !hamburger.contains(evt.target) &&
        navMenu.classList.contains("open")
      ) {
        setMenuState(false);
      }
    });

    // Se o usuário redimensionar para desktop, garante que o menu esteja fechado
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && navMenu.classList.contains("open")) {
        setMenuState(false);
      }
    });
  }
});
