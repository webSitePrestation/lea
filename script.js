// ═══════════════════════════════════════════════════════════
// MENU HAMBURGER
// ═══════════════════════════════════════════════════════════

function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  navMenu.classList.toggle("active");
  overlay.classList.toggle("active");
}

// Fermer le menu en cliquant sur l'overlay
document.getElementById("overlay").addEventListener("click", toggleMenu);

// Fermer le menu avec la touche Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const navMenu = document.getElementById("navMenu");
    const overlay = document.getElementById("overlay");
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    }
  }
});

// ═══════════════════════════════════════════════════════════
// SCROLL SMOOTH & ANIMATIONS
// ═══════════════════════════════════════════════════════════

// Animation au scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observer tous les éléments animés
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".practice-card, .virtual-card, .pricing-card, .review-card, .gallery-item",
  );

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });
});

// ═══════════════════════════════════════════════════════════
// FORMULAIRE DE CONTACT
// ═══════════════════════════════════════════════════════════

const contactForm = document.getElementById("contactForm");
const formFeedback = document.getElementById("formFeedback");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Désactiver le bouton pendant l'envoi
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    try {
      const response = await fetch("send-contact.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        showFeedback(
          "Message envoyé avec succès ! Je vous répondrai sous 24h.",
          "success",
        );
        contactForm.reset();
      } else {
        showFeedback(
          result.message || "Une erreur est survenue. Veuillez réessayer.",
          "error",
        );
      }
    } catch (error) {
      showFeedback("Erreur de connexion. Veuillez réessayer.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Envoyer";
    }
  });
}

function showFeedback(message, type) {
  formFeedback.textContent = message;
  formFeedback.className = `form-feedback ${type}`;
  formFeedback.style.display = "block";

  // Faire défiler vers le message
  formFeedback.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Masquer après 5 secondes
  setTimeout(() => {
    formFeedback.style.display = "none";
  }, 5000);
}

// ═══════════════════════════════════════════════════════════
// GALERIE LIGHTBOX (optionnel)
// ═══════════════════════════════════════════════════════════

const galleryItems = document.querySelectorAll(".gallery-item");

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    if (img) {
      // Créer une lightbox simple
      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = "hidden";

      // Animer l'apparition
      setTimeout(() => (lightbox.style.opacity = "1"), 10);

      // Fermer la lightbox
      const closeLightbox = () => {
        lightbox.style.opacity = "0";
        setTimeout(() => {
          document.body.removeChild(lightbox);
          document.body.style.overflow = "";
        }, 300);
      };

      lightbox
        .querySelector(".lightbox-close")
        .addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
      });
    }
  });
});

// Styles de la lightbox (ajoutés dynamiquement)
const lightboxStyle = document.createElement("style");
lightboxStyle.textContent = `
    .lightbox {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s;
        padding: 20px;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }
    
    .lightbox-content img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 2.5rem;
        color: white;
        cursor: pointer;
        z-index: 10001;
        transition: color 0.3s;
    }
    
    .lightbox-close:hover {
        color: #c41e3a;
    }
`;
document.head.appendChild(lightboxStyle);

// ═══════════════════════════════════════════════════════════
// SCROLL INDICATOR
// ═══════════════════════════════════════════════════════════

const scrollIndicator = document.querySelector(".scroll-indicator");

if (scrollIndicator) {
  scrollIndicator.addEventListener("click", () => {
    const histoireSection = document.getElementById("histoire");
    if (histoireSection) {
      histoireSection.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Masquer l'indicateur après le scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = "0";
    } else {
      scrollIndicator.style.opacity = "1";
    }
  });
}

// ═══════════════════════════════════════════════════════════
// SMOOTH SCROLL POUR LES ANCRES
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ═══════════════════════════════════════════════════════════
// CONSOLE MESSAGE (fun)
// ═══════════════════════════════════════════════════════════

console.log(
  "%c🔗 Maîtresse Lea",
  "font-size: 20px; color: #c41e3a; font-weight: bold;",
);
console.log(
  "%cSite développé avec attention",
  "font-size: 12px; color: #d4af37;",
);

// ═══════════════════════════════════════════════════════════
// GALERIE — VOIR PLUS / VOIR MOINS
// ═══════════════════════════════════════════════════════════

(function () {
  var btn = document.getElementById("btnSeeMore");
  var grid = document.getElementById("galleryGrid");

  if (!btn || !grid) return;

  var isOpen = false;

  btn.addEventListener("click", function () {
    isOpen = !isOpen;

    if (isOpen) {
      // Afficher les photos cachées
      grid.classList.add("gallery-open");
      btn.classList.add("open");
      btn.querySelector(".btn-see-more-text").textContent = "Voir moins";

      // Rendre la lightbox fonctionnelle sur les nouveaux items
      var extras = grid.querySelectorAll(".gallery-item.gallery-extra");
      extras.forEach(function (item) {
        if (!item.dataset.lightboxBound) {
          item.dataset.lightboxBound = "1";
          item.addEventListener("click", openLightbox);
        }
      });
    } else {
      // Masquer les photos
      grid.classList.remove("gallery-open");
      btn.classList.remove("open");
      btn.querySelector(".btn-see-more-text").textContent = "Voir plus";

      // Remonter doucement vers le haut de la galerie
      document
        .getElementById("galerie")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  function openLightbox() {
    var img = this.querySelector("img");
    if (!img) return;
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<div class="lightbox-content"><span class="lightbox-close">&times;</span><img src="' +
      img.src +
      '" alt="' +
      img.alt +
      '"></div>';
    document.body.appendChild(lb);
    document.body.style.overflow = "hidden";
    setTimeout(function () {
      lb.style.opacity = "1";
    }, 10);
    function close() {
      lb.style.opacity = "0";
      setTimeout(function () {
        document.body.removeChild(lb);
        document.body.style.overflow = "";
      }, 300);
    }
    lb.querySelector(".lightbox-close").addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }
})();
