# DIBUJO·TÉCNICO — Portal Educativo y Profesional (Blueprint & CAD)

Aplicación web multipágina, responsiva y sin dependencias externas dedicada al **Dibujo Técnico**, diseñada bajo una estética **Blueprint & CAD** con cuadrícula milimetrada, marcas de registro en esquinas, tipografía técnica y diagramas vectoriales interactivos.

---

## 1. Identidad Visual y Sistema de Diseño

- **Modo Dual (`Papel Técnico` / `Pizarra CAD`):**
  - **Papel Técnico (Claro por defecto):** Fondo `#F8FAFC`, tarjetas `#FFFFFF`, texto grafito `#1E293B`, acentos azul cianotipo `#1D4ED8` / `#0284C7`, cotas y énfasis técnico en ámbar `#F59E0B` y líneas sutiles `#CBD5E1`.
  - **Pizarra CAD (Oscuro):** Fondo `#0F172A`, superficies `#16223B`, acentos cian `#38BDF8` y ámbar `#FBBF24`.
  - La preferencia se guarda automáticamente en `localStorage` (`dt-theme`) y se mantiene sincronizada entre todas las páginas.
- **Tipografía:**
  - `JetBrains Mono` para encabezados técnicos, cotas, coordenadas, escalas y cajetines.
  - `Inter` para bloques de lectura y descripciones técnicas.
- **Detalles gráficos y UX:**
  - Cuadrícula milimetrada dual (`20px` menor / `100px` mayor).
  - Marcas de registro técnicas en las esquinas de tarjetas y modales (`.corner-mark`).
  - Barra de navegación fija (*sticky*) con menú hamburguesa *Mobile-First* y resaltado automático de la página activa.
  - Pie de página diseñado como **Cajetín de Plano Técnico (ISO 7200)** con símbolo gráfico del primer diedro (`ISO-E`), código de lámina e índice de navegación.

---

## 2. Arquitectura del Proyecto

El proyecto utiliza **HTML5 semántico**, **CSS3 moderno** (Grid, Flexbox y variables CSS) y **JavaScript vanilla modular**, funcionando directamente en cualquier navegador moderno sin pasos de compilación (*build*).

```text
proyecto de dibujo tecnico/
├── index.html              # 01. Inicio — Hero interactivo + índice del portal
├── fundamentos.html        # 02. Fundamentos — ISO 128, formatos ISO 216 y sistemas ISO-E/ISO-A
├── galeria.html            # 03. Galería — Portafolio filtrable + visor modal con zoom y SVG
├── historia.html           # 04. Historia — Línea de tiempo interactiva + comparativa visual
├── aplicaciones.html       # 05. Aplicaciones — Pestañas por industria (Mecánica, Arq, Civil, Elec)
├── escalas.html            # 06. Escalas — Calculadora ISO 5455 + guía de acotación ISO 129-1
├── styles.css              # Sistema de diseño Blueprint & CAD, temas y responsive design
├── app.js                  # Lógica modular segura por página (solo inicializa módulos activos)
├── README.md               # Documentación técnica del proyecto
└── assets/
    └── img/                # 9 ilustraciones técnicas y multimedia (.jpg)
        ├── app-civil-bridge.jpg
        ├── gallery-architecture.jpg
        ├── gallery-gear.jpg
        ├── gallery-isometric.jpg
        ├── gallery-pcb.jpg
        ├── gallery-section.jpg
        ├── gallery-truss.jpg
        ├── hero-drafting-instruments.jpg
        └── history-renaissance.jpg
```

---

## 3. Módulos y Funcionalidades por Página

### `01. Inicio` (`index.html`)
- **Hero Section:** Presentación del dibujo técnico como lenguaje universal de la ingeniería, con acceso directo a la Galería y Aplicaciones.
- **Diagrama SVG Interactivo (`#heroDiagramSvg`):** Representación simultánea de una escuadra mecánica en **perspectiva isométrica (120°)** y sus tres vistas ortogonales (**Alzado, Planta y Perfil**) con líneas de proyección animadas y botones para aislar cada vista.
- **Directorio del Portal:** Tarjetas visuales con acceso directo a cada sección y herramienta del sitio.

### `02. Fundamentos` (`fundamentos.html`)
- **Pilares clave:** Normalización (`ISO / DIN / ANSI`), Instrumentos Tradicionales vs. CAD y Representación Espacial.
- **Alfabeto de Líneas (`ISO 128-20`):** Tabla visual con espesores normalizados y aplicaciones (continua gruesa, continua fina, de trazos ocultos, trazo y punto).
- **Selector Interactivo de Formatos (`ISO 216`):** Diagrama proporcional y ficha técnica interactiva para formatos `A0`, `A1`, `A2`, `A3` y `A4`.
- **Métodos de Proyección (`ISO 5456-2`):** Comparativa gráfica entre el **Sistema Europeo (`ISO-E`)** y el **Sistema Americano (`ISO-A`)**.

