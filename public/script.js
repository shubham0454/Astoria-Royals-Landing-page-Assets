// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
});

// Circular navigation item interactions
document.querySelectorAll('.nav-item, .nav-card').forEach(item => {
    item.addEventListener('click', function () {
        const text = this.querySelector('span').textContent.toLowerCase();
        const targetSection = document.querySelector(`#${text}`) ||
            document.querySelector('.key-distances-section');
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Simple validation
    if (!name || !email || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'SUBMITTING...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Thank you for your interest! We will contact you soon.');
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Accordion auto-close others when one opens
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function () {
        const accordion = this.closest('.accordion');
        const allButtons = accordion.querySelectorAll('.accordion-button');

        allButtons.forEach(btn => {
            if (btn !== this && !btn.classList.contains('collapsed')) {
                btn.click();
            }
        });
    });
});

// Intersection Observer for animations
const styleObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const styleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, styleObserverOptions);

// Observe elements for animation
document.querySelectorAll('.section-title, .section-text, .nav-card, .accordion-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    styleObserver.observe(el);
});

// Auto-play carousel
const carousel = document.querySelector('#luxuryCarousel');
if (carousel) {
    const bsCarousel = new bootstrap.Carousel(carousel, {
        interval: 4000,
        wrap: true
    });
}

// Mobile menu close on link click
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(el => {
    el.textContent = currentYear;
});

// Preloader (optional)
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Touch gestures for mobile carousel
let startX = 0;
let endX = 0;

document.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    endX = e.changedTouches[0].screenX;
    handleGesture();
});

function handleGesture() {
    const carousel = document.querySelector('#luxuryCarousel');
    if (!carousel) return;

    const bsCarousel = bootstrap.Carousel.getInstance(carousel);
    if (!bsCarousel) return;

    if (endX < startX - 50) {
        bsCarousel.next();
    }
    if (endX > startX + 50) {
        bsCarousel.prev();
    }
}

const carouselSlider = new Swiper(".carousel-slider", {
    grabCursor: true,
    watchSlidesProgress: true,
    loop: true,
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 20,
    initialSlide: 0,
    on: {
        progress(e) {
            // e is Swiper instance
            console.log("e", e);
            const t = e.slides.length;
            for (let r = 0; r < e.slides.length; r += 1) {
                const o = e.slides[r],
                    s = e.slides[r].progress,
                    i = Math.abs(s);
                let n = 1;
                i > 1 && (n = 0.3 * (i - 1) + 1);
                const l = o.querySelectorAll(".item-content"),
                    a = s * n * 50 + "%",
                    c = 1 - 0.2 * i,
                    d = t - Math.abs(Math.round(s));
                (o.style.transform = `translateX(${a}) scale(${c})`),
                    (o.style.zIndex = d.toString()),
                    (o.style.opacity = (i > 3 ? 0 : 1).toString()),
                    l.forEach((e) => {
            /** @type {HTMLElement} */ (e).style.opacity = (1 - i / 3).toString();
                    });
            }
        },
        setTransition(e, t) {
            for (let r = 0; r < e.slides.length; r += 1) {
                const o = e.slides[r],
                    s = o.querySelectorAll(".item-content");
                (o.style.transitionDuration = `${t}ms`),
                    s.forEach((e) => {
            /** @type {HTMLElement} */ (e).style.transitionDuration = `${t}ms`;
                    });
            }
        }
    }
});


