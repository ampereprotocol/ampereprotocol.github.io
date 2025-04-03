/*
Template Name: CryptoLand - Crypto Currency Landing Page Template.
Author: GrayGrids
*/

(function () {
    //===== Prealoder

    window.onload = function () {
        window.setTimeout(fadeout, 500);
    }

    function fadeout() {
        document.querySelector('.preloader').style.opacity = '0';
        document.querySelector('.preloader').style.display = 'none';
    }


    /*=====================================
    Sticky
    ======================================= */
    window.onscroll = function () {
        var header_navbar = document.querySelector(".navbar-area");
        var sticky = header_navbar.offsetTop;

        var logo = document.querySelector('.navbar-brand img')
        if (window.pageYOffset > sticky) {
          header_navbar.classList.add("sticky");
          logo.src = 'assets/images/logo/logo.svg';
        } else {
          header_navbar.classList.remove("sticky");
          logo.src = 'assets/images/logo/white-logo.svg';
        }

        // show or hide the back-top-top button
        var backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
    };

    // WOW active
    new WOW().init();

    //===== mobile-menu-btn
    let navbarToggler = document.querySelector(".mobile-menu-btn");
    navbarToggler.addEventListener('click', function () {
        navbarToggler.classList.toggle("active");
    });


})();

// Aggiungi queste funzioni al tuo file main.js esistente

function initWhitepaperFeatures() {
    // Mobile menu toggle
    const mobileNavToggle = document.querySelector('.mobile-menu-btn');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (mobileNavToggle && navbarCollapse) {
        mobileNavToggle.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Connect Wallet button
    const connectWalletBtn = document.getElementById('connectWallet');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', function() {
            // Qui implementeresti la logica di connessione al wallet
            this.textContent = "Connecting...";

            // Simula la connessione
            setTimeout(() => {
                this.textContent = "Wallet Connected";
                this.classList.add('connected');
            }, 1500);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize animations
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initWhitepaperFeatures();

    // Se la pagina è whitepaper.html, inizializza le funzionalità specifiche
    if (document.body.classList.contains('whitepaper-page')) {
        // Carica Three.js e Chart.js se necessario
        loadWhitepaperDependencies();
    }
});

function loadWhitepaperDependencies() {
    // Carica Three.js solo se necessario
    if (typeof THREE === 'undefined') {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        threeScript.onload = function() {
            const orbitScript = document.createElement('script');
            orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js';
            document.head.appendChild(orbitScript);
        };
        document.head.appendChild(threeScript);
    }

    // Carica Chart.js solo se necessario
    if (typeof Chart === 'undefined') {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        document.head.appendChild(chartScript);
    }

    // Carica il whitepaper.js specifico
    const whitepaperScript = document.createElement('script');
    whitepaperScript.src = 'assets/js/whitepaper.js';
    document.head.appendChild(whitepaperScript);

}
