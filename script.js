/* =========================================================
   SOMERSET ANIMAL INFORMATION SERVICES
   Master JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE NAVIGATION
       Supports both current and older class names
       ===================================================== */

    const navToggle =
        document.querySelector(".nav-toggle") ||
        document.querySelector(".menu-toggle");

    const mobileNav =
        document.querySelector(".mobile-nav") ||
        document.querySelector(".mobile-menu");

    if (navToggle && mobileNav) {

        navToggle.addEventListener("click", () => {

            const isOpen =
                mobileNav.classList.contains("open") ||
                mobileNav.classList.contains("active");

            mobileNav.classList.toggle("open", !isOpen);
            mobileNav.classList.toggle("active", !isOpen);

            navToggle.classList.toggle("active", !isOpen);
            navToggle.setAttribute("aria-expanded", String(!isOpen));

            document.body.classList.toggle("menu-open", !isOpen);
        });

        /* Close menu after clicking a link */

        const mobileLinks = mobileNav.querySelectorAll("a");

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {

                mobileNav.classList.remove("open");
                mobileNav.classList.remove("active");

                navToggle.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");

                document.body.classList.remove("menu-open");
            });
        });

        /* Close menu when clicking outside */

        document.addEventListener("click", event => {

            if (
                !mobileNav.contains(event.target) &&
                !navToggle.contains(event.target)
            ) {
                mobileNav.classList.remove("open");
                mobileNav.classList.remove("active");

                navToggle.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");

                document.body.classList.remove("menu-open");
            }

        });

    }


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header = document.querySelector(".site-header");

    const updateHeader = () => {

        if (!header) return;

        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".reveal, .reveal-up, .fade-in, .animate-on-scroll"
    );

    if ("IntersectionObserver" in window && revealElements.length) {

        const revealObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");
                        entry.target.classList.add("active");

                        revealObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
            element.classList.add("active");
        });

    }


    /* =====================================================
       NUMBER COUNTERS
       ===================================================== */

    const counters = document.querySelectorAll(
        "[data-counter], .counter"
    );

    const animateCounter = element => {

        if (element.dataset.counted === "true") return;

        const text = element.textContent.trim();

        const match = text.match(/([\d,]+)/);

        if (!match) return;

        const target = parseInt(
            match[1].replace(/,/g, ""),
            10
        );

        if (!Number.isFinite(target)) return;

        const prefix = text.substring(
            0,
            text.indexOf(match[1])
        );

        const suffix = text.substring(
            text.indexOf(match[1]) + match[1].length
        );

        const duration = 1200;
        const start = performance.now();

        element.dataset.counted = "true";

        const update = currentTime => {

            const progress = Math.min(
                (currentTime - start) / duration,
                1
            );

            /* Smooth ease-out */

            const eased =
                1 - Math.pow(1 - progress, 3);

            const value = Math.floor(
                target * eased
            );

            element.textContent =
                prefix +
                value.toLocaleString("en-GB") +
                suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }

        };

        requestAnimationFrame(update);
    };


    if ("IntersectionObserver" in window && counters.length) {

        const counterObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        animateCounter(entry.target);

                        counterObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    }


    /* =====================================================
       SMOOTH ANCHOR SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       HERO PARALLAX
       Lightweight and disabled for reduced motion
       ===================================================== */

    const hero =
        document.querySelector(".home-hero");

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        hero &&
        !prefersReducedMotion
    ) {

        let ticking = false;

        const updateHero = () => {

            const scrollPosition =
                window.scrollY;

            if (scrollPosition < window.innerHeight) {

                const visual =
                    hero.querySelector(
                        ".hero-panel, .hero-visual"
                    );

                if (visual) {

                    const movement =
                        Math.min(
                            scrollPosition * 0.04,
                            18
                        );

                    visual.style.transform =
                        `translateY(${movement}px)`;

                }

            }

            ticking = false;
        };

        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateHero
                    );

                    ticking = true;
                }

            },
            {
                passive: true
            }
        );

    }


    /* =====================================================
       DESTINATION CARD MOVEMENT
       Small hover enhancement
       ===================================================== */

    if (!prefersReducedMotion) {

        const destinationCards =
            document.querySelectorAll(
                ".destination-card"
            );

        destinationCards.forEach(card => {

            card.addEventListener(
                "pointermove",
                event => {

                    if (window.innerWidth < 900) {
                        return;
                    }

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const rotateX =
                        ((y / rect.height) - 0.5) * -2;

                    const rotateY =
                        ((x / rect.width) - 0.5) * 2;

                    card.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)
                         translateY(-3px)`;

                }
            );

            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.transform = "";

                }
            );

        });

    }


    /* =====================================================
       BUTTON PRESS FEEDBACK
       ===================================================== */

    document.querySelectorAll(
        ".btn, .button, .cta-button"
    ).forEach(button => {

        button.addEventListener(
            "pointerdown",
            () => {
                button.classList.add("pressed");
            }
        );

        button.addEventListener(
            "pointerup",
            () => {
                button.classList.remove("pressed");
            }
        );

        button.addEventListener(
            "pointerleave",
            () => {
                button.classList.remove("pressed");
            }
        );

    });


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const yearElements =
        document.querySelectorAll(
            "[data-current-year], .current-year"
        );

    const currentYear =
        new Date().getFullYear();

    yearElements.forEach(element => {
        element.textContent = currentYear;
    });


    /* =====================================================
       EXTERNAL LINK SECURITY
       Adds safe attributes to external new-tab links
       ===================================================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(link => {

        const rel =
            link.getAttribute("rel") || "";

        if (!rel.includes("noopener")) {
            link.setAttribute(
                "rel",
                `${rel} noopener`.trim()
            );
        }

    });


    /* =====================================================
       IMAGE LOADING
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {

        /* Don't override explicitly defined settings */

        if (!image.hasAttribute("loading")) {
            image.setAttribute(
                "loading",
                "lazy"
            );
        }

        if (!image.hasAttribute("decoding")) {
            image.setAttribute(
                "decoding",
                "async"
            );
        }

    });


    /* =====================================================
       NORMAL FORM DOUBLE-SUBMIT PROTECTION
       Does not interfere with YouForm
       ===================================================== */

    document.querySelectorAll(
        "form:not([data-no-lock])"
    ).forEach(form => {

        form.addEventListener(
            "submit",
            () => {

                const submitButton =
                    form.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );

                if (!submitButton) return;

                /* Small delay so native validation can run */

                setTimeout(() => {

                    submitButton.disabled = true;

                    submitButton.dataset.originalText =
                        submitButton.textContent;

                    if (
                        submitButton.tagName === "BUTTON"
                    ) {
                        submitButton.textContent =
                            "Sending…";
                    }

                }, 50);

            }
        );

    });


    /* =====================================================
       ESCAPE KEY
       Closes mobile navigation
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            if (!mobileNav) return;

            mobileNav.classList.remove("open");
            mobileNav.classList.remove("active");

            if (navToggle) {

                navToggle.classList.remove("active");

                navToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            document.body.classList.remove(
                "menu-open"
            );

        }
    );


    /* =====================================================
       PAGE LOAD
       ===================================================== */

    document.documentElement.classList.add(
        "js-ready"
    );


    /* =====================================================
       CONSOLE MESSAGE
       ===================================================== */

    console.log(
        "SAIS website scripts loaded successfully."
    );

});
