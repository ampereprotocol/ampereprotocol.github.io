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

    // Video Scroll Animation
    const videoSection = document.querySelector('.video-scroll-section');
    const video = document.getElementById('scroll-video');

    if (video && videoSection) {
        let isPlaying = false;
        let lastScrollPosition = window.scrollY;
        let scrollDirection = 0;
        const videoDuration = 14; // Durata del video in secondi
        let lastTime = performance.now();
        let velocity = 0;

        // Set video properties
        video.currentTime = 0;
        video.pause();

        // Hide overlay when video starts playing
        const videoOverlay = document.querySelector('.video-overlay');
        if (videoOverlay) {
            video.addEventListener('play', function() {
                videoOverlay.style.opacity = '0';
                setTimeout(() => {
                    videoOverlay.style.display = 'none';
                }, 500);
            });
        }

        // Handle scroll animation
        function handleScroll() {
            const currentTime = performance.now();
            const deltaTime = (currentTime - lastTime) / 1000;
            lastTime = currentTime;

            const scrollPosition = window.scrollY;
            const sectionTop = videoSection.offsetTop;
            const sectionHeight = videoSection.offsetHeight;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress (0 to 1)
            let scrollProgress = Math.min(Math.max((scrollPosition - sectionTop) / (sectionHeight - windowHeight), 0), 1);

            // Detect scroll direction and speed
            const scrollDelta = scrollPosition - lastScrollPosition;
            scrollDirection = Math.sign(scrollDelta);

            // Apply smooth deceleration when not scrolling
            if (Math.abs(scrollDelta) < 1) {
                velocity *= Math.pow(0.5, deltaTime);
            } else {
                velocity = scrollDelta * 0.01;
            }

            // Update video time based on velocity
            let newTime = video.currentTime + velocity;

            // Clamp the time between 0 and video duration
            newTime = Math.max(0, Math.min(newTime, videoDuration));
            video.currentTime = newTime;

            // Adjust playback rate based on scroll speed
            video.playbackRate = Math.min(Math.max(Math.abs(velocity) * 2, 4);

            // Play/pause logic
            if (scrollProgress > 0 && scrollProgress < 1) {
                if (!isPlaying) {
                    video.play().catch(e => console.log("Video play error:", e));
                    isPlaying = true;
                }
            } else {
                if (isPlaying) {
                    video.pause();
                    isPlaying = false;
                }
            }

            lastScrollPosition = scrollPosition;
            requestAnimationFrame(handleScroll);
        }

        // Initialize video metadata
        video.addEventListener('loadedmetadata', function() {
            video.currentTime = 0;
            video.pause();
            requestAnimationFrame(handleScroll);
        });
    }

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update active tab pane
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });

    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mobile menu toggle for submenus
    const mobileMenuButtons = document.querySelectorAll('.mobile-menu-btn, .dd-menu');

    mobileMenuButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.innerWidth <= 991) {
                const target = this.getAttribute('data-bs-target');
                const menu = document.querySelector(target);
                menu.classList.toggle('show');
            }
        });
    });
});
