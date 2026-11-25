/**
 * DIBUJO TÉCNICO — PORTAL MULTIPÁGINA & CAD
 * Arquitectura modular segura por página: cada módulo se inicializa
 * únicamente cuando sus elementos existen en el documento activo.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initHeroDiagram();
  initPaperFormats();
  initGallery();
  initTimeline();
  initApplicationsTabs();
  initScaleCalculator();
  initScrollReveal();
});

/* ==========================================================================
   1. TEMA PAPEL TÉCNICO / PIZARRA CAD
   ========================================================================== */
function initThemeToggle() {
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const label = document.getElementById('themeLabel');
  if (!toggleBtn || !label) return;

  const savedTheme = localStorage.getItem('dt-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    html.setAttribute('data-theme', savedTheme);
  }

  const syncLabel = () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    label.textContent = isDark ? 'PAPEL CLARO' : 'CAD DARK';
  };
  syncLabel();

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('dt-theme', next);
    syncLabel();
  });
}

/* ==========================================================================
   2. NAVEGACIÓN STICKY, ESTADO ACTIVO MULTIPÁGINA Y MENÚ MÓVIL
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Marcar enlace activo según página actual
  const pageKey = document.body.dataset.page;
  if (pageKey) {
    links.forEach((link) => {
      link.classList.toggle('active', link.dataset.page === pageKey);
    });
  }

  if (!hamburger || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => link.addEventListener('click', closeMenu));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1020) closeMenu();
  });
}

/* ==========================================================================
   3. DIAGRAMA INTERACTIVO DEL HERO (HOME)
   ========================================================================== */
function initHeroDiagram() {
  const svg = document.getElementById('heroDiagramSvg');
  const chips = document.querySelectorAll('.view-chip');
  if (!svg || !chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const view = chip.dataset.view;
      if (view === 'all') {
        svg.removeAttribute('data-focus');
      } else {
        svg.setAttribute('data-focus', view);
      }
    });
  });
}

/* ==========================================================================
   4. SELECTOR INTERACTIVO DE FORMATOS ISO 216 (FUNDAMENTOS)
   ========================================================================== */
const PAPER_FORMATS = {
  A0: { dims: '841 × 1189 mm', area: '1.00 m²', margin: '20 mm', use: 'Planos urbanos, obra civil y grandes conjuntos mecánicos.' },
  A1: { dims: '594 × 841 mm', area: '0.50 m²', margin: '20 mm', use: 'Proyectos arquitectónicos ejecutivos y ensamblajes industriales.' },
  A2: { dims: '420 × 594 mm', area: '0.25 m²', margin: '10 mm', use: 'Subconjuntos mecánicos, detalles constructivos y esquemas eléctricos.' },
  A3: { dims: '297 × 420 mm', area: '0.125 m²', margin: '10 mm', use: 'Formato estándar de taller, despieces y láminas académicas.' },
  A4: { dims: '210 × 297 mm', area: '0.0625 m²', margin: '10 mm', use: 'Piezas individuales, fichas técnicas y memorias de cálculo.' }
};

function initPaperFormats() {
  const buttons = document.querySelectorAll('.format-btn');
  const readout = document.getElementById('formatReadout');
  const highlightRect = document.getElementById('formatHighlight');
  if (!buttons.length || !readout) return;

  const rects = {
    A0: { x: 10, y: 10, w: 300, h: 212 },
    A1: { x: 10, y: 10, w: 150, h: 212 },
    A2: { x: 160, y: 10, w: 150, h: 106 },
    A3: { x: 160, y: 116, w: 75, h: 106 },
    A4: { x: 235, y: 116, w: 75, h: 53 }
  };

  const selectFormat = (fmt) => {
    const info = PAPER_FORMATS[fmt];
    const box = rects[fmt];
    if (!info || !box) return;

    readout.innerHTML = `
      <div class="spec-row"><dt class="mono">Formato seleccionado</dt><dd class="mono">${fmt}</dd></div>
      <div class="spec-row"><dt class="mono">Dimensiones (ISO 216)</dt><dd class="mono">${info.dims}</dd></div>
      <div class="spec-row"><dt class="mono">Superficie nominal</dt><dd class="mono">${info.area}</dd></div>
      <div class="spec-row"><dt class="mono">Margen de recuadro</dt><dd class="mono">${info.margin}</dd></div>
      <p style="margin:0.65rem 0 0; font-size:0.9rem; color:var(--text-secondary);">${info.use}</p>
    `;

    if (highlightRect) {
      highlightRect.setAttribute('x', box.x);
      highlightRect.setAttribute('y', box.y);
      highlightRect.setAttribute('width', box.w);
      highlightRect.setAttribute('height', box.h);
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectFormat(btn.dataset.format);
    });
  });

  selectFormat('A1');
}

/* ==========================================================================
   5. GALERÍA DE PLANOS (IMÁGENES GENERADAS + VISOR MODAL CON ZOOM Y SVG)
   ========================================================================== */
