/* ============================================================
   MUKESH VEERAVALLI — PORTFOLIO
   GSAP + ScrollTrigger + Lenis orchestration
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(pointer: fine)").matches;
let lenis = null;

/* ------------------------------------------------------------
   1. SMOOTH SCROLL (Lenis <-> GSAP ScrollTrigger)
------------------------------------------------------------ */
function initSmoothScroll() {
    if (prefersReduced || typeof Lenis === "undefined") return;

    lenis = new Lenis({
        duration: 1.7,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.7,
        touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.tick.add((time) => lenis.raf(time * 1000));
    gsap.tick.lagSmoothing(0);
    lenis.stop(); // paused until the intro loading completes

    // smooth anchor navigation
    document.querySelectorAll(".header ul a").forEach((link) => {
        link.addEventListener("click", (e) => {
            if (window.innerWidth > 768 && lenis) {
                const target = document.querySelector(link.getAttribute("data-href"));
                if (target) {
                    e.preventDefault();
                    lenis.scrollTo(target, { offset: 0, duration: 1.5 });
                }
            }
        });
    });

    // nav fade on scroll
    lenis.on("scroll", () => {
        const navFade = document.getElementById("navFade");
        if (navFade) navFade.classList.toggle("is-visible", window.scrollY > 60);
    });
}

/* ------------------------------------------------------------
   2. LOADING SCREEN
------------------------------------------------------------ */
function initLoader() {
    const screenEl = document.getElementById("loadingScreen");
    const wrapEl = document.getElementById("loadingWrap");
    const btnEl = document.getElementById("loadingButton");
    const percentEl = document.getElementById("loadingPercent");
    if (!screenEl || !wrapEl) return;

    document.body.classList.add("is-loading");

    // mouse-follow glow on the pill button
    wrapEl.addEventListener("mousemove", (e) => {
        const rect = wrapEl.getBoundingClientRect();
        wrapEl.style.setProperty("--mouse-x", e.clientX - rect.left + "px");
        wrapEl.style.setProperty("--mouse-y", e.clientY - rect.top + "px");
    });

    let n = 0;
    let timer = null;
    const render = () => { if (percentEl) percentEl.textContent = n + "%"; };

    const finishLoading = () => {
        btnEl.classList.add("is-complete");
        setTimeout(() => {
            wrapEl.classList.add("is-clicked");
            setTimeout(() => {
                screenEl.classList.add("is-done");
                const headerEl = document.getElementById("loadingHeader");
                if (headerEl) headerEl.style.display = "none";
                document.body.classList.remove("is-loading");
                if (lenis) lenis.start();
                startHero();
                ScrollTrigger.refresh();
                setTimeout(() => ScrollTrigger.refresh(), 600);
            }, 1250);
        }, 700);
    };

    const slowCount = () => {
        n = Math.min(100, n + 1);
        render();
        if (n < 100) timer = setTimeout(slowCount, prefersReduced ? 1 : 26);
        else finishLoading();
    };

    const fastCount = () => {
        if (n < 55) {
            n = Math.min(55, n + Math.round(6 * Math.random()));
            render();
            timer = setTimeout(fastCount, 95);
        } else {
            timer = setTimeout(slowCount, 450);
        }
    };

    timer = setTimeout(fastCount, 250);

    // safety fallback: never let the loader hang forever
    setTimeout(() => {
        if (!btnEl.classList.contains("is-complete")) {
            n = 100;
            render();
            finishLoading();
        }
    }, 15000);
}
/* ------------------------------------------------------------
   3. HERO INTRO (name reveal after loading)
------------------------------------------------------------ */
function startHero() {
    if (prefersReduced) {
        gsap.set(".name-in", { y: 0 });
        return;
    }
    gsap.to(".name-in", {
        y: "0%",
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.15,
    });
    gsap.fromTo(
        ".landing-intro h2, .landing-info h3, .landing-info h2",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.3 }
    );
    gsap.fromTo(
        "#characterModel",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", delay: 0.3 }
    );
}

/* ------------------------------------------------------------
   4. CUSTOM CURSOR
------------------------------------------------------------ */
function initCursor() {
    if (!isFinePointer) return;
    const cursor = document.getElementById("cursor");
    if (!cursor) return;

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
    });

    document.querySelectorAll("[data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            if (el.dataset.cursor === "disable") cursor.classList.add("is-disabled");
            else cursor.classList.add("is-active");
        });
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("is-disabled", "is-active");
        });
    });
}

