/* ============================================================
   MUKESH VEERAVALLI — PORTFOLIO 2025
   GSAP + Three.js + Lenis orchestration
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const isFinePointer = window.matchMedia("(pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = () => window.innerWidth > 768;

/* ------------------------------------------------------------
   1. SMOOTH SCROLL (Lenis <-> GSAP ScrollTrigger)
------------------------------------------------------------ */
let lenis = null;

function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === "undefined") return;

    lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Anchor navigation through lenis
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            e.preventDefault();
            closeMenu();
            lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        });
    });
}

/* ------------------------------------------------------------
   2. CUSTOM CURSOR
------------------------------------------------------------ */
function initCursor() {
    if (!isFinePointer) return;
    const cursor = document.getElementById("cursor");
    const dot = cursor.querySelector(".cursor-dot");
    const ring = cursor.querySelector(".cursor-ring");
    const label = document.getElementById("cursor-label");

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const dotPos = { ...pos };
    const ringPos = { ...pos };

    window.addEventListener("mousemove", (e) => {
        pos.x = e.clientX;
        pos.y = e.clientY;
    });

    gsap.ticker.add(() => {
        dotPos.x += (pos.x - dotPos.x) * 0.6;
        dotPos.y += (pos.y - dotPos.y) * 0.6;
        ringPos.x += (pos.x - ringPos.x) * 0.16;
        ringPos.y += (pos.y - ringPos.y) * 0.16;
        dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%,-50%)`;
        ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%) scale(${
            cursor.classList.contains("is-active") ? 2.6 : 1
        })`;
    });

    document.querySelectorAll("[data-cursor]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            label.textContent = el.dataset.cursor;
            cursor.classList.add("is-active");
        });
        el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });
}

/* ------------------------------------------------------------
   3. MAGNETIC ELEMENTS
------------------------------------------------------------ */
function initMagnetic() {
    if (!isFinePointer || prefersReducedMotion) return;
    document.querySelectorAll(".magnetic").forEach((el) => {
        const strength = 0.35;
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
        });
        el.addEventListener("mouseleave", () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        });
    });
}

/* ------------------------------------------------------------
   4. SPLIT-INTO-LINES helper
------------------------------------------------------------ */
function splitLines(el) {
    const html = el.innerHTML;
    // Wrap by explicit visual segments: split on sentences kept simple —
    // wrap whole content; browsers keep <em> intact by splitting nodes.
    const nodes = Array.from(el.childNodes);
    el.innerHTML = "";
    nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent.split(/\n/).forEach((txt) => {
                const t = txt.trim();
                if (!t) return;
                const line = document.createElement("span");
                line.className = "line";
                const inner = document.createElement("span");
                inner.className = "line-inner";
                inner.textContent = t;
                line.appendChild(inner);
                el.appendChild(line);
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const line = document.createElement("span");
            line.className = "line";
            const inner = document.createElement("span");
            inner.className = "line-inner";
            inner.appendChild(node.cloneNode(true));
            line.appendChild(inner);
            el.appendChild(line);
        }
    });
    return el.querySelectorAll(".line-inner");
}