const BLUEPRINTS_DATA = [
  {
    id: 'PL-101',
    title: 'Bloque Soporte en V Isométrico',
    category: 'isometrica',
    categoryLabel: 'Proyección Isométrica',
    categories: ['isometrica', 'mecanica'],
    scale: '1:1',
    projection: 'Axonometría Isométrica (120°)',
    norm: 'ISO 5456-3 / ISO 128',
    material: 'Acero F-1140 Templado',
    image: 'assets/img/gallery-isometric.jpg',
    summary: 'Lámina isométrica de bloque mecanizado con ranura en V, nervios de refuerzo y acotación paralela a los ejes.',
    description:
      'Bloque prismático empleado en metrología y mecanizado para centrar ejes cilíndricos. La proyección isométrica conserva las dimensiones reales sobre los tres ejes a 120°, permitiendo verificar bridas de fijación, taladro pasante y nervios triangulares.',
    svg: `
      <svg viewBox="0 0 420 280" class="blueprint-svg" aria-label="Esquema SVG de bloque soporte en V">
        <line x1="210" y1="225" x2="210" y2="262" class="draw-axis" />
        <line x1="210" y1="225" x2="80" y2="150" class="draw-axis" />
        <line x1="210" y1="225" x2="340" y2="150" class="draw-axis" />
        <polygon points="105,155 210,215 210,150 175,130 155,155 135,110 105,92" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <polygon points="210,215 315,155 315,92 210,150" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <polygon points="105,92 135,110 240,50 210,32" fill="var(--surface-card)" class="draw-line draw-thick" />
        <polygon points="135,110 155,155 260,95 240,50" fill="var(--surface-tint)" class="draw-line" />
        <polygon points="155,155 175,130 280,70 260,95" fill="var(--surface-card)" class="draw-line" />
        <polygon points="175,130 210,150 315,92 280,70" fill="var(--surface-card)" class="draw-line draw-thick" />
        <text x="142" y="218" class="dim-text mono">65</text>
        <text x="270" y="218" class="dim-text mono">90 mm</text>
        <text x="344" y="128" class="dim-text mono">55</text>
        <text x="18" y="26" class="svg-label mono">ISO 30° / 30° · ESQUEMA VECTORIAL</text>
      </svg>
    `
  },
  {
    id: 'PL-102',
    title: 'Pabellón Estudio — Planta y Alzado',
    category: 'arquitectura',
    categoryLabel: 'Arquitectura',
    categories: ['arquitectura'],
    scale: '1:50',
    projection: 'Planta Arquitectónica (+1.20 m) + Alzado',
    norm: 'ISO 7519 / CTE DB',
    material: 'Hormigón visto + Carpintería aluminio',
    image: 'assets/img/gallery-architecture.jpg',
    summary: 'Plano arquitectónico de pabellón minimalista con muros de carga, carpinterías acristaladas, arcos de giro y alzado frontal.',
    description:
      'Documentación arquitectónica que combina la planta seccionada horizontalmente a 1,20 m con el alzado frontal correspondiente. Incluye espesores diferenciados para elementos portantes, carpintería exterior, barridos de puerta a 90° y cadena exterior de cotas.',
    svg: `
      <svg viewBox="0 0 420 280" class="blueprint-svg" aria-label="Esquema SVG de planta arquitectónica">
        <line x1="60" y1="32" x2="360" y2="32" class="dim-line" />
        <text x="145" y="25" class="dim-text mono" text-anchor="middle">4.80 m</text>
        <text x="295" y="25" class="dim-text mono" text-anchor="middle">3.20 m</text>
        <rect x="60" y="52" width="300" height="180" fill="var(--surface-card)" stroke="var(--text-primary)" stroke-width="4" />
        <rect x="115" y="49" width="75" height="6" fill="var(--bg-canvas)" stroke="var(--accent-cyan)" stroke-width="1.4" />
        <rect x="357" y="95" width="6" height="70" fill="var(--bg-canvas)" stroke="var(--accent-cyan)" stroke-width="1.4" />
        <line x1="230" y1="52" x2="230" y2="170" stroke="var(--text-primary)" stroke-width="3" />
        <line x1="230" y1="145" x2="360" y2="145" stroke="var(--text-primary)" stroke-width="3" />
        <line x1="95" y1="232" x2="95" y2="196" stroke="var(--accent-amber)" stroke-width="1.4" />
        <path d="M 95 196 A 36 36 0 0 1 131 232" fill="none" stroke="var(--accent-amber)" stroke-width="1" stroke-dasharray="3 2" />
        <text x="64" y="256" class="svg-label mono">NPT +0.00 · SUP. ÚTIL 43.20 m²</text>
      </svg>
    `
  },
  {
    id: 'PL-103',
    title: 'Buje Escalonado — Corte Total A-A',
    category: 'cortes',
    categoryLabel: 'Cortes y Secciones',
    categories: ['cortes', 'mecanica'],
    scale: '2:1',
    projection: 'Sistema Europeo (ISO-E) · Corte por Simetría',
    norm: 'ISO 128-40 / ISO 128-50',
    material: 'Bronce SAE 660',
    image: 'assets/img/gallery-section.jpg',
    summary: 'Sección longitudinal completa de casquillo escalonado y manguito de acoplamiento con achurado normalizado a 45°.',
    description:
      'El corte total A-A revela las cámaras interiores concéntricas y chaflanes mediante aristas vistas continuas, sustituyendo las líneas ocultas. El material cortado se identifica con rayado fino inclinado a 45° respecto al eje de simetría.',
    svg: `
      <svg viewBox="0 0 420 280" class="blueprint-svg" aria-label="Esquema SVG de corte total A-A">
        <defs>
          <pattern id="hatch103" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--accent-cyan)" stroke-width="1.2" />
          </pattern>
        </defs>
        <circle cx="105" cy="140" r="58" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <circle cx="105" cy="140" r="36" fill="none" class="draw-line" />
        <circle cx="105" cy="140" r="18" fill="var(--bg-canvas)" class="draw-line draw-thick" />
        <line x1="105" y1="62" x2="105" y2="218" stroke="var(--accent-amber)" stroke-width="2.2" stroke-dasharray="12 4 3 4" />
        <polygon points="215,82 275,82 275,104 365,104 365,122 250,122 250,114 215,114" fill="url(#hatch103)" class="draw-line draw-thick" />
        <polygon points="215,198 275,198 275,176 365,176 365,158 250,158 250,166 215,166" fill="url(#hatch103)" class="draw-line draw-thick" />
        <line x1="200" y1="140" x2="385" y2="140" class="draw-axis" />
        <text x="290" y="239" class="dim-text mono" text-anchor="middle">L = 75 ±0.05 · Ø36 H7</text>
      </svg>
    `
  },
  {
    id: 'PL-104',
    title: 'Engranaje y Brida de 6 Taladros',
    category: 'mecanica',
    categoryLabel: 'Piezas Mecánicas',
    categories: ['mecanica', 'cortes'],
    scale: '1:2',
    projection: 'Sistema Europeo (ISO-E) · Alzado y Corte Lateral',
    norm: 'ISO 2203 / DIN 2576',
    material: 'Acero Cementado 18CrNiMo7-6',
    image: 'assets/img/gallery-gear.jpg',
    summary: 'Conjunto de rueda dentada cilíndrica recta acoplada a brida de 6 taladros con chavetero normalizado y círculo primitivo.',
    description:
      'Representación ortogonal combinada en entorno CAD oscuro: a la izquierda se define la corona dentada con sus ejes polares y 6 taladros equidistantes a 60°; a la derecha, el corte lateral detalla el alojamiento de chaveta DIN 6885 y espesores de cubo.',
    svg: `
      <svg viewBox="0 0 420 280" class="blueprint-svg" aria-label="Esquema SVG de brida y engranaje">
        <circle cx="135" cy="140" r="76" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <circle cx="135" cy="140" r="54" fill="none" class="draw-axis" />
        <circle cx="135" cy="140" r="20" fill="var(--bg-canvas)" class="draw-line draw-thick" />
        <line x1="48" y1="140" x2="222" y2="140" class="draw-axis" />
        <line x1="135" y1="52" x2="135" y2="228" class="draw-axis" />
        <g fill="var(--bg-canvas)" class="draw-line">
          <circle cx="189" cy="140" r="8" /><circle cx="81" cy="140" r="8" />
          <circle cx="162" cy="93.2" r="8" /><circle cx="108" cy="93.2" r="8" />
          <circle cx="162" cy="186.8" r="8" /><circle cx="108" cy="186.8" r="8" />
        </g>
        <rect x="275" y="64" width="25" height="152" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <rect x="300" y="108" width="55" height="64" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <text x="135" y="34" class="dim-text mono" text-anchor="middle">6× Ø14 · Ø100 PCD</text>
      </svg>
    `
  },
  {
    id: 'PL-105',
    title: 'Cercha Metálica — Sección Estructural',
    category: 'arquitectura',
    categoryLabel: 'Arquitectura',
    categories: ['arquitectura', 'cortes'],
    scale: '1:50',
    projection: 'Sección Constructiva Transversal',
    norm: 'Eurocódigo 3 / ISO 7519',
    material: 'Acero Laminado HEB-240 + HA-25',
    image: 'assets/img/gallery-truss.jpg',
    summary: 'Sección de pórtico industrial con cercha triangulada simétrica, pilares metálicos, zapatas escalonadas y cotas de altura.',
    description:
      'Plano de ingeniería estructural para nave de 12 m de luz libre. Muestra la geometría triangulada de barras comprimidas y traccionadas en cubierta, el empotramiento sobre pilares de hormigón y los niveles de referencia constructiva.',
    svg: `
      <svg viewBox="0 0 420 280" class="blueprint-svg" aria-label="Esquema SVG de cercha metálica">
        <line x1="25" y1="220" x2="395" y2="220" class="draw-line draw-thick" />
        <rect x="65" y="220" width="44" height="24" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <rect x="311" y="220" width="44" height="24" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <rect x="82" y="105" width="10" height="115" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <rect x="328" y="105" width="10" height="115" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <polygon points="82,105 210,60 338,105" fill="none" class="draw-line draw-thick" />
        <line x1="125" y1="90" x2="125" y2="105" class="draw-line" />
        <line x1="210" y1="60" x2="210" y2="105" class="draw-line" />
        <line x1="295" y1="90" x2="295" y2="105" class="draw-line" />
        <text x="210" y="262" class="dim-text mono" text-anchor="middle">LUZ LIBRE = 12.00 m · COTA +7.60 m</text>
      </svg>
    `
  },
  {
    id: 'PL-106',
    title: 'Controlador PCB Multicapa + Esquema',
    category: 'electronica',
    categoryLabel: 'Electrónica y PCB',
    categories: ['electronica', 'isometrica'],
    scale: '4:1',
    projection: 'Ruteo Ortogonal 45° + Diagrama IEC',
    norm: 'IEC 60617 / IPC-2221',
    material: 'FR-4 1.6 mm · Cobre 1 oz ENIG',
    image: 'assets/img/gallery-pcb.jpg',
    summary: 'Plano de circuito impreso con encapsulado QFP, pistas diferenciales a 45°, vías metalizadas y esquema lógico de control.',
    description:
      'Documentación electrónica que integra el diagrama esquemático normalizado IEC 60617 con la topología física de fabricación de la PCB: huellas SMD, planos de masa, pistas a 45° para integridad de señal y acotación de anclajes mecánicos.',
    svg: `
      <svg viewBox="0 0 420 280" class="blueprint-svg" aria-label="Esquema SVG electrónico IEC">
        <polyline points="60,185 60,75 135,75" fill="none" class="draw-line draw-thick" />
        <rect x="135" y="65" width="52" height="20" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <line x1="187" y1="75" x2="275" y2="75" class="draw-line draw-thick" />
        <rect x="275" y="55" width="76" height="90" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <text x="313" y="104" class="svg-label mono" text-anchor="middle">MCU QFP</text>
        <line x1="60" y1="185" x2="313" y2="185" class="draw-line draw-thick" />
        <line x1="313" y1="145" x2="313" y2="185" class="draw-line" />
        <text x="210" y="226" class="dim-text mono" text-anchor="middle">TRAZADO PCB 45° · NORMA IPC-2221</text>
      </svg>
    `
  }
];

