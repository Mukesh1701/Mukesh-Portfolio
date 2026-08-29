/* ============================================================
   main.js — preloader, cursor, smooth scroll, GSAP animations,
   typewriter, navbar, card tilt & spotlight
   ============================================================ */
(function () {
    "use strict";

    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Smooth scroll (Lenis) ---------- */
    var lenis = null;
    if (typeof Lenis !== "undefined") {
        lenis = new Lenis({ duration: 1.15, smoothWheel: true });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        // Make anchor links work with Lenis
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener("click", function (e) {
                var id = a.getAttribute("href");
                if (id.length > 1 && document.querySelector(id)) {
                    e.preventDefault();
                    lenis.scrollTo(id, { offset: -70 });
                    closeMenu();
                }
            });
        });
    }

    /* ---------- Preloader ---------- */
    var preloader = document.getElementById("preloader");
    var fill = document.getElementById("preloaderFill");
    var count = document.getElementById("preloaderCount");
    var progress = 0;

    var timer = setInterval(function () {
        progress = Math.min(progress + Math.random() * 14, 100);
        if (fill) fill.style.width = progress + "%";
        if (count) count.textContent = Math.floor(progress) + "%";
        if (progress >= 100) {
            clearInterval(timer);
            setTimeout(doneLoading, 350);
        }
    }, 120);

    function doneLoading() {
        if (!preloader || preloader.classList.contains("is-done")) return;
        preloader.classList.add("is-done");
        document.body.classList.remove("is-loading");
        playIntro();
    }
    window.addEventListener("load", function () { setTimeout(doneLoading, 2200); });

    /* ---------- Hero intro ---------- */
    function playIntro() {
        gsap.to(".hero-name .line-in", {
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: "power4.out",
            delay: 0.15
        });
        gsap.from(".navbar", {
            y: -60,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.3
        });
    }

    /* ---------- Custom cursor ---------- */
    var dot = document.getElementById("cursorDot");
    var ring = document.getElementById("cursorRing");
    if (dot && ring && window.matchMedia("(hover: hover)").matches) {
        var mx = -100, my = -100, rx = -100, ry = -100;
        window.addEventListener("mousemove", function (e) {
            mx = e.clientX;
            my = e.clientY;
            dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
        });
        (function loop() {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
            requestAnimationFrame(loop);
        })();
        document.querySelectorAll("a, button, [data-cursor]").forEach(function (el) {
            el.addEventListener("mouseenter", function () { ring.classList.add("is-hover"); });
            el.addEventListener("mouseleave", function () { ring.classList.remove("is-hover"); });
        });
    }

    /* ---------- Navbar ---------- */
    var navbar = document.getElementById("navbar");
    var burger = document.getElementById("navBurger");
    var navLinks = document.getElementById("navLinks");

    window.closeMenu = function () {
        if (burger && navLinks) {
            burger.classList.remove("is-open");
            navLinks.classList.remove("is-open");
        }
    };
    if (burger) {
        burger.addEventListener("click", function () {
            burger.classList.toggle("is-open");
            navLinks.classList.toggle("is-open");
        });
    }
    window.addEventListener("scroll", function () {
        navbar.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });

    /* ---------- Typewriter ---------- */
    var roles = ["AI-powered apps.", "web experiences.", "ML models.", "mobile apps.", "clean UIs."];
    var typedEl = document.getElementById("typedText");
    if (typedEl) {
        var ri = 0, ci = 0, deleting = false;
        (function type() {
            var word = roles[ri];
            typedEl.textContent = word.substring(0, ci);
            var delay = deleting ? 45 : 85;
            if (!deleting && ci === word.length) { delay = 1600; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }
            else ci += deleting ? -1 : 1;
            setTimeout(type, delay);
        })();
    }

    /* ---------- Scroll reveals ---------- */
    document.querySelectorAll(".reveal").forEach(function (el) {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" }
        });
    });

    /* ---------- Card tilt + spotlight ---------- */
    document.querySelectorAll("[data-tilt], .project-card").forEach(function (card) {
        card.addEventListener("mousemove", function (e) {
            var r = card.getBoundingClientRect();
            var x = e.clientX - r.left;
            var y = e.clientY - r.top;
            card.style.setProperty("--mx", x + "px");
            card.style.setProperty("--my", y + "px");
            if (card.hasAttribute("data-tilt")) {
                var rX = ((y / r.height) - 0.5) * -8;
                var rY = ((x / r.width) - 0.5) * 8;
                card.style.transform = "perspective(900px) rotateX(" + rX + "deg) rotateY(" + rY + "deg)";
            }
        });
        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });

    /* ---------- Footer year ---------- */
    var year = document.getElementById("footerYear");
    if (year) year.textContent = new Date().getFullYear();
})();

