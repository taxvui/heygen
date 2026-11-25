# HeyGen Reference Layout Analysis & Bounding-Box Measurements

> **Source**: Automated Chromium DOM geometry measurements (`getBoundingClientRect()`) at reference viewport `1440×900` across `https://app.heygen.com`.

---

## 1. Master Viewport Shell (`1440×900`)

```
+---------------------------------------------------------------------------------------------------+
| (0,0)                                    1440 x 900                                               |
|  +----------+-------------------+  +-----------------------------------------------------------+  |
|  | Primary  | Secondary         |  | Main Content Region (<main>)                              |  |
|  | Icon Rail| Contextual Drawer |  | x=304, y=0, width=1136 (centered container max-w=1050)    |  |
|  | x=9,y=9  | x=87, y=9         |  |                                    [Ask Orby 1] [Upgrade] |  |
|  | 78x882px | 208x882px         |  |                                                           |  |
|  |          |                   |  |                 Welcome to HeyGen                         |  |
|  | [Orb]    | Create        [|] |  |                                                           |  |
|  |  Home    | (o) Home          |  |  Finish your account setup - 0/4                          |  |
|  |          |  /  Video agent   |  |  +------------+ +------------+ +------------+ +---------+ |  |
|  | [Avatar] | [_] Scene by scene|  |  | STEP 1     | | STEP 2     | | STEP 3     | | STEP 4  | |  |
|  |  Avatar  | [P] Single scene  |  |  | 235x212px  | | 235x212px  | | 235x212px  | |235x212px| |  |
|  |          | [A] Translate     |  |  +------------+ +------------+ +------------+ +---------+ |  |
|  | [Brand]  |                   |  |                                                           |  |
|  |  Brand   |                   |  |  Video Prompts                                Personalize |  |
|  |          |                   |  |  +-----------------+ +-----------------+ +--------------+ |  |
|  | [Apps]   |                   |  |  | Ads & Promo     | | Educational     | | Expert       | |  |
|  |  Apps    |                   |  |  | 313x176.06px    | | 313x176.06px    | | 313x176.06px | |  |
|  |          |                   |  |  +-----------------+ +-----------------+ +--------------+ |  |
|  | [Folder] |                   |  |  +-----------------+ +-----------------+ +--------------+ |  |
|  | Projects |                   |  |  | Tips & How-To   | | News Brief      | | Video Podcast| |  |
|  |          |                   |  |  | 313x176.06px    | | 313x176.06px    | | 313x176.06px | |  |
|  |   </>    |                   |  |  +-----------------+ +-----------------+ +--------------+ |  |
|  |   (V)    |                   |  |                                                           |  |
|  |   (U)    |                   |  |                                                           |  |
|  +----------+-------------------+  +-----------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Exact Element Coordinates & Dimensions (`1440×900`)

| Element | Selector / Role | `x` (px) | `y` (px) | `width` (px) | `height` (px) | Spacing / Notes |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Primary Icon Rail Outer** | `aside` left rail | `9` | `9` | `78` | `882` | `9px` outer viewport margin |
| **Primary Nav Inner** | `nav[aria-label="Main navigation"]` | `22.67` | `19` | `49.66` | `409` | Vertical flex stack, `18px` item gap |
| **Prism Orb Logo** | `img[alt="HeyGen"]` | `33.5` | `33` | `28` | `28` | Inside `40×40px` gradient-backed active container |
| **Secondary Sidebar Drawer** | Contextual nav pane | `87` | `9` | `208` | `882` | Joined with left rail in floating rounded shell (`286×882px`) |
| **Secondary Sidebar Nav List** | `nav` inside drawer | `103` | `65` | `176` | `168` | `5` items × `32px` height + `2px` vertical gap |
| **Main Scroll Container** | `main` | `304` | `0` | `1050` | `900` | Content padded `32px` horizontally |
| **Hero Heading (`Welcome to HeyGen`)** | `h1` | `664` | `64` | `330` | `40` | `32px` font-size, `800` weight, centered |
| **Account Setup Wrapper** | Onboarding 4-card block | `336` | `162` | `971` | `248` | `border-radius: 20px`, `padding: 16px` |
| **Step 1–4 Cards** | Individual onboarding cards | `352..1073` | `178` | `226` | `216` | `12px` gap between cards; Step 1 has `2px solid #00c4ff` |
| **Video Prompts Row 1, Col 1** | `Ads & Promo` card | `336` | `493` | `313` | `176.0625` | Exact `16:9` ratio (`313 / 176.0625 = 1.7778`) |
| **Video Prompts Row 1, Col 2** | `Educational Video` card | `665` | `493` | `313` | `176.0625` | `16px` horizontal gap (`336 + 313 + 16 = 665`) |
| **Video Prompts Row 1, Col 3** | `Expert Explainer` card | `994` | `493` | `313` | `176.0625` | `16px` horizontal gap (`665 + 313 + 16 = 994`) |
| **Video Prompts Row 2, Col 1–3** | `Tips`, `News`, `Podcast` | `336, 665, 994` | `685.0625` | `313` | `176.0625` | `16px` vertical gap (`493 + 176.0625 + 16 = 685.0625`) |
| **Sign-In Dialog** | `[role="dialog"]` | `472` | `207.5` | `410` | `502` | Centered overlay modal |
| **Account Menu Popover** | Bottom-left menu | `68` | `618` | `192` | `262` | `border-radius: 16px`, elevated shadow |
| **Settings Modal** | `[role="dialog"]` | `134` | `52` | `1168` | `828` | `220px` left nav + `948px` content pane |

---

## 3. Responsive Breakpoint Behavior (`375px` to `1920px`)

| Viewport Width | Sidebar Behavior | Main Grid Columns (`/home` Video Prompts) | Public Avatars Bento Grid | Apps / Integrations Grid |
| :---: | :--- | :---: | :---: | :---: |
| **`1920px` (Full HD)** | Full `78px + 208px` floating sidebar (`286px` total); main content centered with `max-width: 1120px`. | 3 columns (`340×191px`, `16px` gap) | 2 columns (multi-look bento cards) | 4 columns |
| **`1440px` (Reference Desktop)** | Full `78px + 208px` floating sidebar (`286px` total); main content `1050px` starting at `x=304`. | 3 columns (`313×176.06px`, `16px` gap) | 2 columns | 4 columns (`/apps/integrations`), 3 columns (`/apps`) |
| **`1024px` (Laptop / Landscape Tablet)** | Secondary `208px` drawer collapses or overlays via toggle button; `78px` icon rail remains docked. | 3 columns (fluid `16:9` cards, `14px` gap) | 2 columns | 3 columns |
| **`768px` (Portrait Tablet)** | Secondary sidebar collapses into toggleable drawer; `68px` compact left rail or top bar. | 2 columns (`16:9` cards, `14px` gap); 4-step setup wraps to `2×2` grid. | 1–2 columns | 2 columns |
| **`375px` (Mobile)** | Left rail transforms into bottom navigation bar + top compact header with drawer menu button. | 1 column stacked (`16:9` cards); 4-step setup scrolls horizontally or stacks `1×4`. | 1 column | 1 column |
