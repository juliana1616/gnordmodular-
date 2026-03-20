/**
 * Haikou Gnord Trading Co., LTD - Website JavaScript
 * Features: Hero Slider, Mobile Menu, Product Gallery, Form Validation, Google Analytics Tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initHeroSlider();
    initProductGallery();
    initContactForm();
    initSmoothScroll();
    initAnalyticsTracking();
    initScrollAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
        
        // Track menu interaction
        trackEvent('navigation', 'menu_toggle', isExpanded ? 'close' : 'open');
    });
    
    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        }
    });
}

/**
 * Hero Image Slider
 * Auto-advances every 2 seconds
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero .slide');
    const dots = document.querySelectorAll('.hero .dot');
    const prevBtn = document.querySelector('.hero .slider-btn.prev');
    const nextBtn = document.querySelector('.hero .slider-btn.next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 2000; // 2 seconds as per PRD
    
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, slideDuration);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
            trackEvent('engagement', 'slider_nav', 'next');
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
            trackEvent('engagement', 'slider_nav', 'prev');
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
            trackEvent('engagement', 'slider_dot', `slide_${index + 1}`);
        });
    });
    
    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Start auto-slide
    startAutoSlide();
}

/**
 * Product Detail Gallery
 */
function initProductGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentIndexEl = document.getElementById('currentIndex');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    let currentIndex = 0;
    const totalImages = thumbnails.length;
    
    function updateMainImage(index) {
        const thumbnail = thumbnails[index];
        if (!thumbnail) return;
        
        // Update main image
        mainImage.src = thumbnail.src.replace('w=200&h=200', 'w=800&h=600');
        mainImage.alt = thumbnail.alt.replace('Product view', 'Main product image');
        
        // Update thumbnails
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Update counter
        if (currentIndexEl) {
            currentIndexEl.textContent = index + 1;
        }
        
        currentIndex = index;
    }
    
    // Thumbnail click handlers
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            updateMainImage(index);
            trackEvent('engagement', 'gallery_thumbnail', `image_${index + 1}`);
        });
    });
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateMainImage(newIndex);
            trackEvent('engagement', 'gallery_nav', 'prev');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % totalImages;
            updateMainImage(newIndex);
            trackEvent('engagement', 'gallery_nav', 'next');
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.querySelector('.product-detail-section')) return;
        
        if (e.key === 'ArrowLeft') {
            const newIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateMainImage(newIndex);
        } else if (e.key === 'ArrowRight') {
            const newIndex = (currentIndex + 1) % totalImages;
            updateMainImage(newIndex);
        }
    });
}

