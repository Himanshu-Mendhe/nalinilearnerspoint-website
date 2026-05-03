/* ============================================
   NALINI LEARNERS POINT – Logic & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === Mobile Menu Toggle ===
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // If this is a dropdown toggle on mobile, don't close the menu, just toggle it
                if (window.innerWidth <= 768 && link.parentElement.classList.contains('nav-item-dropdown')) {
                    e.preventDefault();
                    link.parentElement.classList.toggle('active');
                    return;
                }
                
                navLinks.classList.remove('open');
                mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('open');
                mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    // === Header Scroll Effect ===
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 0';
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.padding = '0';
            header.style.background = '#ffffff';
        }
    });

    // === Smooth Scroll for All Anchors ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === Inquiry Form Validation & Submission ===
    const inquiryForm = document.getElementById('inquiryForm');
    const formMsg = document.getElementById('formMsg');
    const submitBtn = document.getElementById('formSubmitBtn');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous messages
            formMsg.textContent = '';
            formMsg.className = 'form-message';

            // Basic Validation
            const name = document.getElementById('studentName').value.trim();
            const phone = document.getElementById('phoneNumber').value.trim();
            const studentClass = document.getElementById('studentClass').value;

            if (!name || !phone || !studentClass) {
                showFormMessage('Please fill in all required fields marked with *', 'error');
                return;
            }

            if (!/^\d{10}$/.test(phone)) {
                showFormMessage('Please enter a valid 10-digit phone number', 'error');
                return;
            }

            // Real Submission via Web3Forms
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

            const formData = new FormData(inquiryForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (response.status === 200) {
                    showFormMessage('Success! Your enquiry has been sent. Our team will contact you soon.', 'success');
                    inquiryForm.reset();
                } else {
                    console.log(result);
                    showFormMessage(result.message || 'Something went wrong. Please try again.', 'error');
                }
            } catch (err) {
                console.log(err);
                showFormMessage('Submission failed. Please check your internet or call us directly.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showFormMessage(text, type) {
        formMsg.textContent = text;
        formMsg.className = `form-message ${type}`;
        
        // Auto-hide error messages after 5 seconds, keep success messages
        if (type === 'error') {
            setTimeout(() => {
                formMsg.textContent = '';
                formMsg.className = 'form-message';
            }, 5000);
        }
    }

    // === Dropdown Navigation Settings ===
    // Dropdowns are handled via CSS :hover on desktop.
    // Ensure smooth scrolling also applies to dropdown links
    document.querySelectorAll('.dropdown-menu a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const navLinks = document.getElementById('navLinks');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });

    // === Intersection Observer for Reveal Animations ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation classes to sections and cards
    const animatedElements = document.querySelectorAll('.course-card, .comp-card, .faculty-card, .why-card, .contact-item, .inquiry-form-block');
    
    // Initial style for animation
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        revealObserver.observe(el);
    });

    // Custom CSS for observed elements
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // =============================================
    // === EXAM IMAGE MODAL ========================
    // =============================================

    // Image map: data-exam value → image filename
    const examImages = {
        tet:         'images/tet.png',
        navodaya:    'images/navodaya.png',
        nmms:        'images/nmms.png',
        homi:        'images/homi.png',
        scholarship: 'images/scholarship.png',
        yuvika:      'images/yuvika.png'
    };

    const modal        = document.getElementById('examModal');
    const modalImg     = document.getElementById('examModalImg');
    const modalSpinner = document.getElementById('examModalSpinner');
    const modalClose   = document.getElementById('examModalClose');
    const modalLeft    = document.getElementById('examModalLeft');
    const modalRight   = document.getElementById('examModalRight');
    const modalBackdrop= document.getElementById('examModalBackdrop');

    let modalIsOpen = false;

    // --- Open Modal ---
    function openModal(examKey) {
        const src = examImages[examKey];
        if (!src) return;

        // Reset image state
        modalImg.classList.remove('loaded');
        modalSpinner.classList.remove('hidden');
        modalImg.src = '';

        // Open overlay
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        modalIsOpen = true;

        // Push a history state so the browser back button can close it
        history.pushState({ modalOpen: true, examKey }, '', '');

        // Lazy-load the image
        const tempImg = new Image();
        tempImg.onload = () => {
            modalImg.src = src;
            modalImg.classList.add('loaded');
            modalSpinner.classList.add('hidden');
        };
        tempImg.onerror = () => {
            // Image not yet available — show a friendly placeholder message
            modalSpinner.classList.add('hidden');
            modalImg.src = '';
            modalImg.alt = 'Image not available yet. Please add ' + src;
            modalImg.classList.add('loaded');
        };
        tempImg.src = src;

        // Move focus to close button for accessibility
        modalClose.focus();
    }

    // --- Close Modal ---
    function closeModal(popState) {
        if (!modalIsOpen) return;
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        modalIsOpen = false;

        // Go back in history only if we triggered close ourselves (not via popstate)
        if (!popState && history.state && history.state.modalOpen) {
            history.back();
        }
    }

    // --- Wire up "Know More" buttons ---
    document.querySelectorAll('.btn-know-more').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const examKey = btn.getAttribute('data-exam');
            openModal(examKey);
        });
    });

    // --- Close button (×) ---
    if (modalClose) {
        modalClose.addEventListener('click', () => closeModal(false));
    }

    // --- Click left / right side zones ---
    if (modalLeft)  modalLeft.addEventListener('click',  () => closeModal(false));
    if (modalRight) modalRight.addEventListener('click', () => closeModal(false));

    // --- Click on backdrop (outside image) ---
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', () => closeModal(false));
    }

    // --- ESC key ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalIsOpen) {
            closeModal(false);
        }
    });

    // --- Browser back button ---
    window.addEventListener('popstate', (e) => {
        if (modalIsOpen) {
            closeModal(true); // true = already popped, don't call history.back() again
        }
    });

    // --- Achiever Star Filters ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const starCards = document.querySelectorAll('.star-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            let visibleCount = 0;

            starCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // Handle empty state
            const emptyState = document.getElementById('starsEmptyState');
            const starsWrapper = document.getElementById('starsWrapper');
            const scrollBtns = document.querySelectorAll('.stars-carousel-wrap .scroll-btn');

            if (visibleCount === 0) {
                if (emptyState) emptyState.classList.remove('hidden');
                if (starsWrapper) starsWrapper.classList.add('hidden');
                scrollBtns.forEach(btn => btn.style.display = 'none');
            } else {
                if (emptyState) emptyState.classList.add('hidden');
                if (starsWrapper) starsWrapper.classList.remove('hidden');
                scrollBtns.forEach(btn => btn.style.display = 'flex');
            }
        });
    });

    // --- Achiever Carousel Scrolling ---
    const starsContainer = document.getElementById('starsContainer');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (starsContainer && scrollLeftBtn && scrollRightBtn) {
        // Scroll amount equals one card width + gap (~280px)
        const scrollAmount = 280;

        scrollLeftBtn.addEventListener('click', () => {
            starsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            starsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

});
