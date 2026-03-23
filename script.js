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
        // 🎨 Palette: Set initial tooltip parity for sighted mouse users
        navToggle.setAttribute('title', 'Open menu');

        const nav = header.querySelector('nav');

        const cleanup = (e) => {
            if (e.target !== nav) return;
            header.classList.remove('nav-animate');
            nav.removeEventListener('transitionend', cleanup);
        };

        const closeMenu = () => {
            header.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
            navToggle.setAttribute('title', 'Open menu');
            document.body.style.overflow = '';
            collapseAllDropdowns();
        };

        navToggle.addEventListener('click', () => {
            const wasOpen = header.classList.contains('nav-open');
            if (wasOpen) {
                closeMenu();
            } else {
                header.classList.add('nav-animate');
                nav.addEventListener('transitionend', cleanup);
                header.classList.add('nav-open');
                navToggle.setAttribute('aria-expanded', 'true');
                navToggle.setAttribute('aria-label', 'Close menu');
                navToggle.setAttribute('title', 'Close menu (Esc)');
                document.body.style.overflow = 'hidden';
            }
        });

        // ⚡ Bolt: Use event delegation instead of attaching O(n) event listeners
        nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                closeMenu();
            }
        });

        // 🎨 Palette: Close mobile menu when clicking outside the header
        document.addEventListener('click', (e) => {
            const isMenuOpen = header.classList.contains('nav-open');
            // If the menu is open and the click target is not within the header
            if (isMenuOpen && !header.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // --- Dropdown Navigation (hover-based on desktop, click-based on mobile) ---

    // ⚡ Bolt: Cache matchMedia to avoid redundant evaluations on hover/click
    const mobileMedia = window.matchMedia('(max-width: 768px)');
    const isMobile = () => mobileMedia.matches;

    // ⚡ Bolt: Cache DOM queries for navigation dropdowns and their toggles to prevent repeated layout reads and O(N²) traversal
    const navDropdownsData = Array.from(document.querySelectorAll('.nav-dropdown')).map(dropdown => ({
        dropdown,
        toggle: dropdown.querySelector('.nav-dropdown-toggle')
    }));

    const syncMobileDropdownState = () => {
        navDropdownsData.forEach(({ dropdown, toggle }) => {
            if (!toggle) return;

            if (isMobile()) {
                dropdown.removeAttribute('data-open');
                toggle.setAttribute('aria-expanded', 'false');
            } else {
                dropdown.removeAttribute('data-open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    };

    const closeAllDropdowns = () => {
        if (isMobile()) return;
        navDropdownsData.forEach(({ dropdown, toggle }) => {
            dropdown.removeAttribute('data-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    };

    const collapseAllDropdowns = () => {
        navDropdownsData.forEach(({ dropdown, toggle }) => {
            dropdown.removeAttribute('data-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    };

    // Update aria-expanded to reflect hover state for accessibility (desktop)
    // and handle click toggling on mobile
    navDropdownsData.forEach(({ dropdown, toggle }) => {
        // Mobile & Desktop Keyboard: toggle dropdown open/closed on button click
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdown.getAttribute('data-open') === 'true';
                // On desktop, close all others first; on mobile allow multiple open
                if (!isMobile()) {
                    navDropdownsData.forEach(other => {
                        if (other.dropdown !== dropdown) {
                            other.dropdown.removeAttribute('data-open');
                            if (other.toggle) other.toggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
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

        // Desktop: update aria-expanded and open state to reflect hover state
        dropdown.addEventListener('mouseenter', () => {
            if (!isMobile() && toggle) {
                toggle.setAttribute('aria-expanded', 'true');
                dropdown.setAttribute('data-open', 'true');
            }
        });
        dropdown.addEventListener('mouseleave', () => {
            if (!isMobile() && toggle) {
                // Do not close if the user has keyboard focus inside the dropdown
                if (!dropdown.contains(document.activeElement)) {
                    toggle.setAttribute('aria-expanded', 'false');
                    dropdown.removeAttribute('data-open');
                }
            }
        });
        dropdown.addEventListener('focusout', (e) => {
            if (isMobile()) return;
            if (!dropdown.contains(e.relatedTarget)) {
                // Do not close if the user's mouse is still hovering over the dropdown
                if (!dropdown.matches(':hover')) {
                    if (toggle) toggle.setAttribute('aria-expanded', 'false');
                    dropdown.removeAttribute('data-open');
                }
            }
        });
    });

    syncMobileDropdownState();
    mobileMedia.addEventListener('change', syncMobileDropdownState);

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

        // ⚡ Bolt: Cache DOM queries to avoid redundant O(n) DOM traversals during animation
        const costCards = panelEl.querySelectorAll('.cost-card');
        const statNumbers = panelEl.querySelectorAll('.stat-number[data-target]');
        const miniDonutFills = panelEl.querySelectorAll('.mini-donut-fill[data-pct]');

        // Reveal cost cards with a stagger
        costCards.forEach((card, i) => {
            if (prefersReducedMotion) {
                card.classList.add('cost-card--visible');
            } else {
                setTimeout(() => card.classList.add('cost-card--visible'), i * 90);
            }
        });

        if (prefersReducedMotion) {
            // Set all final states immediately
            statNumbers.forEach(el => {
                el.textContent = el.getAttribute('data-target');
            });
            miniDonutFills.forEach(fill => {
                const pct = parseInt(fill.getAttribute('data-pct'), 10);
                fill.style.strokeDashoffset = String(MINI_CIRC * (1 - pct / 100));
            });
            return;
        }

        // Animate stat counters
        statNumbers.forEach(el => {
            animateValue(el, parseInt(el.getAttribute('data-target'), 10), duration);
        });

        // Animate mini donut fills (staggered)
        miniDonutFills.forEach((fill, i) => {
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
        tabBtns.forEach(b => {
            b.setAttribute('aria-selected', 'false');
            b.setAttribute('tabindex', '-1');
        });
        tabPanels.forEach(p => { p.hidden = true; });

        // Activate the clicked tab
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
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
        // ⚡ Bolt: Cache Array.from conversion of tabBtns to avoid O(N) array allocation inside keydown listener
        const allTabBtns = Array.from(tabBtns);

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchToPanel(btn));

            // Keyboard navigation: left/right arrow keys between tabs
            btn.addEventListener('keydown', (e) => {
                const currentIndex = allTabBtns.indexOf(btn);
                let newIndex = -1;
                if (e.key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % allTabBtns.length;
                } else if (e.key === 'ArrowLeft') {
                    newIndex = (currentIndex - 1 + allTabBtns.length) % allTabBtns.length;
                } else if (e.key === 'Home') {
                    newIndex = 0;
                } else if (e.key === 'End') {
                    newIndex = allTabBtns.length - 1;
                }
                if (newIndex >= 0) {
                    e.preventDefault();
                    allTabBtns[newIndex].focus();
                    allTabBtns[newIndex].click();
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

    // --- Standalone Cost Sections (section overview pages without tabs) ---
    const standaloneCostSections = document.querySelectorAll('.standalone-crisis-section');
    if (standaloneCostSections.length > 0) {
        if ('IntersectionObserver' in window) {
            let observedStandaloneCount = standaloneCostSections.length;
            const standaloneObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animatePanel(entry.target);
                        standaloneObserver.unobserve(entry.target);
                        observedStandaloneCount--;
                        // ⚡ Bolt: Completely disconnect observer once all elements are animated to free up memory
                        if (observedStandaloneCount === 0) {
                            standaloneObserver.disconnect();
                        }
                    }
                });
            }, { threshold: 0.15 });
            standaloneCostSections.forEach(section => standaloneObserver.observe(section));
        } else {
            standaloneCostSections.forEach(section => animatePanel(section));
        }
    }

    // --- Active Navigation Link ---
    const currentPath = window.location.pathname;
    // ⚡ Bolt: Reused cached navLinks NodeList instead of redundant DOM query
    // Consolidated redundant loop: .nav-links a already includes .nav-dropdown-menu a

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

                // If it's a dropdown link, mark the parent dropdown as active too
                const parentDropdown = link.closest('.nav-dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.add('dropdown-active');
                }
            }
        }
    });

    // --- Navbar Scroll Effect ---
    if (header) {
        if ('IntersectionObserver' in window) {
            const navSentinel = document.createElement('div');
            Object.assign(navSentinel.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '1px',
                height: '1px',
                pointerEvents: 'none',
                opacity: '0'
            });
            document.body.prepend(navSentinel);

            const navObserver = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
            navObserver.observe(navSentinel);
        } else {
            // Fallback for older browsers
            const updateNavScrolled = () => {
                if (window.scrollY > 0) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', updateNavScrolled, { passive: true });
            updateNavScrolled();
        }
    }

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

        // Close Mobile Menu or active dropdown (Escape)
        if (e.key === 'Escape') {
            const activeDropdown = document.activeElement ? document.activeElement.closest('.nav-dropdown') : null;
            let focusTarget = null;
            if (activeDropdown) {
                focusTarget = activeDropdown.querySelector('.nav-dropdown-toggle');
            }

            closeAllDropdowns();
            const isMenuOpen = header && header.classList.contains('nav-open');
            if (isMenuOpen) {
                // Simulate click on nav toggle to close
                if (navToggle) {
                    navToggle.click();
                    navToggle.focus();
                }
            } else if (focusTarget) {
                focusTarget.focus();
            }
        }
    });

    // --- External Links ---
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    if (externalLinks.length > 0) {
        externalLinks.forEach(link => {
            // Add visually hidden text for screen readers
            const srText = document.createElement('span');
            srText.className = 'sr-only';
            srText.textContent = ' (opens in a new tab)';
            link.appendChild(srText);

            // Add tooltip parity for sighted mouse users
            if (!link.hasAttribute('title')) {
                link.setAttribute('title', 'Opens in a new tab');
            }
        });
    }

    // --- Scroll Exit Fade Effect ---
    // Disabled: CSS masks with a translucent, backdrop-filtered navbar can cause
    // severe color artifacts while scrolling in both light and dark modes.

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

            // 🎨 Palette: Add tooltip parity for sighted mouse users based on the current aria-label
            const initialLabel = marker.getAttribute('aria-label');
            if (initialLabel) {
                marker.setAttribute('title', initialLabel);
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
                    const newLabel = newState
                        ? currentLabel.replace('complete', 'incomplete')
                        : currentLabel.replace('incomplete', 'complete');

                    marker.setAttribute('aria-label', newLabel);
                    marker.setAttribute('title', newLabel); // Add tooltip parity
                }

                // Save to localStorage
                safeStorage.setItem(stepId, newState);
            }
        });
    }


});
