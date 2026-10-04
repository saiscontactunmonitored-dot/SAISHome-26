/* =========================================================
   SOMERSET ANIMAL INFORMATION SERVICES
   MASTER SCRIPT — 2026/2027

   Handles:
   - Mobile navigation
   - Header scroll state
   - Scroll reveals
   - Statistics counters
   - Smooth anchor scrolling
   - Hero movement
   - Destination card movement
   - Button interaction
   - Current year
   - Image performance
   - Accessibility
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       BASIC SETTINGS
       ===================================================== */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       MOBILE NAVIGATION
       Supports:
       .menu-toggle
       .nav-toggle
       .mobile-menu
       .mobile-nav
       ===================================================== */

    const menuToggle = document.querySelector(
        ".menu-toggle, .nav-toggle"
    );

    const mobileMenu = document.querySelector(
        ".mobile-menu, .mobile-nav"
    );

    const mobileLinks = document.querySelectorAll(
        ".mobile-link, .mobile-directory, .mobile-nav a, .mobile-menu a"
    );


    if (menuToggle && mobileMenu) {

        const openMenu = () => {

            menuToggle.classList.add("active");

            mobileMenu.classList.add("active");

            mobileMenu.classList.add("open");

            document.body.classList.add("menu-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "true"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Close menu"
            );
        };


        const closeMenu = () => {

            menuToggle.classList.remove("active");

            mobileMenu.classList.remove("active");

            mobileMenu.classList.remove("open");

            document.body.classList.remove("menu-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );
        };


        const toggleMenu = () => {

            const isOpen =
                mobileMenu.classList.contains("active") ||
                mobileMenu.classList.contains("open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        };


        menuToggle.addEventListener(
            "click",
            toggleMenu
        );


        mobileLinks.forEach(link => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {
                    closeMenu();
                }

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth > 1100) {
                    closeMenu();
                }

            }
        );


        /*
         * Make sure the button starts in the correct
         * accessibility state.
         */

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Open menu"
        );
    }


    /* =====================================================
       HEADER SCROLL EFFECT
       ===================================================== */

    const header = document.querySelector(
        ".site-header"
    );


    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 20) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        };


        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true
            }
        );


        updateHeader();
    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (revealElements.length) {

        if (
            "IntersectionObserver" in window &&
            !reducedMotion
        ) {

            const revealObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            entry => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    entry.target.classList.add(
                                        "visible"
                                    );

                                    observer.unobserve(
                                        entry.target
                                    );
                                }

                            }
                        );

                    },
                    {
                        threshold: 0.12,

                        rootMargin:
                            "0px 0px -50px 0px"
                    }
                );


            revealElements.forEach(
                element => {

                    revealObserver.observe(
                        element
                    );

                }
            );

        } else {

            revealElements.forEach(
                element => {

                    element.classList.add(
                        "visible"
                    );

                }
            );
        }
    }


    /* =====================================================
       NUMBER COUNTERS
       ===================================================== */

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    const animateCounter = element => {

        const target = Number(
            element.getAttribute(
                "data-counter"
            )
        );


        if (!Number.isFinite(target)) {
            return;
        }


        /*
         * If reduced motion is enabled,
         * show the final number immediately.
         */

        if (reducedMotion) {

            element.textContent =
                target.toLocaleString("en-GB");

            return;
        }


        const duration = 1500;

        const startTime =
            performance.now();


        const updateCounter = currentTime => {

            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Ease-out animation.
             */

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            const currentValue =
                Math.floor(
                    target *
                    easedProgress
                );


            element.textContent =
                currentValue.toLocaleString(
                    "en-GB"
                );


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                element.textContent =
                    target.toLocaleString(
                        "en-GB"
                    );
            }
        };


        requestAnimationFrame(
            updateCounter
        );
    };


    if (counters.length) {

        if (
            "IntersectionObserver" in window &&
            !reducedMotion
        ) {

            const counterObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach(
                            entry => {

                                if (
                                    entry.isIntersecting
                                ) {

                                    const element =
                                        entry.target;


                                    if (
                                        element.dataset
                                            .counterAnimated
                                            !== "true"
                                    ) {

                                        element.dataset
                                            .counterAnimated =
                                            "true";


                                        animateCounter(
                                            element
                                        );
                                    }


                                    observer.unobserve(
                                        element
                                    );
                                }

                            }
                        );

                    },
                    {
                        threshold: 0.5
                    }
                );


            counters.forEach(
                counter => {

                    counterObserver.observe(
                        counter
                    );

                }
            );

        } else {

            counters.forEach(
                counter => {

                    animateCounter(
                        counter
                    );

                }
            );
        }
    }


    /* =====================================================
       SMOOTH ANCHOR SCROLLING
       ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const header =
                    document.querySelector(
                        ".site-header"
                    );


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;


                const targetPosition =
                    target.getBoundingClientRect()
                        .top
                    +
                    window.scrollY
                    -
                    headerHeight
                    -
                    20;


                window.scrollTo({
                    top: targetPosition,

                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth"
                });

            }
        );

    });


    /* =====================================================
       HERO PARALLAX
       Desktop only
       ===================================================== */

    const heroVisual =
        document.querySelector(
            ".hero-visual"
        );


    if (
        heroVisual &&
        !reducedMotion &&
        window.innerWidth > 900
    ) {

        let ticking = false;


        const updateParallax = () => {

            const scrollPosition =
                window.scrollY;


            if (
                scrollPosition <
                window.innerHeight
            ) {

                const movement =
                    scrollPosition *
                    0.08;


                heroVisual.style.transform =
                    `translateY(${movement}px)`;
            }


            ticking = false;
        };


        window.addEventListener(
            "scroll",
            () => {

                if (!ticking) {

                    window.requestAnimationFrame(
                        updateParallax
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
       Desktop only
       ===================================================== */

    const destinationCards =
        document.querySelectorAll(
            ".destination-card"
        );


    if (
        destinationCards.length &&
        !reducedMotion &&
        window.innerWidth > 900
    ) {

        destinationCards.forEach(
            card => {

                card.addEventListener(
                    "pointermove",
                    event => {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        const rotateY =
                            (
                                (x / rect.width) -
                                0.5
                            ) *
                            3;


                        const rotateX =
                            (
                                (y / rect.height) -
                                0.5
                            ) *
                            -3;


                        card.style.transform =
                            `
                            translateY(-8px)
                            rotateX(${rotateX}deg)
                            rotateY(${rotateY}deg)
                            `;
                    }
                );


                card.addEventListener(
                    "pointerleave",
                    () => {

                        card.style.transform =
                            "";
                    }
                );

            }
        );
    }


    /* =====================================================
       BUTTON PRESS FEEDBACK
       ===================================================== */

    document.querySelectorAll(
        ".button"
    ).forEach(button => {

        button.addEventListener(
            "pointerdown",
            () => {

                button.classList.add(
                    "pressed"
                );

            }
        );


        button.addEventListener(
            "pointerup",
            () => {

                button.classList.remove(
                    "pressed"
                );

            }
        );


        button.addEventListener(
            "pointerleave",
            () => {

                button.classList.remove(
                    "pressed"
                );

            }
        );

    });


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const currentYear =
        new Date().getFullYear();


    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(element => {

        element.textContent =
            currentYear;

    });


    document.querySelectorAll(
        "#currentYear"
    ).forEach(element => {

        element.textContent =
            currentYear;

    });


    /* =====================================================
       IMAGE PERFORMANCE
       ===================================================== */

    document.querySelectorAll(
        "img"
    ).forEach(image => {

        /*
         * Don't overwrite explicitly defined
         * loading/decoding behaviour.
         */

        if (
            !image.hasAttribute(
                "loading"
            )
        ) {

            image.setAttribute(
                "loading",
                "lazy"
            );
        }


        if (
            !image.hasAttribute(
                "decoding"
            )
        ) {

            image.setAttribute(
                "decoding",
                "async"
            );
        }

    });


    /* =====================================================
       EXTERNAL LINKS
       Make sure external links opened in new tabs
       do not create opener security issues.
       ===================================================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(link => {

        const rel =
            link.getAttribute("rel") || "";


        if (
            !rel.includes("noopener")
        ) {

            link.setAttribute(
                "rel",
                `${rel} noopener`.trim()
            );
        }

    });


    /* =====================================================
       PREVENT DOUBLE FORM SUBMISSION
       Only applies to normal HTML forms.
       Does not interfere with YouForm iframe.
       ===================================================== */

    document.querySelectorAll(
        "form"
    ).forEach(form => {

        form.addEventListener(
            "submit",
            () => {

                const submitButtons =
                    form.querySelectorAll(
                        'button[type="submit"], input[type="submit"]'
                    );


                submitButtons.forEach(
                    button => {

                        button.disabled =
                            true;

                    }
                );

            }
        );

    });


    /* =====================================================
       SAFER MOBILE MENU LINK HANDLING
       Close menu when a normal navigation link is used.
       ===================================================== */

    if (mobileMenu) {

        mobileMenu.querySelectorAll(
            "a"
        ).forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    if (menuToggle) {

                        menuToggle.classList.remove(
                            "active"
                        );

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        menuToggle.setAttribute(
                            "aria-label",
                            "Open menu"
                        );
                    }


                    mobileMenu.classList.remove(
                        "active"
                    );

                    mobileMenu.classList.remove(
                        "open"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );

                }
            );

        });
    }


    /* =====================================================
       DEBUG / DEVELOPMENT MESSAGE
       ===================================================== */

    console.log(
        "%cSAIS",
        "font-size:28px;font-weight:900;color:#003888;"
    );

    console.log(
        "%cSomerset Animal Information Services",
        "font-size:13px;font-weight:700;color:#344054;"
    );

    console.log(
        "%cSAIS site scripts loaded successfully.",
        "font-size:12px;color:#003888;"
    );

});
