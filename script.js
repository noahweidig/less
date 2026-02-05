document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const navToggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    if (navToggle && header) {
        navToggle.addEventListener('click', () => {
            const isOpen = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.card');

    if (!prefersReducedMotion && supportsHover && cards.length > 0) {
        cards.forEach(card => {
            let rafId = null;
            let lastEvent = null;

            const handlePointerMove = (event) => {
                lastEvent = event;
                if (rafId) {
                    return;
                }
                rafId = window.requestAnimationFrame(() => {
                    if (!lastEvent) {
                        rafId = null;
                        return;
                    }
                    const rect = card.getBoundingClientRect();
                    const x = lastEvent.clientX - rect.left;
                    const y = lastEvent.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
                    const rotateY = ((x - centerX) / centerX) * 10;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                    rafId = null;
                });
            };

            card.addEventListener('pointerenter', () => {
                card.style.willChange = 'transform';
            });

            card.addEventListener('pointermove', handlePointerMove);

            card.addEventListener('pointerleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                card.style.willChange = '';
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }
                lastEvent = null;
            });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const steps = document.querySelectorAll('.step');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    if (steps.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        steps.forEach(step => {
            observer.observe(step);
        });
    }
});