/**
 * Contact Form Validation & Handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Handle compliance dropdown change
    const complianceSelect = document.getElementById('compliance');
    const otherComplianceGroup = document.getElementById('other-compliance-group');
    const otherComplianceInput = document.getElementById('other-compliance');
    
    if (complianceSelect && otherComplianceGroup) {
        complianceSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherComplianceGroup.style.display = 'block';
                otherComplianceInput.setAttribute('required', 'true');
            } else {
                otherComplianceGroup.style.display = 'none';
                otherComplianceInput.removeAttribute('required');
            }
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const userType = document.getElementById('user-type');
        const projectCity = document.getElementById('project-city');
        const compliance = document.getElementById('compliance');
        const designInquiry = document.getElementById('design-inquiry');
        const importSupport = document.getElementById('import-support');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        } else {
            clearError(name);
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(email);
        }
        
        // Validate phone (optional but if provided, should be valid)
        if (phone.value.trim()) {
            const phoneRegex = /^[0-9]{7,15}$/;
            if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            } else {
                clearError(phone);
            }
        }
        
        // Validate new required fields
        if (!userType.value) {
            showError(userType, 'Please select your type');
            isValid = false;
        } else {
            clearError(userType);
        }
        
        if (!projectCity.value.trim()) {
            showError(projectCity, 'Please enter your project city');
            isValid = false;
        } else {
            clearError(projectCity);
        }
        
        if (!compliance.value) {
            showError(compliance, 'Please select required compliance');
            isValid = false;
        } else {
            clearError(compliance);
        }
        
        // Validate other compliance if selected
        if (compliance.value === 'other' && !otherComplianceInput.value.trim()) {
            showError(otherComplianceInput, 'Please specify the certificate');
            isValid = false;
        } else {
            clearError(otherComplianceInput);
        }
        
        if (!designInquiry.value) {
            showError(designInquiry, 'Please select design inquiry type');
            isValid = false;
        } else {
            clearError(designInquiry);
        }
        
        if (!importSupport.value) {
            showError(importSupport, 'Please select import support option');
            isValid = false;
        } else {
            clearError(importSupport);
        }
        
        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else {
            clearError(message);
        }
        
        if (isValid) {
            // Get reCAPTCHA token
            grecaptcha.ready(function() {
                grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', {action: 'submit'}).then(function(token) {
                    // Track form submission
                    trackEvent('conversion', 'form_submit', 'contact_form');
                    
                    // Show success message
                    showSuccessMessage(form);
                    
                    // Here you would typically send the data to your backend
                    // For now, we'll just log it
                    console.log('Form submitted:', {
                        name: name.value,
                        email: email.value,
                        countryCode: document.getElementById('country-code').value,
                        phone: phone.value,
                        message: message.value,
                        'g-recaptcha-response': token
                    });
                    
                    // Reset form
                    form.reset();
                });
            });
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                clearError(this);
            }
        });
    });
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing error
    clearError(input);
    
    // Add error styling
    input.style.borderColor = '#e74c3c';
    
    // Create error message
    const error = document.createElement('span');
    error.className = 'error-message';
    error.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
    error.textContent = message;
    error.setAttribute('role', 'alert');
    
    formGroup.appendChild(error);
    
    // Announce error to screen readers
    input.setAttribute('aria-invalid', 'true');
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    input.style.borderColor = '';
    input.removeAttribute('aria-invalid');
    
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}

function showSuccessMessage(form) {
    // Remove existing success message
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const success = document.createElement('div');
    success.className = 'success-message';
    success.style.cssText = 'background-color: #27ae60; color: white; padding: 1rem; border-radius: 5px; margin-top: 1rem; text-align: center;';
    success.setAttribute('role', 'alert');
    success.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. We will get back to you soon.';
    
    form.appendChild(success);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        success.remove();
    }, 5000);
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerOffset = 60;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Track navigation
                trackEvent('navigation', 'smooth_scroll', href);
            }
        });
    });
}

/**
 * Google Analytics Event Tracking
 */
function initAnalyticsTracking() {
    // Track product clicks
    document.querySelectorAll('[data-track="product-click"]').forEach(el => {
        el.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            trackEvent('engagement', 'product_click', product);
        });
    });
    
    // Track social media clicks
    document.querySelectorAll('[data-track="social-click"]').forEach(el => {
        el.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            trackEvent('engagement', 'social_click', platform);
        });
    });
    
    // Track WhatsApp clicks
    document.querySelectorAll('[data-track="whatsapp-click"]').forEach(el => {
        el.addEventListener('click', function() {
            trackEvent('conversion', 'whatsapp_click', 'floating_button');
        });
    });
    
    // Track form submissions
    document.querySelectorAll('[data-track="form-submit"]').forEach(el => {
        el.addEventListener('click', function() {
            trackEvent('conversion', 'form_start', 'contact_form');
        });
    });
    
    // Track inquiry clicks
    document.querySelectorAll('[data-track="inquiry-click"]').forEach(el => {
        el.addEventListener('click', function() {
            trackEvent('conversion', 'inquiry_click', 'product_detail');
        });
    });
    
    // Track scroll depth
    trackScrollDepth();
}

/**
 * Track Event to Google Analytics
 */
function trackEvent(category, action, label = null, value = null) {
    if (typeof gtag !== 'undefined') {
        const eventData = {
            event_category: category,
            event_action: action
        };
        
        if (label) eventData.event_label = label;
        if (value) eventData.value = value;
        
        gtag('event', action, eventData);
    }
    
    // Also log to console for debugging
    console.log('Analytics Event:', { category, action, label, value });
}

/**
 * Track Scroll Depth
 */
function trackScrollDepth() {
    const milestones = [25, 50, 75, 90];
    const tracked = new Set();
    
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !tracked.has(milestone)) {
                tracked.add(milestone);
                trackEvent('engagement', 'scroll_depth', `${milestone}%`);
            }
        });
    }, 250));
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

/**
 * Debounce Utility Function
 */
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

/**
 * Lazy Load Images
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Track page load time
window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    trackEvent('performance', 'page_load_time', null, loadTime);
});
