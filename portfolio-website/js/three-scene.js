/* ============================================================
   three-scene.js — 3D particle field + floating geometry hero
   Rendered behind the whole page. Gracefully skips on failure.
   ============================================================ */
(function () {
    "use strict";

    var canvas = document.getElementById("bg3d");
    if (!canvas || typeof THREE === "undefined") return;

    try {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            60, window.innerWidth / window.innerHeight, 0.1, 100
        );
        camera.position.set(0, 2.2, 14);

        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        var mouse = { x: 0, y: 0 };
        var target = { x: 0, y: 0 };

        /* ----- Particle wave (points) ----- */
        var cols = 90, rows = 50, sep = 0.55;
        var positions = new Float32Array(cols * rows * 3);
        var i = 0;
        for (var x = 0; x < cols; x++) {
            for (var y = 0; y < rows; y++) {
                positions[i] = x * sep - (cols * sep) / 2;      // x
                positions[i + 1] = 0;                            // y (animated)
                positions[i + 2] = y * sep - (rows * sep) / 2;   // z
                i += 3;
            }
        }
        var waveGeo = new THREE.BufferGeometry();
        waveGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        var waveMat = new THREE.PointsMaterial({
            color: 0x22d3ee,
            size: 0.045,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        var wave = new THREE.Points(waveGeo, waveMat);
        wave.position.y = -3.5;
        scene.add(wave);

        /* ----- Second particle layer (purple, drifting) ----- */
        var dustCount = 500;
        var dustPos = new Float32Array(dustCount * 3);
        for (var d = 0; d < dustCount; d++) {
            dustPos[d * 3] = (Math.random() - 0.5) * 40;
            dustPos[d * 3 + 1] = (Math.random() - 0.5) * 24;
            dustPos[d * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
        }
        var dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
        var dustMat = new THREE.PointsMaterial({
            color: 0x8b5cf6,
            size: 0.06,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        var dust = new THREE.Points(dustGeo, dustMat);
        scene.add(dust);

        /* ----- Wireframe shapes ----- */
        var shapes = [];
        var torus = new THREE.Mesh(
            new THREE.TorusGeometry(1.6, 0.04, 12, 60),
            new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.35, wireframe: true })
        );
        torus.position.set(-7, 3.5, -6);
        scene.add(torus);
        shapes.push(torus);

        var ico = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.1, 0),
            new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.35, wireframe: true })
        );
        ico.position.set(7.5, 4, -5);
        scene.add(ico);
        shapes.push(ico);

        var octa = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.8, 0),
            new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.3, wireframe: true })
        );
        octa.position.set(5, -2.5, -3);
        scene.add(octa);
        shapes.push(octa);

        /* ----- Interaction ----- */
        window.addEventListener("mousemove", function (e) {
            target.x = (e.clientX / window.innerWidth) * 2 - 1;
            target.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener("resize", function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        /* ----- Animate ----- */
        var clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            var t = clock.getElapsedTime();

            mouse.x += (target.x - mouse.x) * 0.04;
            mouse.y += (target.y - mouse.y) * 0.04;

            // Wave surface
            var pos = waveGeo.attributes.position;
            for (var j = 0; j < pos.count; j++) {
                var px = pos.getX(j);
                var pz = pos.getZ(j);
                pos.setY(j, Math.sin(px * 0.5 + t) * 0.35 + Math.cos(pz * 0.4 + t * 0.8) * 0.35);
            }
            pos.needsUpdate = true;

            dust.rotation.y = t * 0.02;
            dust.position.x = mouse.x * 1.2;

            shapes.forEach(function (s, idx) {
                s.rotation.x = t * (0.15 + idx * 0.06);
                s.rotation.y = t * (0.2 + idx * 0.05);
                s.position.y += Math.sin(t + idx) * 0.002;
            });

            camera.position.x = mouse.x * 1.6;
            camera.position.y = 2.2 + mouse.y * 0.8;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }
        animate();
    } catch (err) {
        // 3D is decorative — never let it break the page
        if (canvas) canvas.style.display = "none";
        console.warn("3D scene disabled:", err);
    }
})();
