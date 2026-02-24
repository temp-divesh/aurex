(function() {
    'use strict';

    // ========== MAGNETIC CURSOR SYSTEM ==========
    const magneticCursor = document.getElementById('magneticCursor');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    if (magneticCursor && window.innerWidth > 768) {
        magneticCursor.classList.add('active');
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.7;
            cursorY += (mouseY - cursorY) * 0.7;
            magneticCursor.style.left = cursorX + 'px';
            magneticCursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, .btn-magnetic, .stat-card, .philosophy-card, .capability-item, .team-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                magneticCursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                magneticCursor.classList.remove('hover');
            });
        });
    }

    // ========== INTRO SEQUENCE ==========
    const introSequence = document.getElementById('intro');
    document.body.classList.add('intro-active');

    if (introSequence) {
        // Canvas particle effect
        const canvas = document.getElementById('introCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#00d4ff';

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    ctx.globalAlpha = p.opacity;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();
                });

                ctx.globalAlpha = 1;
                requestAnimationFrame(animateParticles);
            }
            animateParticles();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        setTimeout(() => {
            document.body.classList.remove('intro-active');
            introSequence.classList.add('done');
            
            // Trigger hero animations
            setTimeout(() => {
                document.querySelectorAll('.title-line').forEach((line, i) => {
                    setTimeout(() => {
                        line.classList.add('visible');
                    }, i * 200);
                });
            }, 100);
        }, 3000);

        setTimeout(() => {
            introSequence.classList.add('removed');
        }, 4000);
    } else {
        document.body.classList.remove('intro-active');
        document.querySelectorAll('.title-line').forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, i * 200);
        });
    }

    // ========== FLOATING NAVIGATION ==========
    const floatingNav = document.getElementById('floatingNav');
    
    setTimeout(() => {
        if (floatingNav) {
            floatingNav.classList.add('visible');
        }
    }, 3500);

    // Mobile nav toggle
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.pageYOffset + 200;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.toggle('active', href === '#' + current);
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const y = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });

    // Section numbers
    document.querySelectorAll('.section-number').forEach(el => {
        revealObserver.observe(el);
    });

    // Philosophy cards
    document.querySelectorAll('.philosophy-card').forEach((card, i) => {
        revealObserver.observe(card);
        card.style.transitionDelay = `${i * 0.2}s`;
    });

    // Capability items
    document.querySelectorAll('.capability-item').forEach((item, i) => {
        revealObserver.observe(item);
        item.style.transitionDelay = `${i * 0.15}s`;
    });

    // Team cards
    document.querySelectorAll('.team-card').forEach((card, i) => {
        revealObserver.observe(card);
    });

    // Philosophy section — storyline nodes when in view
    const philosophySection = document.getElementById('philosophy');
    if (philosophySection) {
        const philosophyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.2 });
        philosophyObserver.observe(philosophySection);
    }

    // Title words
    document.querySelectorAll('.title-word').forEach((word, i) => {
        revealObserver.observe(word);
        word.style.transitionDelay = `${i * 0.1}s`;
    });

    // ========== ANIMATED COUNTERS ==========
    function animateCounter(element, target, duration, format) {
        format = format || (target % 1 !== 0 ? 'decimal' : 'int');
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = format === 'decimal' ? target.toFixed(1) : Math.round(target).toString();
                clearInterval(timer);
            } else {
                element.textContent = format === 'decimal' ? Math.min(current, target).toFixed(1) : Math.floor(Math.min(current, target)).toString();
            }
        }, 16);
    }

    const statValues = document.querySelectorAll('.stat-value');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.getAttribute('data-target'));
                const format = element.getAttribute('data-format') || (target % 1 !== 0 ? 'decimal' : 'int');
                animateCounter(element, target, 2000, format);
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => {
        statsObserver.observe(el);
    });

    // ========== PARALLAX EFFECTS ==========
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }, { passive: true });
    }

    // ========== FORM HANDLING ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Floating labels
        const formInputs = contactForm.querySelectorAll('.form-input');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.btn-submit');
            const formData = new FormData(contactForm);
            
            console.log('Contact Form:', Object.fromEntries(formData));
            
            submitBtn.innerHTML = '<span class="btn-submit-text">Sent ✓</span>';
            submitBtn.disabled = true;
            submitBtn.style.background = '#34c759';
            
            contactForm.reset();
            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            setTimeout(() => {
                submitBtn.innerHTML = '<span class="btn-submit-text">Send Message</span><div class="btn-submit-arrow">→</div>';
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
        });
    }

    // ========== SCROLL HINT ==========
    const scrollHint = document.querySelector('.hero-scroll-hint');
    if (scrollHint) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollHint.style.opacity = '0';
                scrollHint.style.pointerEvents = 'none';
            } else {
                scrollHint.style.opacity = '1';
                scrollHint.style.pointerEvents = 'all';
            }
        }, { passive: true });
    }

    // ========== BUTTON RIPPLE EFFECT ==========
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    magneticButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.animation = 'none';
                setTimeout(() => {
                    ripple.style.animation = '';
                }, 10);
            }
        });
    });

    // ========== PERFORMANCE OPTIMIZATION ==========
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--ease-out-expo', 'ease');
        document.documentElement.style.setProperty('--ease-in-out-expo', 'ease');
        document.querySelectorAll('*').forEach(el => {
            el.style.animationDuration = '0.01ms';
            el.style.transitionDuration = '0.01ms';
        });
    }



    console.log('Aurex Digital — Website initialized');
})();
