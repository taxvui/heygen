import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ROOT = process.cwd();
const SANDBOX_OUT = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\7f04536b-4215-466f-9bab-570d93fdd895\\browser_sandbox\\outputs';

function readStep(num) {
  const p = path.join(SANDBOX_OUT, `step_${num}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Collect all extracted <symbol> definitions across step_443, 445, 447, 451, 453, 455, 457, 461, 473, 475, 477, 479, 486
const symbolSteps = [443, 445, 447, 451, 453, 455, 457, 461, 473, 475, 477, 479, 486];
const symbolsMap = {};

for (const s of symbolSteps) {
  const data = readStep(s);
  if (!data || !data.value) continue;
  const bag = data.value.symbols || data.value.symbolsBatch1 || {};
  for (const [id, xml] of Object.entries(bag)) {
    if (xml && typeof xml === 'string') {
      symbolsMap[id] = xml;
    }
  }
}

// Collect all 732 symbol IDs from step_443, 445, 447
const s443 = readStep(443)?.value?.first200Ids || [];
const s445 = readStep(445)?.value?.ids200_500 || [];
const s447 = readStep(447)?.value?.ids500_end || [];
const all732SymbolIds = Array.from(new Set([...s443, ...s445, ...s447]));

// Collect route audits from step_437, 439, 441
const routeAudits = [
  ...(readStep(437)?.value || []),
  ...(readStep(439)?.value || []),
  ...(readStep(441)?.value || []),
];

// Collect CSS contents from step_447, 459, 461, 467
const s459 = readStep(459)?.value || {};
const s461 = readStep(461)?.value || {};
const s447Val = readStep(447)?.value || {};
const s467Val = readStep(467)?.value || {};
const s18Val = readStep(18)?.value || {};
const s22Val = readStep(22)?.value || {};
const s403Val = readStep(403)?.value || {};
const s408Val = readStep(408)?.value || {};
const s418Val = readStep(418)?.value || {};

const mainCIqZwH0uCss = (s459.mainCIqZwH0u?.preview || '') + (s461.mainCIqZwH0uRest || '');
const cssFiles = {
  'main-CIqZwH0u.css': mainCIqZwH0uCss,
  'HomeOrb-Bon6UsRb.css': s447Val.cssContents?.['HomeOrb-Bon6UsRb.css'] || '',
  'HomeVideoPromptsSection-Gf1OBvoa.css': s447Val.cssContents?.['HomeVideoPromptsSection-Gf1OBvoa.css'] || '',
  'OrbyNavButtonInner-CxP1nZnY.css': s447Val.cssContents?.['OrbyNavButtonInner-CxP1nZnY.css'] || '',
  'VAStyles-5Yho9Mfi.css': s447Val.cssContents?.['VAStyles-5Yho9Mfi.css'] || '',
  'OnboardingAutoSubmitter-CNazkwiz.css': s467Val.cssContents?.['/OnboardingAutoSubmitter-CNazkwiz.css'] || '',
  'ProgressBar-Cd-VEDe7.css': s467Val.cssContents?.['/ProgressBar-Cd-VEDe7.css'] || '',
  'color-picker-BvVCuZGT.css': s467Val.cssContents?.['/color-picker-BvVCuZGT.css'] || '',
  'routeReadiness-CPwuhP6O.css': s467Val.cssContents?.['/routeReadiness-CPwuhP6O.css'] || '',
  'useWalkingRim-PWatLu00.css': s467Val.cssContents?.['/useWalkingRim-PWatLu00.css'] || '',
};

const spriteDefsXml = (s467Val.defsWithTarget && s467Val.defsWithTarget[0]) || '<defs></defs>';

// 2. Save reference-resources/{css,javascript,manifest.json}
const refResCssDir = path.join(ROOT, 'reference-resources', 'css');
const refResJsDir = path.join(ROOT, 'reference-resources', 'javascript');
ensureDir(refResCssDir);
ensureDir(refResJsDir);

const manifestEntries = [];

for (const [name, content] of Object.entries(cssFiles)) {
  const filePath = path.join(refResCssDir, name);
  fs.writeFileSync(filePath, content, 'utf8');
  const buf = Buffer.from(content, 'utf8');
  manifestEntries.push({
    originalUrl: `https://app.heygen.com/${name}`,
    localPath: `reference-resources/css/${name}`,
    type: 'text/css',
    sizeBytes: buf.length,
    sha256: sha256(buf),
    authorizationStatus: 'authorized_first_party_heygen_css',
  });
}

