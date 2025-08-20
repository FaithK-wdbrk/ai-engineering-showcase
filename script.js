// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initSkillAnimations();
    initContactForm();
    initProjectFilters();
    initThemeToggle();
    initScrollToTop();
    initTypewriterEffect();
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Update ARIA attributes
        const isExpanded = navToggle.classList.contains('active');
        navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for skill bars
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll(
        'section, .project-card, .skill-category, .timeline-item, .contact-method'
    );
    
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-avatar');
        
        if (heroImage) {
            const speed = scrolled * 0.5;
            heroImage.style.transform = `translateY(${speed}px)`;
        }
    });
}

// Skill bar animations
function initSkillAnimations() {
    function animateSkillBars(skillCategory) {
        const skillBars = skillCategory.querySelectorAll('.skill-progress');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = bar.getAttribute('style').match(/width:\s*(\d+%)/)[1];
            }, index * 200);
        });
    }

    // Export function for use in scroll effects
    window.animateSkillBars = animateSkillBars;
}

// Contact form functionality
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.form-submit');
    const submitText = document.querySelector('.submit-text');
    const submitLoading = document.querySelector('.submit-loading');

    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        const formData = new FormData(form);
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
        });

        // Validate required fields
        const requiredFields = ['name', 'email', 'subject', 'message'];
        
        requiredFields.forEach(field => {
            const value = formData.get(field);
            const errorElement = document.querySelector(`#${field}-error`);
            
            if (!value || value.trim() === '') {
                errorElement.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
                isValid = false;
            }
        });

        // Validate email format
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailError = document.querySelector('#email-error');
        
        if (email && !emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }

        return isValid;
    }

    function submitForm() {
        // Show loading state
        submitText.style.display = 'none';
        submitLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset button state
            submitText.style.display = 'inline';
            submitLoading.style.display = 'none';
            submitBtn.disabled = false;
        }, 2000);
    }

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.querySelector(`#${fieldName}-error`);
        
        if (!value) {
            errorElement.textContent = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            return false;
        }
        
        if (fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorElement.textContent = 'Please enter a valid email address';
                return false;
            }
        }
        
        errorElement.textContent = '';
        return true;
    }

    function clearFieldError(field) {
        const errorElement = document.querySelector(`#${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
}

// Project filtering (if needed for future expansion)
function initProjectFilters() {
    // This can be expanded to add project filtering functionality
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add hover effects
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Theme toggle functionality (for future dark mode)
function initThemeToggle() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    // This function can be expanded to add a theme toggle button
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Export for potential future use
    window.toggleTheme = toggleTheme;
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Add styles for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            background: var(--primary-dark);
            transform: translateY(-3px);
        }
    `;
    document.head.appendChild(style);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typewriter effect for hero section
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const titles = [
        'Full Stack Developer',
        'UI/UX Enthusiast',
        'Problem Solver',
        'Code Craftsman'
    ];
    
    let currentTitle = 0;
    let currentChar = 0;
    let isDeleting = false;

    function typeWriter() {
        const current = titles[currentTitle];
        
        if (isDeleting) {
            heroTitle.textContent = current.substring(0, currentChar - 1);
            currentChar--;
        } else {
            heroTitle.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }

        // Adjust typing speed
        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && currentChar === current.length) {
            // Pause at end of word
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentTitle = (currentTitle + 1) % titles.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-lg);
        }
        
        .notification-success {
            background: #10b981;
        }
        
        .notification-error {
            background: #ef4444;
        }
        
        .notification-info {
            background: var(--primary-color);
        }
        
        .notification.show {
            transform: translateX(0);
        }
    `;
    
    if (!document.querySelector('style[data-notifications]')) {
        style.setAttribute('data-notifications', 'true');
        document.head.appendChild(style);
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Utility functions
function debounce(func, wait) {
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

// Performance optimizations
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events that don't need to run on every scroll
}, 100);

const throttledScrollHandler = throttle(function() {
    // Handle scroll events that need to run frequently but not on every scroll
}, 16); // ~60fps

// Add CSS animation classes
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .skill-progress {
        transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(animationStyles);

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://via.placeholder.com/400x400/4f46e5/ffffff?text=Your+Photo',
        'https://via.placeholder.com/600x400/4f46e5/ffffff?text=E-Commerce+Platform',
        'https://via.placeholder.com/600x400/059669/ffffff?text=Task+Management+App',
        'https://via.placeholder.com/600x400/dc2626/ffffff?text=Weather+Dashboard',
        'https://via.placeholder.com/600x400/7c3aed/ffffff?text=Social+Media+Dashboard'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Add loading state management
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Export functions for potential external use
window.portfolioJS = {
    showNotification,
    toggleTheme: window.toggleTheme,
    validateForm: function() {
        const form = document.querySelector('.contact-form');
        return form ? validateForm() : false;
    }
};