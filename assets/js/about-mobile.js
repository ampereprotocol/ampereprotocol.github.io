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

    function showTeamMember(index) {
    teamMembers.forEach((member, i) => {
        if (i === index) {
            gsap.to(member, {
                duration: 0.8,
                opacity: 1,
                rotationY: 0,
                scale: 1,
                filter: 'blur(0px)',
                ease: "back.out(1.2)"
            });
        } else {
            gsap.to(member, {
                duration: 0.5,
                opacity: 0,
                rotationY: -90,
                scale: 0.8,
                filter: 'blur(2px)',
                ease: "power2.in"
            });
        }
    });

    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    currentIndex = index;
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