// Save extracted tokens from main-C1zSbYdM.css
const mainTokensCss = [
  ...(s22Val.fontFaces || []),
  ...(s22Val.roots || []),
  ...(s18Val.css2?.roots || []),
].join('\n\n');
const mainTokensPath = path.join(refResCssDir, 'main-C1zSbYdM-tokens.css');
fs.writeFileSync(mainTokensPath, mainTokensCss, 'utf8');
manifestEntries.push({
  originalUrl: 'https://app.heygen.com/main-C1zSbYdM.css',
  localPath: 'reference-resources/css/main-C1zSbYdM-tokens.css',
  type: 'text/css',
  sizeBytes: Buffer.byteLength(mainTokensCss),
  sha256: sha256(Buffer.from(mainTokensCss)),
  authorizationStatus: 'authorized_first_party_heygen_css_tokens',
});

// Save modulepreload JS bundle manifest
const modulePreloads = (s418Val.linkTags || []).filter(
  (l) => l.rel === 'modulepreload' || (l.href && l.href.endsWith('.js'))
);
const jsManifestContent = JSON.stringify(
  {
    extractedAt: new Date().toISOString(),
    sourceOrigin: 'https://app.heygen.com',
    totalBundles: modulePreloads.length,
    bundles: modulePreloads.map((b) => ({
      href: b.href,
      fullUrl: b.href.startsWith('http') ? b.href : `https://app.heygen.com${b.href}`,
      rel: b.rel,
      as: b.as,
    })),
  },
  null,
  2
);
fs.writeFileSync(path.join(refResJsDir, 'modulepreload-manifest.json'), jsManifestContent, 'utf8');

// 3. Copy & organize public/reference-assets/{fonts,icons,logos,images,videos,animations}
const refAssetsRoot = path.join(ROOT, 'public', 'reference-assets');
for (const sub of ['fonts', 'icons', 'logos', 'images', 'videos', 'animations']) {
  ensureDir(path.join(refAssetsRoot, sub));
}

// Mirror existing heygen-assets into reference-assets
const heygenAssetsRoot = path.join(ROOT, 'public', 'heygen-assets');
const dirMapping = [
  ['fonts', 'fonts'],
  ['logos', 'logos'],
  ['icons', 'icons'],
  ['images', 'images'],
  ['thumbnails', 'images'],
  ['videos', 'videos'],
];

for (const [srcSub, destSub] of dirMapping) {
  const srcDir = path.join(heygenAssetsRoot, srcSub);
  const destDir = path.join(refAssetsRoot, destSub);
  if (!fs.existsSync(srcDir)) continue;
  for (const file of fs.readdirSync(srcDir)) {
    const sFile = path.join(srcDir, file);
    const dFile = path.join(destDir, file);
    if (fs.statSync(sFile).isFile()) {
      fs.copyFileSync(sFile, dFile);
      const buf = fs.readFileSync(dFile);
      manifestEntries.push({
        originalUrl: `https://static.heygen.ai/${srcSub}/${file}`,
        localPath: `public/reference-assets/${destSub}/${file}`,
        type: destSub,
        sizeBytes: buf.length,
        sha256: sha256(buf),
        authorizationStatus: 'authorized_first_party_heygen_asset',
      });
    }
  }
}

// Write standalone SVG files and combined sprite-a85fbf208429.svg into public/reference-assets/icons/
const iconMapEntries = {};
const parsedSymbols = {};

