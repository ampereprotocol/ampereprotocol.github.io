document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.2,
                    width: 1
                },
                move: { enable: true, speed: 2 }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            }
        });
    }

    // Team Carousel
    const teamMembers = document.querySelectorAll('.team-member');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.team-prev');
    const nextBtn = document.querySelector('.team-next');
    let currentIndex = 0;

    // Show initial team member
    showTeamMember(currentIndex);

    // Dot click event
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showTeamMember(index);
        });
    });

    // Previous button click
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
        showTeamMember(currentIndex);
    });

    // Next button click
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % teamMembers.length;
        showTeamMember(currentIndex);
    });

    // Show specific team member
    function showTeamMember(index) {
        // Hide all team members
        teamMembers.forEach(member => {
            member.classList.remove('active');
        });

        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show selected team member
        teamMembers[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    // Card hover animations
    const cards = document.querySelectorAll('.value-card, .tech-card, .milestone');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                duration: 0.3,
                y: -5,
                boxShadow: '0 15px 40px rgba(62, 128, 255, 0.2)',
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                duration: 0.3,
                y: 0,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                ease: "power2.out"
            });
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile team carousel swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const teamCarousel = document.querySelector('.team-carousel');

    teamCarousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    teamCarousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next
            currentIndex = (currentIndex + 1) % teamMembers.length;
            showTeamMember(currentIndex);
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - previous
            currentIndex = (currentIndex - 1 + teamMembers.length) % teamMembers.length;
            showTeamMember(currentIndex);
        }
    }
});
