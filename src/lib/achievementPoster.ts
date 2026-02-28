import type { AchievementScene } from "@/lib/achievementVisuals";

type PosterInput = {
  title: string;
  date: string;
  scene: AchievementScene;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function starField() {
  return `
    <rect x="42" y="38" width="10" height="10" fill="#fff2b8"/>
    <rect x="46" y="30" width="2" height="6" fill="#fff2b8"/>
    <rect x="46" y="52" width="2" height="6" fill="#fff2b8"/>
    <rect x="34" y="46" width="6" height="2" fill="#fff2b8"/>
    <rect x="54" y="46" width="6" height="2" fill="#fff2b8"/>
    <rect x="1020" y="58" width="8" height="8" fill="#fff8d7"/>
    <rect x="1090" y="130" width="6" height="6" fill="#fff8d7"/>
    <rect x="960" y="168" width="4" height="4" fill="#fff8d7"/>
    <rect x="118" y="118" width="4" height="4" fill="#fff8d7"/>
    <rect x="930" y="98" width="4" height="4" fill="#fff8d7"/>
  `;
}

function moon() {
  return `
    <circle cx="1030" cy="96" r="34" fill="#ffeaa0"/>
    <circle cx="1044" cy="92" r="30" fill="#203a74"/>
  `;
}

function cityLights() {
  const houses = [
    [70, 635, 78, 55],
    [160, 620, 86, 70],
    [260, 640, 76, 50],
    [358, 610, 96, 80],
    [478, 628, 88, 62],
    [598, 600, 108, 90],
    [732, 628, 92, 62],
    [846, 608, 96, 82],
    [966, 626, 86, 64]
  ];

  return houses
    .map(([x, y, w, h]) => {
      return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#18254d"/>
        <rect x="${x + 12}" y="${y + 14}" width="14" height="14" fill="#ffd56b"/>
        <rect x="${x + w - 28}" y="${y + 14}" width="14" height="14" fill="#ffd56b"/>
        <rect x="${x + 12}" y="${y + 34}" width="14" height="14" fill="#ffd56b"/>
        <rect x="${x + w - 28}" y="${y + 34}" width="14" height="14" fill="#ffd56b"/>
      `;
    })
    .join("");
}

function mountainNightScene() {
  return `
    <rect width="1200" height="800" fill="#132f67"/>
    <rect width="1200" height="280" fill="#183a76"/>
    <rect width="1200" height="300" y="180" fill="#284c84"/>
    <rect width="1200" height="160" y="640" fill="#0f244f"/>
    ${starField()}
    ${moon()}
    <rect x="0" y="160" width="1200" height="200" fill="url(#skyGlow)"/>
    <path d="M0 540 L150 470 L260 520 L410 438 L540 516 L705 400 L840 498 L980 430 L1200 552 L1200 800 L0 800 Z" fill="#223a69"/>
    <path d="M0 580 L160 520 L280 566 L430 500 L560 580 L720 476 L900 562 L1040 506 L1200 590 L1200 800 L0 800 Z" fill="#31497b"/>
    <path d="M170 560 L362 468 L530 560 L445 646 L220 646 Z" fill="#493644"/>
    ${cityLights()}
    <rect x="0" y="0" width="1200" height="230" fill="url(#titleShade)"/>
    <rect x="0" y="640" width="1200" height="160" fill="url(#dateShade)"/>
    <g transform="translate(330 455)">
      <rect x="0" y="126" width="92" height="18" fill="#2a1d1d"/>
      <rect x="18" y="48" width="52" height="78" fill="#d8a669"/>
      <rect x="24" y="20" width="40" height="38" fill="#f4c9a5"/>
      <rect x="10" y="6" width="68" height="22" fill="#c89146"/>
      <rect x="4" y="24" width="16" height="18" fill="#c89146"/>
      <rect x="10" y="78" width="14" height="40" fill="#8c5f33"/>
      <rect x="52" y="78" width="14" height="40" fill="#8c5f33"/>
      <rect x="-14" y="56" width="24" height="40" fill="#8d663b"/>
    </g>
    <g transform="translate(448 470)">
      <rect x="0" y="112" width="82" height="16" fill="#1b1d2d"/>
      <rect x="14" y="48" width="52" height="64" fill="#6d86ca"/>
      <rect x="22" y="18" width="36" height="38" fill="#f2c4a1"/>
      <rect x="18" y="10" width="44" height="18" fill="#332235"/>
      <rect x="18" y="78" width="14" height="34" fill="#334467"/>
      <rect x="48" y="78" width="14" height="34" fill="#334467"/>
      <rect x="58" y="54" width="18" height="24" fill="#b27e3f"/>
    </g>
  `;
}

function cityNightScene() {
  return `
    <rect width="1200" height="800" fill="#223d73"/>
    <rect width="1200" height="300" fill="#32548d"/>
    ${starField()}
    ${moon()}
    <rect x="0" y="0" width="1200" height="210" fill="url(#titleShade)"/>
    <rect x="0" y="620" width="1200" height="180" fill="url(#dateShade)"/>
    <rect x="0" y="540" width="1200" height="260" fill="#15284f"/>
    <rect x="74" y="404" width="90" height="260" fill="#1a2b54"/>
    <rect x="190" y="324" width="108" height="340" fill="#1b305d"/>
    <rect x="330" y="430" width="96" height="234" fill="#18284e"/>
    <rect x="468" y="292" width="130" height="372" fill="#20356b"/>
    <rect x="644" y="364" width="104" height="300" fill="#1b2c57"/>
    <rect x="786" y="316" width="114" height="348" fill="#223664"/>
    <rect x="940" y="390" width="104" height="274" fill="#1c2a4f"/>
    <rect x="1074" y="340" width="84" height="324" fill="#20325d"/>
    ${cityLights()}
  `;
}

function cafeScene() {
  return `
    <rect width="1200" height="800" fill="#f0d6aa"/>
    <rect width="1200" height="340" fill="#f3e8d1"/>
    <rect x="0" y="640" width="1200" height="160" fill="#cc9b68"/>
    <rect x="84" y="118" width="340" height="170" fill="#fff7e6"/>
    <rect x="800" y="88" width="220" height="140" fill="#fff7e6"/>
    <rect x="280" y="520" width="640" height="42" rx="18" fill="#8f623c"/>
    <rect x="370" y="452" width="88" height="68" rx="18" fill="#fff9f0"/>
    <rect x="740" y="448" width="88" height="68" rx="18" fill="#fff9f0"/>
    <rect x="398" y="470" width="30" height="30" fill="#9a6d49"/>
    <rect x="768" y="470" width="30" height="30" fill="#9a6d49"/>
    <g transform="translate(262 332)">
      <rect x="0" y="126" width="92" height="18" fill="#5f4030"/>
      <rect x="18" y="48" width="52" height="78" fill="#d8a669"/>
      <rect x="24" y="20" width="40" height="38" fill="#f4c9a5"/>
      <rect x="10" y="6" width="68" height="22" fill="#c89146"/>
      <rect x="-14" y="56" width="24" height="40" fill="#8d663b"/>
    </g>
    <g transform="translate(770 336)">
      <rect x="0" y="112" width="82" height="16" fill="#1b1d2d"/>
      <rect x="14" y="48" width="52" height="64" fill="#6d86ca"/>
      <rect x="22" y="18" width="36" height="38" fill="#f2c4a1"/>
      <rect x="18" y="10" width="44" height="18" fill="#332235"/>
      <rect x="58" y="54" width="18" height="24" fill="#b27e3f"/>
    </g>
    <rect x="0" y="0" width="1200" height="210" fill="url(#titleShadeLight)"/>
    <rect x="0" y="620" width="1200" height="180" fill="url(#dateShadeDark)"/>
  `;
}

function focusScene() {
  return `
    <rect width="1200" height="800" fill="#efe6c9"/>
    <rect width="1200" height="340" fill="#f5f0dc"/>
    <rect x="0" y="620" width="1200" height="180" fill="#b68957"/>
    <rect x="180" y="470" width="840" height="110" rx="20" fill="#99683d"/>
    <rect x="280" y="394" width="210" height="86" rx="18" fill="#fff9ef"/>
    <rect x="342" y="414" width="84" height="12" fill="#dfd7c4"/>
    <rect x="342" y="438" width="112" height="12" fill="#dfd7c4"/>
    <rect x="754" y="388" width="140" height="96" rx="18" fill="#736a51"/>
    <rect x="790" y="414" width="68" height="68" fill="#fff0b0"/>
    <rect x="0" y="0" width="1200" height="210" fill="url(#titleShadeLight)"/>
    <rect x="0" y="620" width="1200" height="180" fill="url(#dateShadeDark)"/>
  `;
}

function streetScene() {
  return `
    <rect width="1200" height="800" fill="#dae6ef"/>
    <rect width="1200" height="360" fill="#eef5f8"/>
    <rect x="0" y="640" width="1200" height="160" fill="#5d6f80"/>
    <rect x="0" y="610" width="1200" height="12" fill="#f8fbff"/>
    <rect x="0" y="0" width="1200" height="210" fill="url(#titleShadeLight)"/>
    <rect x="0" y="620" width="1200" height="180" fill="url(#dateShadeDark)"/>
    <rect x="146" y="280" width="26" height="220" fill="#90a3b0"/>
    <rect x="120" y="244" width="78" height="36" fill="#ffe7a8"/>
    <rect x="902" y="214" width="136" height="172" fill="#f8fbff"/>
    <rect x="926" y="244" width="26" height="26" fill="#ffde7a"/>
    <rect x="968" y="244" width="26" height="26" fill="#ffde7a"/>
    <rect x="926" y="286" width="26" height="26" fill="#ffde7a"/>
    <rect x="968" y="286" width="26" height="26" fill="#ffde7a"/>
  `;
}

function fallbackScene(scene: AchievementScene) {
  switch (scene) {
    case "mountain-night":
      return mountainNightScene();
    case "city-night":
      return cityNightScene();
    case "cafe-table":
      return cafeScene();
    case "kitchen":
      return cafeScene();
    case "street-walk":
      return streetScene();
    case "desk-focus":
      return focusScene();
    case "cozy-rest":
      return focusScene();
    case "growth-garden":
      return streetScene();
    default:
      return cityNightScene();
  }
}

export function buildAchievementPosterSvg({ title, date, scene }: PosterInput) {
  return `
  <svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)} ${escapeXml(date)}">
    <defs>
      <linearGradient id="titleShade" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="rgba(7,15,36,0.55)"/>
        <stop offset="1" stop-color="rgba(7,15,36,0)"/>
      </linearGradient>
      <linearGradient id="dateShade" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="rgba(7,15,36,0)"/>
        <stop offset="1" stop-color="rgba(7,15,36,0.45)"/>
      </linearGradient>
      <linearGradient id="titleShadeLight" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="rgba(255,255,255,0.38)"/>
        <stop offset="1" stop-color="rgba(255,255,255,0)"/>
      </linearGradient>
      <linearGradient id="dateShadeDark" x1="0" y1="0" x2="0" y2="1">
        <stop stop-color="rgba(0,0,0,0)"/>
        <stop offset="1" stop-color="rgba(0,0,0,0.15)"/>
      </linearGradient>
      <radialGradient id="skyGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(610 166) rotate(90) scale(190 520)">
        <stop stop-color="#ffe3a5" stop-opacity="0.55"/>
        <stop offset="1" stop-color="#ffe3a5" stop-opacity="0"/>
      </radialGradient>
    </defs>
    ${fallbackScene(scene)}
  </svg>
  `;
}