function initGallery() {
  const grid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('blueprintModal');
  if (!grid || !modal) return;

  const modalClose = document.getElementById('modalCloseBtn');
  const modalStage = document.getElementById('modalSvgStage');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');
  const zoomReadout = document.getElementById('zoomReadout');
  const modeBtns = document.querySelectorAll('.mode-btn');

  let currentZoom = 1;
  let activePlan = null;
  let activeMode = 'image';

  const updateZoom = (val) => {
    currentZoom = Math.min(2.2, Math.max(0.6, val));
    modalStage.style.transform = `scale(${currentZoom})`;
    zoomReadout.textContent = `${Math.round(currentZoom * 100)}%`;
  };

  const renderModalStage = () => {
    if (!activePlan) return;
    if (activeMode === 'image') {
      modalStage.innerHTML = `<img src="${activePlan.image}" alt="${activePlan.title}" />`;
    } else {
      modalStage.innerHTML = activePlan.svg;
    }
  };

  const openModal = (plan) => {
    activePlan = plan;
    activeMode = 'image';
    modeBtns.forEach((b) => b.classList.toggle('active', b.dataset.mode === 'image'));

    document.getElementById('modalCode').textContent = plan.id;
    document.getElementById('modalTitle').textContent = plan.title;
    document.getElementById('specCategory').textContent = plan.categoryLabel;
    document.getElementById('specScale').textContent = plan.scale;
    document.getElementById('specProjection').textContent = plan.projection;
    document.getElementById('specNorm').textContent = plan.norm;
    document.getElementById('specMaterial').textContent = plan.material;
    document.getElementById('specDescription').textContent = plan.description;

    renderModalStage();
    updateZoom(1);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };

  const renderCards = (filter) => {
    const items =
      filter === 'all'
        ? BLUEPRINTS_DATA
        : BLUEPRINTS_DATA.filter((item) => item.categories.includes(filter));

    grid.innerHTML = items
      .map(
        (item) => `
      <article class="plan-card card-blueprint" tabindex="0" data-plan-id="${item.id}" aria-label="Abrir plano ${item.title}">
        <div class="corner-mark tl" aria-hidden="true"></div>
        <div class="corner-mark tr" aria-hidden="true"></div>
        <div class="plan-thumb">
          <img src="${item.image}" alt="${item.title}" class="plan-img" loading="lazy" />
          <span class="plan-zoom-hint mono">INSPECCIONAR ↗</span>
        </div>
        <div class="plan-meta">
          <div class="plan-cat-row mono">
            <span>${item.categoryLabel.toUpperCase()}</span>
            <span>${item.id}</span>
          </div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </div>
        <div class="mini-cajetin">
          <span>${item.norm.split('/')[0].trim()}</span>
          <span>ISO-E</span>
          <span>ESC ${item.scale}</span>
        </div>
      </article>
    `
      )
      .join('');

    grid.querySelectorAll('.plan-card').forEach((card) => {
      const plan = BLUEPRINTS_DATA.find((p) => p.id === card.dataset.planId);
      card.addEventListener('click', () => openModal(plan));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(plan);
        }
      });
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderCards(btn.dataset.filter);
    });
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeMode = btn.dataset.mode;
      modeBtns.forEach((b) => b.classList.toggle('active', b === btn));
      renderModalStage();
      updateZoom(1);
    });
  });

  zoomInBtn.addEventListener('click', () => updateZoom(currentZoom + 0.2));
  zoomOutBtn.addEventListener('click', () => updateZoom(currentZoom - 0.2));
  zoomResetBtn.addEventListener('click', () => updateZoom(1));
  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  renderCards('all');
}

