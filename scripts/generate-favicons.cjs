const fs = require("fs");
const { Resvg } = require("@resvg/resvg-js");

// 1. Vector Favicon SVG (Scalable & crisp for modern browsers)
const faviconSvg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14151e" />
      <stop offset="100%" stop-color="#08080c" />
    </linearGradient>

    <!-- Warm Accent Glow -->
    <radialGradient id="emberGlow" cx="80%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#ea580c" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
    </radialGradient>

    <!-- Monogram Gradient -->
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="85%" stop-color="#fdf4ee" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
  </defs>

  <!-- Rounded Base Tile -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="512" height="512" rx="112" fill="url(#emberGlow)" />
  
  <!-- Precision Border & Corner Rivet Ring -->
  <rect x="20" y="20" width="472" height="472" rx="92" fill="none" stroke="#2a2c3d" stroke-width="8" />
  <rect x="28" y="28" width="456" height="456" rx="84" fill="none" stroke="#ea580c" stroke-opacity="0.25" stroke-width="2" />

  <!-- Corner Accents -->
  <circle cx="56" cy="56" r="8" fill="#ea580c" opacity="0.8" />
  <circle cx="456" cy="56" r="8" fill="#ea580c" opacity="0.8" />
  <circle cx="56" cy="456" r="8" fill="#ea580c" opacity="0.8" />
  <circle cx="456" cy="456" r="8" fill="#ea580c" opacity="0.8" />

  <!-- GS Monogram Core -->
  <g transform="translate(256, 276)">
    <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" 
          fill="url(#textGrad)" 
          font-family="Unbounded, sans-serif" 
          font-size="220" 
          font-weight="900" 
          letter-spacing="-10">
      GS
    </text>
  </g>

  <!-- Product Spark Star Accent -->
  <g transform="translate(380, 130) scale(1.6)">
    <path d="M0 -15 Q0 0 15 0 Q0 0 0 15 Q0 0 -15 0 Q0 0 0 -15 Z" fill="#ea580c" />
  </g>
</svg>`;

// Write favicon.svg
fs.writeFileSync("public/favicon.svg", faviconSvg);

// Generate Favicon PNGs of multiple resolutions
const sizes = [
  { size: 32, file: "public/favicon-32x32.png" },
  { size: 16, file: "public/favicon-16x16.png" },
  { size: 48, file: "public/favicon.ico" }, // Resvg PNG as ICO fallback
  { size: 180, file: "public/apple-touch-icon.png" },
  { size: 192, file: "public/android-chrome-192x192.png" },
  { size: 512, file: "public/android-chrome-512x512.png" },
];

for (const { size, file } of sizes) {
  const resvg = new Resvg(faviconSvg, {
    fitTo: { mode: "width", value: size },
    font: {
      fontDirs: [".fonts"],
      loadSystemFonts: false,
      defaultFontFamily: "Unbounded",
    },
  });
  const pngData = resvg.render().asPng();
  fs.writeFileSync(file, pngData);
  console.log(`Rendered ${file} (${size}x${size}, ${pngData.length} bytes)`);
}

// 2. Web Manifest
const manifest = {
  name: "Gulshan Kumar Sahu — Product Portfolio",
  short_name: "Gulshan Sahu",
  description: "Product Manager building AI-powered enterprise products at the intersection of business strategy, user experience, and technology.",
  start_url: "./",
  display: "standalone",
  background_color: "#08080c",
  theme_color: "#08080c",
  icons: [
    {
      src: "./android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "./android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "./android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
fs.writeFileSync("public/site.webmanifest", JSON.stringify(manifest, null, 2));

console.log("Successfully generated all favicons, touch icons, and site.webmanifest!");
