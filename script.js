/* =========================================================
   SOMERSET ANIMAL INFORMATION SERVICES
   SAIS — MAIN WEBSITE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. PAGE LOADER
       ===================================================== */

    const loader = document.querySelector(".site-loader");

    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.style.pointerEvents = "none";
            }, 1200);
        });
    }


    /* =====================================================
       02. ANNOUNCEMENT BAR
       ===================================================== */

    const announcementClose = document.querySelector(".announcement-close");
    const announcementBar = document.querySelector(".announcement-bar");

    if (announcementClose && announcementBar) {

        announcementClose.addEventListener("click", () => {
            announcementBar.style.display = "none";

            try {
                sessionStorage.setItem(
                    "saisAnnouncementClosed",
                    "true"
                );
            } catch (error) {
                /* Storage unavailable — continue normally */
            }
        });

        try {
            if (
                sessionStorage.getItem("saisAnnouncementClosed") === "true"
            ) {
                announcementBar.style.display = "none";
            }
        } catch (error) {
            /* Storage unavailable — continue normally */
        }
    }


    /* =====================================================
       03. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-directory");

    if (menuToggle && mobileMenu) {

        const openMenu = () => {
            menuToggle.classList.add("active");
            mobileMenu.classList.add("active");
            document.body.classList.add("menu-open");

            menuToggle.setAttribute("aria-expanded", "true");
        };

        const closeMenu = () => {
            menuToggle.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.classList.remove("menu-open");

            menuToggle.setAttribute("aria-expanded", "false");
        };

        menuToggle.addEventListener("click", () => {

            if (mobileMenu.classList.contains("active")) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

        window.addEventListener("resize", () => {

            if (window.innerWidth > 1050) {
                closeMenu();
            }

        });
    }


    /* =====================================================
       04. SCROLL REVEAL
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       05. ANIMATED STAT COUNTERS
       ===================================================== */

    const counters = document.querySelectorAll("[data-counter]");

    const animateCounter = element => {

        const target = Number(
            element.getAttribute("data-counter")
        );

        if (!Number.isFinite(target)) {
            return;
        }

        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = currentTime => {

            const elapsed = currentTime - startTime;
            const progress = Math.min(
                elapsed / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(
                target * easedProgress
            );

            element.textContent =
                currentValue.toLocaleString("en-GB");

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent =
                    target.toLocaleString("en-GB");
            }
        };

        requestAnimationFrame(updateCounter);
    };


    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        if (
                            entry.target.dataset.counterAnimated !== "true"
                        ) {

                            entry.target.dataset.counterAnimated =
                                "true";

                            animateCounter(entry.target);
                        }

                        observer.unobserve(entry.target);
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

    } else {

        counters.forEach(counter => {
            animateCounter(counter);
        });

    }


    /* =====================================================
       06. SMOOTH INTERNAL LINKS
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header ? header.offsetHeight : 0;

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
       07. HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
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
       08. HERO PARALLAX
       ===================================================== */

    const heroVisual =
        document.querySelector(".hero-visual");

    const heroOrbit =
        document.querySelector(".hero-orbit");

    const heroGlow =
        document.querySelector(".hero-glow");

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (
        heroVisual &&
        !reducedMotion &&
        window.innerWidth > 900
    ) {

        let ticking = false;

        const updateParallax = () => {

            const scrollPosition =
                window.scrollY;

            if (scrollPosition < window.innerHeight) {

                const movement =
                    scrollPosition * 0.08;

                heroVisual.style.transform =
                    `translateY(${movement}px)`;

                if (heroOrbit) {
                    heroOrbit.style.transform =
                        `translateY(${movement * -0.3}px)`;
                }

                if (heroGlow) {
                    heroGlow.style.transform =
                        `translateY(${movement * -0.5}px)`;
                }
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
       09. BUTTON RIPPLE / PRESS FEEDBACK
       ===================================================== */

    document.querySelectorAll(".button").forEach(button => {

        button.addEventListener("pointerdown", () => {
            button.classList.add("pressed");
        });

        button.addEventListener("pointerup", () => {
            button.classList.remove("pressed");
        });

        button.addEventListener("pointerleave", () => {
            button.classList.remove("pressed");
        });

    });


    /* =====================================================
       10. DESTINATION CARD TILT
       ===================================================== */

    const destinationCards =
        document.querySelectorAll(".destination-card");

    if (
        !reducedMotion &&
        window.innerWidth > 900
    ) {

        destinationCards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const rotateY =
                    ((x / rect.width) - 0.5) * 3;

                const rotateX =
                    ((y / rect.height) - 0.5) * -3;

                card.style.transform =
                    `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            });

            card.addEventListener("pointerleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* =====================================================
       11. POPUP
       ===================================================== */

    const popupOverlay =
        document.querySelector(".popup-overlay");

    const popupClose =
        document.querySelector(".popup-close");

    const popupTriggers =
        document.querySelectorAll("[data-popup-open]");

    const popupStorageKey =
        "saisPopupShown";

    const openPopup = () => {

        if (!popupOverlay) {
            return;
        }

        popupOverlay.classList.add("active");

        document.body.classList.add("menu-open");

        popupOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        try {
            sessionStorage.setItem(
                popupStorageKey,
                "true"
            );
        } catch (error) {
            /* Storage unavailable */
        }
    };

    const closePopup = () => {

        if (!popupOverlay) {
            return;
        }

        popupOverlay.classList.remove("active");

        document.body.classList.remove("menu-open");

        popupOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    };

    if (popupOverlay) {

        popupTriggers.forEach(trigger => {

            trigger.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    openPopup();

                }
            );

        });

        if (popupClose) {

            popupClose.addEventListener(
                "click",
                closePopup
            );

        }

        popupOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target === popupOverlay
                ) {
                    closePopup();
                }

            }
        );

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    popupOverlay.classList.contains("active")
                ) {
                    closePopup();
                }

            }
        );


        /* -----------------------------------------------
           Delayed popup
           ----------------------------------------------- */

        let popupAlreadyShown = false;

        try {
            popupAlreadyShown =
                sessionStorage.getItem(
                    popupStorageKey
                ) === "true";
        } catch (error) {
            popupAlreadyShown = false;
        }

        if (!popupAlreadyShown) {

            setTimeout(() => {

                if (
                    document.visibilityState === "visible"
                ) {
                    openPopup();
                }

            }, 18000);
        }
    }


    /* =====================================================
       12. EXTERNAL LINK SAFETY
       ===================================================== */

    document.querySelectorAll("a").forEach(link => {

        const href =
            link.getAttribute("href");

        if (
            href &&
            href.startsWith("http") &&
            !href.includes(
                window.location.hostname
            )
        ) {

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );

        }

    });


    /* =====================================================
       13. CURRENT YEAR
       ===================================================== */

    document.querySelectorAll(
        "[data-current-year]"
    ).forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       14. IMAGE LAZY LOADING
       ===================================================== */

    document.querySelectorAll("img").forEach(
        image => {

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

        }
    );


    /* =====================================================
       15. CONSOLE BRAND MESSAGE
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
        "%cBuilt for animals, people and local businesses.",
        "font-size:11px;color:#667085;"
    );

});