/* ==========================================================================
   6. LÍNEA DE TIEMPO HISTÓRICA INTERACTIVA
   ========================================================================== */
const TIMELINE_DATA = {
  antiguedad: {
    tag: '3000 a.C. – 300 a.C. · GEOMETRÍA FUNDACIONAL',
    title: 'Antigüedad: Egipto, Mesopotamia y Grecia',
    text: 'Los constructores del antiguo Egipto y Mesopotamia trazaban plantas sobre papiro y tablillas de arcilla (como la estatua de Gudea de Lagash, 2120 a.C.) usando retículas modulares. En Grecia, Euclides sistematizó los axiomas geométricos en "Los Elementos", sentando la base matemática de toda construcción con regla y compás.',
    milestones: [
      'Tablilla de Gudea: primer plano arquitectónico conocido con escala grabada.',
      'Cánones proporcionales egipcios basados en cuadrículas modulares.',
      'Euclides y Pitágoras: teoremas de perpendicularidad, ángulos y proporción áurea (φ).'
    ],
    svg: `
      <svg viewBox="0 0 280 200" class="blueprint-svg" aria-label="Construcción geométrica euclidiana y espiral áurea">
        <rect x="24" y="24" width="232" height="144" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <line x1="167" y1="24" x2="167" y2="168" class="draw-line" />
        <line x1="167" y1="112" x2="256" y2="112" class="draw-line" />
        <line x1="201" y1="112" x2="201" y2="168" class="draw-line" />
        <path d="M 24 168 A 143 143 0 0 1 167 24 A 88 88 0 0 1 256 112 A 55 55 0 0 1 201 168 A 34 34 0 0 1 167 134" fill="none" stroke="var(--accent-amber)" stroke-width="2" />
        <circle cx="167" cy="112" r="3" fill="var(--accent-cyan)" />
        <text x="24" y="188" class="cajetin-sub mono">PROPORCIÓN ÁUREA φ = 1.618 · EUCLIDES</text>
      </svg>
    `
  },
  renacimiento: {
    tag: 'SIGLOS XV – XVI · PERSPECTIVA Y MECÁNICA',
    title: 'Renacimiento: Brunelleschi y Leonardo da Vinci',
    text: 'Filippo Brunelleschi descubrió las leyes matemáticas de la perspectiva cónica hacia 1415, permitiendo representar la profundidad espacial de forma fiel. Décadas después, Leonardo da Vinci elevó el dibujo técnico-científico con vistas explosionadas, cortes anatómicos y mecanismos de engranajes detallados.',
    milestones: [
      'Brunelleschi y Alberti: formalización del punto de fuga y el plano del cuadro.',
      'Leonardo da Vinci: dibujos de máquinas de transmisión y estudios en sección.',
      'Alberto Durero: tratados geométricos aplicados al diseño de letras y fortificaciones.'
    ],
    svg: `
      <svg viewBox="0 0 280 200" class="blueprint-svg" aria-label="Perspectiva cónica central del Renacimiento">
        <line x1="15" y1="68" x2="265" y2="68" class="draw-axis" />
        <circle cx="140" cy="68" r="4" fill="var(--accent-amber)" />
        <text x="148" y="62" class="dim-text mono">PUNTO FUGA (PF)</text>
        <g stroke="var(--accent-cyan)" stroke-width="0.9" opacity="0.65">
          <line x1="140" y1="68" x2="30" y2="170" />
          <line x1="140" y1="68" x2="85" y2="170" />
          <line x1="140" y1="68" x2="195" y2="170" />
          <line x1="140" y1="68" x2="250" y2="170" />
        </g>
        <rect x="65" y="92" width="150" height="72" fill="none" class="draw-line draw-thick" />
        <rect x="98" y="82" width="84" height="44" fill="none" class="draw-line" />
        <line x1="65" y1="92" x2="98" y2="82" class="draw-line" />
        <line x1="215" y1="92" x2="182" y2="82" class="draw-line" />
        <text x="24" y="188" class="cajetin-sub mono">PERSPECTIVA CÓNICA CENTRAL · S. XV</text>
      </svg>
    `
  },
  industrial: {
    tag: '1795 – REVOLUCIÓN INDUSTRIAL · GEOMETRÍA DESCRIPTIVA',
    title: 'Gaspard Monge y el Sistema Diédrico',
    text: 'El matemático francés Gaspard Monge publicó en 1795 su "Géométrie Descriptive", considerada el acta de nacimiento del dibujo técnico moderno. Al proyectar un cuerpo 3D ortogonalmente sobre dos planos perpendiculares (vertical y horizontal), permitió fabricar piezas intercambiables en serie.',
    milestones: [
      'Creación del sistema diédrico: correspondencia exacta entre alzado y planta.',
      'Adopción militar e industrial para fortificaciones, calderas y máquinas de vapor.',
      'Aparición del papel cianotipo (blueprint, 1842) para reproducir copias de taller.'
    ],
    svg: `
      <svg viewBox="0 0 280 200" class="blueprint-svg" aria-label="Diedro de Monge">
        <polygon points="55,40 215,40 215,112 55,112" fill="var(--surface-tint)" class="draw-line" />
        <polygon points="55,112 215,112 245,162 85,162" fill="var(--surface-tint-2)" class="draw-line" />
        <line x1="40" y1="112" x2="230" y2="112" stroke="var(--accent-amber)" stroke-width="2" />
        <circle cx="145" cy="75" r="4" fill="var(--accent-amber)" />
        <circle cx="145" cy="136" r="4" fill="var(--accent-cyan)" />
        <line x1="145" y1="75" x2="145" y2="136" class="proj-ray" />
        <text x="154" y="79" class="cajetin-txt mono">P'' (PV)</text>
        <text x="154" y="140" class="cajetin-txt mono">P' (PH)</text>
        <text x="24" y="188" class="cajetin-sub mono">LÍNEA DE TIERRA · SISTEMA DIÉDRICO</text>
      </svg>
    `
  },
  digital: {
    tag: 'SIGLO XX – ACTUALIDAD · ESTANDARIZACIÓN Y CAD/BIM',
    title: 'Normas ISO y Era Digital (CAD / BIM)',
    text: 'La industrialización exigió normas internacionales (DIN 1917, ISO 1947). En 1963, Ivan Sutherland presentó Sketchpad, precursor del CAD. Hoy, el diseño paramétrico 3D, las tolerancias GD&T y el modelado BIM generan planos asociativos y gemelos digitales listos para fabricación CNC.',
    milestones: [
      'Estandarización global ISO 128 y sistemas de proyección ISO-E / ISO-A.',
      'Transición del estilógrafo y tablero paralex al CAD vectorial (AutoCAD, CATIA, SolidWorks).',
      'Metodología BIM (Building Information Modeling) e industria 4.0 con gemelos digitales.'
    ],
    svg: `
      <svg viewBox="0 0 280 200" class="blueprint-svg" aria-label="Malla paramétrica CAD 3D">
        <g stroke="var(--accent-cyan)" stroke-width="1.1" fill="none">
          <polygon points="140,28 216,66 216,134 140,172 64,134 64,66" fill="var(--surface-tint)" />
          <line x1="140" y1="28" x2="140" y2="172" />
          <line x1="64" y1="66" x2="216" y2="134" />
          <line x1="216" y1="66" x2="64" y2="134" />
          <ellipse cx="140" cy="100" rx="76" ry="26" stroke="var(--accent-amber)" />
          <ellipse cx="140" cy="100" rx="34" ry="72" stroke="var(--accent-amber)" stroke-dasharray="3 2" />
        </g>
        <circle cx="140" cy="100" r="4" fill="var(--accent-amber)" />
        <text x="24" y="188" class="cajetin-sub mono">MODELADO PARAMÉTRICO 3D · BIM / CNC</text>
      </svg>
    `
  }
};

