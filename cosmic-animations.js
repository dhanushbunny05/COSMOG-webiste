// COSMOG 2025 - Professional Scroll Animations & Effects
// Enhanced Animation System with AOS + GSAP + Custom CSS
(function() {
    'use strict';

    // Enhanced Animation Configuration
    const COSMIC_CONFIG = {
        animations: {
            hero: {
                stagger: 0.2,
                duration: 1.0,
                ease: 'power3.out'
            },
            scroll: {
                offset: 120,
                duration: 500,
                easing: 'ease-out-cubic'
            }
        },
        breakpoints: {
            mobile: 768,
            tablet: 1024
        }
    };
    
    const isMobile = window.innerWidth <= COSMIC_CONFIG.breakpoints.mobile;

    // ===== 1. HERO SECTION ANIMATIONS =====
    const initHeroAnimations = () => {
        gsap.timeline({
            defaults: { ease: COSMIC_CONFIG.animations.hero.ease, duration: COSMIC_CONFIG.animations.hero.duration }
        })
        .from('.event-badge', { y: -50, opacity: 0, scale: 0.8, duration: 1 })
        .from('.hero-title', { y: 100, opacity: 0, scale: 0.9, duration: 1 }, '-=0.5')
        .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1 }, '-=0.8')
        .from('.detail-item', { y: 30, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.6')
        .from('.hero-buttons .btn-primary, .hero-buttons .btn-secondary', { y: 30, opacity: 0, scale: 0.9, stagger: 0.2, duration: 0.5 }, '-=0.4')
        .from('.scroll-indicator', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4');
    };

    // ===== 2. ABOUT SECTION SCROLL ANIMATIONS =====
    const initAboutAnimations = () => {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.from('.about-title', {
            scrollTrigger: { trigger: '.about-section', start: 'top 80%', toggleActions: 'play none none reverse' },
            y: 80, opacity: 0, scale: 0.8, duration: 1.0, ease: 'power3.out'
        });

        gsap.from('.about-paragraph', {
            scrollTrigger: { trigger: '.about-content', start: 'top 70%', toggleActions: 'play none none reverse' },
            y: 60, opacity: 0, duration: 1, stagger: 0.3, ease: 'power2.out'
        });

        gsap.from('.title-underline', {
            scrollTrigger: { trigger: '.about-title', start: 'top 70%', toggleActions: 'play none none reverse' },
            scaleX: 0, duration: 1.2, ease: 'power2.inOut'
        });
    };

    // ===== 3. COSMIC EVENTS CAROUSEL ANIMATIONS =====
    const initCosmicEventsAnimations = () => {
        gsap.from('.cosmic-events-title', {
            scrollTrigger: { trigger: '.cosmic-events-section', start: 'top 80%', toggleActions: 'play none none reverse' },
            y: 100, opacity: 0, scale: 0.8, duration: 1.5, ease: 'power3.out'
        });

        gsap.from('.cosmic-events-subtitle', {
            scrollTrigger: { trigger: '.cosmic-events-section', start: 'top 75%', toggleActions: 'play none none reverse' },
            y: 50, opacity: 0, duration: 1, delay: 0.3
        });

        gsap.from('.cosmic-event-card', {
            scrollTrigger: { trigger: '.cosmic-events-carousel', start: 'top 70%', toggleActions: 'play none none reverse' },
            y: 100, opacity: 0, scale: 0.8, stagger: 0.2, ease: 'power2.out',
            duration: isMobile ? 0.5 : 0.8, // Faster on mobile
            rotationY: isMobile ? 0 : 25 // No 3D rotation on mobile
        });
    };

    // ===== 4. ADVANCED SCROLL PROGRESS INDICATOR (Desktop Only) =====
    const initScrollProgress = () => {
        if (isMobile) return;

        const progressContainer = document.createElement('div');
        progressContainer.innerHTML = `<div class="progress-line"></div>`;
        progressContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 3px; z-index: 9999; pointer-events: none;`;
        document.body.appendChild(progressContainer);

        const progressLine = progressContainer.querySelector('.progress-line');
        progressLine.style.cssText = `height: 100%; width: 0%; background: linear-gradient(90deg, var(--cosmic-cyan), var(--cosmic-purple), var(--cosmic-pink));`;
        
        gsap.to(progressLine, {
            width: '100%',
            ease: 'none',
            scrollTrigger: { scrub: true }
        });
    };

    // ===== 5. MAGNETIC CURSOR EFFECT (Desktop Only) =====
    const initMagneticCursor = () => {
        if (isMobile) return;

        const cursor = document.createElement('div');
        cursor.innerHTML = `<div class="cursor-dot"></div><div class="cursor-ring"></div>`;
        cursor.style.cssText = `position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; mix-blend-mode: difference;`;
        document.body.appendChild(cursor);
        
        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        dot.style.cssText = `width: 8px; height: 8px; background: white; border-radius: 50%; position: absolute; transform: translate(-50%, -50%);`;
        ring.style.cssText = `width: 40px; height: 40px; border: 2px solid white; border-radius: 50%; position: absolute; transform: translate(-50%, -50%);`;
        
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

        window.addEventListener('mousemove', e => {
            gsap.to(dot, 0.1, { x: e.clientX, y: e.clientY });
            gsap.to(ring, 0.3, { x: e.clientX, y: e.clientY, ease: 'power2.out' });
        });
        
        document.querySelectorAll('a, button, .cosmic-event-card').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(ring, 0.3, { scale: 1.5 }));
            el.addEventListener('mouseleave', () => gsap.to(ring, 0.3, { scale: 1 }));
        });
    };

    // ===== 6. MAIN INITIALIZATION FUNCTION =====
    const initCosmicAnimations = () => {
        console.log('🌟 Initializing COSMOG 2025 Animations...');
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not found. Animations disabled.');
            return;
        }
        
        initHeroAnimations();
        initAboutAnimations();
        initCosmicEventsAnimations();
        initScrollProgress();
        initMagneticCursor();

        console.log('🎉 All animations initialized successfully!');
    };

    // ===== AUTO-INITIALIZE ON DOM READY =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCosmicAnimations);
    } else {
        initCosmicAnimations();
    }

})();