/* ------------------------------------------------------------
   5. THREE.JS — 3D HERO SCENE
------------------------------------------------------------ */
function initWebGL() {
    if (typeof THREE === "undefined" || prefersReducedMotion) return;

    const canvas = document.getElementById("webgl");
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0908, 0.06);

    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    // --- Central wireframe icosahedron ---
    const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(4.2, 1),
        new THREE.MeshBasicMaterial({ color: 0xf5a623, wireframe: true, transparent: true, opacity: 0.28 })
    );
    scene.add(ico);

    // --- Inner rotating torus knot ---
    const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(2.2, 0.5, 110, 14),
        new THREE.MeshBasicMaterial({ color: 0xf3ede3, wireframe: true, transparent: true, opacity: 0.07 })
    );
    knot.position.set(0, 0, -2);
    scene.add(knot);

    // --- Ambient particle field ---
    const COUNT = isDesktop() ? 900 : 350;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 34;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
        particleGeo,
        new THREE.PointsMaterial({
            color: 0xf3ede3, size: 0.045, transparent: true, opacity: 0.5,
            sizeAttenuation: true, depthWrite: false,
        })
    );
    scene.add(particles);

    // --- Honey glow orbs ---
    const orbGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xf5a623 });
    const orbs = [];
    for (let i = 0; i < 14; i++) {
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
            (Math.random() - 0.5) * 26,
            (Math.random() - 0.5) * 14,
            (Math.random() - 0.5) * 12 - 2
        );
        orb.userData.speed = 0.2 + Math.random() * 0.6;
        orb.userData.offset = Math.random() * Math.PI * 2;
        scene.add(orb);
        orbs.push(orb);
    }

    // --- Mouse parallax ---
    const mouse = { x: 0, y: 0 };
    if (isFinePointer) {
        window.addEventListener("mousemove", (e) => {
            mouse.x = (e.clientX / innerWidth) * 2 - 1;
            mouse.y = (e.clientY / innerHeight) * 2 - 1;
        });
    }

    // --- Scroll response: hero content drives camera drift ---
    let scrollProgress = 0;
    ScrollTrigger.create({
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => { scrollProgress = self.progress; },
    });

    const clock = new THREE.Clock();

    function animate() {
        const t = clock.getElapsedTime();

        ico.rotation.x = t * 0.18 + mouse.y * 0.25;
        ico.rotation.y = t * 0.22 + mouse.x * 0.35;
        knot.rotation.x = -t * 0.14;
        knot.rotation.y = t * 0.2;
        particles.rotation.y = t * 0.02 + scrollProgress * 0.9;

        orbs.forEach((orb) => {
            orb.position.y += Math.sin(t * orb.userData.speed + orb.userData.offset) * 0.004;
        });

        camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.04;
        camera.position.y += (-mouse.y * 0.9 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        // Drift back on scroll
        ico.position.y = scrollProgress * 5;
        particles.position.y = scrollProgress * 3;
        knot.position.y = scrollProgress * 4;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
}

/* ------------------------------------------------------------
   6. HERO INTRO TIMELINE
------------------------------------------------------------ */
function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".hero-word", { y: 0, duration: 1.3, stagger: 0.12 })
      .from(".hero-topline span", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.8")
      .from(".hero-portrait", { y: 60, opacity: 0, duration: 1.1 }, "-=0.9")
      .from(".hero-tagline", { y: 30, opacity: 0, duration: 0.9 }, "-=0.8")
      .from(".hero-actions .btn", { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
      .from(".hero-scrollhint", { opacity: 0, duration: 0.8 }, "-=0.4");

    return tl;
}

/* ------------------------------------------------------------
   7. SCROLL-DRIVEN MARQUEES
------------------------------------------------------------ */
function initMarquees() {
    document.querySelectorAll(".marquee").forEach((marquee, i) => {
        const track = marquee.querySelector(".marquee-track");
        const dir = i % 2 === 0 ? -1 : 1;

        // Continuous base motion
        gsap.to(track, {
            xPercent: dir * -25,
            repeat: -1,
            duration: 18,
            ease: "none",
        });

        // Velocity boost with scroll
        ScrollTrigger.create({
            trigger: marquee,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                gsap.to(track, {
                    xPercent: dir * (-25 - Math.min(Math.abs(self.getVelocity() / 300), 20)),
                    duration: 0.6,
                    overwrite: true,
                });
                gsap.to(track, { xPercent: dir * -25, duration: 2.2, delay: 0.35, ease: "power2.out", overwrite: false });
            },
        });
    });
}

/* ------------------------------------------------------------
   8. GENERIC SCROLL REVEALS
------------------------------------------------------------ */
function initReveals() {
    // data-reveal elements
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
        });
    });

    // Section heads slide in
    gsap.utils.toArray(".section-head").forEach((el) => {
        gsap.from(el.children, {
            x: -30,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
        });
    });

    // Line-masked headlines
    gsap.utils.toArray(".split-lines").forEach((el) => {
        const inners = splitLines(el);
        gsap.to(inners, {
            y: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
        });
    });

    // Hero parallax exit
    gsap.to(".hero-inner", {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
    });
}

/* ------------------------------------------------------------
   9. STAT COUNTERS
------------------------------------------------------------ */
function initCounters() {
    document.querySelectorAll(".stat-num").forEach((num) => {
        const target = +num.dataset.count;
        ScrollTrigger.create({
            trigger: num,
            start: "top 88%",
            once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 2,
                    ease: "power3.out",
                    onUpdate: function () { num.textContent = Math.round(this.targets()[0].val); },
                });
            },
        });
    });
}

