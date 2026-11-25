# HeyGen Reference Design System, CSS Variables & Typography

> **Source**: Extracted directly from `/main-CIqZwH0u.css`, `/main-C1zSbYdM.css`, `/HomeVideoPromptsSection-Gf1OBvoa.css`, and computed styles on `https://app.heygen.com`.

---

## 1. Font Families & `@font-face` Declarations

| Token / Usage | Font Family | Weights Loaded | Source Format & Origin |
| :--- | :--- | :--- | :--- |
| **`--font-family-primary`** | `"TT Norms Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | `300`, `400`, `450`, `500`, `600`, `700`, `900` (+ Italics) | `.woff2` (`https://static.heygen.ai/fonts/tt_norms_pro/...`) |
| **`--font-family-display`** | `"ABC Solar Display", "TT Norms Pro", sans-serif` | `100`, `400`, `600`, `700`, `800` (+ Italics) | `.woff2` (`https://static.heygen.ai/fonts/solar/...`) |
| **`--font-family-headline`** | `"ABC Solar Display Headline", "ABC Solar Display", sans-serif` | `100`–`900` | `.woff2` (`https://app.heygen.com/fonts/solar/...`) |
| **`--font-family-secondary`** | `"SF Pro Display", -apple-system, sans-serif` | `100`–`900` (+ Italics) | `.otf` (`https://static.heygen.ai/font/SF_Pro_Display/...`) |
| **`--font-family-emoji`** | `"NotoEmoji", "Apple Color Emoji", "Segoe UI Emoji"` | `400` | `.ttf` (`https://static.heygen.ai/font/Noto_Color_Emoji/NotoColorEmoji-Regular.ttf`) |

---

## 2. Typography Scale

| Role | Token Name | Font Size | Line Height | Font Weight | Letter Spacing |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Title Micro** | `title-micro` | `12px` | `14px` | `700` | `0em` |
| **Title Small** | `title-small` | `14px` | `18px` | `700` | `-0.01em` |
| **Title Regular** | `title-regular` | `16px` | `20px` | `700` | `-0.01em` |
| **Title Medium** | `title-medium` | `18px` | `22px` | `700` | `-0.015em` |
| **Title Large** | `title-large` | `20px` | `24px` | `700` | `-0.015em` |
| **Title XLarge** | `title-xlarge` | `32px` | `36px` | `800` | `-0.025em` |
| **Body SM** | `body-sm` | `12px` | `16px` | `400` | `0em` |
| **Body MD** | `body-md` | `14px` | `20px` | `400` | `0em` |
| **Body LG** | `body-lg` | `16px` | `24px` | `400` | `0em` |
| **Body XL** | `body-xl` | `18px` | `28px` | `400` | `0em` |
| **Display XS** | `display-xs` | `24px` | `32px` | `700` | `-0.02em` |
| **Display SM** | `display-sm` | `30px` | `38px` | `700` | `-0.02em` |
| **Display MD** | `display-md` | `36px` | `44px` | `800` | `-0.025em` |

---

## 3. Color Palette & CSS Custom Properties

### 3.1 Light Theme (`:root`, `[data-theme="light"]`)
```css
:root, [data-theme="light"] {
  /* Brand Cyan Scale */
  --brand-1: #e6f9ff;
  --brand-2: #c2f1ff;
  --brand-3: #91e6ff;
  --brand-4: #5edaff;
  --brand-5: #2ecfff;
  --brand-6: #00c4ff;
  --brand: #00c4ff;
  --brand-7: #00a7d9;
  --brandAccessible: #00a7d9;
  --brand-8: #008bb5;
  --brand-9: #007091;
  --brandAccessibleText: #007091;
  --brand-10: #005873;

  /* Typography Colors */
  --textTitle: #232833;
  --textBody: #4e5666;
  --textSupport: #687080;
  --textDisable: #bcc1cc;
  --textTitleRev: #ffffff;

  /* Surface & Fill Colors */
  --fillGeneral: #ffffff;
  --fillBlock: #f7f8fa;
  --fillBrandBlock: #f9feff;
  --fillBackground: #f7f8fa;
  --fillTooltips: #191919;
  --fillSkeleton: #e8e8e8;
  --fillShimmer: #f3f3f5;

  /* Borders & Interactive States */
  --line: #e2e3e6;
  --lineSolid: #eaecee;
  --lineDarker: #cdced2;
  --UXHover: #eaecee;
  --UXSelect: #e2e3e6;
  --UXPrimaryHover: #cff0fb;
  --UXPrimarySelect: #e3f4fa;

  /* Primary Buttons */
  --btn-primary-bg: #19191a;
  --btn-primary-fg: #ffffff;
  --btn-primary-hover: #4e5666;
  --btn-primary-active: #232833;

  /* Prism & Accent Tokens */
  --prismPurple: #c259ff;
  --prismPink: #ff5993;
  --prismBlue: #00a1f2;
  --prismViolet: #7559ff;
  --More-red: #e54945;
  --More-orange: #ff791a;
  --More-gold: #ffaa00;
  --More-green: #00bf8f;
  --More-navy: #1f6aff;
  --More-AvatarPink: #f3a6ff;
  --More-AgentCyan: #04d3d6;

  /* Radii & Shadows */
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 20px;
  --button-border-radius: 100px;
  --box-shadow-elevated: 0px 2px 4px -2px rgba(0, 0, 0, 0.06), 0px 4px 8px -2px rgba(0, 0, 0, 0.1);
  --button-shadow: 0 4px 12px rgba(117, 89, 255, 0.15);
}
```

### 3.2 Dark Theme (`[data-theme="dark"]`)
```css
[data-theme="dark"] {
  --textTitle: rgba(255, 255, 255, 0.9);
  --textBody: rgba(255, 255, 255, 0.75);
  --textSupport: rgba(255, 255, 255, 0.5);
  --fillGeneral: #16171a;
  --fillBlock: #1f2124;
  --fillUpper: #252629;
  --fillBackground: #0d0e0f;
  --fillBrandBlock: #0e404f;
  --line: #2b2d31;
  --lineSolid: #26282c;
}
```
