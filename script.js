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
                const strKey = String(key);
                const strValue = String(value);
                // 🛡️ Sentinel: Enforce input length limits to prevent LocalStorage exhaustion (DoS)
                if (strKey.length > 100 || strValue.length > 1000) {
                    console.warn('Security Warning: Storage input exceeds length limit.');
                    return;
                }
                localStorage.setItem(strKey, strValue);
            } catch (e) {
                console.warn('Security Warning: LocalStorage access blocked or quota exceeded.');
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
    // ⚡ Bolt: Cache matchMedia for dark mode to avoid redundant evaluations
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

    const updateThemeLabel = () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let isDark = currentTheme === 'dark';

        // If no attribute, check system preference
        if (!currentTheme) {
            isDark = prefersDarkMode.matches;
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
            const systemPrefersDark = prefersDarkMode.matches;
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
                closeAllDropdowns();
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

    // --- Dropdown Navigation (hover-based on desktop, click-based on mobile) ---

    // ⚡ Bolt: Cache matchMedia to avoid redundant evaluations on hover/click
    const mobileMedia = window.matchMedia('(max-width: 768px)');
    const isMobile = () => mobileMedia.matches;

    // ⚡ Bolt: Cache DOM queries for navigation dropdowns to prevent repeated layout reads
    const navDropdownsList = document.querySelectorAll('.nav-dropdown');

    const closeAllDropdowns = () => {
        navDropdownsList.forEach(d => {
            d.removeAttribute('data-open');
            const btn = d.querySelector('.nav-dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    };

    // Update aria-expanded to reflect hover state for accessibility (desktop)
    // and handle click toggling on mobile
    navDropdownsList.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');

        // Mobile: toggle dropdown open/closed on button click
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (!isMobile()) return;
                e.stopPropagation();
                const isOpen = dropdown.getAttribute('data-open') === 'true';
                // Close all others first
                navDropdownsList.forEach(d => {
                    if (d !== dropdown) {
                        d.removeAttribute('data-open');
                        const t = d.querySelector('.nav-dropdown-toggle');
                        if (t) t.setAttribute('aria-expanded', 'false');
                    }
                });
                // Toggle this one
                if (isOpen) {
                    dropdown.removeAttribute('data-open');
                    toggle.setAttribute('aria-expanded', 'false');
                } else {
                    dropdown.setAttribute('data-open', 'true');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            });
        }

        // Desktop: update aria-expanded to reflect hover state
        dropdown.addEventListener('mouseenter', () => {
            if (!isMobile() && toggle) toggle.setAttribute('aria-expanded', 'true');
        });
        dropdown.addEventListener('mouseleave', () => {
            if (!isMobile() && toggle) toggle.setAttribute('aria-expanded', 'false');
        });
        dropdown.addEventListener('focusin', () => {
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
        });
        dropdown.addEventListener('focusout', (e) => {
            if (!dropdown.contains(e.relatedTarget)) {
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
                if (isMobile()) dropdown.removeAttribute('data-open');
            }
        });
    });

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

            // ⚡ Bolt: Extract updateTransform to prevent allocating a new anonymous function every frame
            const updateTransform = () => {
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
            };

            const handlePointerMove = (event) => {
                lastEvent = event;
                if (rafId) {
                    return;
                }
                rafId = window.requestAnimationFrame(updateTransform);
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

    // --- Animated Value Counter ---
    const animateValue = (element, end, duration) => {
        const startTime = performance.now();
        let lastValue = null;
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const newValue = Math.round(end * eased);

            // ⚡ Bolt: Cache value to prevent unnecessary DOM writes
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

    // --- Crisis Dashboard: Tab System + Panel Animations ---
    const tabBtns = document.querySelectorAll('.tab-btn[role="tab"]');
    const tabPanels = document.querySelectorAll('.tab-panel[role="tabpanel"]');
    // Track which panels have already been animated to avoid replaying
    const animatedPanels = new Set();

    // Mini donut circumference: 2π × r=38
    const MINI_CIRC = 2 * Math.PI * 38;

    const animatePanel = (panelEl) => {
        const panelId = panelEl.id;
        if (animatedPanels.has(panelId)) return;
        animatedPanels.add(panelId);

        const duration = 1400;

        // Reveal cost cards with a stagger
        panelEl.querySelectorAll('.cost-card').forEach((card, i) => {
            if (prefersReducedMotion) {
                card.classList.add('cost-card--visible');
            } else {
                setTimeout(() => card.classList.add('cost-card--visible'), i * 90);
            }
        });

        if (prefersReducedMotion) {
            // Set all final states immediately
            panelEl.querySelectorAll('.stat-number[data-target]').forEach(el => {
                el.textContent = el.getAttribute('data-target');
            });
            panelEl.querySelectorAll('.mini-donut-fill[data-pct]').forEach(fill => {
                const pct = parseInt(fill.getAttribute('data-pct'), 10);
                fill.style.strokeDashoffset = String(MINI_CIRC * (1 - pct / 100));
            });
            return;
        }

        // Animate stat counters
        panelEl.querySelectorAll('.stat-number[data-target]').forEach(el => {
            animateValue(el, parseInt(el.getAttribute('data-target'), 10), duration);
        });

        // Animate mini donut fills (staggered)
        panelEl.querySelectorAll('.mini-donut-fill[data-pct]').forEach((fill, i) => {
            const pct = parseInt(fill.getAttribute('data-pct'), 10);
            const targetOffset = MINI_CIRC * (1 - pct / 100);
            setTimeout(() => {
                fill.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                fill.style.strokeDashoffset = String(targetOffset);
            }, i * 90);
        });
    };

    const switchToPanel = (btn) => {
        // Deactivate all tabs and hide all panels
        tabBtns.forEach(b => b.setAttribute('aria-selected', 'false'));
        tabPanels.forEach(p => { p.hidden = true; });

        // Activate the clicked tab
        btn.setAttribute('aria-selected', 'true');
        const targetId = btn.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
            targetPanel.hidden = false;
            // Trigger panel slide-in animation
            if (!prefersReducedMotion) {
                void targetPanel.offsetWidth; // reflow to reset animation
                targetPanel.classList.add('panel-entering');
                targetPanel.addEventListener('animationend', () => {
                    targetPanel.classList.remove('panel-entering');
                }, { once: true });
            }
            animatePanel(targetPanel);
        }
    };

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchToPanel(btn));

            // Keyboard navigation: left/right arrow keys between tabs
            btn.addEventListener('keydown', (e) => {
                const allBtns = Array.from(tabBtns);
                const currentIndex = allBtns.indexOf(btn);
                let newIndex = -1;
                if (e.key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % allBtns.length;
                } else if (e.key === 'ArrowLeft') {
                    newIndex = (currentIndex - 1 + allBtns.length) % allBtns.length;
                } else if (e.key === 'Home') {
                    newIndex = 0;
                } else if (e.key === 'End') {
                    newIndex = allBtns.length - 1;
                }
                if (newIndex >= 0) {
                    e.preventDefault();
                    allBtns[newIndex].focus();
                    allBtns[newIndex].click();
                }
            });
        });

        // Animate the first (active) panel when the crisis section scrolls into view
        const crisisSection = document.querySelector('.crisis-section');
        if (crisisSection && 'IntersectionObserver' in window) {
            const crisisObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activePanel = crisisSection.querySelector('.tab-panel:not([hidden])');
                        if (activePanel) animatePanel(activePanel);
                        // ⚡ Bolt: Disconnect single-use observer to free memory
                        crisisObserver.disconnect();
                    }
                });
            }, { threshold: 0.15 });
            crisisObserver.observe(crisisSection);
        } else if (crisisSection) {
            const activePanel = crisisSection.querySelector('.tab-panel:not([hidden])');
            if (activePanel) animatePanel(activePanel);
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

    // Also check dropdown menu links and mark parent dropdown active
    const dropdownLinks = document.querySelectorAll('.nav-dropdown-menu a');
    dropdownLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath && currentPath.endsWith(linkPath)) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('active');
            const parentDropdown = link.closest('.nav-dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('dropdown-active');
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
        // ⚡ Bolt: Early return for non-shortcut keys to avoid unnecessary DOM access (document.activeElement) on every keystroke
        if (e.key !== 't' && e.key !== 'T' && e.key !== 'Escape') return;

        const activeTag = document.activeElement ? document.activeElement.tagName : '';

        // Toggle Theme (T)
        if ((e.key === 't' || e.key === 'T') && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
            themeToggle.click();
        }

        // Close Mobile Menu (Escape)
        if (e.key === 'Escape') {
            closeAllDropdowns();
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
                // 🎨 Palette: Update screen reader text when initially loaded as complete
                const currentLabel = marker.getAttribute('aria-label');
                if (currentLabel && currentLabel.includes('complete')) {
                    marker.setAttribute('aria-label', currentLabel.replace('complete', 'incomplete'));
                }
            }
        });

        // ⚡ Bolt: Use event delegation instead of attaching O(n) event listeners
        document.addEventListener('click', (e) => {
            const marker = e.target.closest('.step-marker');
            if (marker) {
                const stepId = marker.getAttribute('data-step-id');
                const currentState = marker.getAttribute('aria-pressed') === 'true';
                const newState = !currentState;
                marker.setAttribute('aria-pressed', newState);

                // 🎨 Palette: Dynamically update aria-label for accurate screen reader announcements
                const currentLabel = marker.getAttribute('aria-label');
                if (currentLabel) {
                    if (newState) {
                        marker.setAttribute('aria-label', currentLabel.replace('complete', 'incomplete'));
                    } else {
                        marker.setAttribute('aria-label', currentLabel.replace('incomplete', 'complete'));
                    }
                }

                // Save to localStorage
                safeStorage.setItem(stepId, newState);
            }
        });
    }
});