### `03. Galería de Planos` (`galeria.html`)
- **Filtros por categoría:** `Todos (6)`, `Proyección Isométrica`, `Cortes y Secciones`, `Arquitectura`, `Piezas Mecánicas` y `Electrónica y PCB`.
- **6 Láminas con Cajetín Individual (`PL-101` a `PL-106`):**
  1. `PL-101` — Bloque Soporte en V Isométrico (`1:1`, `ISO 5456-3`).
  2. `PL-102` — Pabellón Estudio: Planta y Alzado (`1:50`, `ISO 7519`).
  3. `PL-103` — Buje Escalonado en Corte Total A-A (`2:1`, `ISO 128-40`).
  4. `PL-104` — Engranaje y Brida de 6 Taladros (`1:2`, `ISO 2203 / DIN 2576`).
  5. `PL-105` — Cercha Metálica: Sección Estructural (`1:50`, `Eurocódigo 3`).
  6. `PL-106` — Controlador PCB Multicapa + Esquema (`4:1`, `IEC 60617 / IPC-2221`).
- **Visor Modal Lightbox (`#blueprintModal`):** Controles de zoom (`60%` a `220%`), restablecimiento `1:1`, ficha técnica normalizada y conmutador en vivo entre **Lámina HD** (`<img>`) y **Esquema SVG** (`<svg>`).

### `04. Historia` (`historia.html`)
- **Línea de Tiempo Interactiva:** Cuatro hitos con ilustración geométrica SVG:
  - *Antigüedad Clásica* (Egipto, tablilla de Gudea y geometría euclidiana).
  - *Renacimiento* (Filippo Brunelleschi y la perspectiva cónica; Leonardo da Vinci y estudios mecánicos).
  - *Revolución Industrial* (Gaspard Monge y la Geometría Descriptiva / sistema diédrico).
  - *Era Moderna y Digital* (Estandarización ISO y transición al CAD/BIM).
- **Comparativa Visual:** Diferencias entre la **Representación Artística Libre** (perspectiva cónica y claroscuro) y la **Representación Técnica Normalizada** (vistas diédricas y cotas ISO).

### `05. Aplicaciones` (`aplicaciones.html`)
- **Pestañas Interactivas por Sector:**
  - **Ingeniería Mecánica e Industrial:** Tolerancias GD&T (`ISO 1101`), ajustes eje-agujero y despieces.
  - **Arquitectura y Urbanismo:** Plantas acotadas, alzados, secciones y modelado BIM (`ISO 7519`).
  - **Ingeniería Civil y Topografía:** Curvas de nivel, perfiles longitudinales y viaductos.
  - **Electrónica y Electricidad:** Diagramas esquemáticos normalizados (`IEC 60617`) y ruteo PCB (`IPC-2221`).
- Combina por cada sector la normativa aplicable, escalas habituales, lámina multimedia y diagrama vectorial explicativo.

### `06. Escalas y Acotación` (`escalas.html`)
- **Calculadora Rápida de Escalas (`ISO 5455`):** Conversión en tiempo real entre medida real (`mm`, `cm`, `m`) y medida en el plano, con preselecciones rápidas (`1:100`, `1:50`, `1:20`, `1:5`, `1:1`, `2:1`, `5:1`), factor `k`, clasificación automática (Reducción / Natural / Ampliación) y barra proporcional.
- **Sistemas de Acotación (`ISO 129-1`):** Guía visual comparativa de acotación en serie y en paralelo.

---

## 4. Arquitectura JavaScript (`app.js`)

Cada página declara su identificador en `<body data-page="...">` y `app.js` ejecuta sus módulos de forma segura verificando la existencia de los nodos en el DOM:

- `initThemeToggle()` — Alternancia entre tema claro/oscuro y persistencia en `localStorage`.
- `initNavigation()` — Estado activo del menú multipágina y control del menú hamburguesa móvil.
- `initHeroDiagram()` — Aislamiento interactivo de vistas en el diagrama SVG principal.
- `initPaperFormats()` — Lógica del selector interactivo de formatos `A0`–`A4`.
- `initGallery()` — Renderizado, filtrado por categorías, modal lightbox, zoom y conmutador HD/SVG.
- `initTimeline()` — Cambio dinámico de hitos históricos y sus diagramas SVG.
- `initApplicationsTabs()` — Cambio dinámico de pestañas sectoriales.
- `initScaleCalculator()` — Cálculo matemático de escalas y actualización de la barra visual.
- `initScrollReveal()` — Animaciones de entrada mediante `IntersectionObserver`.

---

## 5. Uso y Despliegue

1. **Ejecución local:** Clona o descarga el repositorio y abre `index.html` directamente en cualquier navegador web moderno.
2. **GitHub Pages:** En la configuración del repositorio (**Settings → Pages**), selecciona la rama `main` y la carpeta raíz (`/ (root)`) para publicar el portal en línea sin configuración adicional.
