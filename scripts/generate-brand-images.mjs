/**
 * Generate brand identity PNG images from Hugov2.pen design data.
 * Outputs to public/diagrams/brand-*.png
 */
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "..", "public", "diagrams");
mkdirSync(OUT, { recursive: true });

function svg(w, h, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;family=Fraunces:wght@600&amp;display=swap');</style></defs>
  ${content}
</svg>`;
}

// ═══════════════════════════════════════════════
// 1. Proposal A — Warm Indigo + Gold
// ═══════════════════════════════════════════════
function proposalA() {
  const W = 1200, H = 900;
  const swatches = [
    { color: "#5B45A8", label: "Primary" },
    { color: "#7B6BC4", label: "Secondary" },
    { color: "#E8C97B", label: "Accent" },
    { color: "#2D9B6F", label: "Success" },
    { color: "#E8A440", label: "Warning" },
    { color: "#D14D4D", label: "Error" },
  ];
  return svg(W, H, `
    <!-- Background -->
    <rect width="${W}" height="${H}" fill="#F9F7FF" rx="16"/>

    <!-- Header bar -->
    <rect y="0" width="${W}" height="64" fill="#FFFFFF" rx="16"/>
    <rect y="16" width="${W}" height="48" fill="#FFFFFF"/>
    <line x1="0" y1="64" x2="${W}" y2="64" stroke="#3D2B7A" stroke-opacity="0.07" stroke-width="1"/>
    <circle cx="32" cy="32" r="14" fill="#5B45A8"/>
    <text x="56" y="38" font-family="Fraunces, serif" font-size="18" font-weight="600" fill="#1A1527">hugo</text>
    <text x="520" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#6B6480">Dashboard</text>
    <text x="620" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#6B6480">Subscriptions</text>
    <text x="740" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#6B6480">Insurance</text>

    <!-- Tag -->
    <rect x="64" y="100" width="260" height="28" rx="14" fill="#3D2B7A" fill-opacity="0.08"/>
    <text x="194" y="118" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#5B45A8">● PROPOSAL A — WARM INDIGO + GOLD</text>

    <!-- Hero -->
    <defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F9F7FF"/><stop offset="100%" stop-color="#EEEAFC"/></linearGradient></defs>
    <rect x="0" y="80" width="${W}" height="260" fill="url(#gA)"/>
    <text x="64" y="180" font-family="Fraunces, serif" font-size="44" font-weight="600" fill="#1A1527" letter-spacing="-1">Your finances,</text>
    <text x="64" y="230" font-family="Fraunces, serif" font-size="44" font-weight="600" fill="#1A1527" letter-spacing="-1">under one roof.</text>
    <text x="64" y="265" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#6B6480">Hugo keeps watch over your subscriptions and insurance — so you don't have to.</text>
    <rect x="64" y="290" width="120" height="40" rx="8" fill="#5B45A8"/>
    <text x="124" y="315" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">Get Started</text>
    <rect x="200" y="290" width="120" height="40" rx="8" fill="none" stroke="#5B45A8" stroke-width="1.5"/>
    <text x="260" y="315" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#5B45A8">Learn More</text>

    <!-- Dashboard Preview -->
    <text x="64" y="385" font-family="Fraunces, serif" font-size="24" font-weight="600" fill="#1A1527">Dashboard Preview</text>
    ${["Monthly Spend|2.847 kr|−12% fra last month|#5B45A8", "Active Subscriptions|14|2 new in last week|#5B45A8", "Potential Savings|485 kr|AI-detected overlaps|#2D9B6F"].map((s, i) => {
      const [label, value, sub, color] = s.split("|");
      const x = 64 + i * 370;
      return `
        <rect x="${x}" y="405" width="340" height="100" rx="12" fill="#FFFFFF" stroke="#3D2B7A" stroke-opacity="0.06" stroke-width="1"/>
        <text x="${x + 20}" y="432" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#6B6480">${label}</text>
        <text x="${x + 20}" y="468" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" fill="#1A1527">${value}</text>
        <text x="${x + 20}" y="490" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="${color}">${sub}</text>
      `;
    }).join("")}

    <!-- Color Palette -->
    <rect x="0" y="560" width="${W}" height="340" fill="#F3F0FA" rx="0"/>
    <text x="64" y="596" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#6B6480" letter-spacing="1.5">COLOR PALETTE</text>
    ${swatches.map((s, i) => {
      const x = 64 + i * 180;
      return `
        <rect x="${x}" y="615" width="160" height="56" rx="8" fill="${s.color}"/>
        <text x="${x + 80}" y="692" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#6B6480">${s.label}</text>
        <text x="${x + 80}" y="706" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#6B6480">${s.color}</text>
      `;
    }).join("")}

    <!-- Typography -->
    <text x="64" y="755" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#6B6480" letter-spacing="1.5">TYPOGRAPHY</text>
    <text x="64" y="800" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#1A1527">Hugo keeps your</text>
    <text x="64" y="838" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#1A1527">finances in check.</text>
    <text x="64" y="862" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#6B6480">Display — Fraunces</text>
    <text x="600" y="800" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#1A1527">The quick brown fox jumps</text>
    <text x="600" y="824" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#1A1527">over the lazy dog. 0123456789</text>
    <text x="600" y="848" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#6B6480">UI — Plus Jakarta Sans</text>
  `);
}

// ═══════════════════════════════════════════════
// 2. Proposal B — Forest Green + Cream
// ═══════════════════════════════════════════════
function proposalB() {
  const W = 1200, H = 900;
  const swatches = [
    { color: "#2D7A4E", label: "Primary" },
    { color: "#5BA37B", label: "Secondary" },
    { color: "#E07A5F", label: "Accent" },
    { color: "#F7F3EC", label: "Background" },
    { color: "#D4A43A", label: "Warning" },
    { color: "#C44B4B", label: "Error" },
  ];
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="#F7F3EC" rx="16"/>
    <rect y="0" width="${W}" height="64" fill="#FFFFFF" rx="16"/>
    <rect y="16" width="${W}" height="48" fill="#FFFFFF"/>
    <line x1="0" y1="64" x2="${W}" y2="64" stroke="#1A3A2A" stroke-opacity="0.07"/>
    <circle cx="32" cy="32" r="14" fill="#2D7A4E"/>
    <text x="56" y="38" font-family="Fraunces, serif" font-size="18" font-weight="600" fill="#1A3A2A">hugo</text>
    <text x="520" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#6B7B71">Dashboard</text>
    <text x="620" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#6B7B71">Subscriptions</text>
    <text x="740" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#6B7B71">Insurance</text>

    <rect x="64" y="100" width="280" height="28" rx="14" fill="#2D7A4E" fill-opacity="0.08"/>
    <text x="204" y="118" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#2D7A4E">● PROPOSAL B — FOREST GREEN + CREAM</text>

    <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F7F3EC"/><stop offset="100%" stop-color="#EBE5DA"/></linearGradient></defs>
    <rect x="0" y="80" width="${W}" height="260" fill="url(#gB)"/>
    <text x="64" y="180" font-family="Fraunces, serif" font-size="44" font-weight="600" fill="#1A3A2A" letter-spacing="-1">Your finances,</text>
    <text x="64" y="230" font-family="Fraunces, serif" font-size="44" font-weight="600" fill="#1A3A2A" letter-spacing="-1">under one roof.</text>
    <text x="64" y="265" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#6B7B71">Hugo keeps watch over your subscriptions and insurance — so you don't have to.</text>
    <rect x="64" y="290" width="120" height="40" rx="8" fill="#2D7A4E"/>
    <text x="124" y="315" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">Get Started</text>
    <rect x="200" y="290" width="120" height="40" rx="8" fill="none" stroke="#2D7A4E" stroke-width="1.5"/>
    <text x="260" y="315" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#2D7A4E">Learn More</text>

    <text x="64" y="385" font-family="Fraunces, serif" font-size="24" font-weight="600" fill="#1A3A2A">Dashboard Preview</text>
    ${["Monthly Spend|2.847 kr|−12% fra last month|#2D7A4E", "Active Subscriptions|14|2 new in last week|#2D7A4E", "Potential Savings|485 kr|AI-detected overlaps|#2D7A4E"].map((s, i) => {
      const [label, value, sub, color] = s.split("|");
      const x = 64 + i * 370;
      return `
        <rect x="${x}" y="405" width="340" height="100" rx="12" fill="#FFFFFF" stroke="#1A3A2A" stroke-opacity="0.06"/>
        <text x="${x + 20}" y="432" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#6B7B71">${label}</text>
        <text x="${x + 20}" y="468" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" fill="#1A3A2A">${value}</text>
        <text x="${x + 20}" y="490" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="${color}">${sub}</text>
      `;
    }).join("")}

    <rect x="0" y="560" width="${W}" height="340" fill="#EBE5DA"/>
    <text x="64" y="596" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#6B7B71" letter-spacing="1.5">COLOR PALETTE</text>
    ${swatches.map((s, i) => {
      const x = 64 + i * 180;
      return `
        <rect x="${x}" y="615" width="160" height="56" rx="8" fill="${s.color}" ${s.color === "#F7F3EC" ? 'stroke="#D0C8B8" stroke-width="1"' : ""}/>
        <text x="${x + 80}" y="692" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#6B7B71">${s.label}</text>
        <text x="${x + 80}" y="706" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#6B7B71">${s.color}</text>
      `;
    }).join("")}

    <text x="64" y="755" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#6B7B71" letter-spacing="1.5">TYPOGRAPHY</text>
    <text x="64" y="800" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#1A3A2A">Hugo keeps your</text>
    <text x="64" y="838" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#1A3A2A">finances in check.</text>
    <text x="64" y="862" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#6B7B71">Display — Fraunces</text>
    <text x="600" y="800" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#1A3A2A">The quick brown fox jumps</text>
    <text x="600" y="824" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#1A3A2A">over the lazy dog. 0123456789</text>
    <text x="600" y="848" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#6B7B71">UI — Plus Jakarta Sans</text>
  `);
}

