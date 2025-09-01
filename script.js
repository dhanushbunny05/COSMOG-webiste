// COSMOG 2025 - Enhanced JavaScript with Security & Performance Fixes
(function() {
    'use strict';

    // Configuration object to avoid hard-coded values
    const CONFIG = {
        eventEndDate: '2025-09-17T09:00:00',
        carousel: {
            autoPlayDuration: 3000, // Consistent autoplay duration
            transitionDuration: 500,
            swipeThreshold: 50
        },
        performance: {
            throttleDelay: 250,
            scrollUpdateDelay: 16,
            debounceDelay: 250 // Centralized debounce delay
        },
        animations: {
            rippleDelay: 600,
            loadingDelay: 1000
        }
    };

    // Utility functions
    const utils = {
        safeExecute: function(fn, context = 'Unknown', fallback = null) {
            try {
                return fn();
            } catch (error) {
                console.warn(`[COSMOG] Error in ${context}:`, error.message);
                if (fallback && typeof fallback === 'function') {
                    return fallback();
                }
                return null;
            }
        },
        throttle: function(func, limit) {
            let inThrottle;
            let timeoutId;
            const throttledFn = function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    timeoutId = setTimeout(() => {
                        inThrottle = false;
                        timeoutId = null;
                    }, limit);
                }
            };
            throttledFn.cleanup = function() {
                if (timeoutId) clearTimeout(timeoutId);
            };
            return throttledFn;
        },
        debounce: function(func, delay) {
            let timeoutId;
            const debouncedFn = function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
            debouncedFn.cleanup = function() {
                if (timeoutId) clearTimeout(timeoutId);
            };
            return debouncedFn;
        },
        query: (selector, parent = document) => parent.querySelector(selector),
        queryAll: (selector, parent = document) => Array.from(parent.querySelectorAll(selector))
    };

    // Component registry for cleanup
    const componentRegistry = new Map();

    const mobileNavigation = {
        init: function() {
            return utils.safeExecute(() => {
                const mobileMenuBtn = utils.query('.mobile-menu-btn');
                const mobileNav = utils.query('.mobile-nav');
                if (!mobileMenuBtn || !mobileNav) return null;
                
                const mobileNavLinks = utils.queryAll('.mobile-nav .nav-link');
                const mobileMenuIcon = utils.query('i', mobileMenuBtn);

                const toggleMenu = (e) => {
                    e.preventDefault();
                    const isActive = mobileNav.classList.toggle('active');
                    mobileMenuBtn.setAttribute('aria-expanded', String(isActive));
                    if (mobileMenuIcon) mobileMenuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
                    if (isActive) utils.query('.nav-link', mobileNav)?.focus();
                };

                const closeMenu = () => {
                    mobileNav.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    if (mobileMenuIcon) mobileMenuIcon.className = 'fas fa-bars';
                };

                const handleEscape = (e) => {
                    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                        closeMenu();
                        mobileMenuBtn.focus();
                    }
                };
                
                mobileMenuBtn.addEventListener('click', toggleMenu);
                mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));
                document.addEventListener('keydown', handleEscape);

                const cleanup = () => {
                    mobileMenuBtn.removeEventListener('click', toggleMenu);
                    mobileNavLinks.forEach(link => link.removeEventListener('click', closeMenu));
                    document.removeEventListener('keydown', handleEscape);
                };
                return { cleanup };
            }, 'Mobile Navigation');
        }
    };

    const cosmicCarousel = {
        init: function() {
            return utils.safeExecute(() => {
                const carousel = utils.query('.cosmic-events-carousel');
                const track = utils.query('.carousel-track');
                const slides = utils.queryAll('.carousel-track > *');
                const nextButton = utils.query('.carousel-btn-next');
                const prevButton = utils.query('.carousel-btn-prev');

                if (!carousel || !track || slides.length === 0) return null;

                let progressContainer = utils.query('.carousel-progress', carousel);
                if (!progressContainer) {
                    progressContainer = document.createElement('div');
                    progressContainer.className = 'carousel-progress';
                    const progressBarEl = document.createElement('div');
                    progressBarEl.className = 'carousel-progress-bar';
                    progressContainer.appendChild(progressBarEl);
                    carousel.appendChild(progressContainer);
                }
                const progressBar = utils.query('.carousel-progress-bar', progressContainer);

                let currentSlideIndex = 0;
                let animationFrameId = null;
                let startTime = Date.now();

                const updateSlidePosition = () => {
                    const trackContainer = utils.query('.carousel-track-container');
                    if (!trackContainer || slides.length === 0) return;
                    
                    const containerWidth = trackContainer.offsetWidth;
                    const slideWidth = slides[0].offsetWidth;
                    const slideGap = parseFloat(getComputedStyle(track).gap) || 0;
                    
                    const offset = (slideWidth + slideGap) * currentSlideIndex;
                    const centerOffset = (containerWidth - slideWidth) / 2;
                    const translateX = centerOffset - offset;
                    track.style.transform = `translateX(${translateX}px)`;

                    slides.forEach((slide, index) => {
                        slide.classList.remove('is-active', 'is-prev', 'is-next');
                        if (index === currentSlideIndex) {
                            slide.classList.add('is-active');
                        } else if (index === currentSlideIndex - 1) {
                            slide.classList.add('is-prev');
                        } else if (index === currentSlideIndex + 1) {
                            slide.classList.add('is-next');
                        }
                    });
                };

                const moveToSlide = (targetIndex) => {
                    currentSlideIndex = (targetIndex + slides.length) % slides.length;
                    updateSlidePosition();
                    startTime = Date.now();
                };

                const startAutoPlay = () => {
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    startTime = Date.now();
                    
                    const animateProgress = () => {
                        const elapsedTime = Date.now() - startTime;
                        const progress = (elapsedTime / CONFIG.carousel.autoPlayDuration) * 100;

                        if (progress >= 100) {
                            moveToSlide(currentSlideIndex + 1);
                        } else {
                           if (progressBar) progressBar.style.width = `${progress}%`;
                        }
                        animationFrameId = requestAnimationFrame(animateProgress);
                    };
                    animationFrameId = requestAnimationFrame(animateProgress);
                };

                const stopAutoPlay = () => {
                    if (animationFrameId) cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                };

                const handleNext = () => moveToSlide(currentSlideIndex + 1);
                const handlePrev = () => moveToSlide(currentSlideIndex - 1);

                if (nextButton) nextButton.addEventListener('click', handleNext);
                if (prevButton) prevButton.addEventListener('click', handlePrev);
                carousel.addEventListener('mouseenter', stopAutoPlay);
                carousel.addEventListener('mouseleave', startAutoPlay);

                const handleResize = utils.debounce(updateSlidePosition, CONFIG.performance.debounceDelay);
                window.addEventListener('resize', handleResize);

                setTimeout(() => {
                    updateSlidePosition();
                    startAutoPlay();
                }, 100);

                const cleanup = () => {
                    stopAutoPlay();
                    if (nextButton) nextButton.removeEventListener('click', handleNext);
                    if (prevButton) prevButton.removeEventListener('click', handlePrev);
                    carousel.removeEventListener('mouseenter', stopAutoPlay);
                    carousel.removeEventListener('mouseleave', startAutoPlay);
                    window.removeEventListener('resize', handleResize);
                    handleResize.cleanup();
                };
                return { cleanup };
            }, 'Cosmic Carousel');
        }
    };
    
    // Other components (cardEffects, buttonEffects, etc.) are well-written and do not require critical corrections.
    const cardEffects = {
        init: function() {
            return utils.safeExecute(() => {
                const cards = utils.queryAll('[data-tilt]');
                if (cards.length === 0) return null;
                const handlers = new Map();
                cards.forEach(card => {
                    const handleMouseMove = utils.throttle((e) => {
                        const rect = card.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        const rotateX = (y - centerY) / 8;
                        const rotateY = (centerX - x) / 8;
                        card.style.transform = `translateY(-10px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg) perspective(1000px)`;
                    }, 16);
                    const handleMouseLeave = () => {
                        card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
                    };
                    card.addEventListener('mousemove', handleMouseMove);
                    card.addEventListener('mouseleave', handleMouseLeave);
                    handlers.set(card, { handleMouseMove, handleMouseLeave });
                });
                const cleanup = () => {
                    handlers.forEach((cardHandlers, card) => {
                        card.removeEventListener('mousemove', cardHandlers.handleMouseMove);
                        card.removeEventListener('mouseleave', cardHandlers.handleMouseLeave);
                        cardHandlers.handleMouseMove.cleanup();
                    });
                };
                return { cleanup };
            }, '3D Card Effects');
        }
    };
    const buttonEffects = {
        init: function() {
            return utils.safeExecute(() => {
                const buttons = utils.queryAll('.cosmic-event-btn');
                if (buttons.length === 0) return null;
                const handleClick = (e) => {
                    const button = e.currentTarget;
                    const ripple = document.createElement('div');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    ripple.className = 'ripple-effect';
                    ripple.style.cssText = `position: absolute; top: ${y}px; left: ${x}px; width: ${size}px; height: ${size}px; background: rgba(255, 255, 255, 0.6); border-radius: 50%; transform: scale(0); animation: ripple-animation ${CONFIG.animations.rippleDelay}ms ease-out; pointer-events: none; z-index: 1;`;
                    button.style.position = 'relative';
                    button.appendChild(ripple);
                    setTimeout(() => ripple.remove(), CONFIG.animations.rippleDelay);
                };
                buttons.forEach(button => button.addEventListener('click', handleClick));
                if (!document.getElementById('ripple-styles')) {
                    const style = document.createElement('style');
                    style.id = 'ripple-styles';
                    style.textContent = `@keyframes ripple-animation { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }`;
                    document.head.appendChild(style);
                }
                const cleanup = () => {
                    buttons.forEach(button => button.removeEventListener('click', handleClick));
                    document.getElementById('ripple-styles')?.remove();
                };
                return { cleanup };
            }, 'Button Effects');
        }
    };
    const registrationButtons = {
        init: function() {
            return utils.safeExecute(() => {
                const buttons = utils.queryAll('.register-btn, .cosmic-event-btn, .btn-primary, .view-all-events-btn');
                if (buttons.length === 0) return null;
                const handleRegistration = function(e) {
                    e.preventDefault();
                    if (this.disabled) return;
                    alert('Registration and event details will be available soon! Stay tuned for COSMOG 2025!');
                };
                buttons.forEach(button => button.addEventListener('click', handleRegistration));
                const cleanup = () => {
                    buttons.forEach(button => button.removeEventListener('click', handleRegistration));
                };
                return { cleanup };
            }, 'Registration Buttons');
        }
    };
    const smoothScrolling = {
        init: function() {
            return utils.safeExecute(() => {
                const anchorLinks = utils.queryAll('a[href^="#"]');
                if (anchorLinks.length === 0) return null;
                const handleClick = function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const target = utils.query(targetId);
                    if (target) {
                        const navbarHeight = utils.query('.navbar')?.offsetHeight || 64;
                        const targetPosition = target.offsetTop - navbarHeight;
                        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                        target.focus({ preventScroll: true });
                        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                    }
                };
                anchorLinks.forEach(link => link.addEventListener('click', handleClick));
                const cleanup = () => {
                    anchorLinks.forEach(link => link.removeEventListener('click', handleClick));
                };
                return { cleanup };
            }, 'Smooth Scrolling');
        }
    };
    const scrollProgress = {
        init: function() {
            return utils.safeExecute(() => {
                const progressBar = document.createElement('div');
                progressBar.className = 'scroll-progress';
                progressBar.setAttribute('aria-hidden', 'true');
                progressBar.style.cssText = `position: fixed; top: 64px; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, var(--cosmic-cyan), var(--cosmic-purple), var(--cosmic-pink)); z-index: 1000; transition: width 0.25s ease;`;
                document.body.appendChild(progressBar);
                const updateProgress = utils.throttle(() => {
                    const scrollPercent = (window.pageYOffset / (document.body.offsetHeight - window.innerHeight)) * 100;
                    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
                }, CONFIG.performance.scrollUpdateDelay);
                window.addEventListener('scroll', updateProgress, { passive: true });
                const cleanup = () => {
                    window.removeEventListener('scroll', updateProgress);
                    updateProgress.cleanup();
                    progressBar.remove();
                };
                return { cleanup };
            }, 'Scroll Progress');
        }
    };
    const loadingAnimation = {
        init: function() {
            return utils.safeExecute(() => {
                const handleLoad = () => document.body.classList.add('loaded');
                if (document.readyState === 'complete') {
                    handleLoad();
                } else {
                    window.addEventListener('load', handleLoad, { once: true });
                }
                if (!document.getElementById('loading-styles')) {
                    const style = document.createElement('style');
                    style.id = 'loading-styles';
                    style.textContent = `body.loaded { animation: fadeIn 0.5s ease-in; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
                    document.head.appendChild(style);
                }
                const cleanup = () => document.getElementById('loading-styles')?.remove();
                return { cleanup };
            }, 'Loading Animation');
        }
    };


    function initializeCosmog() {
        console.log('🚀 Initializing COSMOG 2025...');
        const components = [
            mobileNavigation, cosmicCarousel, cardEffects, buttonEffects,
            registrationButtons, smoothScrolling, scrollProgress, loadingAnimation
        ];
        components.forEach(component => {
            const instance = component.init();
            if (instance && instance.cleanup) {
                componentRegistry.set(component, instance.cleanup);
            }
        });
        console.log('✨ COSMOG 2025 initialized successfully!');
    }

    function cleanupCosmog() {
        console.log('🧹 Cleaning up COSMOG components...');
        componentRegistry.forEach(cleanup => utils.safeExecute(cleanup, 'Component Cleanup'));
        componentRegistry.clear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCosmog);
    } else {
        initializeCosmog();
    }

    window.addEventListener('beforeunload', cleanupCosmog);

})();
