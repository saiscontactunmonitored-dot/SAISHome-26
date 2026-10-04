/* =========================================================
   SOMERSET ANIMAL INFORMATION SERVICES
   SAIS — MAIN WEBSITE SCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (menuToggle && mobileNav) {

        const openMenu = () => {

            menuToggle.classList.add("open");
            mobileNav.classList.add("open");

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

            menuToggle.classList.remove("open");
            mobileNav.classList.remove("open");

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


        menuToggle.addEventListener("click", () => {

            if (mobileNav.classList.contains("open")) {

                closeMenu();

            } else {

                openMenu();

            }

        });


        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMenu);

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
       HEADER SCROLL EFFECT
       ===================================================== */

    const header = document.querySelector(".site-header");

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
            { passive: true }
        );

        updateHeader();

    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("visible");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add("visible");

        });

    }


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    document
        .querySelectorAll("[data-current-year], #currentYear")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });


    /* =====================================================
       IMAGE LOADING
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {

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
       BUTTON PRESS
       ===================================================== */

    document.querySelectorAll(".button").forEach(button => {

        button.addEventListener(
            "pointerdown",
            () => button.classList.add("pressed")
        );

        button.addEventListener(
            "pointerup",
            () => button.classList.remove("pressed")
        );

        button.addEventListener(
            "pointerleave",
            () => button.classList.remove("pressed")
        );

    });

});