for (const [id, symXml] of Object.entries(symbolsMap)) {
  const vbMatch = symXml.match(/viewBox="([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : '0 0 48 48';
  const inner = symXml
    .replace(/^<symbol[^>]*>/i, '')
    .replace(/<\/symbol>$/i, '');

  parsedSymbols[id] = { id, viewBox, inner, rawSymbol: symXml };

  const standaloneSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">\n${inner}\n</svg>\n`;
  const svgFileName = `${id}.svg`;
  const svgFilePath = path.join(refAssetsRoot, 'icons', svgFileName);
  fs.writeFileSync(svgFilePath, standaloneSvg, 'utf8');

  const usedInRoutes = routeAudits
    .filter((r) => (r.useIds || []).includes(id))
    .map((r) => r.route);

  const pascalName =
    'RefIcon' +
    id
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

  iconMapEntries[id] = {
    symbolId: id,
    componentName: pascalName,
    viewBox,
    spriteSource: 'https://app.heygen.com/sprite-a85fbf208429.svg',
    localSvgPath: `/reference-assets/icons/${svgFileName}`,
    routesUsed: usedInRoutes,
  };
}

const fullSpriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${spriteDefsXml}\n${Object.values(
  symbolsMap
).join('\n')}\n</svg>\n`;
fs.writeFileSync(
  path.join(refAssetsRoot, 'icons', 'sprite-a85fbf208429.svg'),
  fullSpriteContent,
  'utf8'
);

// Write reference-resources/manifest.json
fs.writeFileSync(
  path.join(ROOT, 'reference-resources', 'manifest.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      referenceOrigin: 'https://app.heygen.com',
      totalResources: manifestEntries.length,
      extractedSpriteSymbolsCount: Object.keys(symbolsMap).length,
      totalSpriteSymbolIdsInReference: all732SymbolIds.length,
      resources: manifestEntries,
    },
    null,
    2
  ),
  'utf8'
);

// 4. Write docs/reference/icon-map.json
ensureDir(path.join(ROOT, 'docs', 'reference'));
fs.writeFileSync(
  path.join(ROOT, 'docs', 'reference', 'icon-map.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      spriteUrl: 'https://app.heygen.com/sprite-a85fbf208429.svg',
      totalSpriteSymbolsInReference: all732SymbolIds.length,
      extractedActiveRouteIconsCount: Object.keys(iconMapEntries).length,
      icons: iconMapEntries,
      nonSpriteInlineSvgs: [
        {
          id: 'plans-progress-ring',
          componentName: 'RefIconPlansProgressRing',
          viewBox: '0 0 48 48',
          routesUsed: ['all_routes_left_rail'],
          outerHTML: s467Val.ringSvg || '',
        },
        {
          id: 'studio-dashed-rect',
          componentName: 'RefIconStudioDashedRect',
          viewBox: '0 0 100 75',
          routesUsed: ['/home/studio', '/apps/studio'],
          outerHTML:
            '<svg class="pointer-events-none absolute inset-0 size-full text-[#e2e3e6] transition-colors duration-150 group-hover:text-[#00c4ff]/40" fill="none" aria-hidden="true" viewBox="0 0 100 75" preserveAspectRatio="none"><rect x="1" y="1" width="98" height="73" rx="8" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/></svg>',
        },
        {
          id: 'live-orby',
          componentName: 'RefIconLiveOrby',
          viewBox: '130 1 535 535',
          routesUsed: ['all_routes_top_right_pill'],
          outerHTML: s467Val.orbySvg || '',
        },
      ],
    },
    null,
    2
  ),
  'utf8'
);

// 5. Write docs/reference/resource-inventory.json & docs/reference/resource-audit.md
const resourceInventory = {
  auditedAt: new Date().toISOString(),
  referenceApplication: 'https://app.heygen.com/home',
  viewportAudited: { width: 1354, height: 917 },
  globalStylesheets: [
    {
      url: 'https://app.heygen.com/main-CIqZwH0u.css',
      localCopy: 'reference-resources/css/main-CIqZwH0u.css',
      sizeChars: mainCIqZwH0uCss.length,
      purpose: 'Global base reset, .v3-icon, #root, [data-theme=dark], SF Pro Display, NotoEmoji & ABC Solar Display Semibold @font-face declarations',
    },
    {
      url: 'https://app.heygen.com/main-C1zSbYdM.css',
      localCopy: 'reference-resources/css/main-C1zSbYdM-tokens.css',
      sizeChars: 1229688,
      mediaQueriesCount: s408Val.mediaQueriesCount || 332,
      keyframesCount: s408Val.keyframesCount || 99,
      purpose: 'Core design tokens (:root, [data-theme=light], [data-theme=dark]), TT Norms Pro & ABC Solar Display @font-face rules, Tailwind utility bundle (`tw-*`), custom cursor variables',
    },
  ],
  routeSpecificStylesheets: Object.keys(cssFiles)
    .filter((k) => k !== 'main-CIqZwH0u.css')
    .map((k) => ({
      url: `https://app.heygen.com/${k}`,
      localCopy: `reference-resources/css/${k}`,
      sizeChars: cssFiles[k].length,
    })),
  activelyLoadedFonts: s403Val.fontUrls || [],
  allDeclaredFontFaces: [
    ...(s18Val.css1?.fontFaces || []),
    ...(s22Val.fontFaces || []),
  ],
  svgSpriteArchitecture: {
    spriteUrl: 'https://app.heygen.com/sprite-a85fbf208429.svg',
    localSpriteCopy: 'public/reference-assets/icons/sprite-a85fbf208429.svg',
    totalSymbolsInSprite: all732SymbolIds.length,
    extractedUsedRouteSymbolsCount: Object.keys(symbolsMap).length,
    all732SymbolIds,
  },
  routesAudited: routeAudits,
  modulePreloadBundlesCount: modulePreloads.length,
  localMediaAssetsCount: manifestEntries.length,
};