/* ------------------------------------------------------------
   10. PINNED HORIZONTAL PROJECTS GALLERY
------------------------------------------------------------ */
function initProjectsPin() {
    const pin = document.getElementById("projects-pin");
    const track = document.getElementById("projects-track");
    if (!pin || !track) return;

    if (!isDesktop()) return; // mobile: native vertical/horizontal flow

    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${getScrollAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
        },
    });

    // Subtle skew on scroll velocity for extra drama
    ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${getScrollAmount()}`,
        onUpdate: (self) => {
            const v = self.getVelocity();
            gsap.to(track, { skewX: gsap.utils.clamp(-6, 6, v / -400), duration: 0.5, overwrite: "auto" });
        },
    });
}

/* ------------------------------------------------------------
   11. PORTRAIT 3D TILT
------------------------------------------------------------ */
function initTilt() {
    if (!isFinePointer || prefersReducedMotion) return;
    const el = document.querySelector("[data-tilt]");
    if (!el) return;
    el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(el, { rotationY: x * 22, rotationX: -y * 22, duration: 0.5, ease: "power2.out", transformPerspective: 700 });
    });
    el.addEventListener("mouseleave", () => {
        gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
    });
}

/* ------------------------------------------------------------
   12. NAV — hide on scroll down + mobile menu
------------------------------------------------------------ */
const header = document.getElementById("site-header");
const mobileMenu = document.getElementById("mobile-menu");
const navToggle = document.getElementById("nav-toggle");
let lastScroll = 0;

function initNav() {
    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        if (y > 120 && y > lastScroll && !mobileMenu.classList.contains("is-open")) {
            header.classList.add("is-hidden");
        } else {
            header.classList.remove("is-hidden");
        }
        lastScroll = y;
    }, { passive: true });

    navToggle.addEventListener("click", () => {
        const open = mobileMenu.classList.contains("is-open");
        if (open) { closeMenu(); } else { openMenu(); }
    });
}

function openMenu() {
    mobileMenu.classList.add("is-open");
    navToggle.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    if (lenis) lenis.stop();
}
function closeMenu() {
    mobileMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (lenis) lenis.start();
}

/* ------------------------------------------------------------
   13. CONTACT FORM (mailto handoff)
------------------------------------------------------------ */
function initForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("reason").value.trim();

        if (!email || !subject || !message) {
            status.textContent = "Please fill in all fields.";
            return;
        }

        status.textContent = "Opening your mail client…";
        const mailto = `mailto:veeravallimukesh2006@gmail.com?subject=${encodeURIComponent(
            `[Portfolio] ${subject}`
        )}&body=${encodeURIComponent(`${message}\n\n— sent from ${email}`)}`;
        window.location.href = mailto;

        setTimeout(() => { status.textContent = "Thanks for reaching out — I'll reply soon!"; }, 1200);
        form.reset();
    });
}

/* ------------------------------------------------------------
   14. FOOTER LIVE CLOCK
------------------------------------------------------------ */
function initClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    const tick = () => {
        el.textContent = new Date().toLocaleTimeString("en-IN", { hour12: false });
    };
    tick();
    setInterval(tick, 1000);
}

/* ------------------------------------------------------------
   15. PRELOADER + BOOT
------------------------------------------------------------ */
function boot() {
    document.body.classList.add("is-loading");

    const count = document.getElementById("preloader-count");
    const barFill = document.getElementById("preloader-bar-fill");
    const words = gsap.utils.toArray(".preloader-word");

    const progress = { val: 0 };

    const master = gsap.timeline();

    // Word reveal
    master.to(words, { y: 0, duration: 1, stagger: 0.12, ease: "power4.out" });

    // Count 0 -> 100
    master.to(progress, {
        val: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: () => {
            count.textContent = Math.round(progress.val);
            barFill.style.width = progress.val + "%";
        },
    }, "-=0.4");

    master.to(words, { y: "-110%", duration: 0.7, stagger: 0.06, ease: "power3.in" }, "+=0.15");
    master.to("#preloader", {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
            document.getElementById("preloader").style.display = "none";
            document.body.classList.remove("is-loading");
            ScrollTrigger.refresh();
        },
    }, "-=0.25");

    // Start hero intro as the curtain lifts
    master.add(heroIntro(), "-=0.55");
}

/* ------------------------------------------------------------
   INIT ALL
------------------------------------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
    initSmoothScroll();
    initWebGL();
    initCursor();
    initMagnetic();
    initNav();
    initTilt();
    initMarquees();
    initReveals();
    initCounters();
    initProjectsPin();
    initForm();
    initClock();
    boot();
});

window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
});



