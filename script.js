// --- Security: Anti-Clickjacking Framebuster ---
// Prevent the site from being maliciously embedded in an iframe.
if (window.self !== window.top) {
    try {
        window.top.location.replace(window.location.href);
    } catch (e) {
        // If the browser blocks the navigation (e.g. sandbox attribute on iframe)
        // hide the document content to prevent clickjacking.
        document.documentElement.style.display = 'none';
        console.error('Security Warning: Clickjacking attempt detected and blocked.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Security: Safe LocalStorage Wrapper ---
    // Prevent unhandled SecurityError exceptions when cookies/storage are blocked
    const safeStorage = {
        getItem: (key) => {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('Security Warning: LocalStorage access blocked.');
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('Security Warning: LocalStorage access blocked.');
            }
        },
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Security Warning: LocalStorage access blocked.');
            }
        }
    };

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const navToggle = document.querySelector('.nav-toggle');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;

    const updateThemeLabel = () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let isDark = currentTheme === 'dark';

        // If no attribute, check system preference
        if (!currentTheme) {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('title', `${label} (T)`);
    };

    // Check for saved theme preference or system preference
    // Optimized to avoid blocking main thread with synchronous I/O
    const initTheme = () => {
        const savedTheme = safeStorage.getItem('theme');
        if (savedTheme) {
            // Security: Validate untrusted data from localStorage
            if (savedTheme === 'light' || savedTheme === 'dark') {
                htmlElement.setAttribute('data-theme', savedTheme);
            } else {
                console.warn('Security Warning: Invalid theme value detected in localStorage. Removing tampered key.');
                safeStorage.removeItem('theme');
            }
        }
        updateThemeLabel();
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(initTheme);
    } else {
        setTimeout(initTheme, 0);
    }

    themeToggle.addEventListener('click', () => {
        let currentTheme = htmlElement.getAttribute('data-theme');

        // If no attribute, we are using system preference
        if (!currentTheme) {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            currentTheme = systemPrefersDark ? 'dark' : 'light';
        }

        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        safeStorage.setItem('theme', newTheme);
        updateThemeLabel();
    });

    if (navToggle && header) {
        const nav = header.querySelector('nav');

        const cleanup = (e) => {
            if (e.target !== nav) return;
            header.classList.remove('nav-animate');
            nav.removeEventListener('transitionend', cleanup);
        };

        navToggle.addEventListener('click', () => {
            header.classList.add('nav-animate');
            nav.addEventListener('transitionend', cleanup);
            const isOpen = header.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen);
            navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        });

        // ⚡ Bolt: Use event delegation instead of attaching O(n) event listeners
        nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                header.classList.add('nav-animate');
                nav.addEventListener('transitionend', cleanup);
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
            }
        });

        // 🎨 Palette: Close mobile menu when clicking outside the header
        document.addEventListener('click', (e) => {
            const isMenuOpen = header.classList.contains('nav-open');
            // If the menu is open and the click target is not within the header
            if (isMenuOpen && !header.contains(e.target)) {
                header.classList.add('nav-animate');
                nav.addEventListener('transitionend', cleanup);
                header.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.setAttribute('aria-label', 'Open menu');
            }
        });
    }

    // --- Hero Intro Animation ---
    const heroContents = document.querySelectorAll('.hero-content');

    if (heroContents.length > 0) {
        if (prefersReducedMotion) {
            heroContents.forEach(content => content.classList.add('is-visible'));
        } else {
            window.requestAnimationFrame(() => {
                heroContents.forEach(content => content.classList.add('is-visible'));
            });
        }
    }

    // --- 3D Tilt Effect for Cards ---
    const cards = document.querySelectorAll('.card');

    if (!prefersReducedMotion && supportsHover && cards.length > 0) {
        cards.forEach(card => {
            let rafId = null;
            let lastEvent = null;
            let cardRect = null;

            const handlePointerMove = (event) => {
                lastEvent = event;
                if (rafId) {
                    return;
                }
                rafId = window.requestAnimationFrame(() => {
                    if (!lastEvent || !cardRect) {
                        rafId = null;
                        return;
                    }

                    // Optimized: Use cached document-relative coordinates
                    const x = lastEvent.pageX - cardRect.left;
                    const y = lastEvent.pageY - cardRect.top;

                    const centerX = cardRect.width / 2;
                    const centerY = cardRect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
                    const rotateY = ((x - centerX) / centerX) * 10;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                    rafId = null;
                });
            };

            card.addEventListener('pointerenter', () => {
                // ⚡ Bolt: Read layout (getBoundingClientRect) before writing to DOM (willChange) to prevent Forced Synchronous Layout.
                const rect = card.getBoundingClientRect();
                card.style.willChange = 'transform';
                cardRect = {
                    left: rect.left + window.scrollX,
                    top: rect.top + window.scrollY,
                    width: rect.width,
                    height: rect.height
                };
            });

            card.addEventListener('pointermove', handlePointerMove);

            const handleTransitionEnd = (e) => {
                if (e.target === card && e.propertyName === 'transform' && !card.matches(':hover')) {
                    card.style.willChange = '';
                    card.removeEventListener('transitionend', handleTransitionEnd);
                }
            };

            card.addEventListener('pointerleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                // ⚡ Bolt: Wait for transition to finish before removing will-change to avoid dropping the layer early
                card.addEventListener('transitionend', handleTransitionEnd);
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                    rafId = null;
                }
                lastEvent = null;
                cardRect = null;
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
        let observedStepsCount = steps.length;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Only animate once
                    observedStepsCount--;
                    // ⚡ Bolt: Completely disconnect observer once all elements are animated to free up memory
                    if (observedStepsCount === 0) {
                        observer.disconnect();
                    }
                }
            });
        }, observerOptions);

        steps.forEach(step => {
            observer.observe(step);
        });
    }

    // --- Screen Time Chart Animation ---
    const screenTimeSection = document.querySelector('.screen-time');

    if (screenTimeSection) {
        const donutFill = screenTimeSection.querySelector('.donut-fill');
        const donutNumber = screenTimeSection.querySelector('.donut-number');
        const statNumbers = screenTimeSection.querySelectorAll('.stat-number');
        const circumference = 2 * Math.PI * 80;
        const targetPercent = 44;

        const animateValue = (element, end, duration) => {
            const startTime = performance.now();
            let lastValue = null;
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const newValue = Math.round(end * eased);

                // ⚡ Bolt: Cache value to prevent unnecessary DOM writes
                // Only update textContent if the integer value has actually changed
                if (newValue !== lastValue) {
                    element.textContent = newValue;
                    lastValue = newValue;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            requestAnimationFrame(update);
        };

        const animateChart = () => {
            const targetOffset = circumference * (1 - targetPercent / 100);

            if (prefersReducedMotion) {
                if (donutFill) donutFill.style.strokeDashoffset = targetOffset;
                if (donutNumber) donutNumber.textContent = targetPercent;
                statNumbers.forEach(el => {
                    el.textContent = el.getAttribute('data-target');
                });
            } else {
                const duration = 1500;
                if (donutFill) {
                    donutFill.style.transition = 'stroke-dashoffset ' + duration + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
                    donutFill.style.strokeDashoffset = targetOffset;
                }
                if (donutNumber) animateValue(donutNumber, targetPercent, duration);
                statNumbers.forEach(el => {
                    animateValue(el, parseInt(el.getAttribute('data-target'), 10), duration);
                });
            }
        };

        if ('IntersectionObserver' in window) {
            const chartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        screenTimeSection.classList.add('visible');
                        animateChart();
                        chartObserver.unobserve(entry.target);
                        // ⚡ Bolt: Completely disconnect single-use observer to free memory
                        chartObserver.disconnect();
                    }
                });
            }, { threshold: 0.2 });

            chartObserver.observe(screenTimeSection);
        } else {
            screenTimeSection.classList.add('visible');
            animateChart();
        }
    }

    // --- Active Navigation Link ---
    const currentPath = window.location.pathname;
    // ⚡ Bolt: Reused cached navLinks NodeList instead of redundant DOM query

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath) {
            // Check if current path ends with the link path (e.g. "index.html")
            // Also handle root path "/" mapping to "index.html"
            if (
                currentPath.endsWith(linkPath) ||
                (currentPath === '/' && linkPath === 'index.html') ||
                (currentPath.endsWith('/') && linkPath === 'index.html')
            ) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            }
        }
    });

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        // Optimized: Use IntersectionObserver instead of scroll event listener
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                // If sentinel is NOT intersecting, we've scrolled past the top 300px
                if (!entries[0].isIntersecting) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });

            const sentinel = document.createElement('div');
            Object.assign(sentinel.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '1px',
                height: '300px',
                pointerEvents: 'none',
                opacity: '0'
            });
            document.body.appendChild(sentinel);

            observer.observe(sentinel);
        } else {
            // Fallback for older browsers
            const toggleBackToTop = () => {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            };

            window.addEventListener('scroll', toggleBackToTop, { passive: true });
        }

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // Return focus to the top of the document for keyboard users
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus({ preventScroll: true });
            }
        });
    }

    // --- Keyboard Shortcuts ---
    document.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName : '';

        // Toggle Theme (T)
        if ((e.key === 't' || e.key === 'T') && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
            themeToggle.click();
        }

        // Close Mobile Menu (Escape)
        if (e.key === 'Escape') {
            const isMenuOpen = header && header.classList.contains('nav-open');
            if (isMenuOpen) {
                // Simulate click on nav toggle to close
                if (navToggle) {
                    navToggle.click();
                    navToggle.focus();
                }
            }
        }
    });

    // --- Interactive Habits Checklist ---
    const stepMarkers = document.querySelectorAll('.step-marker');

    if (stepMarkers.length > 0) {
        stepMarkers.forEach(marker => {
            const stepId = marker.getAttribute('data-step-id');
            // Optimized: Read from localStorage only once on load
            const isCompleted = safeStorage.getItem(stepId) === 'true';

            if (isCompleted) {
                marker.setAttribute('aria-pressed', 'true');
            }

            marker.addEventListener('click', () => {
                const currentState = marker.getAttribute('aria-pressed') === 'true';
                const newState = !currentState;
                marker.setAttribute('aria-pressed', newState);

                // Save to localStorage
                safeStorage.setItem(stepId, newState);
            });
        });
    }
});