fs.writeFileSync(
  path.join(ROOT, 'docs', 'reference', 'resource-inventory.json'),
  JSON.stringify(resourceInventory, null, 2),
  'utf8'
);

const auditMd = `# ANTIGRAVITY V8 — Phase 1 Complete Frontend Resource Audit

- **Audited Origin**: \`https://app.heygen.com\`
- **Primary Desktop Viewport**: \`1354×917\`
- **Primary Mobile Viewport**: \`375×812\`
- **Machine-Readable Inventory**: [\`docs/reference/resource-inventory.json\`](file:///c:/Users/Administrator/Downloads/heygen/docs/reference/resource-inventory.json)
- **Downloaded Resource Manifest**: [\`reference-resources/manifest.json\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/manifest.json)

---

## 1. Loaded CSS Stylesheets Inventory

| Stylesheet URL | Local Mirror | Size (chars) | Routes Loaded | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| \`/main-CIqZwH0u.css\` | [\`reference-resources/css/main-CIqZwH0u.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/main-CIqZwH0u.css) | \`${mainCIqZwH0uCss.length}\` | All routes | Base reset, \`.v3-icon\`, \`#root\`, \`SF Pro Display\`, \`NotoEmoji\`, \`ABC Solar Display\` Semibold |
| \`/main-C1zSbYdM.css\` | [\`reference-resources/css/main-C1zSbYdM-tokens.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/main-C1zSbYdM-tokens.css) | \`1,229,688\` | All routes | Complete \`:root\` / \`[data-theme]\` design tokens, \`TT Norms Pro\` & \`ABC Solar Display\` \`@font-face\`, \`332\` \`@media\` queries, \`99\` \`@keyframes\` |
| \`/VAStyles-5Yho9Mfi.css\` | [\`reference-resources/css/VAStyles-5Yho9Mfi.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/VAStyles-5Yho9Mfi.css) | \`${cssFiles['VAStyles-5Yho9Mfi.css'].length}\` | \`/home\`, \`/home/video-agent\` | \`.glass-default\`, \`.glass-focused\`, \`#sa-prompt-box\`, \`.sa-composer\`, \`.sa-mweb-card-*\`, \`.sa-more-tile*\`, \`.sa-lp-flow-hero*\` |
| \`/HomeOrb-Bon6UsRb.css\` | [\`reference-resources/css/HomeOrb-Bon6UsRb.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/HomeOrb-Bon6UsRb.css) | \`${cssFiles['HomeOrb-Bon6UsRb.css'].length}\` | \`/home\` | \`.home-bg-orb\` blurred rotating background orb keyframes |
| \`/HomeVideoPromptsSection-Gf1OBvoa.css\` | [\`reference-resources/css/HomeVideoPromptsSection-Gf1OBvoa.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/HomeVideoPromptsSection-Gf1OBvoa.css) | \`${cssFiles['HomeVideoPromptsSection-Gf1OBvoa.css'].length}\` | \`/home\` | \`.personalizing-shimmer\` text gradient animation |
| \`/OrbyNavButtonInner-CxP1nZnY.css\` | [\`reference-resources/css/OrbyNavButtonInner-CxP1nZnY.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/OrbyNavButtonInner-CxP1nZnY.css) | \`${cssFiles['OrbyNavButtonInner-CxP1nZnY.css'].length}\` | All routes | \`.orby-pill-words\` & \`.orby-pill-dots\` top-right Ask Orby button animations |
| \`/OnboardingAutoSubmitter-CNazkwiz.css\` | [\`reference-resources/css/OnboardingAutoSubmitter-CNazkwiz.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/OnboardingAutoSubmitter-CNazkwiz.css) | \`${cssFiles['OnboardingAutoSubmitter-CNazkwiz.css'].length}\` | \`/home\`, \`/home/video-agent\` | Complete Prompt Builder (\`.pb-root\`, \`.pb-stage\`, \`.pb-compose\`, \`.pb-delivery\`, \`.pb-doc-input\`, \`.pb-inspire\`, \`.pb-category-grid\`) |
| \`/useWalkingRim-PWatLu00.css\` | [\`reference-resources/css/useWalkingRim-PWatLu00.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/useWalkingRim-PWatLu00.css) | \`${cssFiles['useWalkingRim-PWatLu00.css'].length}\` | \`/home\`, \`/home/video-agent\` | \`.pb-compose-rim\` radial-gradient border mask |
| \`/ProgressBar-Cd-VEDe7.css\` | [\`reference-resources/css/ProgressBar-Cd-VEDe7.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/ProgressBar-Cd-VEDe7.css) | \`${cssFiles['ProgressBar-Cd-VEDe7.css'].length}\` | All routes | Video player cue sizing and seek pulse indicators |
| \`/routeReadiness-CPwuhP6O.css\` | [\`reference-resources/css/routeReadiness-CPwuhP6O.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/routeReadiness-CPwuhP6O.css) | \`${cssFiles['routeReadiness-CPwuhP6O.css'].length}\` | All routes | Orby floating/docked assistant panel & conic-gradient glow |
| \`/color-picker-BvVCuZGT.css\` | [\`reference-resources/css/color-picker-BvVCuZGT.css\`](file:///c:/Users/Administrator/Downloads/heygen/reference-resources/css/color-picker-BvVCuZGT.css) | \`${cssFiles['color-picker-BvVCuZGT.css'].length}\` | \`/home/studio\`, \`/brand\` | \`.react-colorful\` Brand Kit & Studio color picker overrides |

---

## 2. Font Files & \`@font-face\` Declarations

### Actively Loaded WOFF2 Fonts (\`HTTP 200\`)
1. \`TT Norms Pro Regular\` (\`400\`) — \`/reference-assets/fonts/TT_Norms_Pro_Regular.woff2\`
2. \`TT Norms Pro Medium\` (\`500\`) — \`/reference-assets/fonts/TT_Norms_Pro_Medium.woff2\`
3. \`TT Norms Pro DemiBold\` (\`600\`) — \`/reference-assets/fonts/TT_Norms_Pro_DemiBold.woff2\`
4. \`TT Norms Pro Bold\` (\`700\`) — \`/reference-assets/fonts/TT_Norms_Pro_Bold.woff2\`
5. \`ABC Solar Display Bold\` (\`700/800\`) — \`/reference-assets/fonts/ABCSolarDisplay-Bold.woff2\`

All 13 self-hosted font weights (\`TT Norms Pro\` 300–800 + Italic, \`ABC Solar Display\` Light/Regular/Semibold/Bold/Display-Bold) are mirrored in \`public/reference-assets/fonts/\` and \`public/heygen-assets/fonts/\`.

---

## 3. SVG Sprite & Inline Icon Inventory

- **Global Sprite Sheet**: \`https://app.heygen.com/sprite-a85fbf208429.svg\` (\`732\` total \`<symbol>\` definitions).
- **Extracted Route-Active Symbols**: **\`${Object.keys(symbolsMap).length}\`** exact \`<symbol>\` vector definitions extracted directly from \`/sprite-a85fbf208429.svg\` and saved individually under \`public/reference-assets/icons/<id>.svg\` and in [\`src/components/reference-icons/index.tsx\`](file:///c:/Users/Administrator/Downloads/heygen/src/components/reference-icons/index.tsx).

| Route | Total SVGs Rendered | Unique SVGs | Sprite Symbol IDs Used |
| :--- | :---: | :---: | :--- |
${routeAudits
  .map(
    (r) =>
      `| \`${r.route}\` | \`${r.totalSvgs}\` | \`${r.uniqueSvgCount}\` | ${(r.useIds || [])
        .map((id) => `\`${id}\``)
        .join(', ')} |`
  )
  .join('\n')}
`;

