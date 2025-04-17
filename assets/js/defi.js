// SOLUZIONE SEMPLICE - Scroll controlla la riproduzione
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('scroll-video');
    if (!video) return;

    // Configurazione iniziale
    video.currentTime = 0;
    video.pause();
    video.muted = true; // Audio disabilitato per autoplay

    let lastScrollY = window.scrollY;
    let isScrolling = false;
    let scrollTimeout;
    const scrollThreshold = 10; // Sensibilità dello scroll

    window.addEventListener('scroll', function() {
        // Rileva direzione scroll
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        lastScrollY = currentScrollY;

        // Se non sta già scorrendo, avvia la riproduzione
        if (!isScrolling) {
            isScrolling = true;
            video.play().catch(e => console.log("Autoplay non consentito:", e));
        }

        // Aggiorna la riproduzione in base alla direzione
        if (scrollDirection === 'down') {
            video.playbackRate = 1.0; // Velocità normale
        } else {
            video.playbackRate = -1.0; // Indietro (richiede video preparato)
        }

        // Reset stato scrolling
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            video.pause();
        }, 100);
    });

    console.log("Video scroll controller pronto");

    // Aggiungi questo alla fine del defi.js
  if (window.innerWidth <= 768) {
      // Animazione alternativa per mobile
      const mobileHero = document.querySelector('.mobile-hero-section');
      if (mobileHero) {
          mobileHero.style.opacity = '0';
          setTimeout(() => {
              mobileHero.style.transition = 'opacity 1s ease';
              mobileHero.style.opacity = '1';
          }, 300);
      }
  }
});
