// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to load HTML content into a placeholder
    const loadHTML = async (url, elementId) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.text();
            const placeholder = document.getElementById(elementId);
            if (placeholder) {
                placeholder.innerHTML = data;

                // Re-initialize any scripts or event listeners specific to the loaded content
                if (elementId === 'header-placeholder') {
                    initializeHeaderScripts();
                } else if (elementId === 'footer-placeholder') {
                    // Update current year in footer after it's loaded
                    const currentYearSpan = document.getElementById('currentYear');
                    if (currentYearSpan) {
                        currentYearSpan.textContent = new Date().getFullYear();
                    }
                }
            } else {
                console.error(`Placeholder element with ID '${elementId}' not found.`);
            }
        } catch (error) {
            console.error(`Error loading HTML from ${url}:`, error);
        }
    };

    // Load the header when the DOM is fully loaded
    loadHTML('header.html', 'header-placeholder');
    // Load the footer when the DOM is fully loaded
    loadHTML('footer.html', 'footer-placeholder');

    // Function to initialize header-specific scripts (like hamburger menu)
    // This needs to be called after the header content is loaded
    function initializeHeaderScripts() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('is-active'); // For animated hamburger icon
            });

            // Close mobile menu when a link is clicked
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        hamburger.classList.remove('is-active');
                    }
                });
            });
        }

        // Optional: Add a "sticky" class to header on scroll for visual change
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) { // Adjust scroll threshold as needed
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        // Smooth scrolling for navigation links (assuming these links are in the header)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // --- Scroll-triggered animations ---
    // Ensure elements with 'animate-on-scroll' class are present in your HTML
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: Stop observing after animation
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // FAQ Accordion functionality (if this script is used on faq.html)
    // It's recommended to include this directly in faq.html or ensure it runs after FAQ content is present.
    // If you plan to dynamically load FAQ content as well, this logic needs adjustment.
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionContent = button.nextElementSibling;

            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                accordionContent.style.maxHeight = 0;
            }

            // Close other open accordions
            document.querySelectorAll('.accordion-header').forEach(otherButton => {
                if (otherButton !== button && otherButton.classList.contains('active')) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });
});