document.getElementById('leadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const alertContainer = document.getElementById('alertContainer');

    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Submitting...';
    loadingSpinner.style.display = 'inline-block';

    // Clear previous alerts
    alertContainer.innerHTML = '';

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        // Validate required fields
        if (!data.firstName || !data.mobile || !data.email) {
            throw new Error('Please fill in all required fields');
        }

        // Trim whitespace from all fields
        data.firstName = (data.firstName || '').trim();
        data.mobile = (data.mobile || '').trim();
        data.email = (data.email || '').trim();

        // Re-check after trimming
        if (!data.firstName || !data.mobile || !data.email) {
            throw new Error('Please fill in all required fields');
        }

        // Validate mobile number (10 digits)
        const mobileNumber = (data.mobile || '').replace(/\D/g, '');
        if (!/^\d{10}$/.test(mobileNumber)) {
            throw new Error('Please enter a valid 10-digit mobile number');
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            throw new Error('Please enter a valid email address');
        }

        // Prepare data for MDoc API
        const mdocData = {
            DataFrom: "T",
            ApiKey: "a28cc43c-526d-4010-970e-0d0e92c18902",
            EnquiryDate: new Date().toISOString().split('T')[0],
            FirstName: data.firstName,
            MobileNo: mobileNumber,
            Email: data.email.toLowerCase(),
            Source: "Digitals",
            SourceDetail: "WebSite",
            Remark: data.remarks || "Website enquiry for Astoria Royals"
        };

        console.log('Submitting data:', mdocData); // Debug log

        // Submit to MDoc API with proper error handling
        const mdocResponse = await fetch('https://nirman.maksoftbox.com/MDocBoxAPI/MdocAddEnquiryORTeleCalling', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: new URLSearchParams(mdocData).toString()
        });

        // Check if the response is ok
        if (!mdocResponse.ok) {
            throw new Error(`HTTP error! status: ${mdocResponse.status}`);
        }

        // First, let's see the raw response
        const responseText = await mdocResponse.text();
        console.log('Raw API Response:', responseText);
        
        let mdocResult;
        try {
            mdocResult = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            throw new Error('Invalid response from server. Please try again.');
        }
        
        console.log('Parsed API Response:', mdocResult);
        console.log('Response type:', typeof mdocResult);
        console.log('Response keys:', Object.keys(mdocResult));

        // Check for successful response - be more flexible
        const isSuccess = 
            mdocResult.code === 200 || 
            mdocResult.code === "200" ||
            mdocResult.status === 'success' || 
            mdocResult.success === true ||
            mdocResult.Success === true ||
            mdocResult.result === 'success' ||
            (mdocResult.message && mdocResult.message.toLowerCase().includes('success')) ||
            (mdocResult.Message && mdocResult.Message.toLowerCase().includes('success'));

        console.log('Is Success:', isSuccess);

        if (isSuccess) {
            // Success - also save to backup database
            try {
                await saveToBackupDatabase(data);
            } catch (backupError) {
                console.warn('Backup failed but main submission succeeded:', backupError);
            }

            showAlert('success', 'Thank you! Your enquiry has been submitted successfully. Our team will contact you soon.');
            this.reset();
        } else {
            // Handle MDoc API errors
            let errorMessage = 'Something went wrong. Please try again.';
            
            // Check different possible error message formats
            const apiMessage = mdocResult.message || mdocResult.Message || mdocResult.error || mdocResult.Error || mdocResult.msg;
            
            console.log('API Error Message:', apiMessage);
            
            if (apiMessage) {
                // Handle specific error cases
                if (apiMessage.toLowerCase().includes('mobile') || apiMessage.toLowerCase().includes('phone')) {
                    errorMessage = 'This mobile number is already registered. Please use a different number.';
                } else if (apiMessage.toLowerCase().includes('email')) {
                    errorMessage = 'This email is already registered. Please use a different email.';
                } else if (apiMessage.toLowerCase().includes('failed')) {
                    // Check the status message for more details
                    const statusMessage = mdocResult.status || '';
                    if (statusMessage.toLowerCase().includes('mobile')) {
                        errorMessage = 'This mobile number is already registered. Please use a different number.';
                    } else if (statusMessage.toLowerCase().includes('email')) {
                        errorMessage = 'This email is already registered. Please use a different email.';
                    } else {
                        errorMessage = statusMessage || 'Registration failed. Please try again.';
                    }
                } else {
                    errorMessage = apiMessage;
                }
            }
            
            // If we still don't have a good error message, show the full response for debugging
            if (errorMessage === 'Something went wrong. Please try again.') {
                console.error('Unhandled API response format:', mdocResult);
                errorMessage = `API Error: ${JSON.stringify(mdocResult)}`;
            }
            
            throw new Error(errorMessage);
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        
        // Handle different types of errors
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage = 'Server error. Please try again in a moment.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showAlert('error', errorMessage);
    } finally {
        // Reset loading state
        submitBtn.disabled = false;
        submitText.textContent = 'KNOW MORE';
        loadingSpinner.style.display = 'none';
    }
});

// Save to backup database function
async function saveToBackupDatabase(data) {
    try {
        const backupData = {
            ...data,
            timestamp: new Date().toISOString(),
            source: 'website',
            project: 'Astoria Royals'
        };

        // This would be your backend API endpoint
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backupData)
        });

        if (!response.ok) {
            console.warn('Failed to save to backup database');
        }
    } catch (error) {
        console.warn('Backup database error:', error);
        // Don't throw error here as main submission was successful
    }
}

// Show alert function with improved styling and debug mode
function showAlert(type, message) {
    const alertContainer = document.getElementById('alertContainer');
    const alertDiv = document.createElement('div');
    
    // Add Bootstrap alert classes
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    alertContainer.appendChild(alertDiv);

    // Auto-hide after 8 seconds (longer for debug messages)
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 8000);
}

// Debug function to test API response format
window.debugApiResponse = function() {
    console.log('Testing API with dummy data...');
    
    const testData = {
        DataFrom: "T",
        ApiKey: "a28cc43c-526d-4010-970e-0d0e92c18902",
        EnquiryDate: new Date().toISOString().split('T')[0],
        FirstName: "Test User",
        MobileNo: "9999999999",
        Email: "test@example.com",
        Source: "Digitals",
        SourceDetail: "WebSite",
        Remark: "Debug test"
    };
    
    fetch('https://nirman.maksoftbox.com/MDocBoxAPI/MdocAddEnquiryORTeleCalling', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams(testData).toString()
    })
    .then(response => response.text())
    .then(text => {
        console.log('Debug API Response (raw):', text);
        try {
            const parsed = JSON.parse(text);
            console.log('Debug API Response (parsed):', parsed);
        } catch (e) {
            console.log('Response is not valid JSON');
        }
    })
    .catch(error => {
        console.error('Debug API Error:', error);
    });
};

// Smooth scrolling for navigation
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

// Form validation on input - Mobile number formatting
const mobileInput = document.getElementById('mobile');
if (mobileInput) {
    mobileInput.addEventListener('input', function (e) {
        // Remove all non-digit characters
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;

        // Limit to 10 digits
        if (value.length > 10) {
            e.target.value = value.slice(0, 10);
        }
        
        // Remove any validation errors when user starts typing
        e.target.classList.remove('is-invalid');
    });
}

// Real-time email validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', function (e) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (e.target.value && !emailPattern.test(e.target.value)) {
            e.target.classList.add('is-invalid');
        } else {
            e.target.classList.remove('is-invalid');
        }
    });
}

// Real-time name validation
const firstNameInput = document.getElementById('firstName');
if (firstNameInput) {
    firstNameInput.addEventListener('input', function (e) {
        e.target.classList.remove('is-invalid');
    });
}

// Animation on scroll
const classObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const classObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, classObserverOptions);

// Observe elements for animation
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    classObserver.observe(el);
});