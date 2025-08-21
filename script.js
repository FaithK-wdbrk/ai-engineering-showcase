// Portfolio Website JavaScript Functionality
// Modern ES6+ implementation with error handling

class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeNavigation();
        this.initializeTheme();
        this.initializeTypingAnimation();
        this.initializeProjectFilters();
        this.initializeContactForm();
        this.initializeScrollToTop();
    }

    // ============ NAVIGATION FUNCTIONALITY ============
    
    setupEventListeners() {
        // DOM loaded event
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMLoaded());
        } else {
            this.onDOMLoaded();
        }

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleNavbarScroll();
            this.updateActiveNavLink();
            this.handleScrollToTopButton();
        });

        // Resize events
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    onDOMLoaded() {
        // Mobile menu toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Nav links smooth scrolling
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Hero buttons smooth scrolling
        const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = button.getAttribute('href').substring(1);
                this.smoothScrollTo(targetId);
            });
        });
    }

    initializeNavigation() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    smoothScrollTo(targetId) {
        try {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error('Error in smooth scroll:', error);
        }
    }

    handleNavbarScroll() {
        try {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        } catch (error) {
            console.error('Error in navbar scroll handler:', error);
        }
    }

    updateActiveNavLink() {
        try {
            if (!this.sections || !this.navLinks) return;

            let currentSection = '';
            const scrollPosition = window.scrollY + 200;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        } catch (error) {
            console.error('Error updating active nav link:', error);
        }
    }

    handleResize() {
        // Close mobile menu on resize
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    // ============ ANIMATIONS ============

    initializeAnimations() {
        this.setupIntersectionObserver();
        this.initializeSkillBars();
    }

    setupIntersectionObserver() {
        try {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        
                        // Trigger skill bar animations
                        if (entry.target.classList.contains('skills-grid')) {
                            this.animateSkillBars();
                        }
                        
                        // Trigger project card animations
                        if (entry.target.classList.contains('projects-grid')) {
                            this.animateProjectCards();
                        }
                    }
                });
            }, observerOptions);

            // Observe all elements with animate-on-scroll class
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach(element => {
                this.observer.observe(element);
            });

            // Observe project cards for fade-in animation
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                this.observer.observe(card);
            });

        } catch (error) {
            console.error('Error setting up Intersection Observer:', error);
        }
    }

    initializeSkillBars() {
        this.skillBarsAnimated = false;
    }

    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        
        try {
            const progressBars = document.querySelectorAll('.progress');
            progressBars.forEach((bar, index) => {
                const progress = bar.getAttribute('data-progress');
                setTimeout(() => {
                    bar.style.width = `${progress}%`;
                }, index * 200);
            });
            this.skillBarsAnimated = true;
        } catch (error) {
            console.error('Error animating skill bars:', error);
        }
    }

    animateProjectCards() {
        try {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 150);
            });
        } catch (error) {
            console.error('Error animating project cards:', error);
        }
    }

    // ============ TYPING ANIMATION ============

    initializeTypingAnimation() {
        try {
            const typingElement = document.getElementById('typing-text');
            const cursor = document.getElementById('cursor');
            
            if (!typingElement) return;

            const texts = [
                'AI Engineer',
                'Full Stack Developer',
                'Machine Learning Expert',
                'Problem Solver'
            ];
            
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;

            const typeText = () => {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    typingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 50;
                } else {
                    typingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 100;
                }

                if (!isDeleting && charIndex === currentText.length) {
                    typingSpeed = 2000; // Pause at end
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typingSpeed = 500; // Pause before next text
                }

                setTimeout(typeText, typingSpeed);
            };

            // Start typing animation
            setTimeout(typeText, 1000);

            // Animate cursor
            if (cursor) {
                setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
                }, 500);
            }

        } catch (error) {
            console.error('Error in typing animation:', error);
        }
    }

    // ============ PROJECT FILTERING ============

    initializeProjectFilters() {
        try {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const projectCards = document.querySelectorAll('.project-card');

            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const filter = button.getAttribute('data-filter');
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Filter projects
                    this.filterProjects(filter, projectCards);
                });
            });
        } catch (error) {
            console.error('Error initializing project filters:', error);
        }
    }

    filterProjects(filter, projectCards) {
        try {
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, index * 100);
                } else {
                    card.classList.remove('fade-in');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        } catch (error) {
            console.error('Error filtering projects:', error);
        }
    }

    // ============ CONTACT FORM ============

    initializeContactForm() {
        try {
            const form = document.getElementById('contact-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        } catch (error) {
            console.error('Error initializing contact form:', error);
        }
    }

    validateField(field) {
        try {
            const value = field.value.trim();
            const fieldName = field.name;
            const errorElement = document.getElementById(`${fieldName}-error`);
            
            if (!errorElement) return true;

            let isValid = true;
            let errorMessage = '';

            switch (fieldName) {
                case 'name':
                    if (!value) {
                        errorMessage = 'Name is required';
                        isValid = false;
                    } else if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!value) {
                        errorMessage = 'Email is required';
                        isValid = false;
                    } else if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'subject':
                    if (!value) {
                        errorMessage = 'Subject is required';
                        isValid = false;
                    } else if (value.length < 3) {
                        errorMessage = 'Subject must be at least 3 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'message':
                    if (!value) {
                        errorMessage = 'Message is required';
                        isValid = false;
                    } else if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters';
                        isValid = false;
                    }
                    break;
            }

            if (isValid) {
                field.classList.remove('error');
                field.classList.add('valid');
                errorElement.textContent = '';
            } else {
                field.classList.add('error');
                field.classList.remove('valid');
                errorElement.textContent = errorMessage;
            }

            return isValid;
        } catch (error) {
            console.error('Error validating field:', error);
            return false;
        }
    }

    clearFieldError(field) {
        try {
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement && field.value.trim()) {
                field.classList.remove('error');
                errorElement.textContent = '';
            }
        } catch (error) {
            console.error('Error clearing field error:', error);
        }
    }

    async handleFormSubmission(form) {
        try {
            const submitBtn = document.getElementById('submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            const formMessage = document.getElementById('form-message');

            // Validate all fields
            const inputs = form.querySelectorAll('input, textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                this.showFormMessage('Please fix the errors above.', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            formMessage.textContent = '';

            // Simulate form submission (replace with actual API call)
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate successful submission
            const success = Math.random() > 0.1; // 90% success rate for demo
            
            if (success) {
                this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                inputs.forEach(input => {
                    input.classList.remove('valid', 'error');
                });
            } else {
                this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showFormMessage('An unexpected error occurred. Please try again.', 'error');
        } finally {
            // Reset button state
            const submitBtn = document.getElementById('submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
        }
    }

    showFormMessage(message, type) {
        try {
            const formMessage = document.getElementById('form-message');
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.className = `form-message ${type}`;
                formMessage.style.display = 'block';
                
                // Auto-hide success messages
                if (type === 'success') {
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                }
            }
        } catch (error) {
            console.error('Error showing form message:', error);
        }
    }

    // ============ THEME TOGGLE ============

    initializeTheme() {
        try {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;

            // Check for saved theme preference or default to light
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.setTheme(savedTheme);

            themeToggle.addEventListener('click', () => {
                const currentTheme = document.body.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        } catch (error) {
            console.error('Error initializing theme:', error);
        }
    }

    setTheme(theme) {
        try {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            const themeToggle = document.getElementById('theme-toggle');
            const icon = themeToggle.querySelector('i');
            
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    }

    // ============ SCROLL TO TOP ============

    initializeScrollToTop() {
        try {
            const scrollToTopBtn = document.getElementById('scroll-to-top');
            if (!scrollToTopBtn) return;

            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        } catch (error) {
            console.error('Error initializing scroll to top:', error);
        }
    }

    handleScrollToTopButton() {
        try {
            const scrollToTopBtn = document.getElementById('scroll-to-top');
            if (!scrollToTopBtn) return;

            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        } catch (error) {
            console.error('Error handling scroll to top button:', error);
        }
    }

    // ============ UTILITY FUNCTIONS ============

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ============ ERROR HANDLING ============

    handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        // In production, you might want to send errors to a logging service
    }
}

// ============ ADDITIONAL UTILITY FUNCTIONS ============

// Lazy loading for images
function initializeLazyLoading() {
    try {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src], img.lazy');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    } catch (error) {
        console.error('Error initializing lazy loading:', error);
    }
}

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize portfolio when DOM is ready
const portfolio = new Portfolio();

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}