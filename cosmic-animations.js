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
    

    // ===== 1. HERO SECTION ANIMATIONS =====
    const initHeroAnimations = () => {
        const heroTl = gsap.timeline({
            defaults: {
                ease: COSMIC_CONFIG.animations.hero.ease,
                duration: COSMIC_CONFIG.animations.hero.duration
            }
        });
        heroTl
            .from('.event-badge', { y: -50, opacity: 0, scale: 0.8, duration: 1 })
            .from('.hero-title', { y: 100, opacity: 0, scale: 0.9, duration: 1 }, '-=0.5')
            .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1 }, '-=0.8')
            .from('.detail-item', { y: 30, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.6')
            .from('.hero-buttons .btn-primary', { y: 30, opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.4')
            .from('.hero-buttons .btn-secondary', { y: 30, opacity: 0, scale: 0.9, duration: 0.5 }, '-=0.6')
            .from('.scroll-indicator', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4');

        gsap.to('.bg-orb.orb-1', { rotation: 360, duration: 20, repeat: -1, ease: 'none' });
        gsap.to('.bg-orb.orb-2', { rotation: -360, duration: 25, repeat: -1, ease: 'none' });
        gsap.to('.bg-orb.orb-3', { rotation: 360, duration: 30, repeat: -1, ease: 'none' });

        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const text = heroTitle.textContent;
            heroTitle.innerHTML = '';
            [...text].forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.opacity = '0';
                heroTitle.appendChild(span);
            });
            gsap.to('.hero-title span', { opacity: 1, duration: 0.03, stagger: 0.05, delay: 0.5 });
        }
    };

    // ===== 2. ABOUT SECTION SCROLL ANIMATIONS =====
    const initAboutAnimations = () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo('.about-title', { y: 80, opacity: 0, scale: 0.8 }, {
            y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', // CHANGED: duration from 1.0 to 0.5
            scrollTrigger: { trigger: '.about-section', start: 'top 80%', end: 'top 20%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo('.about-paragraph', { y: 60, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.out', // CHANGED: duration and stagger
            scrollTrigger: { trigger: '.about-content', start: 'top 70%', end: 'bottom 30%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo('.title-underline', { scaleX: 0 }, {
            scaleX: 1, duration: 0.6, ease: 'power2.inOut', // CHANGED: duration from 1.2 to 0.6
            scrollTrigger: { trigger: '.about-title', start: 'top 70%', toggleActions: 'play none none reverse' }
        });
    };

    // ===== 3. COSMIC EVENTS CAROUSEL ANIMATIONS =====
    const initCosmicEventsAnimations = () => {
        gsap.fromTo('.cosmic-events-title', { y: 100, opacity: 0, scale: 0.8 }, {
            y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', // CHANGED: duration from 1.5 to 0.7
            scrollTrigger: { trigger: '.cosmic-events-section', start: 'top 80%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo('.cosmic-events-subtitle', { y: 50, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.5, delay: 0.1, // CHANGED: duration from 1 to 0.5, delay from 0.3 to 0.1
            scrollTrigger: { trigger: '.cosmic-events-section', start: 'top 75%', toggleActions: 'play none none reverse' }
        });
        gsap.fromTo('.cosmic-event-card', { y: 100, opacity: 0, scale: 0.8, rotationY: 25 }, {
            y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 0.1, stagger: 0, ease: 'power2.out', // CHANGED: duration from 0.5 to 0.3, stagger from 0.2 to 0.1
            scrollTrigger: { trigger: '.cosmic-events-carousel', start: 'top 70%', toggleActions: 'play none none reverse' }
        });
        document.querySelectorAll('.cosmic-event-card').forEach(card => {
            const icon = card.querySelector('.cosmic-event-icon');
            const content = card.querySelector('.cosmic-event-content');
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -15, scale: 1.05, duration: 0.4, ease: 'power2.out' });
                gsap.to(icon, { scale: 1.2, rotation: 360, duration: 0.6, ease: 'back.out(1.7)' });
                gsap.to(content, { y: -5, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
                gsap.to(icon, { scale: 1, rotation: 0, duration: 0.4, ease: 'power2.out' });
                gsap.to(content, { y: 0, duration: 0.3, ease: 'power2.out' });
            });
        });
    };

    // ===== 4. ADVANCED SCROLL PROGRESS INDICATOR =====
    const initScrollProgress = () => {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'cosmic-scroll-progress';
        progressContainer.innerHTML = `<div class="progress-line"><div class="progress-orb"></div><div class="progress-trail"></div></div>`;
        progressContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 4px; z-index: 9999; background: rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);`;
        document.body.appendChild(progressContainer);
        const progressLine = progressContainer.querySelector('.progress-line');
        const progressOrb = progressContainer.querySelector('.progress-orb');
        progressLine.style.cssText = `height: 100%; background: linear-gradient(90deg, var(--cosmic-cyan), var(--cosmic-purple), var(--cosmic-pink)); width: 0%; transition: width 0.1s ease; position: relative; box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);`;
        progressOrb.style.cssText = `position: absolute; right: -8px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; background: var(--cosmic-cyan); border-radius: 50%; box-shadow: 0 0 15px rgba(0, 191, 255, 0.8); animation: pulse 2s infinite;`;
        const updateProgress = () => {
            const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressLine.style.width = Math.min(scrolled, 100) + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
    };

    // ===== 5. MAGNETIC CURSOR EFFECT =====
    const initMagneticCursor = () => {
        const cursor = document.createElement('div');
        cursor.className = 'cosmic-cursor';
        cursor.innerHTML = `<div class="cursor-dot"></div><div class="cursor-ring"></div>`;
        cursor.style.cssText = `position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; mix-blend-mode: difference;`;
        document.body.appendChild(cursor);
        const dot = cursor.querySelector('.cursor-dot');
        const ring = cursor.querySelector('.cursor-ring');
        dot.style.cssText = `width: 8px; height: 8px; background: var(--cosmic-cyan); border-radius: 50%; position: absolute; transform: translate(-50%, -50%);`;
        ring.style.cssText = `width: 40px; height: 40px; border: 2px solid var(--cosmic-purple); border-radius: 50%; position: absolute; transform: translate(-50%, -50%); transition: transform 0.2s ease;`;
        document.addEventListener('mousemove', (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.3, ease: 'power2.out' });
        });
        document.querySelectorAll('a, button, .cosmic-event-btn').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(ring, { scale: 1.5, duration: 0.3, ease: 'power2.out' }));
            el.addEventListener('mouseleave', () => gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power2.out' }));
        });
    };

    // ===== 6. SECTION TRANSITIONS WITH PARALLAX =====
    const initSectionTransitions = () => {
        gsap.utils.toArray('.about-section, .cosmic-events-section').forEach(section => {
            const bg = section.querySelector('::before') || section;
            gsap.to(bg, { yPercent: -50, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        gsap.utils.toArray('section').forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section, start: 'top 90%', end: 'bottom 10%',
                onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }),
                onLeave: () => gsap.to(section, { opacity: 0.7, duration: 0.5 }),
                onEnterBack: () => gsap.to(section, { opacity: 1, duration: 0.5 })
            });
        });
    };

    // ===== 7. MAIN INITIALIZATION FUNCTION =====
    const initCosmicAnimations = () => {
        // ...
        if (typeof gsap !== 'undefined') {
            // --- Animations that run on ALL screen sizes ---
            initHeroAnimations();
            // initSectionTransitions(); // This one is lightweight, can stay if you like

            // --- Animations that ONLY run on DESKTOP ---
            if (window.innerWidth > 768) {
                initAboutAnimations(); // MOVED HERE
                initCosmicEventsAnimations(); // MOVED HERE
                initSectionTransitions(); // MOVED HERE for consistency
                initScrollProgress();
                initMagneticCursor();
            }
        } else {
            // Fallback to load GSAP if it's not present
            const gsapScript = document.createElement('script');
            gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            gsapScript.onload = () => {
                const scrollTriggerScript = document.createElement('script');
                scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                scrollTriggerScript.onload = initCosmicAnimations;
                document.head.appendChild(scrollTriggerScript);
            };
            document.head.appendChild(gsapScript);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCosmicAnimations);
    } else {
        initCosmicAnimations();
    }
    window.initCosmicAnimations = initCosmicAnimations;
})();