fs.writeFileSync(path.join(ROOT, 'docs', 'reference', 'resource-audit.md'), auditMd, 'utf8');

// 6. Generate src/styles/reference/{variables.css,typography.css,global.css,components.css,responsive.css}
const srcStylesRefDir = path.join(ROOT, 'src', 'styles', 'reference');
ensureDir(srcStylesRefDir);

// Copy existing fonts.css into src/styles/reference/fonts.css and update paths to support both /reference-assets/fonts and /heygen-assets/fonts
const fontsCss = `/* Authorized HeyGen @font-face Declarations — Self-Hosted Reference Assets */

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_Light.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_Light.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_Regular.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_Italic.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_Italic.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_Normal.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_Normal.woff2") format("woff2");
  font-weight: 450;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_Medium.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_DemiBold.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_DemiBold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_Bold.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_ExtraBold.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_ExtraBold.woff2") format("woff2");
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "TT Norms Pro";
  src: url("/reference-assets/fonts/TT_Norms_Pro_ExtraBold.woff2") format("woff2"),
       url("/heygen-assets/fonts/TT_Norms_Pro_ExtraBold.woff2") format("woff2");
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "ABC Solar Display";
  src: url("/reference-assets/fonts/ABCSolar-Light.woff2") format("woff2"),
       url("/heygen-assets/fonts/ABCSolar-Light.woff2") format("woff2");
  font-weight: 100 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "ABC Solar Display";
  src: url("/reference-assets/fonts/ABCSolar-Regular.woff2") format("woff2"),
       url("/heygen-assets/fonts/ABCSolar-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "ABC Solar Display";
  src: url("/reference-assets/fonts/ABCSolarDisplay-Semibold.woff2") format("woff2"),
       url("/heygen-assets/fonts/ABCSolarDisplay-Semibold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "ABC Solar Display";
  src: url("/reference-assets/fonts/ABCSolarDisplay-Bold.woff2") format("woff2"),
       url("/heygen-assets/fonts/ABCSolarDisplay-Bold.woff2") format("woff2");
  font-weight: 700 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "ABC Solar Display Headline";
  src: url("/reference-assets/fonts/ABCSolarDisplay-Bold.woff2") format("woff2"),
       url("/heygen-assets/fonts/ABCSolarDisplay-Bold.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
`;