// ═══════════════════════════════════════════════
// 3. Proposal C — Slate Blue + Terracotta (CHOSEN)
// ═══════════════════════════════════════════════
function proposalC() {
  const W = 1200, H = 900;
  const swatches = [
    { color: "#4A6FA5", label: "Primary" },
    { color: "#7B9DC4", label: "Secondary" },
    { color: "#C8644A", label: "Accent" },
    { color: "#F5F7FA", label: "Background" },
    { color: "#D4A43A", label: "Warning" },
    { color: "#C44B4B", label: "Error" },
  ];
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="#F5F7FA" rx="16"/>
    <rect y="0" width="${W}" height="64" fill="#FFFFFF" rx="16"/>
    <rect y="16" width="${W}" height="48" fill="#FFFFFF"/>
    <line x1="0" y1="64" x2="${W}" y2="64" stroke="#2C3E6B" stroke-opacity="0.07"/>
    <circle cx="32" cy="32" r="14" fill="#4A6FA5"/>
    <text x="56" y="38" font-family="Fraunces, serif" font-size="18" font-weight="600" fill="#141C2E">hugo</text>
    <text x="520" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#7A8599">Dashboard</text>
    <text x="620" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#7A8599">Subscriptions</text>
    <text x="740" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#7A8599">Insurance</text>

    <!-- CHOSEN badge -->
    <rect x="64" y="100" width="340" height="28" rx="14" fill="#C8644A" fill-opacity="0.1"/>
    <text x="234" y="118" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#C8644A">★ PROPOSAL C — SLATE BLUE + TERRACOTTA (CHOSEN)</text>

    <defs><linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F5F7FA"/><stop offset="100%" stop-color="#E8EAF0"/></linearGradient></defs>
    <rect x="0" y="80" width="${W}" height="260" fill="url(#gC)"/>
    <text x="64" y="180" font-family="Fraunces, serif" font-size="44" font-weight="600" fill="#141C2E" letter-spacing="-1">Your finances,</text>
    <text x="64" y="230" font-family="Fraunces, serif" font-size="44" font-weight="600" fill="#141C2E" letter-spacing="-1">under one roof.</text>
    <text x="64" y="265" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#7A8599">Hugo keeps watch over your subscriptions and insurance — so you don't have to.</text>
    <rect x="64" y="290" width="120" height="40" rx="8" fill="#4A6FA5"/>
    <text x="124" y="315" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">Get Started</text>
    <rect x="200" y="290" width="120" height="40" rx="8" fill="none" stroke="#4A6FA5" stroke-width="1.5"/>
    <text x="260" y="315" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#4A6FA5">Learn More</text>

    <text x="64" y="385" font-family="Fraunces, serif" font-size="24" font-weight="600" fill="#141C2E">Dashboard Preview</text>
    ${["Monthly Spend|2.847 kr|−12% fra last month|#4A6FA5", "Active Subscriptions|14|2 new in last week|#4A6FA5", "Potential Savings|485 kr|AI-detected overlaps|#C8644A"].map((s, i) => {
      const [label, value, sub, color] = s.split("|");
      const x = 64 + i * 370;
      return `
        <rect x="${x}" y="405" width="340" height="100" rx="12" fill="#FFFFFF" stroke="#2C3E6B" stroke-opacity="0.06"/>
        <text x="${x + 20}" y="432" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#7A8599">${label}</text>
        <text x="${x + 20}" y="468" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" fill="#141C2E">${value}</text>
        <text x="${x + 20}" y="490" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="${color}">${sub}</text>
      `;
    }).join("")}

    <rect x="0" y="560" width="${W}" height="340" fill="#E8EAF0"/>
    <text x="64" y="596" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#7A8599" letter-spacing="1.5">COLOR PALETTE</text>
    ${swatches.map((s, i) => {
      const x = 64 + i * 180;
      return `
        <rect x="${x}" y="615" width="160" height="56" rx="8" fill="${s.color}" ${s.color === "#F5F7FA" ? 'stroke="#D0D5DD" stroke-width="1"' : ""}/>
        <text x="${x + 80}" y="692" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#7A8599">${s.label}</text>
        <text x="${x + 80}" y="706" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500" fill="#7A8599">${s.color}</text>
      `;
    }).join("")}

    <text x="64" y="755" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#7A8599" letter-spacing="1.5">TYPOGRAPHY</text>
    <text x="64" y="800" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#141C2E">Hugo keeps your</text>
    <text x="64" y="838" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#141C2E">finances in check.</text>
    <text x="64" y="862" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">Display — Fraunces</text>
    <text x="600" y="800" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#141C2E">The quick brown fox jumps</text>
    <text x="600" y="824" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#141C2E">over the lazy dog. 0123456789</text>
    <text x="600" y="848" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">UI — Plus Jakarta Sans</text>
  `);
}

// ═══════════════════════════════════════════════
// 4. Logo Explorations
// ═══════════════════════════════════════════════
function logoExplorations() {
  const W = 1400, H = 400;
  const logos = [
    { label: "1. CLEAN WORDMARK", desc: "Pure serif wordmark — confident,\nminimal, name-forward. Like Stripe.", type: "text" },
    { label: "2. SHIELD MONOGRAM", desc: "Shield = protection/guardian.\nLowercase h = approachable.", type: "shield" },
    { label: "3. ORBITAL RING", desc: "Circle = recurring/cyclical.\nDot = active monitoring.", type: "orbital" },
    { label: "4. ROUNDED BADGE", desc: "Pill badge — modern, app-icon\nfriendly. Like a trust stamp.", type: "badge" },
  ];
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="#FFFFFF" rx="16" stroke="#00000010" stroke-width="1"/>
    <text x="48" y="56" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#1A1527">Logo Explorations</text>
    <text x="48" y="80" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#888888">Four different directions for the Hugo brand mark</text>

    ${logos.map((l, i) => {
      const x = 260 + i * 280;
      const lines = l.desc.split("\n");
      let mark = "";
      if (l.type === "text") {
        mark = `<text x="${x + 120}" y="205" text-anchor="middle" font-family="Fraunces, serif" font-size="48" font-weight="600" fill="#1A1527" letter-spacing="-1.5">hugo</text>`;
      } else if (l.type === "shield") {
        mark = `
          <rect x="${x + 92}" y="156" width="56" height="64" rx="8" fill="#5B45A8"/>
          <rect x="${x + 92}" y="196" width="56" height="24" rx="16" fill="#5B45A8"/>
          <text x="${x + 120}" y="200" text-anchor="middle" font-family="Fraunces, serif" font-size="32" font-weight="600" fill="#FFFFFF">h</text>
          <text x="${x + 120}" y="252" text-anchor="middle" font-family="Fraunces, serif" font-size="24" font-weight="600" fill="#1A1527" letter-spacing="-0.5">hugo</text>
        `;
      } else if (l.type === "orbital") {
        mark = `
          <circle cx="${x + 120}" cy="185" r="26" fill="none" stroke="#4A6FA5" stroke-width="3"/>
          <text x="${x + 120}" y="195" text-anchor="middle" font-family="Fraunces, serif" font-size="28" font-weight="600" fill="#4A6FA5">h</text>
          <circle cx="${x + 146}" cy="165" r="5" fill="#C8644A"/>
          <text x="${x + 120}" y="242" text-anchor="middle" font-family="Fraunces, serif" font-size="24" font-weight="600" fill="#1A1527" letter-spacing="-0.5">hugo</text>
        `;
      } else {
        mark = `
          <rect x="${x + 66}" y="170" width="108" height="44" rx="22" fill="#4A6FA5"/>
          <text x="${x + 120}" y="199" text-anchor="middle" font-family="Fraunces, serif" font-size="22" font-weight="600" fill="#FFFFFF" letter-spacing="-0.5">hugo</text>
        `;
      }
      return `
        <rect x="${x}" y="110" width="240" height="260" rx="12" fill="#FAFAFA"/>
        <text x="${x + 120}" y="140" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600" fill="#999999" letter-spacing="1.5">${l.label}</text>
        ${mark}
        ${lines.map((ln, j) => `<text x="${x + 120}" y="${310 + j * 16}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#999999">${ln}</text>`).join("")}
      `;
    }).join("")}
  `);
}