function initTimeline() {
  const buttons = document.querySelectorAll('.timeline-step');
  const detailBox = document.getElementById('timelineDetail');
  if (!buttons.length || !detailBox) return;

  const renderEra = (eraKey) => {
    const data = TIMELINE_DATA[eraKey];
    detailBox.innerHTML = `
      <div class="era-text">
        <span class="era-tag mono">${data.tag}</span>
        <h3>${data.title}</h3>
        <p>${data.text}</p>
        <ul class="era-milestones">
          ${data.milestones.map((m) => `<li>${m}</li>`).join('')}
        </ul>
      </div>
      <div class="era-svg-frame">
        ${data.svg}
      </div>
    `;
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderEra(btn.dataset.era);
    });
  });

  renderEra('antiguedad');
}

/* ==========================================================================
   7. APLICACIONES POR INDUSTRIA (CON IMÁGENES MULTIMEDIA + SVG)
   ========================================================================== */
const APPS_DATA = {
  mecanica: {
    title: 'Ingeniería Mecánica e Industrial',
    description:
      'Documenta piezas de maquinaria, conjuntos de ensamblaje y despieces completos para torneado, fresado o impresión industrial. Incorpora ajustes normalizados (eje/agujero), tolerancias geométricas (GD&T), acabados superficiales (Ra) y listas de materiales (BOM).',
    norm: 'ISO 1101 (GD&T) · ISO 286',
    scaleRange: 'Escalas habituales: 2:1, 1:1, 1:2, 1:5',
    image: 'assets/img/gallery-gear.jpg',
    imageCaption: 'PLANO CAD · CONJUNTO ENGRANAJE Y BRIDA',
    deliverables: ['Planos de despiece', 'Conjuntos explosionados', 'Tolerancias GD&T', 'Roscas y engranajes'],
    svg: `
      <svg viewBox="0 0 360 210" class="blueprint-svg" aria-label="Diagrama mecánico con GD&T">
        <line x1="30" y1="98" x2="330" y2="98" class="draw-axis" />
        <rect x="65" y="66" width="70" height="64" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <rect x="135" y="50" width="90" height="96" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <rect x="225" y="74" width="68" height="48" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <g transform="translate(115, 162)">
          <rect x="0" y="0" width="136" height="28" fill="var(--surface-card)" stroke="var(--accent-amber)" stroke-width="1.3" />
          <line x1="28" y1="0" x2="28" y2="28" stroke="var(--accent-amber)" />
          <line x1="94" y1="0" x2="94" y2="28" stroke="var(--accent-amber)" />
          <circle cx="14" cy="14" r="6" fill="none" stroke="var(--accent-amber)" stroke-width="1.3" />
          <text x="61" y="18" class="dim-text mono" text-anchor="middle">Ø0.02</text>
          <text x="115" y="18" class="dim-text mono" text-anchor="middle">A</text>
        </g>
        <line x1="180" y1="146" x2="180" y2="162" stroke="var(--accent-amber)" stroke-width="1.2" />
        <text x="180" y="34" class="svg-label mono" text-anchor="middle">Ø32 h6 · Ø48 H7 · M24×1.5</text>
      </svg>
    `
  },
  arquitectura: {
    title: 'Arquitectura y Urbanismo',
    description:
      'Traduce la concepción espacial de edificios y entornos urbanos en documentación ejecutiva: planos de emplazamiento, plantas de distribución, alzados de fachada, secciones constructivas, detalles de carpintería, instalaciones MEP y coordinación integral en modelos BIM.',
    norm: 'ISO 7519 · CTE / BIM IFC',
    scaleRange: 'Escalas habituales: 1:200, 1:100, 1:50, 1:20',
    image: 'assets/img/gallery-architecture.jpg',
    imageCaption: 'ARQUITECTURA · PLANTA Y ALZADO DE PABELLÓN',
    deliverables: ['Plantas acotadas', 'Alzados y secciones', 'Detalles constructivos', 'Modelado BIM'],
    svg: `
      <svg viewBox="0 0 360 210" class="blueprint-svg" aria-label="Diagrama arquitectónico">
        <rect x="45" y="45" width="140" height="120" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <polygon points="35,45 115,18 195,45" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <rect x="65" y="65" width="32" height="34" fill="var(--bg-canvas)" class="draw-line" />
        <rect x="132" y="65" width="32" height="34" fill="var(--bg-canvas)" class="draw-line" />
        <rect x="98" y="120" width="34" height="45" fill="var(--bg-canvas)" class="draw-line" />
        <rect x="218" y="55" width="105" height="110" fill="var(--surface-card)" class="draw-line" />
        <line x1="218" y1="110" x2="323" y2="110" class="draw-line draw-thick" />
        <line x1="255" y1="55" x2="255" y2="165" stroke="var(--accent-amber)" stroke-width="1.4" stroke-dasharray="4 3" />
        <text x="115" y="190" class="dim-text mono" text-anchor="middle">ALZADO + SECCIÓN BIM</text>
      </svg>
    `
  },
  civil: {
    title: 'Ingeniería Civil y Topografía',
    description:
      'Representa grandes obras de infraestructura y el relieve del terreno: planos topográficos con curvas de nivel, perfiles longitudinales de carreteras y ferrocarriles, movimientos de tierras, puentes, presas y redes hidráulicas.',
    norm: 'ISO 128 · Normativa Obras Públicas',
    scaleRange: 'Escalas habituales: 1:5000, 1:1000, 1:500',
    image: 'assets/img/app-civil-bridge.jpg',
    imageCaption: 'TOPOGRAFÍA Y OBRA CIVIL · PUENTE ATIRANTADO',
    deliverables: ['Curvas de nivel', 'Perfiles longitudinales', 'Puentes y viaductos', 'Obras hidráulicas'],
    svg: `
      <svg viewBox="0 0 360 210" class="blueprint-svg" aria-label="Curvas de nivel y puente">
        <g fill="none" stroke="var(--accent-cyan)" stroke-width="1.2">
          <path d="M 35 148 Q 95 102, 170 125 T 325 110" />
          <path d="M 35 168 Q 105 125, 175 148 T 325 132" opacity="0.75" />
          <path d="M 35 188 Q 115 152, 185 170 T 325 156" opacity="0.55" />
        </g>
        <line x1="45" y1="70" x2="315" y2="70" class="draw-line draw-thick" />
        <rect x="115" y="28" width="8" height="92" fill="var(--surface-tint-2)" class="draw-line" />
        <rect x="237" y="28" width="8" height="92" fill="var(--surface-tint-2)" class="draw-line" />
        <g stroke="var(--accent-amber)" stroke-width="1.1">
          <line x1="119" y1="30" x2="65" y2="70" /><line x1="119" y1="30" x2="155" y2="70" />
          <line x1="241" y1="30" x2="205" y2="70" /><line x1="241" y1="30" x2="295" y2="70" />
        </g>
        <text x="180" y="200" class="svg-label mono" text-anchor="middle">VIADUCTO + CURVAS DE NIVEL</text>
      </svg>
    `
  },
  electronica: {
    title: 'Electrónica y Electricidad',
    description:
      'Emplea simbología estandarizada para representar sistemas de potencia, cuadros eléctricos unifilares, diagramas esquemáticos electrónicos y trazado de pistas en placas de circuito impreso (PCB) multicapa.',
    norm: 'IEC 60617 · IPC-2221',
    scaleRange: 'Escalas habituales: Esquemático (S/E), PCB 1:1 / 4:1',
    image: 'assets/img/gallery-pcb.jpg',
    imageCaption: 'ELECTRÓNICA · PCB MULTICAPA Y ESQUEMA IEC',
    deliverables: ['Esquemas unifilares', 'Diagramas lógicos', 'Ruteo PCB multicapa', 'Armarios de control'],
    svg: `
      <svg viewBox="0 0 360 210" class="blueprint-svg" aria-label="Esquema electrónico IEC">
        <polyline points="60,145 60,55 125,55" fill="none" class="draw-line draw-thick" />
        <rect x="125" y="47" width="42" height="16" fill="var(--surface-tint)" class="draw-line draw-thick" />
        <text x="146" y="38" class="dim-text mono" text-anchor="middle">R1 4.7kΩ</text>
        <line x1="167" y1="55" x2="245" y2="55" class="draw-line draw-thick" />
        <line x1="205" y1="55" x2="205" y2="92" class="draw-line" />
        <line x1="189" y1="92" x2="221" y2="92" stroke="var(--accent-amber)" stroke-width="2.2" />
        <line x1="189" y1="102" x2="221" y2="102" stroke="var(--accent-amber)" stroke-width="2.2" />
        <line x1="205" y1="102" x2="205" y2="145" class="draw-line" />
        <rect x="245" y="40" width="60" height="72" fill="var(--surface-tint-2)" class="draw-line draw-thick" />
        <text x="275" y="80" class="svg-label mono" text-anchor="middle">IC-01</text>
        <line x1="275" y1="112" x2="275" y2="145" class="draw-line" />
        <line x1="60" y1="145" x2="275" y2="145" class="draw-line draw-thick" />
        <text x="180" y="185" class="svg-label mono" text-anchor="middle">ESQUEMA NORMALIZADO · IEC 60617</text>
      </svg>
    `
  }
};