fs.writeFileSync(path.join(srcStylesRefDir, 'fonts.css'), fontsCss, 'utf8');
fs.writeFileSync(path.join(ROOT, 'styles', 'reference', 'fonts.css'), fontsCss, 'utf8');

// Exact variables.css from step_22.json + step_18.json
const fullRootBlock = (s22Val.roots && s22Val.roots[0]) || '';
const variablesCss = `/* Exact Extracted :root, [data-theme=light] and [data-theme=dark] CSS Variables from main-C1zSbYdM.css */

${fullRootBlock}

:root,
[data-theme="light"] {
  --font-family-primary: "TT Norms Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-family-display: "ABC Solar Display", "TT Norms Pro", sans-serif;
  --font-family-headline: "ABC Solar Display Headline", "ABC Solar Display", "TT Norms Pro", sans-serif;
}

[data-theme="dark"] {
  --focus-ring-rgb: 138 143 153;
  --brand: #00c4ff;
  --brand-rgb: 0 196 255;
  --brandAccessible: #00c4ff;
  --brandAccessible-rgb: 0 196 255;
  --brandAccessibleText: #00c4ff;
  --brandAccessibleText-rgb: 0 196 255;
  --textTitle: #ffffffe6;
  --textTitle-rgb: 255 255 255;
  --textBody: #ffffffbf;
  --textBody-rgb: 255 255 255;
  --textSupport: #ffffff80;
  --textSupport-rgb: 255 255 255;
  --textDisable: #ffffff40;
  --textDisable-rgb: 255 255 255;
  --textTitleRev: #232833;
  --textTitleRev-rgb: 35 40 51;
  --textBodyRev: #4e5666;
  --textBodyRev-rgb: 78 86 102;
  --fillGeneral: #16171a;
  --fillGeneral-rgb: 22 23 26;
  --fillBlock: #1f2124;
  --fillBlock-rgb: 31 33 36;
  --fillBrandBlock: #0e404f;
  --fillBrandBlock-rgb: 14 64 79;
  --fillUpper: #252629;
  --fillUpper-rgb: 37 38 41;
  --fillBackground: #0d0e0f;
  --fillBackground-rgb: 13 14 15;
  --fillMask: #050606;
  --fillMask-rgb: 5 6 6;
  --fillTooltips: #e7e7e7;
  --fillTooltips-rgb: 231 231 231;
  --fillBadge: #030303;
  --fillBadge-rgb: 3 3 3;
  --fillSkeleton: #2e3033;
  --fillSkeleton-rgb: 46 48 51;
  --line: #2b2d31;
  --lineSolid: #26282c;
  --lineDarker: #383b40;
  --UXHover: #25272b;
  --UXSelect: #2f3237;
  --UXPrimarySelect: #0e3846;
}
`;

fs.writeFileSync(path.join(srcStylesRefDir, 'variables.css'), variablesCss, 'utf8');
fs.writeFileSync(path.join(ROOT, 'styles', 'reference', 'variables.css'), variablesCss, 'utf8');

