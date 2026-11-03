/* global React */
// DeepSeek Harness plugin: 3D Landmarks
// Registers a left-sidebar entry (sidebar.panellist) and a full main panel (main).

(function () {
  'use strict';

  const PANEL_ID = 'dsh-3d-landmarks';
  const PANEL_LABEL = '3D Landmarks';

  // ---------- tiny icon ----------
  function LandmarksIcon() {
    return React.createElement(
      'svg',
      {
        width: 20,
        height: 20,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true'
      },
      React.createElement('path', { d: 'M3 21h18' }),
      React.createElement('path', { d: 'M5 21V10l7-5 7 5v11' }),
      React.createElement('path', { d: 'M9 21v-6h6v6' }),
      React.createElement('path', { d: 'M12 5v3' })
    );
  }

  // ---------- load Three.js once ----------
  let threePromise = null;
  function loadThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (threePromise) return threePromise;
    threePromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
      s.async = true;
      s.onload = () => resolve(window.THREE);
      s.onerror = () => reject(new Error('Failed to load Three.js'));
      document.head.appendChild(s);
    });
    return threePromise;
  }

  // ---------- model builders ----------
  function buildEiffelTower(THREE) {
    const g = new THREE.Group();
    const brown = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.7 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.8 });

    // four legs (tapered boxes)
    const legPositions = [
      [0.9, 0.9],
      [-0.9, 0.9],
      [0.9, -0.9],
      [-0.9, -0.9]
    ];
    for (const [x, z] of legPositions) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.32, 4, 4), brown);
      leg.position.set(x * 1.1, 2, z * 1.1);
      leg.rotation.y = Math.PI / 4;
      g.add(leg);
    }

    // lower platform
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 3.2), dark);
    p1.position.y = 4;
    g.add(p1);

    // mid section
    const mid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.9, 3.2, 4), brown);
    mid.position.y = 5.6;
    mid.rotation.y = Math.PI / 4;
    g.add(mid);

    // upper platform
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 1.8), dark);
    p2.position.y = 7.2;
    g.add(p2);

    // top spire
    const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 2.2, 4), brown);
    spire.position.y = 8.5;
    spire.rotation.y = Math.PI / 4;
    g.add(spire);

    g.position.y = -0.5;
    g.scale.set(1.2, 1.2, 1.2);
    return g;
  }

  function buildGreatWall(THREE) {
    const g = new THREE.Group();
    const stone = new THREE.MeshStandardMaterial({ color: 0x9a8c7a, roughness: 0.9 });
    const darkStone = new THREE.MeshStandardMaterial({ color: 0x6e6258, roughness: 0.9 });

    // winding wall segments
    const points = [
      [-6, 0.3, -2], [-3, 0.6, 0], [0, 0.9, 1.5], [3, 0.6, 0], [6, 0.3, -2]
    ];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const dx = b[0] - a[0];
      const dz = b[2] - a[2];
      const len = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, len), stone);
      wall.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.55, (a[2] + b[2]) / 2);
      wall.rotation.y = angle;
      g.add(wall);
    }

    // watchtowers
    for (const p of points) {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.9, 1.7), darkStone);
      tower.position.set(p[0], p[1] + 0.95, p[2]);
      g.add(tower);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.9, 4), darkStone);
      roof.position.set(p[0], p[1] + 2.35, p[2]);
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
    }

    g.position.y = -0.8;
    return g;
  }

  function buildForbiddenCity(THREE) {
    const g = new THREE.Group();
    const red = new THREE.MeshStandardMaterial({ color: 0xa62a2a, roughness: 0.75 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.5 });
    const darkGold = new THREE.MeshStandardMaterial({ color: 0xb8860b, roughness: 0.6 });

    // outer wall
    const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 1.4, 7), red);
    wall.position.y = 0.7;
    g.add(wall);

    // three main halls
    const halls = [
      { x: 0, z: 0, w: 3.2, d: 2.0, h: 1.8 },
      { x: 0, z: -2.2, w: 2.4, d: 1.6, h: 1.4 },
      { x: 0, z: 2.2, w: 2.4, d: 1.6, h: 1.4 }
    ];
    for (const h of halls) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(h.w, h.h, h.d), red);
      base.position.set(h.x, 1.4 + h.h / 2, h.z);
      g.add(base);

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(Math.max(h.w, h.d) * 0.78, 0.9, 4),
        gold
      );
      roof.position.set(h.x, 1.4 + h.h + 0.45, h.z);
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
    }

    // courtyard tiles
    const court = new THREE.Mesh(new THREE.BoxGeometry(7, 0.08, 5.5), darkGold);
    court.position.y = 1.45;
    g.add(court);

    // corner pavilions
    for (const [x, z] of [[-3.5, -2.5], [3.5, -2.5], [-3.5, 2.5], [3.5, 2.5]]) {
      const pav = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 1.2), red);
      pav.position.set(x, 1.4 + 0.55, z);
      g.add(pav);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.7, 4), gold);
      roof.position.set(x, 1.4 + 1.1 + 0.35, z);
      roof.rotation.y = Math.PI / 4;
      g.add(roof);
    }

    g.position.y = -1.0;
    return g;
  }

  function buildColosseum(THREE) {
    const g = new THREE.Group();
    const travertine = new THREE.MeshStandardMaterial({ color: 0xc2b280, roughness: 0.85 });
    const darkStone = new THREE.MeshStandardMaterial({ color: 0x8a7d5c, roughness: 0.9 });

    const radiiX = 5.2;
    const radiiZ = 3.6;
    const levels = 3;
    const archesPerLevel = 12;

    for (let level = 0; level < levels; level++) {
      const y = 0.6 + level * 1.2;
      for (let i = 0; i < archesPerLevel; i++) {
        const angle = (i / archesPerLevel) * Math.PI * 2;
        const x = Math.cos(angle) * radiiX;
        const z = Math.sin(angle) * radiiZ;

        // pillar
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 0.42), travertine);
        pillar.position.set(x, y, z);
        pillar.rotation.y = -angle;
        g.add(pillar);

        // arch opening (dark inset)
        const arch = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.12), darkStone);
        arch.position.set(x * 0.98, y + 0.05, z * 0.98);
        arch.rotation.y = -angle;
        g.add(arch);
      }

      // horizontal band
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(radiiX + 0.12, radiiX + 0.12, 0.12, 32, 1, true),
        travertine
      );
      band.scale.z = radiiZ / radiiX;
      band.position.y = y + 0.6;
      g.add(band);
    }

    // partial upper wall (ruined look)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * radiiX;
      const z = Math.sin(angle) * radiiZ;
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.0, 0.5), travertine);
      block.position.set(x, 4.2, z);
      block.rotation.y = -angle;
      g.add(block);
    }

    // arena floor
    const arena = new THREE.Mesh(
      new THREE.CylinderGeometry(radiiX - 0.9, radiiX - 0.9, 0.1, 32),
      darkStone
    );
    arena.scale.z = (radiiZ - 0.9) / (radiiX - 0.9);
    arena.position.y = 0.05;
    g.add(arena);

    g.position.y = -0.4;
    return g;
  }

  // ---------- main viewer component ----------
  const LANDMARKS = [
    { id: 'eiffel', label: 'Eiffel Tower — Paris', build: buildEiffelTower },
    { id: 'great-wall', label: 'Great Wall — China', build: buildGreatWall },
    { id: 'forbidden-city', label: 'Forbidden City — Beijing', build: buildForbiddenCity },
    { id: 'colosseum', label: 'Colosseum — Rome', build: buildColosseum }
  ];

  function LandmarksPanel() {
    const containerRef = React.useRef(null);
    const rendererRef = React.useRef(null);
    const sceneRef = React.useRef(null);
    const cameraRef = React.useRef(null);
    const modelRef = React.useRef(null);
    const [selected, setSelected] = React.useState(LANDMARKS[0].id);
    const [error, setError] = React.useState(null);

    // initialise Three.js
    React.useEffect(() => {
      let cancelled = false;
      let animId = null;

      loadThree()
        .then((THREE) => {
          if (cancelled || !containerRef.current) return;

          const width = containerRef.current.clientWidth || 600;
          const height = containerRef.current.clientHeight || 420;

          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x11151c);

          const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
          camera.position.set(8, 7, 12);
          camera.lookAt(0, 2, 0);

          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.shadowMap.enabled = true;
          containerRef.current.appendChild(renderer.domElement);

          // lights
          scene.add(new THREE.AmbientLight(0xffffff, 0.65));
          const dir = new THREE.DirectionalLight(0xffffff, 1.8);
          dir.position.set(8, 14, 8);
          dir.castShadow = true;
          scene.add(dir);
          const fill = new THREE.DirectionalLight(0x88aaff, 0.5);
          fill.position.set(-6, 4, -8);
          scene.add(fill);

          // ground
          const ground = new THREE.Mesh(
            new THREE.CircleGeometry(18, 48),
            new THREE.MeshStandardMaterial({ color: 0x1e242e, roughness: 1 })
          );
          ground.rotation.x = -Math.PI / 2;
          ground.position.y = -1.2;
          ground.receiveShadow = true;
          scene.add(ground);

          // grid helper for scale
          const grid = new THREE.GridHelper(20, 20, 0x334455, 0x223344);
          grid.position.y = -1.18;
          scene.add(grid);

          sceneRef.current = scene;
          rendererRef.current = renderer;
          cameraRef.current = camera;

          // orbit-lite: mouse drag rotates the whole rig
          let dragging = false;
          let lastX = 0;
          let lastY = 0;
          let theta = Math.PI / 4;
          let phi = Math.PI / 3;
          const radius = 16;

          function updateCamera() {
            camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
            camera.position.y = radius * Math.cos(phi);
            camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
            camera.lookAt(0, 2.2, 0);
          }
          updateCamera();

          const el = renderer.domElement;
          el.style.cursor = 'grab';
          el.addEventListener('pointerdown', (e) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            el.style.cursor = 'grabbing';
          });
          window.addEventListener('pointerup', () => {
            dragging = false;
            el.style.cursor = 'grab';
          });
          window.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            theta -= dx * 0.005;
            phi = Math.max(0.25, Math.min(Math.PI / 2 - 0.05, phi - dy * 0.005));
            updateCamera();
          });
          el.addEventListener('wheel', (e) => {
            e.preventDefault();
            // zoom is handled by moving the camera along its view vector
            const dirVec = new THREE.Vector3();
            camera.getWorldDirection(dirVec);
            camera.position.addScaledVector(dirVec, e.deltaY > 0 ? -0.9 : 0.9);
            camera.lookAt(0, 2.2, 0);
          }, { passive: false });

          // render loop
          function animate() {
            animId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
          }
          animate();

          // re-render on resize
          const ro = new ResizeObserver(() => {
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            if (w > 0 && h > 0) {
              camera.aspect = w / h;
              camera.updateProjectionMatrix();
              renderer.setSize(w, h);
            }
          });
          ro.observe(containerRef.current);

          // store cleanup handles
          containerRef.current.__cleanup3d = () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            renderer.dispose();
            if (renderer.domElement.parentNode) {
              renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
          };
        })
        .catch((err) => {
          if (!cancelled) setError(err.message || 'Could not load 3D engine');
        });

      return () => {
        cancelled = true;
        if (containerRef.current && containerRef.current.__cleanup3d) {
          containerRef.current.__cleanup3d();
        }
      };
    }, []);

    // swap model when selection changes
    React.useEffect(() => {
      const scene = sceneRef.current;
      if (!scene) return;
      const THREE = window.THREE;
      if (!THREE) return;

      if (modelRef.current) {
        scene.remove(modelRef.current);
        modelRef.current = null;
      }

      const def = LANDMARKS.find((l) => l.id === selected);
      if (!def) return;

      const group = def.build(THREE);
      group.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(group);
      modelRef.current = group;
    }, [selected]);

    const styles = {
      root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: 'var(--dsw-alias-bg-primary, #0f1218)',
        color: 'var(--dsw-alias-text-primary, #e8edf5)',
        fontFamily: 'system-ui, sans-serif'
      },
      toolbar: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderBottom: '1px solid var(--dsw-alias-border-subtle, #26303d)'
      },
      select: {
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid var(--dsw-alias-border-default, #334155)',
        background: 'var(--dsw-alias-bg-secondary, #1a202b)',
        color: 'inherit',
        fontSize: 14
      },
      hint: {
        fontSize: 12,
        opacity: 0.65
      },
      canvasWrap: {
        flex: 1,
        minHeight: 0,
        position: 'relative'
      }
    };

    return React.createElement(
      'div',
      { style: styles.root },
      React.createElement(
        'div',
        { style: styles.toolbar },
        React.createElement('strong', null, '3D Landmarks'),
        React.createElement(
          'select',
          {
            style: styles.select,
            value: selected,
            onChange: (e) => setSelected(e.target.value)
          },
          LANDMARKS.map((l) =>
            React.createElement('option', { key: l.id, value: l.id }, l.label)
          )
        ),
        React.createElement(
          'span',
          { style: styles.hint },
          'Drag to orbit · Scroll to zoom'
        )
      ),
      React.createElement(
        'div',
        { style: styles.canvasWrap, ref: containerRef },
        error &&
          React.createElement(
            'div',
            {
              style: {
                padding: 24,
                color: '#ffb4b4',
                fontSize: 14
              }
            },
            'Could not start the 3D viewer: ',
            error
          )
      )
    );
  }

  // ---------- plugin registration ----------
  function apply(ctx) {
    // left sidebar entry
    ctx.slots.inject('sidebar.panellist', () =>
      ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_ID,
        order: 10,
        label: () => PANEL_LABEL
      }, LandmarksIcon)
    );

    // full main panel
    ctx.slots.inject('main', () =>
      ctx.slots.register({
        name: 'main',
        key: PANEL_ID,
        label: PANEL_LABEL
      }, LandmarksPanel)
    );
  }

  // Cordis expects a plugin object or a function with .apply
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apply };
  } else {
    window.__dshPlugin_3d_landmarks = { apply };
  }
})();
