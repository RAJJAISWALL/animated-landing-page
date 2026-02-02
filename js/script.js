// Animation Observer Setup
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

// Intersection Observer for scroll animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
        }
    });
}, observerOptions);

// Hero Section Animations
function animateHeroSection() {
    // Background circles fan out from right
    const heroShapes = document.querySelectorAll('.hero-bg-shapes img');

    heroShapes.forEach((shape, index) => {
        setTimeout(() => {
            shape.style.transition =
                'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease';

            shape.style.opacity = '1';
            shape.style.transform = 'translateX(0) scale(1)';
        }, index * 180);
    });

    window.addEventListener('load', animateHeroSection);

    // Illustration cards burst
    const illustrationCards = document.querySelectorAll('.hero-illustration .illustration-card');

    setTimeout(() => {
        illustrationCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) rotate(0deg) scale(1)';
                card.style.transition =
                    'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease';


                setTimeout(() => {
                    card.classList.add('floating');
                }, 600);
            }, index * 200);
        });
    }, 800);
}


// Benefits Section - Staggered Fade Reveal
function setupBenefitsAnimation() {
    const benefitCards = document.querySelectorAll('.benefit-card');

    const benefitsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal');
                }, index * 150);
            }
        });
    }, observerOptions);

    benefitCards.forEach(card => {
        benefitsObserver.observe(card);
    });
}

// Why Section Animations
function setupWhyAnimation() {
    const whySection = document.querySelector('.why-section');
    const whyLine = document.querySelector('.why-bg-line');
    const whyCircle = document.querySelector('.why-bg-circle');
    const whyRectangle = document.querySelector('.why-bg-rectangle');
    const whyEllipse = document.querySelector('.why-bg-ellipse');
    const whyCards = document.querySelectorAll('.why-illustration-card');
    const whyContent = document.querySelector('.why-content');
    const whyFeatures = document.querySelectorAll('.why-feature');

    const whyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Background line draw effect
                if (whyRectangle) {
                    setTimeout(() => {
                        whyRectangle.style.opacity = '1';
                        whyRectangle.style.transform = 'scale(1)';
                    }, 200);
                }

                if (whyEllipse) {
                    setTimeout(() => {
                        whyEllipse.style.opacity = '1';
                        whyEllipse.style.transform = 'scale(1)';
                    }, 400);
                }
                // Draw background line
                if (whyLine) {
                    setTimeout(() => {
                        whyLine.classList.add('draw');
                    }, 100);
                }

                // Grow background circle
                if (whyCircle) {
                    setTimeout(() => {
                        whyCircle.style.opacity = '1';
                        whyCircle.classList.add('grow');
                    }, 300);
                }



                // Illustration cards burst
                setTimeout(() => {
                    whyCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                            setTimeout(() => {
                                card.classList.add('floating');
                            }, 600);
                        }, index * 200);
                    });
                }, 600);

                // Content and features staggered reveal
                setTimeout(() => {
                    if (whyContent) {
                        whyContent.classList.add('reveal');
                    }

                    whyFeatures.forEach((feature, index) => {
                        setTimeout(() => {
                            feature.classList.add('reveal');
                        }, index * 150);
                    });
                }, 1200);

                whyObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (whySection) {
        whyObserver.observe(whySection);
    }
}

// Signup Section Animation
function setupSignupAnimation() {
    const signupContainer = document.querySelector('.signup-container');
    const signupTriangle = document.querySelector('.signup-triangle');

    const signupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in container
                entry.target.classList.add('reveal');

                // Triangle slide in
                if (signupTriangle) {
                    setTimeout(() => {
                        signupTriangle.style.transform = 'translateY(-50%) translateX(0)';
                        signupTriangle.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }, 300);
                }

                signupObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (signupContainer) {
        signupObserver.observe(signupContainer);
    }
}

// Form Validation and Submission
function setupFormHandling() {
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');

    // Real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
    emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    phoneInput.addEventListener('blur', () => validateField(phoneInput, 'phone'));

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isPhoneValid = validateField(phoneInput, 'phone');

        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            return;
        }

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Prepare form data
        const formData = new FormData(form);

        try {
            const response = await fetch('process_signup.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                successMessage.textContent = result.message;
                successMessage.classList.add('show');

                // Reset form
                form.reset();

                // Add celebration animation
                celebrateSuccess();

                // Hide success message after 10 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 10000);
            } else {
                // Show error
                alert(result.message);
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
            console.error('Error:', error);
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Get My Coupon';
        }
    });
}

// Field Validation
function validateField(input, type) {
    const errorElement = input.nextElementSibling;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    input.classList.remove('error');
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.classList.remove('show');
    }

    const value = input.value.trim();

    switch (type) {
        case 'name':
            if (value === '') {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'phone':
            if (value !== '') {
                const phoneRegex = /^[0-9+\-\s()]{10,20}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
            }
            break;
    }

    if (!isValid) {
        input.classList.add('error');
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }

    return isValid;
}

// Success Celebration Animation
function celebrateSuccess() {
    // Create confetti effect
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        createConfetti(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';

    document.body.appendChild(confetti);

    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => {
        confetti.remove();
    };
}

// Smooth Scroll for Navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    if (menuToggle && navLinks) {
        // Toggle menu when clicking hamburger button
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            overlay.classList.toggle('active', isActive);
            
            // Change icon from hamburger to X
            menuToggle.innerHTML = isActive ? '✕' : '☰';
        });
        
        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
                menuToggle.innerHTML = '☰';
            });
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.innerHTML = '☰';
        });
    }
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }

        lastScroll = currentScroll;
    });
}

// Initialize all animations and functionality
document.addEventListener('DOMContentLoaded', () => {
    // Trigger hero animations on load
    setTimeout(() => {
        animateHeroSection();
    }, 300);

    // Setup scroll-triggered animations
    setupBenefitsAnimation();
    setupWhyAnimation();
    setupSignupAnimation();

    // Setup form handling
    setupFormHandling();

    // Setup smooth scroll
    setupSmoothScroll();

    // Setup navbar effects
    setupNavbarScroll();
    
    // Setup mobile menu
    setupMobileMenu();
});
window.addEventListener('load', () => {
    animateHeroSection();
});

