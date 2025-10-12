// Smooth scrolling for anchor links
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Highlight active navigation link on scroll
const sectionIds = ['hero', 'pain-points', 'solucoes', 'beneficios', 'casos', 'cta-section', 'contato']; // Add all your section IDs here
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let currentActive = 'hero';
    for (let i = 0; i < sectionIds.length; i++) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
            const rect = section.getBoundingClientRect();
            // Adjust this offset based on your header height or preferred active area
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentActive = sectionIds[i];
                break;
            }
        }
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentActive) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinksMobile = document.querySelector('.nav-links'); // Renamed to avoid conflict

mobileMenuToggle?.addEventListener('click', () => {
    navLinksMobile.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.querySelectorAll('.pain-card, .solution-card, .benefit-card, .case-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success message
    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Mensagem Enviada! ✓';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        contactForm.reset();
    }, 3000);
});

// Parallax effect for floating cards
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        const speed = (index + 1) * 0.1;
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