function initApplicationsTabs() {
  const tabs = document.querySelectorAll('.app-tab');
  const panel = document.getElementById('appPanel');
  if (!tabs.length || !panel) return;

  const renderApp = (key) => {
    const data = APPS_DATA[key];
    panel.innerHTML = `
      <div class="app-panel-info">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="app-norms-box">
          <div class="norm-pill">
            <span class="mono">NORMATIVA APLICABLE</span>
            <strong>${data.norm}</strong>
          </div>
          <div class="norm-pill">
            <span class="mono">ESCALAS DE TRABAJO</span>
            <strong>${data.scaleRange}</strong>
          </div>
        </div>
        <div class="app-deliverables" style="margin-bottom:1.1rem;">
          ${data.deliverables.map((d) => `<span class="deliv-chip">▸ ${d}</span>`).join('')}
        </div>
        <div class="app-diagram-box">
          ${data.svg}
        </div>
      </div>
      <div class="app-visual-stack">
        <div class="app-photo-card">
          <img src="${data.image}" alt="${data.title}" />
          <div class="app-photo-cap mono">${data.imageCaption}</div>
        </div>
      </div>
    `;
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      renderApp(tab.dataset.app);
    });
  });

  renderApp('mecanica');
}

/* ==========================================================================
   8. CALCULADORA RÁPIDA DE ESCALAS (ISO 5455)
   ========================================================================== */
