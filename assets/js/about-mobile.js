// about-mobile.js
// Questo verrà caricato SOLO su mobile

document.addEventListener('DOMContentLoaded', function() {
    // Solo per dispositivi mobile
    if (window.innerWidth <= 767px) {
        // Semplifica particles.js su mobile
        if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 30 },
                    line_linked: { enable: false }
                }
            });
        }

        // Migliora il carosello per touch
        const teamCarousel = document.querySelector('.team-carousel');
        let touchStartX = 0;

        teamCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        teamCarousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) showNextTeamMember();
            if (touchEndX - touchStartX > 50) showPrevTeamMember();
        }, { passive: true });

        // Nascondi la barra degli indirizzi su Android
        window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, 1), 10));
    }

    function showNextTeamMember() {
        const current = document.querySelector('.team-member.active');
        const next = current.nextElementSibling || document.querySelector('.team-member:first-child');
        updateTeamMember(next);
    }

    function showPrevTeamMember() {
        const current = document.querySelector('.team-member.active');
        const prev = current.previousElementSibling || document.querySelector('.team-member:last-child');
        updateTeamMember(prev);
    }

    function updateTeamMember(element) {
        document.querySelectorAll('.team-member').forEach(m => m.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

        element.classList.add('active');
        const index = element.dataset.index;
        document.querySelector(`.dot[data-index="${index}"]`).classList.add('active');

        // Scroll to element su mobile
        if (window.innerWidth <= 767px) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
});