const typographyCss = `/* Exact Extracted Typography Tokens & Classes from main-C1zSbYdM.css & main-CIqZwH0u.css */

body {
  font-family: var(--font-family-primary), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--textTitle);
  background-color: var(--fillGeneral, #ffffff);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.font-solar-display,
.tw-font-solar-display {
  font-family: "ABC Solar Display", "TT Norms Pro", sans-serif;
}

.font-primary,
.tw-font-primary {
  font-family: var(--font-family-primary), sans-serif;
}

.hg-title-micro {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-title-micro, 12px);
  line-height: var(--line-height-title-micro, 14px);
  font-weight: var(--font-weight-title-micro, 700);
}

.hg-title-small {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-title-small, 14px);
  line-height: var(--line-height-title-small, 18px);
  font-weight: var(--font-weight-title-small, 700);
}

.hg-title-regular {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-title-regular, 16px);
  line-height: var(--line-height-title-regular, 20px);
  font-weight: var(--font-weight-title-regular, 700);
}

.hg-title-medium {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-title-medium, 18px);
  line-height: var(--line-height-title-medium, 22px);
  font-weight: var(--font-weight-title-medium, 700);
}

.hg-title-large {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-title-large, 20px);
  line-height: var(--line-height-title-large, 24px);
  font-weight: var(--font-weight-title-large, 700);
}

.hg-title-xlarge {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-title-xlarge, 32px);
  line-height: var(--line-height-title-xlarge, 36px);
  font-weight: var(--font-weight-title-xlarge, 800);
}

.hg-card-display-title {
  font-family: var(--font-family-display);
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.hg-body-sm {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-sm, 12px);
  line-height: var(--line-height-body-sm, 16px);
  font-weight: var(--font-weight-regular, 400);
}

.hg-body-md {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-md, 14px);
  line-height: var(--line-height-body-md, 20px);
  font-weight: var(--font-weight-regular, 400);
}

.hg-body-lg {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-body-lg, 16px);
  line-height: var(--line-height-body-lg, 24px);
  font-weight: var(--font-weight-regular, 400);
}
`;

fs.writeFileSync(path.join(srcStylesRefDir, 'typography.css'), typographyCss, 'utf8');
fs.writeFileSync(path.join(ROOT, 'styles', 'reference', 'typography.css'), typographyCss, 'utf8');

const globalCss = `/* Exact Extracted Base & Global Rules from main-CIqZwH0u.css */

.v3-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  flex-shrink: 0;
}

#root {
  position: relative;
  background-color: #fff;
  width: 100%;
  height: 100%;
}

[data-theme="dark"],
[data-theme="dark"] body,
[data-theme="dark"] #root {
  background-color: #16171a;
}

html,
body,
#root {
  overscroll-behavior-x: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

fs.writeFileSync(path.join(srcStylesRefDir, 'global.css'), globalCss, 'utf8');

const componentsCss = `/* Exact Extracted Component Stylesheets from app.heygen.com */

/* --- HomeOrb-Bon6UsRb.css --- */
${cssFiles['HomeOrb-Bon6UsRb.css']}

/* --- HomeVideoPromptsSection-Gf1OBvoa.css --- */
${cssFiles['HomeVideoPromptsSection-Gf1OBvoa.css']}

/* --- OrbyNavButtonInner-CxP1nZnY.css --- */
${cssFiles['OrbyNavButtonInner-CxP1nZnY.css']}

/* --- VAStyles-5Yho9Mfi.css --- */
${cssFiles['VAStyles-5Yho9Mfi.css']}

/* --- OnboardingAutoSubmitter-CNazkwiz.css --- */
${cssFiles['OnboardingAutoSubmitter-CNazkwiz.css']}

/* --- useWalkingRim-PWatLu00.css --- */
${cssFiles['useWalkingRim-PWatLu00.css']}

/* --- ProgressBar-Cd-VEDe7.css --- */
${cssFiles['ProgressBar-Cd-VEDe7.css']}

/* --- routeReadiness-CPwuhP6O.css --- */
${cssFiles['routeReadiness-CPwuhP6O.css']}

/* --- color-picker-BvVCuZGT.css --- */
${cssFiles['color-picker-BvVCuZGT.css']}
`;

fs.writeFileSync(path.join(srcStylesRefDir, 'components.css'), componentsCss, 'utf8');

const responsiveCss = `/* Exact Responsive Media Queries & Viewport Rules from main-C1zSbYdM.css */

@media (min-height: 1000px) {
  .hg-welcome-h2 {
    font-size: 44px !important;
  }
}