// ═══════════════════════════════════════════════
// 5. Dashboard Mockup (Proposal C)
// ═══════════════════════════════════════════════
function dashboardMockup() {
  const W = 1440, H = 700;
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="#F5F7FA" rx="12"/>

    <!-- Navbar -->
    <rect width="${W}" height="60" fill="#FFFFFF" rx="12"/>
    <rect y="12" width="${W}" height="48" fill="#FFFFFF"/>
    <line x1="0" y1="60" x2="${W}" y2="60" stroke="#141C2E" stroke-opacity="0.03"/>
    <circle cx="46" cy="30" r="14" fill="none" stroke="#4A6FA5" stroke-width="2"/>
    <text x="40" y="35" font-family="Fraunces, serif" font-size="14" font-weight="600" fill="#4A6FA5">h</text>
    <circle cx="56" cy="20" r="3" fill="#C8644A"/>
    <text x="76" y="36" font-family="Fraunces, serif" font-size="18" font-weight="600" fill="#141C2E">hugo</text>
    <text x="620" y="36" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#4A6FA5" font-weight="500">Dashboard</text>
    <text x="740" y="36" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#7A8599">Subscriptions</text>
    <text x="860" y="36" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#7A8599">Insurance</text>

    <!-- Header row -->
    <text x="32" y="100" font-family="Plus Jakarta Sans, sans-serif" font-size="22" font-weight="700" fill="#141C2E">Good morning, Hugo</text>
    <text x="32" y="120" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#7A8599">Here's what's due. Last sync: Mon 03 March 2025.</text>
    <rect x="920" y="80" width="150" height="36" rx="8" fill="#4A6FA5"/>
    <text x="995" y="103" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">+ Add Subscription</text>
    <rect x="1080" y="80" width="140" height="36" rx="8" fill="none" stroke="#4A6FA5" stroke-width="1.5"/>
    <text x="1150" y="103" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#4A6FA5">Import from Email</text>

    <!-- Stat cards -->
    ${[
      { label: "Monthly Spend", value: "2.847 kr", sub: "↑ 12% from last month", subColor: "#C8644A" },
      { label: "Active Subscriptions", value: "14", sub: "↑ 2 new this week", subColor: "#4A6FA5" },
      { label: "Tracked Policies", value: "4", sub: "3 policies analyzed", subColor: "#4A6FA5" },
      { label: "Potential Savings", value: "485 kr/mo", sub: "● 4 AI-detected overlaps", subColor: "#C8644A" },
    ].map((c, i) => {
      const x = 32 + i * 248;
      return `
        <rect x="${x}" y="145" width="232" height="95" rx="12" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
        <text x="${x + 16}" y="170" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">${c.label}</text>
        <text x="${x + 16}" y="205" font-family="Plus Jakarta Sans, sans-serif" font-size="26" font-weight="700" fill="#141C2E">${c.value}</text>
        <text x="${x + 16}" y="226" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${c.subColor}">${c.sub}</text>
      `;
    }).join("")}

    <!-- Subscriptions table -->
    <rect x="32" y="260" width="970" height="410" rx="12" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="52" y="292" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="600" fill="#141C2E">Upcoming Renewals</text>
    <text x="930" y="292" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#4A6FA5">View All</text>
    <line x1="52" y1="308" x2="982" y2="308" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="52" y="328" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">Service</text>
    <text x="400" y="328" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">Category</text>
    <text x="600" y="328" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">Renewal</text>
    <text x="900" y="328" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">Cost</text>
    ${[
      { name: "Netflix", cat: "Entertainment", date: "Mar 12, 2026", cost: "149 kr", color: "#E50914" },
      { name: "Spotify", cat: "Music", date: "Mar 15, 2026", cost: "79 kr", color: "#1DB954" },
      { name: "Microsoft 365", cat: "Productivity", date: "Mar 18, 2026", cost: "89 kr", color: "#0078D4" },
      { name: "Amazon Prime", cat: "Shopping", date: "Mar 22, 2026", cost: "49 kr", color: "#FF9900" },
    ].map((r, i) => {
      const y = 360 + i * 50;
      return `
        <circle cx="66" cy="${y}" r="14" fill="${r.color}"/>
        <text x="60" y="${y + 5}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">${r.name[0]}</text>
        <text x="90" y="${y - 4}" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#141C2E">${r.name}</text>
        <text x="90" y="${y + 12}" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">${r.cat}</text>
        <text x="400" y="${y + 4}" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#7A8599">${r.cat}</text>
        <text x="600" y="${y + 4}" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#7A8599">${r.date}</text>
        <text x="900" y="${y + 4}" text-anchor="end" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#141C2E">${r.cost}</text>
        <line x1="52" y1="${y + 25}" x2="982" y2="${y + 25}" stroke="#141C2E" stroke-opacity="0.03"/>
      `;
    }).join("")}

    <!-- Sidebar: AI Insights -->
    <rect x="1020" y="260" width="390" height="200" rx="12" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="1040" y="292" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="600" fill="#141C2E">AI Insights</text>
    <rect x="1040" y="310" width="350" height="56" rx="8" fill="#C8644A" fill-opacity="0.08"/>
    <text x="1056" y="333" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#C8644A">Coverage Overlap</text>
    <text x="1056" y="352" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">Your car and home policies both cover liability. You</text>
    <rect x="1040" y="376" width="350" height="56" rx="8" fill="#4A6FA5" fill-opacity="0.08"/>
    <text x="1056" y="399" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#4A6FA5">Savings Potential</text>
    <text x="1056" y="418" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">Bundling your 3 insurance policies could save up to...</text>

    <!-- Sidebar: Spending -->
    <rect x="1020" y="475" width="390" height="195" rx="12" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="1040" y="507" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="600" fill="#141C2E">Spending by Category</text>
    ${[
      { cat: "Entertainment", pct: 0.45, color: "#C8644A", label: "845 kr" },
      { cat: "Productivity", pct: 0.25, color: "#4A6FA5", label: "524 kr" },
      { cat: "Music", pct: 0.15, color: "#D4A43A", label: "79 kr" },
    ].map((b, i) => {
      const y = 530 + i * 40;
      return `
        <text x="1040" y="${y + 10}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">${b.cat}</text>
        <rect x="1160" y="${y}" width="180" height="14" rx="7" fill="#F0F2F5"/>
        <rect x="1160" y="${y}" width="${180 * b.pct}" height="14" rx="7" fill="${b.color}"/>
        <text x="1360" y="${y + 10}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#141C2E">${b.label}</text>
      `;
    }).join("")}
  `);
}

// ═══════════════════════════════════════════════
// 6. Landing Page (Proposal C)
// ═══════════════════════════════════════════════
function landingPage() {
  const W = 1440, H = 1600;
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="#FFFFFF" rx="12"/>

    <!-- Header -->
    <rect width="${W}" height="64" fill="#FFFFFF" rx="12"/>
    <rect y="12" width="${W}" height="52" fill="#FFFFFF"/>
    <line x1="0" y1="64" x2="${W}" y2="64" stroke="#141C2E" stroke-opacity="0.02"/>
    <circle cx="62" cy="32" r="13" fill="none" stroke="#4A6FA5" stroke-width="2"/>
    <text x="56" y="37" font-family="Fraunces, serif" font-size="14" font-weight="600" fill="#4A6FA5">h</text>
    <circle cx="75" cy="22" r="3" fill="#C8644A"/>
    <text x="90" y="38" font-family="Fraunces, serif" font-size="18" font-weight="600" fill="#141C2E">hugo</text>
    ${["Features", "Pricing", "About", "FAQ"].map((t, i) => `<text x="${580 + i * 80}" y="38" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#7A8599">${t}</text>`).join("")}
    <text x="1280" y="38" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="500" fill="#141C2E">Log in</text>
    <rect x="1320" y="18" width="80" height="32" rx="8" fill="#4A6FA5"/>
    <text x="1360" y="39" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF">Sign up</text>

    <!-- Hero -->
    <rect x="0" y="64" width="${W}" height="640" fill="#FFFFFF"/>
    <rect x="570" y="100" width="300" height="28" rx="14" fill="#4A6FA5" fill-opacity="0.04" stroke="#4A6FA5" stroke-opacity="0.12"/>
    <circle cx="594" cy="114" r="3" fill="#3B8A6E"/>
    <text x="720" y="118" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="500" fill="#4A6FA5">Now with AI-powered insurance analysis</text>

    <text x="720" y="190" text-anchor="middle" font-family="Fraunces, serif" font-size="56" font-weight="600" fill="#141C2E" letter-spacing="-1.5">Every subscription.</text>
    <text x="720" y="255" text-anchor="middle" font-family="Fraunces, serif" font-size="56" font-weight="600" fill="#141C2E" letter-spacing="-1.5">Every policy.</text>
    <text x="720" y="320" text-anchor="middle" font-family="Fraunces, serif" font-size="56" font-weight="600" fill="#141C2E" letter-spacing="-1.5">One calm overview.</text>

    <text x="720" y="370" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="18" fill="#7A8599">Hugo watches your recurring payments and insurance policies so you</text>
    <text x="720" y="396" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="18" fill="#7A8599">never overpay, miss a renewal, or leave a coverage gap.</text>

    <rect x="580" y="425" width="160" height="48" rx="10" fill="#4A6FA5"/>
    <text x="660" y="454" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="600" fill="#FFFFFF">Start for free →</text>
    <rect x="756" y="425" width="120" height="48" rx="10" fill="none" stroke="#141C2E" stroke-opacity="0.08"/>
    <text x="816" y="454" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="15" font-weight="500" fill="#141C2E">See how ↓</text>

    <text x="720" y="500" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="12" fill="#A0AEC0">No credit card required · Free forever for up to 10 subscriptions</text>

    <!-- Dashboard preview (simplified) -->
    <rect x="170" y="530" width="1100" height="160" rx="12" fill="#F5F7FA" stroke="#141C2E" stroke-opacity="0.06"/>
    <rect x="170" y="530" width="1100" height="36" rx="12" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <circle cx="190" cy="548" r="6" fill="#FF5F56"/>
    <circle cx="210" cy="548" r="6" fill="#FFBD2E"/>
    <circle cx="230" cy="548" r="6" fill="#27C93F"/>
    <text x="720" y="552" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#A0AEC0">hugo — dashboard</text>
    <text x="300" y="600" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#141C2E">Good morning, Hugo</text>
    <rect x="300" y="616" width="200" height="50" rx="8" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="316" y="636" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">Monthly</text>
    <text x="316" y="654" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#141C2E">2.847 kr</text>
    <rect x="520" y="616" width="200" height="50" rx="8" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="536" y="636" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">Active Subs</text>
    <text x="536" y="654" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#141C2E">14</text>
    <rect x="740" y="616" width="200" height="50" rx="8" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
    <text x="756" y="636" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="#7A8599">Savings</text>
    <text x="756" y="654" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#C8644A">485 kr</text>

    <!-- Trust logos -->
    <rect x="0" y="704" width="${W}" height="100" fill="#FFFFFF"/>
    <text x="720" y="740" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#A0AEC0">Trusted by 2,000+ families across Scandinavia</text>
    ${["Tryg", "Alka", "Topdanmark", "Gjensidige", "Codan"].map((t, i) => `<text x="${380 + i * 140}" y="775" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="700" fill="#C8D1DC">${t}</text>`).join("")}

    <!-- How it works -->
    <rect x="0" y="804" width="${W}" height="300" fill="#F5F7FA"/>
    <text x="720" y="850" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#4A6FA5" letter-spacing="2">HOW IT WORKS</text>
    <text x="720" y="890" text-anchor="middle" font-family="Fraunces, serif" font-size="36" font-weight="600" fill="#141C2E" letter-spacing="-0.5">Three steps to financial clarity</text>
    <text x="720" y="920" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#7A8599">No spreadsheets. No digging through emails. Hugo does the work for you.</text>
    ${[
      { num: "01", title: "Connect", desc: "Link your email or add\nsubscriptions manually." },
      { num: "02", title: "AI scans", desc: "Hugo finds recurring charges\nand insurance policies." },
      { num: "03", title: "Optimize", desc: "Get alerts, find overlaps,\nand save money." },
    ].map((s, i) => {
      const x = 180 + i * 380;
      return `
        <rect x="${x}" y="950" width="340" height="130" rx="16" fill="#FFFFFF" stroke="#141C2E" stroke-opacity="0.04"/>
        <text x="${x + 24}" y="985" font-family="Plus Jakarta Sans, sans-serif" font-size="24" font-weight="700" fill="#4A6FA5" opacity="0.3">${s.num}</text>
        <text x="${x + 24}" y="1010" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="#141C2E">${s.title}</text>
        ${s.desc.split("\n").map((l, j) => `<text x="${x + 24}" y="${1032 + j * 18}" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#7A8599">${l}</text>`).join("")}
      `;
    }).join("")}

    <!-- Features -->
    <rect x="0" y="1104" width="${W}" height="240" fill="#FFFFFF"/>
    <text x="720" y="1146" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#C8644A" letter-spacing="2">FEATURES</text>
    <text x="720" y="1186" text-anchor="middle" font-family="Fraunces, serif" font-size="36" font-weight="600" fill="#141C2E" letter-spacing="-0.5">Everything you need,</text>
    <text x="720" y="1226" text-anchor="middle" font-family="Fraunces, serif" font-size="36" font-weight="600" fill="#141C2E" letter-spacing="-0.5">nothing you don't</text>
    ${[
      { icon: "📧", title: "Email Import", desc: "Gmail &amp; Outlook" },
      { icon: "🛡", title: "Insurance AI", desc: "Gap &amp; overlap detection" },
      { icon: "🔔", title: "Renewal Alerts", desc: "Never miss a payment" },
      { icon: "📊", title: "Spending Analytics", desc: "Charts &amp; trends" },
      { icon: "🌐", title: "Multi-language", desc: "Danish &amp; English" },
      { icon: "👨‍👩‍👧", title: "Household", desc: "Share with family" },
    ].map((f, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 260 + col * 320;
      const y = 1260 + row * 50;
      return `
        <text x="${x}" y="${y}" font-size="16">${f.icon}</text>
        <text x="${x + 26}" y="${y}" font-family="Plus Jakarta Sans, sans-serif" font-size="13" font-weight="600" fill="#141C2E">${f.title}</text>
        <text x="${x + 26}" y="${y + 16}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#7A8599">${f.desc}</text>
      `;
    }).join("")}

    <!-- Stats -->
    <rect x="0" y="1344" width="${W}" height="100" fill="#F5F7FA"/>
    ${[
      { value: "2,847", label: "Subscriptions tracked", color: "#4A6FA5" },
      { value: "430.000 kr", label: "Saved for our users", color: "#C8644A" },
      { value: "98%", label: "User satisfaction", color: "#3B8A6E" },
    ].map((s, i) => {
      const x = 240 + i * 360;
      return `
        <text x="${x}" y="1395" text-anchor="middle" font-family="Fraunces, serif" font-size="36" font-weight="600" fill="${s.color}" letter-spacing="-1">${s.value}</text>
        <text x="${x}" y="1420" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="13" fill="#7A8599">${s.label}</text>
      `;
    }).join("")}

    <!-- Footer -->
    <rect x="0" y="1444" width="${W}" height="156" fill="#141C2E" rx="0"/>
    <text x="720" y="1490" text-anchor="middle" font-family="Fraunces, serif" font-size="36" font-weight="600" fill="#FFFFFF" letter-spacing="-1">Named after what matters most.</text>
    <text x="720" y="1520" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="#7A8599">Hugo was built with the same care you'd give your family. Start protecting your finances today.</text>
    <rect x="640" y="1540" width="160" height="40" rx="8" fill="#4A6FA5"/>
    <text x="720" y="1565" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">Start for free →</text>
    <text x="720" y="1590" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="#4A5568">© 2026 Hugo · Made with love in Copenhagen</text>
  `);
}

// ═══════════════════════════════════════════════
// Generate all
// ═══════════════════════════════════════════════
const images = [
  { name: "brand-proposal-a", fn: proposalA },
  { name: "brand-proposal-b", fn: proposalB },
  { name: "brand-proposal-c", fn: proposalC },
  { name: "brand-logo-explorations", fn: logoExplorations },
  { name: "brand-dashboard-mockup", fn: dashboardMockup },
  { name: "brand-landing-page", fn: landingPage },
];

for (const img of images) {
  const svgStr = img.fn();
  const svgPath = resolve(OUT, `${img.name}.svg`);
  const pngPath = resolve(OUT, `${img.name}.png`);
  writeFileSync(svgPath, svgStr, "utf-8");
  await sharp(Buffer.from(svgStr)).png().resize({ width: 2400 }).toFile(pngPath);
  console.log(`✓ ${img.name}.png`);
}

console.log(`\nGenerated ${images.length} brand images in ${OUT}`);