function initScaleCalculator() {
  const numInput = document.getElementById('scaleNum');
  const denInput = document.getElementById('scaleDen');
  const measureInput = document.getElementById('realMeasure');
  const unitSelect = document.getElementById('measureUnit');
  if (!numInput || !denInput || !measureInput || !unitSelect) return;

  const presetBtns = document.querySelectorAll('.preset-chip');
  const badge = document.getElementById('scaleTypeBadge');
  const resultMain = document.getElementById('drawingResult');
  const resultSub = document.getElementById('drawingResultCm');
  const rulerBar = document.getElementById('rulerBar');

  const compute = () => {
    const e = parseFloat(numInput.value);
    const r = parseFloat(denInput.value);
    const realVal = parseFloat(measureInput.value);
    const unit = unitSelect.value;

    if (!e || !r || e <= 0 || r <= 0 || isNaN(realVal) || realVal < 0) {
      resultMain.textContent = '—';
      resultSub.textContent = 'Introduce valores positivos válidos';
      return;
    }

    const factor = e / r;
    const unitToMm = unit === 'm' ? 1000 : unit === 'cm' ? 10 : 1;
    const realMm = realVal * unitToMm;
    const paperMm = realMm * factor;
    const paperCm = paperMm / 10;

    if (Math.abs(factor - 1) < 0.0001) {
      badge.textContent = 'ESCALA NATURAL (1:1)';
    } else if (factor < 1) {
      badge.textContent = 'ESCALA DE REDUCCIÓN';
    } else {
      badge.textContent = 'ESCALA DE AMPLIACIÓN';
    }

    resultMain.textContent = `${paperMm.toFixed(2)} mm`;
    resultSub.textContent = `= ${paperCm.toFixed(2)} cm · Factor k = ${factor.toFixed(3)}`;

    const pct = Math.min(100, Math.max(4, (paperMm / 250) * 100));
    rulerBar.style.width = `${pct}%`;

    presetBtns.forEach((btn) => {
      const match =
        parseFloat(btn.dataset.num) === e && parseFloat(btn.dataset.den) === r;
      btn.classList.toggle('active', match);
    });
  };

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      numInput.value = btn.dataset.num;
      denInput.value = btn.dataset.den;
      compute();
    });
  });

  [numInput, denInput, measureInput, unitSelect].forEach((el) => {
    el.addEventListener('input', compute);
    el.addEventListener('change', compute);
  });

  compute();
}

/* ==========================================================================
   9. ANIMACIONES SUAVES AL HACER SCROLL
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  reveals.forEach((el) => observer.observe(el));
}