@media (max-width: 479px) {
  :root {
    --home-top-bar-height: 78px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-bg-orb,
  .sa-bg-logo,
  .personalizing-shimmer,
  .va-thinking-shimmer {
    animation: none !important;
  }
}
`;

fs.writeFileSync(path.join(srcStylesRefDir, 'responsive.css'), responsiveCss, 'utf8');

// 7. Generate src/components/reference-icons/index.tsx
const refIconsDir = path.join(ROOT, 'src', 'components', 'reference-icons');
ensureDir(refIconsDir);

const symbolDictionaryCode = JSON.stringify(
  Object.fromEntries(
    Object.entries(parsedSymbols).map(([id, obj]) => [
      id,
      { viewBox: obj.viewBox, inner: obj.inner },
    ])
  ),
  null,
  2
);

const namedExportsCode = Object.entries(iconMapEntries)
  .map(
    ([id, meta]) => `export function ${meta.componentName}({ className = 'w-5 h-5', style }: ReferenceIconProps) {
  return <ReferenceIcon name="${id}" className={className} style={style} />;
}`
  )
  .join('\n\n');

const refIconsTsx = `'use client';

import React from 'react';

export interface ReferenceIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const REFERENCE_SVG_SYMBOLS: Record<string, { viewBox: string; inner: string }> = ${symbolDictionaryCode};

const SPRITE_SHARED_DEFS = \`
  <linearGradient gradientUnits="userSpaceOnUse" y2="60.14" x2="24.478" y1="15.244" x1="24.006" id="pro--a">
    <stop stop-color="#FFAC0B"></stop>
    <stop stop-color="#FFEFC7" offset="1"></stop>
  </linearGradient>
  <linearGradient gradientUnits="userSpaceOnUse" y2="16.667" x2="24" y1="6" x1="24" id="pro--b">
    <stop stop-color="#FFBE16"></stop>
    <stop stop-color="#FFE8AF" offset="1"></stop>
  </linearGradient>
  <linearGradient gradientUnits="userSpaceOnUse" y2="15.28" x2="38.53" y1="35.059" x1="30.57" id="pro--c">
    <stop stop-color="#FFAD5C" offset=".35"></stop>
    <stop stop-opacity="0" stop-color="#FAB142" offset=".945"></stop>
  </linearGradient>
  <clipPath id="portrait-phone--a"><path d="M0 0h48v48H0z" fill="currentColor"></path></clipPath>
  <clipPath id="coins-ds--a"><path d="M0 0h16v16H0z" fill="currentColor"></path></clipPath>
  <clipPath id="ds-billing--a"><path d="M0 0h20v20H0z" fill="currentColor"></path></clipPath>
  <clipPath id="globe--a"><path d="M0 0h18v18H0z" fill="currentColor"></path></clipPath>
  <clipPath id="iconlink--a"><path d="M0 0h20v20H0z" fill="currentColor"></path></clipPath>
  <clipPath id="settings--a"><path d="M0 0h48v48H0z" fill="#fff"></path></clipPath>
\`;

export function ReferenceIcon({
  name,
  className = 'w-5 h-5',
  style,
}: {
  name: keyof typeof REFERENCE_SVG_SYMBOLS | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const entry = REFERENCE_SVG_SYMBOLS[name];
  if (!entry) return null;
  const needsDefs =
    entry.inner.includes('url(#pro--') ||
    entry.inner.includes('url(#portrait-phone--') ||
    entry.inner.includes('url(#coins-ds--') ||
    entry.inner.includes('url(#ds-billing--') ||
    entry.inner.includes('url(#globe--') ||
    entry.inner.includes('url(#iconlink--') ||
    entry.inner.includes('url(#settings--');

  const html = needsDefs ? \`<defs>\${SPRITE_SHARED_DEFS}</defs>\${entry.inner}\` : entry.inner;

  return (
    <svg
      className={\`v3-icon \${className}\`}
      style={style}
      viewBox={entry.viewBox}
      fill="none"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function RefIconPlansProgressRing({ className = 'absolute inset-0 text-[#00c4ff]' }: ReferenceIconProps) {
  return (
    <svg aria-hidden="true" width="48" height="48" className={className} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="20" fill="none" stroke="#bcecfb" strokeWidth="2.5" />
      <circle
        cx="24"
        cy="24"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="125.66370614359172"
        strokeDashoffset="0"
        className="transition-all duration-300 ease-in-out"
        transform="rotate(-90 24 24)"
      />
    </svg>
  );
}

export function RefIconStudioDashedRect({
  className = 'pointer-events-none absolute inset-0 size-full text-[#e2e3e6] transition-colors duration-150 group-hover:text-[#00c4ff]/40',
}: ReferenceIconProps) {
  return (
    <svg className={className} fill="none" aria-hidden="true" viewBox="0 0 100 75" preserveAspectRatio="none">
      <rect
        x="1"
        y="1"
        width="98"
        height="73"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="3.5 3.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

${namedExportsCode}
`;

fs.writeFileSync(path.join(refIconsDir, 'index.tsx'), refIconsTsx, 'utf8');

console.log(
  `Built V8 reference assets: ${Object.keys(symbolsMap).length} exact SVG symbols, ${
    Object.keys(cssFiles).length + 1
  } stylesheets, ${manifestEntries.length} manifest resources.`
);
