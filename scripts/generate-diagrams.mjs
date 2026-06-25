/**
 * Generate SVG process flow diagrams for Hugo documentation.
 * Outputs to public/diagrams/*.svg
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, "..", "public", "diagrams");
mkdirSync(OUT_DIR, { recursive: true });

// Brand colors
const C = {
  primary: "#4A6FA5",
  accent: "#C8644A",
  green: "#22C55E",
  amber: "#F59E0B",
  bg: "#F5F7FA",
  textDark: "#141C2E",
  textMuted: "#64748B",
  white: "#FFFFFF",
  arrow: "#94A3B8",
  lightBlue: "#EBF0F7",
  lightGreen: "#ECFDF5",
  lightAmber: "#FFFBEB",
  lightAccent: "#FDF2F0",
  gmail: "#DC2626",
  gmailBg: "#FEF2F2",
  outlook: "#2563EB",
  outlookBg: "#EFF6FF",
};

// SVG helper: a step box with icon, title, description
function stepBox(x, y, w, h, { icon, title, desc, fillBg, strokeColor }) {
  const cx = x + w / 2;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fillBg}" stroke="${strokeColor}" stroke-width="2"/>
    <text x="${cx}" y="${y + 44}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="24" fill="${strokeColor}">${icon}</text>
    <text x="${cx}" y="${y + 68}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="${C.textDark}">${title}</text>
    ${desc.map((line, i) => `<text x="${cx}" y="${y + 86 + i * 14}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">${line}</text>`).join("\n    ")}
  `;
}

// Arrow between boxes
function arrow(x, y) {
  const ax = x + 20;
  const ay = y;
  return `
    <path d="M${ax - 12},${ay} L${ax + 12},${ay} M${ax + 6},${ay - 6} L${ax + 12},${ay} L${ax + 6},${ay + 6}" stroke="${C.arrow}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

// Legend item
function legendItem(x, y, color, label) {
  return `
    <rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${color}"/>
    <text x="${x + 18}" y="${y + 10}" font-family="Plus Jakarta Sans, sans-serif" font-size="11" fill="${C.textMuted}">${label}</text>
  `;
}

// Badge pill
function badge(x, y, label, color, bgColor) {
  const tw = label.length * 6.5 + 24;
  return `
    <rect x="${x}" y="${y}" width="${tw}" height="28" rx="14" fill="${bgColor}"/>
    <text x="${x + tw / 2}" y="${y + 18}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="${color}">${label}</text>
  `;
}

function wrapSvg(width, height, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&amp;display=swap');
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="${C.white}" rx="16"/>
  ${content}
</svg>`;
}

// ── Diagram 1: System Architecture ──
function systemArchitecture() {
  const W = 1200, H = 620;
  return wrapSvg(W, H, `
    <text x="48" y="52" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" fill="${C.textDark}">System Architecture</text>
    <text x="48" y="78" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="${C.textMuted}">High-level overview of Hugo's three-tier architecture and external service integrations</text>

    <!-- Browser -->
    <rect x="48" y="120" width="180" height="100" rx="12" fill="${C.lightBlue}" stroke="${C.primary}" stroke-width="2"/>
    <text x="138" y="162" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="22" fill="${C.primary}">🖥</text>
    <text x="138" y="186" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="${C.textDark}">Browser</text>
    <text x="138" y="204" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">React 18 + Next.js</text>

    <!-- Arrow -->
    <path d="M228,170 L278,170" stroke="${C.arrow}" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
    <text x="253" y="162" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.arrow}">HTTPS</text>

    <!-- Next.js container -->
    <rect x="278" y="100" width="580" height="240" rx="16" fill="${C.bg}" stroke="${C.primary}" stroke-width="2" stroke-dasharray="6 3"/>
    <text x="568" y="130" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="700" fill="${C.primary}">Next.js 14 App Router</text>

    <!-- Inner boxes -->
    <rect x="298" y="150" width="130" height="70" rx="8" fill="${C.white}" stroke="${C.primary}" stroke-width="1.5"/>
    <text x="363" y="180" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="${C.textDark}">middleware.ts</text>
    <text x="363" y="198" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.textMuted}">Route protection</text>

    <rect x="443" y="150" width="130" height="70" rx="8" fill="${C.white}" stroke="${C.primary}" stroke-width="1.5"/>
    <text x="508" y="180" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="${C.textDark}">API Routes</text>
    <text x="508" y="198" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.textMuted}">REST endpoints</text>

    <rect x="298" y="240" width="130" height="70" rx="8" fill="${C.white}" stroke="${C.primary}" stroke-width="1.5"/>
    <text x="363" y="270" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="${C.textDark}">Zod Validation</text>
    <text x="363" y="288" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.textMuted}">Input schemas</text>

    <rect x="443" y="240" width="130" height="70" rx="8" fill="${C.white}" stroke="${C.primary}" stroke-width="1.5"/>
    <text x="508" y="270" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="${C.textDark}">NextAuth.js v5</text>
    <text x="508" y="288" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.textMuted}">JWT sessions</text>

    <!-- Prisma box inside container -->
    <rect x="598" y="180" width="240" height="100" rx="8" fill="${C.white}" stroke="${C.primary}" stroke-width="1.5"/>
    <text x="718" y="218" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="${C.textDark}">Prisma ORM</text>
    <text x="718" y="236" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.textMuted}">Type-safe DB queries</text>
    <text x="718" y="254" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="${C.textMuted}">Schema migrations</text>

    <!-- Arrows down -->
    <path d="M400,340 L400,400" stroke="${C.arrow}" stroke-width="2" fill="none"/>
    <path d="M568,340 L568,400" stroke="${C.arrow}" stroke-width="2" fill="none"/>
    <path d="M738,340 L738,400" stroke="${C.arrow}" stroke-width="2" fill="none"/>

    <!-- Bottom service boxes -->
    <rect x="298" y="400" width="200" height="90" rx="12" fill="${C.lightBlue}" stroke="${C.primary}" stroke-width="2"/>
    <text x="398" y="438" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="${C.primary}">PostgreSQL (Neon)</text>
    <text x="398" y="458" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">Users, Subscriptions</text>
    <text x="398" y="474" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">Insurance Policies</text>

    <rect x="518" y="400" width="200" height="90" rx="12" fill="${C.lightAccent}" stroke="${C.accent}" stroke-width="2"/>
    <text x="618" y="438" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="${C.accent}">Anthropic Claude</text>
    <text x="618" y="458" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">Email parsing</text>
    <text x="618" y="474" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">Insurance analysis</text>

    <rect x="738" y="400" width="200" height="90" rx="12" fill="${C.lightGreen}" stroke="${C.green}" stroke-width="2"/>
    <text x="838" y="438" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="700" fill="${C.green}">External APIs</text>
    <text x="838" y="458" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">Gmail, Outlook</text>
    <text x="838" y="474" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="10" fill="${C.textMuted}">Google/MS OAuth</text>

    <!-- Legend -->
    <rect x="48" y="530" width="${W - 96}" height="44" rx="8" fill="${C.bg}"/>
    ${legendItem(72, 546, C.primary, "Application Layer")}
    ${legendItem(260, 546, C.accent, "AI Services")}
    ${legendItem(420, 546, C.green, "External APIs")}

    <defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><path d="M0,0 L8,3 L0,6" fill="${C.arrow}"/></marker></defs>
  `);
}

// ── Generic 5-step flow diagram builder ──
function flowDiagram({ title, subtitle, steps, legends, extras = "" }) {
  const W = 1200, H = 480;
  const boxW = 180, boxH = 130;
  const arrowW = 40;
  const totalW = steps.length * boxW + (steps.length - 1) * arrowW;
  const startX = (W - totalW) / 2;
  const boxY = 130;

  let content = `
    <text x="48" y="52" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" fill="${C.textDark}">${title}</text>
    <text x="48" y="78" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="${C.textMuted}">${subtitle}</text>
  `;

  steps.forEach((step, i) => {
    const x = startX + i * (boxW + arrowW);
    content += stepBox(x, boxY, boxW, boxH, step);
    if (i < steps.length - 1) {
      content += arrow(x + boxW, boxY + boxH / 2);
    }
  });

  // Extras row (badges etc)
  content += extras;

  // Legend bar
  const legendY = H - 60;
  content += `<rect x="48" y="${legendY}" width="${W - 96}" height="44" rx="8" fill="${C.bg}"/>`;
  legends.forEach((leg, i) => {
    content += legendItem(72 + i * 200, legendY + 16, leg.color, leg.label);
  });

  return wrapSvg(W, H, content);
}

// ── Diagram 2: Auth & Registration ──
function authFlow() {
  return flowDiagram({
    title: "Auth &amp; Registration Flow",
    subtitle: "User registration, login, and session management",
    steps: [
      { icon: "📝", title: "Register", desc: ["POST /api/auth/register", "{email, password}"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "🔒", title: "Hash Password", desc: ["bcrypt.hash(pw, 12)", "Prisma user.create"], fillBg: C.lightGreen, strokeColor: C.green },
      { icon: "🔑", title: "Login", desc: ["NextAuth credentials", "Email + password verify"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "🎫", title: "JWT Cookie", desc: ["httpOnly session cookie", "Secure, SameSite=Lax"], fillBg: C.lightAmber, strokeColor: C.amber },
      { icon: "📊", title: "Dashboard", desc: ["middleware.ts auth()", "Protected routes"], fillBg: C.lightBlue, strokeColor: C.primary },
    ],
    legends: [
      { color: C.primary, label: "App / API" },
      { color: C.green, label: "Security" },
      { color: C.amber, label: "Token / Session" },
    ],
  });
}

// ── Diagram 3: Email Import ──
function emailImport() {
  return flowDiagram({
    title: "Gmail / Outlook Import Flow",
    subtitle: "How Hugo imports subscriptions from email accounts via OAuth and AI parsing",
    steps: [
      { icon: "🔗", title: "OAuth Connect", desc: ["User authorizes", "Gmail or Outlook", "via OAuth 2.0"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "🔍", title: "Email Scan", desc: ["Scan inbox for", "receipts, invoices", "&amp; confirmations"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "✨", title: "Claude AI Parse", desc: ["Claude extracts", "service, amount,", "frequency, dates"], fillBg: C.lightAccent, strokeColor: C.accent },
      { icon: "✅", title: "Review", desc: ["User reviews", "candidates, edits", "&amp; confirms imports"], fillBg: C.lightAmber, strokeColor: C.amber },
      { icon: "💾", title: "Save to DB", desc: ["Confirmed subs", "saved to PostgreSQL", "via Prisma ORM"], fillBg: C.lightGreen, strokeColor: C.green },
    ],
    legends: [
      { color: C.primary, label: "App / API" },
      { color: C.accent, label: "AI Processing" },
      { color: C.amber, label: "User Review" },
      { color: C.green, label: "Database" },
    ],
    extras: `
      ${badge(330, 330, "Gmail API (googleapis)", C.gmail, C.gmailBg)}
      ${badge(548, 330, "Microsoft Graph API", C.outlook, C.outlookBg)}
      ${badge(740, 330, "Claude 3.5 Sonnet", C.accent, C.lightAccent)}
    `,
  });
}

// ── Diagram 4: Insurance Document Analysis ──
function insuranceAnalysis() {
  return flowDiagram({
    title: "Insurance Document Analysis",
    subtitle: "How Hugo processes uploaded insurance documents using AI to extract coverage details",
    steps: [
      { icon: "📄", title: "Upload PDF", desc: ["User uploads", "insurance policy", "PDF document"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "📋", title: "Text Extract", desc: ["PDF parsed and", "text content", "extracted for AI"], fillBg: C.lightGreen, strokeColor: C.green },
      { icon: "🧠", title: "Claude Analysis", desc: ["AI identifies coverage", "types, limits,", "premiums &amp; exclusions"], fillBg: C.lightAccent, strokeColor: C.accent },
      { icon: "🛡", title: "Coverage Map", desc: ["Structured summary", "of all coverage areas", "with risk scores"], fillBg: C.lightAmber, strokeColor: C.amber },
      { icon: "📊", title: "Dashboard", desc: ["Results displayed", "in insurance module", "with insights cards"], fillBg: C.lightBlue, strokeColor: C.primary },
    ],
    legends: [
      { color: C.primary, label: "Upload / Display" },
      { color: C.green, label: "Processing" },
      { color: C.accent, label: "AI Analysis" },
      { color: C.amber, label: "Output" },
    ],
  });
}

// ── Diagram 5: Cross-Policy AI Insights ──
function crossPolicyInsights() {
  return flowDiagram({
    title: "Cross-Policy AI Insights",
    subtitle: "How Claude compares multiple insurance policies to find overlaps, gaps, and savings",
    steps: [
      { icon: "📁", title: "Load Policies", desc: ["Fetch all user", "insurance policies", "from database"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "🔀", title: "Cross-Compare", desc: ["Claude analyzes", "coverage overlaps", "across all policies"], fillBg: C.lightAccent, strokeColor: C.accent },
      { icon: "🔎", title: "Detect Gaps", desc: ["Identify coverage", "gaps, redundancies", "&amp; savings potential"], fillBg: C.lightAccent, strokeColor: C.accent },
      { icon: "💡", title: "Recommendations", desc: ["AI generates", "actionable advice", "with priority scores"], fillBg: C.lightAmber, strokeColor: C.amber },
      { icon: "📈", title: "Insights Cards", desc: ["Interactive cards", "with charts, risk", "scores &amp; actions"], fillBg: C.lightBlue, strokeColor: C.primary },
    ],
    legends: [
      { color: C.primary, label: "Data Layer" },
      { color: C.accent, label: "AI Processing" },
      { color: C.amber, label: "Insights" },
    ],
  });
}

// ── Diagram 6: Household Sharing ──
function householdSharing() {
  return flowDiagram({
    title: "Household Sharing Flow",
    subtitle: "How family members share subscriptions and insurance policies in a unified view",
    steps: [
      { icon: "🏠", title: "Create House", desc: ["Owner creates", "a new household", "group account"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "👤", title: "Invite Members", desc: ["Send email invites", "to family members", "with role assignment"], fillBg: C.lightGreen, strokeColor: C.green },
      { icon: "🔄", title: "Share Data", desc: ["Members share", "subscriptions &amp;", "policies with group"], fillBg: C.lightAmber, strokeColor: C.amber },
      { icon: "📋", title: "Merged View", desc: ["Combined dashboard", "showing all family", "commitments"], fillBg: C.lightBlue, strokeColor: C.primary },
      { icon: "🔔", title: "Smart Alerts", desc: ["AI alerts for", "duplicate services", "&amp; renewal reminders"], fillBg: C.lightAccent, strokeColor: C.accent },
    ],
    legends: [
      { color: C.primary, label: "Setup / Display" },
      { color: C.green, label: "Member Mgmt" },
      { color: C.amber, label: "Sharing" },
      { color: C.accent, label: "AI Alerts" },
    ],
  });
}

// ── Generate all ──
import sharp from "sharp";

const diagrams = [
  { name: "01-system-architecture", fn: systemArchitecture },
  { name: "02-auth-registration", fn: authFlow },
  { name: "03-email-import", fn: emailImport },
  { name: "04-insurance-analysis", fn: insuranceAnalysis },
  { name: "05-cross-policy-insights", fn: crossPolicyInsights },
  { name: "06-household-sharing", fn: householdSharing },
];

for (const d of diagrams) {
  const svgPath = resolve(OUT_DIR, `${d.name}.svg`);
  const pngPath = resolve(OUT_DIR, `${d.name}.png`);
  const svg = d.fn();
  writeFileSync(svgPath, svg, "utf-8");

  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .resize({ width: 2400 })          // 2× for retina clarity
    .toFile(pngPath);

  console.log(`✓ ${d.name}.svg + .png`);
}

console.log(`\nGenerated ${diagrams.length} diagrams (SVG + PNG) in ${OUT_DIR}`);