/* ------------------------------------------------------------
   5. TEXT SPLIT + SCROLL REVEALS (About)
------------------------------------------------------------ */
function splitIntoWords(el) {
    const text = el.textContent.trim();
    el.textContent = "";
    text.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) { el.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement("span");
        w.className = "split-word";
        w.textContent = part;
        el.appendChild(w);
    });
}

function splitIntoChars(el) {
    const text = el.textContent;
    el.textContent = "";
    Array.from(text).forEach((ch) => {
        if (ch === " ") { el.appendChild(document.createTextNode(" ")); return; }
        const c = document.createElement("span");
        c.className = "split-char";
        c.textContent = ch;
        el.appendChild(c);
    });
}

function initReveals() {
    if (prefersReduced) return;

    document.querySelectorAll(".para").forEach((el) => {
        if (window.innerWidth <= 768) return;
        splitIntoWords(el);
        const trigger = el.closest(".about-me") || el;
        gsap.fromTo(
            el.querySelectorAll(".split-word"),
            { autoAlpha: 0, y: 60 },
            {
                autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.02,
                scrollTrigger: { trigger, start: "top 78%", toggleActions: "play none none reverse" },
            }
        );
    });

    document.querySelectorAll(".title").forEach((el) => {
        if (window.innerWidth <= 768) return;
        splitIntoChars(el);
        const trigger = el.closest(".about-me") || el;
        gsap.fromTo(
            el.querySelectorAll(".split-char"),
            { autoAlpha: 0, y: 50, rotate: 10 },
            {
                autoAlpha: 1, y: 0, rotate: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.035,
                scrollTrigger: { trigger, start: "top 85%", toggleActions: "play none none reverse" },
            }
        );
    });
}
/* ------------------------------------------------------------
   6. CAREER TIMELINE
------------------------------------------------------------ */
function initCareer() {
    if (prefersReduced) return;

    gsap.fromTo(
        ".career-timeline",
        { maxHeight: "0%" },
        {
            maxHeight: "100%",
            ease: "none",
            scrollTrigger: {
                trigger: ".career-section",
                start: "top 70%",
                end: "bottom 40%",
                scrub: 1,
            },
        }
    );

    gsap.fromTo(
        ".career-info-box",
        { opacity: 0, y: 60 },
        {
            opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
            scrollTrigger: {
                trigger: ".career-section",
                start: "top 78%",
                toggleActions: "play none none reverse",
            },
        }
    );
}

/* ------------------------------------------------------------
   7. WORK — pinned horizontal scroll (desktop)
------------------------------------------------------------ */
function initWork() {
    if (window.innerWidth <= 1025 || prefersReduced) return;
    const track = document.getElementById("workTrack");
    if (!track) return;

    const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth);

    gsap.to(track, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
            trigger: ".work-section",
            start: "top top",
            end: () => "+=" + (getDist() + 150),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        },
    });
}

/* ------------------------------------------------------------
   8. WHAT I DO — tap toggle on touch devices
------------------------------------------------------------ */
function initWhatIDO() {
    if (!("ontouchstart" in window)) return;
    document.querySelectorAll(".what-noTouch").forEach((el) => {
        el.addEventListener("click", () => {
            el.classList.toggle("what-content-active");
            el.classList.remove("what-sibling");
            Array.from(el.parentElement.children).forEach((sibling) => {
                if (sibling !== el) {
                    sibling.classList.remove("what-content-active");
                    sibling.classList.toggle("what-sibling");
                }
            });
        });
    });
}

/* ------------------------------------------------------------
   9. FOOTER YEAR
------------------------------------------------------------ */
function initFooter() {
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------
   INIT
------------------------------------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initCursor();
    initLoader();
    initWhatIDO();
    initCareer();
    initWork();
    initReveals();
    initFooter();
});

window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});