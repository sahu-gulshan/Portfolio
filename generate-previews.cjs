const fs = require("fs");
const { Resvg } = require("@resvg/resvg-js");

// -------------------------------------------------------------
// FINALIZED PRIMARY SOCIAL CARD: KINETIC MONOLITH & 3D GYROSCOPIC PRODUCT NEXUS
// Refined Studio Aesthetics:
// 1. Subtle, diffused ambient warm atmosphere
// 2. High-precision minimalist vector linework & architectural framing
// 3. Sophisticated warm copper/ember accents without overpowering saturation
// 4. Pure 2-font Sans-Serif system (Unbounded & Plus Jakarta Sans)
// -------------------------------------------------------------
const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Technical Millimeter Grid Texture -->
    <pattern id="v4MillimeterGrid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#ffffff" stroke-opacity="0.025" stroke-width="0.75" />
      <circle cx="0" cy="0" r="0.75" fill="#ffffff" fill-opacity="0.06" />
    </pattern>

    <!-- Subtle Offset Studio Warm Atmosphere (Soft, Ambient & Elegant) -->
    <radialGradient id="v4StudioAura" cx="72%" cy="32%" r="55%">
      <stop offset="0%" stop-color="#d1651c" stop-opacity="0.14" />
      <stop offset="45%" stop-color="#ea580c" stop-opacity="0.04" />
      <stop offset="100%" stop-color="#060608" stop-opacity="0" />
    </radialGradient>

    <!-- Subtle Secondary Radial Ambient on Left -->
    <radialGradient id="v4LeftAura" cx="25%" cy="65%" r="45%">
      <stop offset="0%" stop-color="#d1651c" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#060608" stop-opacity="0" />
    </radialGradient>

    <!-- Sleek Architectural Console Gradient -->
    <linearGradient id="v4ConsoleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111218" />
      <stop offset="100%" stop-color="#0a0b0f" />
    </linearGradient>

    <!-- Metric Card Gradient -->
    <linearGradient id="v4MetricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#101117" />
      <stop offset="100%" stop-color="#090a0e" />
    </linearGradient>

    <!-- Headline Subtle Shimmer Gradient -->
    <linearGradient id="v4HeadlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f4d1b8" />
    </linearGradient>
  </defs>

  <!-- BACKGROUND BASE & ATMOSPHERE -->
  <rect width="1200" height="630" fill="#060608" />
  <rect width="1200" height="630" fill="url(#v4MillimeterGrid)" />
  <rect width="1200" height="630" fill="url(#v4StudioAura)" />
  <rect width="1200" height="630" fill="url(#v4LeftAura)" />

  <!-- ARCHITECTURAL PRECISION BORDER (Strict 28px/32px Margin) -->
  <rect x="32" y="28" width="1136" height="574" fill="none" stroke="#1c1d26" stroke-width="1.2" />
  
  <!-- HARDWARE CORNER ACCENT RIVETS -->
  <g fill="#272833">
    <circle cx="44" cy="40" r="2.5" />
    <circle cx="1156" cy="40" r="2.5" />
    <circle cx="44" cy="590" r="2.5" />
    <circle cx="1156" cy="590" r="2.5" />
  </g>

  <!-- ARCHITECTURAL HUD CORNER REGISTRATION BRACKETS (Subtle, Clean) -->
  <g stroke="#3a3c4d" stroke-width="1.2" opacity="0.8">
    <path d="M 52 64 L 52 50 L 66 50" fill="none" />
    <path d="M 1148 64 L 1148 50 L 1134 50" fill="none" />
    <path d="M 52 566 L 52 580 L 66 580" fill="none" />
    <path d="M 1148 566 L 1148 580 L 1134 580" fill="none" />
  </g>
  <g fill="#d1651c" opacity="0.75">
    <circle cx="52" cy="50" r="2" />
    <circle cx="1148" cy="50" r="2" />
    <circle cx="52" cy="580" r="2" />
    <circle cx="1148" cy="580" r="2" />
  </g>

  <!-- KINETIC 3D GYROSCOPIC VECTOR GRAPHIC (Subtle Blueprint Layer in Background) -->
  <g transform="translate(600, 240)">
    <!-- Concentric Orbital Perspective Ellipses -->
    <ellipse cx="0" cy="0" rx="380" ry="155" fill="none" stroke="#1d1e26" stroke-width="0.9" stroke-dasharray="4 8" opacity="0.5" />
    <ellipse cx="0" cy="0" rx="300" ry="120" fill="none" stroke="#d1651c" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="8 6" />
    <ellipse cx="0" cy="0" rx="220" ry="85" fill="none" stroke="#38bdf8" stroke-opacity="0.14" stroke-width="0.9" />
    <ellipse cx="0" cy="0" rx="140" ry="55" fill="none" stroke="#10b981" stroke-opacity="0.16" stroke-width="0.9" stroke-dasharray="3 4" />

    <!-- Perspective Axes -->
    <line x1="-420" y1="0" x2="420" y2="0" stroke="#ffffff" stroke-opacity="0.03" stroke-width="0.8" />
    <line x1="0" y1="-170" x2="0" y2="170" stroke="#ffffff" stroke-opacity="0.03" stroke-width="0.8" />

    <!-- Cardinal Degree Calibration Labels (Subtle & Crisp: Plus Jakarta Sans) -->
    <!-- Top: 01 STRATEGY -->
    <g transform="translate(0, -125)">
      <circle cx="0" cy="0" r="3.5" fill="#d1651c" opacity="0.85" />
      <text x="0" y="-10" text-anchor="middle" fill="#d1651c" fill-opacity="0.85" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="700" letter-spacing="1">
        01 // STRATEGY
      </text>
    </g>

    <!-- Right: 04 SCALE -->
    <g transform="translate(305, 0)">
      <circle cx="0" cy="0" r="3.5" fill="#10b981" opacity="0.75" />
      <text x="14" y="3.5" fill="#10b981" fill-opacity="0.85" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="700" letter-spacing="1">
        04 // SCALE
      </text>
    </g>

    <!-- Bottom: 03 EXECUTION -->
    <g transform="translate(0, 125)">
      <circle cx="0" cy="0" r="3.5" fill="#38bdf8" opacity="0.75" />
      <text x="0" y="16" text-anchor="middle" fill="#38bdf8" fill-opacity="0.85" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="700" letter-spacing="1">
        03 // EXECUTION
      </text>
    </g>

    <!-- Left: 02 DISCOVERY -->
    <g transform="translate(-305, 0)">
      <circle cx="0" cy="0" r="3.5" fill="#d1651c" opacity="0.85" />
      <text x="-14" y="3.5" text-anchor="end" fill="#d1651c" fill-opacity="0.85" font-family="Plus Jakarta Sans" font-size="9.5" font-weight="700" letter-spacing="1">
        02 // DISCOVERY
      </text>
    </g>
  </g>

  <!-- TOP HUD SYSTEM TELEMETRY (y=54) -->
  <g transform="translate(72, 54)">
    <text x="0" y="0" fill="#636674" font-family="Plus Jakarta Sans" font-size="11" font-weight="700" letter-spacing="1">
      // PM_SYS: CORE_V26 • 0→1 PRODUCT ARCHITECTURE
    </text>
    <text x="1056" y="0" text-anchor="end" fill="#d1651c" font-family="Plus Jakarta Sans" font-size="11" font-weight="700" letter-spacing="1">
      AVAILABLE FOR PM ROLES ✦
    </text>
  </g>

  <!-- ========================================================== -->
  <!-- PRIMARY FOREGROUND CONTENT HIERARCHY (Heuristic Ergonomics) -->
  <!-- ========================================================== -->
  <g transform="translate(600, 0)">
    
    <!-- 1. Top Status Badge (y=78 to 110, Height=32px, Radius=16px) -->
    <g transform="translate(0, 78)">
      <rect x="-175" y="0" width="350" height="32" rx="16" fill="#101117" stroke="#252634" stroke-width="1" />
      <circle cx="-152" cy="16" r="3.5" fill="#10b981" />
      <circle cx="-152" cy="16" r="7.5" fill="none" stroke="#10b981" stroke-width="1" opacity="0.3" />
      <text x="10" y="20.5" text-anchor="middle" fill="#d4d4d8" font-family="Plus Jakarta Sans" font-size="11" font-weight="700" letter-spacing="0.5">
        LEAD PRODUCT MANAGER PORTFOLIO
      </text>
    </g>

    <!-- 2. Display Name Headline (Baseline at y=162, Unbounded 900, 58px) -->
    <text x="0" y="162" text-anchor="middle" fill="url(#v4HeadlineGrad)" font-family="Unbounded" font-size="58" font-weight="900" letter-spacing="-2.2">
      GULSHAN KUMAR SAHU
    </text>

    <!-- 3. Core Pillar Scope Capsule (y=182 to 210, Height=28px) -->
    <g transform="translate(0, 182)">
      <rect x="-240" y="0" width="480" height="28" rx="14" fill="#12131a" stroke="#262738" stroke-width="0.8" />
      <text x="0" y="18" text-anchor="middle" fill="#d1651c" font-family="Plus Jakarta Sans" font-size="10.5" font-weight="700" letter-spacing="1.5">
        ✦ STRATEGY  •  DISCOVERY  •  EXECUTION  •  SCALE ✦
      </text>
    </g>

    <!-- 4. Chamfered Hardware Console Manifesto (y=232 to 326, Height=94px, Width=820px) -->
    <!-- Minimalist matte chassis with refined subtle accent line & corner rivets -->
    <g transform="translate(-410, 232)">
      <path d="M 18 0 L 802 0 L 820 18 L 820 76 L 802 94 L 18 94 L 0 76 L 0 18 Z" 
            fill="url(#v4ConsoleGrad)" stroke="#232532" stroke-width="1.2" />

      <!-- Minimal Corner Accents -->
      <circle cx="16" cy="16" r="2" fill="#d1651c" opacity="0.6" />
      <circle cx="804" cy="16" r="2" fill="#d1651c" opacity="0.6" />
      <circle cx="16" cy="78" r="2" fill="#d1651c" opacity="0.6" />
      <circle cx="804" cy="78" r="2" fill="#d1651c" opacity="0.6" />

      <!-- Refined Quote Text -->
      <text x="410" y="38" text-anchor="middle" fill="#e4e4e7" font-family="Plus Jakarta Sans" font-size="18.5" font-weight="600">
        "I build products where AI meets data, UX meets business,
      </text>
      <text x="410" y="68" text-anchor="middle" fill="#d1651c" font-family="Plus Jakarta Sans" font-size="19" font-weight="700">
        and ideas become outcomes."
      </text>
    </g>

    <!-- 5. Trio of Tactical Telemetry Blocks (y=348 to 418, Height=70px, Width=820px total) -->
    <g transform="translate(-410, 348)">
      
      <!-- Block 1: Experience & Track Record -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="260" height="70" rx="10" fill="url(#v4MetricGrad)" stroke="#20212d" stroke-width="1" />
        <circle cx="22" cy="35" r="4" fill="#d1651c" />
        <text x="38" y="30" fill="#ffffff" font-family="Unbounded" font-size="16" font-weight="900">5+ YEARS</text>
        <text x="38" y="50" fill="#8e909e" font-family="Plus Jakarta Sans" font-size="10" font-weight="700">PM LEADERSHIP</text>
        <!-- Milestone Progress Gauge -->
        <line x1="175" y1="35" x2="240" y2="35" stroke="#1f202c" stroke-width="3" stroke-linecap="round" />
        <line x1="175" y1="35" x2="228" y2="35" stroke="#d1651c" stroke-width="3" stroke-linecap="round" />
      </g>

      <!-- Block 2: Platforms Shipped -->
      <g transform="translate(280, 0)">
        <rect x="0" y="0" width="260" height="70" rx="10" fill="url(#v4MetricGrad)" stroke="#20212d" stroke-width="1" />
        <circle cx="22" cy="35" r="4" fill="#38bdf8" />
        <text x="38" y="30" fill="#ffffff" font-family="Unbounded" font-size="16" font-weight="900">5+ TOOLS</text>
        <text x="38" y="50" fill="#8e909e" font-family="Plus Jakarta Sans" font-size="10" font-weight="700">PLATFORMS SHIPPED</text>
        <!-- Sparkline Vector -->
        <polyline points="175,42 190,36 205,44 220,26 235,30 242,22" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </g>

      <!-- Block 3: Enterprise Adoption & Impact -->
      <g transform="translate(560, 0)">
        <rect x="0" y="0" width="260" height="70" rx="10" fill="url(#v4MetricGrad)" stroke="#20212d" stroke-width="1" />
        <circle cx="22" cy="35" r="4" fill="#10b981" />
        <text x="38" y="30" fill="#ffffff" font-family="Unbounded" font-size="16" font-weight="900">FORTUNE 500</text>
        <text x="38" y="50" fill="#8e909e" font-family="Plus Jakarta Sans" font-size="10" font-weight="700">ENTERPRISE SCALE</text>
        <!-- Target Radar Reticle -->
        <circle cx="224" cy="35" r="10" fill="none" stroke="#10b981" stroke-width="1" opacity="0.5" />
        <circle cx="224" cy="35" r="3" fill="#10b981" />
      </g>
    </g>

    <!-- 6. Bottom Registration Footer & Live Portfolio Link (y=446 to 530) -->
    <g transform="translate(0, 446)">
      <line x1="-410" y1="0" x2="410" y2="0" stroke="#171822" stroke-width="1" />
      
      <g transform="translate(0, 32)">
        <circle cx="-195" cy="-4.5" r="3" fill="#d1651c" opacity="0.8" />
        <text x="0" y="0" text-anchor="middle" fill="#ffffff" font-family="Plus Jakarta Sans" font-size="13.5" font-weight="700" letter-spacing="1">
          SAHU-GULSHAN.GITHUB.IO/PORTFOLIO
        </text>
        <circle cx="195" cy="-4.5" r="3" fill="#d1651c" opacity="0.8" />
      </g>

      <text x="0" y="56" text-anchor="middle" fill="#636674" font-family="Plus Jakarta Sans" font-size="11" font-weight="700" letter-spacing="0.5">
        ✦ INTERACTIVE 0→1 CASE STUDIES &amp; PRODUCT ARCHITECTURES ✦
      </text>
    </g>
  </g>
</svg>`;

// Write primary SVG
fs.writeFileSync("public/og-image.svg", svg);

// Render high-resolution 1200x630 PNG
const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: {
    fontDirs: [".fonts"],
    loadSystemFonts: false,
    defaultFontFamily: "Plus Jakarta Sans",
  },
});
const pngBuffer = resvg.render().asPng();
fs.writeFileSync("public/og-image.png", pngBuffer);

console.log(`Successfully generated public/og-image.png (${pngBuffer.length} bytes) and public/og-image.svg!`);
