# HeyGen Reference Component Architecture & Specifications

> **Source**: Automated DOM, accessibility tree, and CSS inspection of `https://app.heygen.com`.

---

## 1. Navigation & Shell Components

### 1.1 Floating Dual-Pane Sidebar Shell (`<AppSidebarShell>`)
- **Outer Wrapper**: Fixed floating container positioned `9px` from top, bottom, and left edges (`top: 9px; bottom: 9px; left: 9px`), total expanded width `286px` (`78px` primary icon rail + `208px` secondary section drawer), rounded `20px` corners (`--border-radius-xl`), background `#ffffff`, subtle border `1px solid #eaecee` (`--lineSolid`), shadow `0px 2px 8px rgba(0, 0, 0, 0.04)`.
- **Primary Left Icon Rail (`78px` wide)**:
  - **Top Section (`nav[aria-label="Main navigation"]`)**:
    1. **Home** (`PRISM_ORB.svg` / `PRISM_ORB.png`, `28×28px`, active state wraps icon in a `40×40px` rounded-xl pill with gradient glow and cyan label `Home` `11px` weight `600`).
    2. **Avatar** (`20×20px` user-circle icon + `Avatar` label; active state shows `#00c4ff` rounded square `40×40px` with white icon and cyan text).
    3. **Brand** (`20×20px` palette/swatch icon + `Brand` label; active state shows `#f3a6ff` lavender-pink rounded square `40×40px`).
    4. **Apps** (`20×20px` ruler/pencil crossed tools icon + `Apps` label; active state shows `#232833` dark charcoal rounded square `40×40px`).
    5. **Projects** (`20×20px` horizontal divider above folder icon + `Projects` label; active state shows `#232833` dark charcoal rounded square `40×40px`).
  - **Bottom Utilities (pinned to bottom of `78px` rail)**:
    1. **Developers (`</>`)**: `36×36px` icon button linking to `/developers/api`.
    2. **Upgrade / Credits Ring**: `36×36px` circular progress ring (`#00c4ff` cyan stroke) with gold diamond icon (`#ffaa00`) in center.
    3. **Account Avatar Button**: `36×36px` circular user avatar trigger opening the Account Menu Popover.
- **Secondary Contextual Sidebar (`208px` wide, `16px` horizontal padding)**:
  - **Header**: Section title (`Create`, `Manage Avatars`, `Brand`, `Apps`, `Projects`, `Developers`) in `13px` font-weight `600` color `#687080` + right-aligned sidebar collapse toggle button (`18×18px` split-panel icon).
  - **Nav Items (`176×36px` pills)**: Border-radius `18px` (`9999px` pill), `12px` horizontal padding, `10px` icon-to-text gap, `14px` font-weight `500`.
    - Active item: background `#e3f4fa` (`--UXPrimarySelect`), text `#232833` font-weight `600`.
    - Inactive item: text `#4e5666`, hover background `#eaecee` (`--UXHover`).

### 1.2 Top-Right Floating Utility Pills (`<FloatingHeaderUtilities>`)
- **Ask Orby Pill**: Floating white pill (`height: 40px`, `padding: 0 14px`, `border-radius: 9999px`, `box-shadow: 0 2px 8px rgba(0,0,0,0.08)`), cyan robot/orb icon (`24×24px`) with green online dot, text `Ask Orby` (`13px` weight `600`), red notification badge `1` (`18×18px` circle `#e54945` at top-right corner).
- **Upgrade Pill**: Floating white pill (`height: 40px`, `padding: 0 16px`, `border-radius: 9999px`, `border: 1px solid #eaecee`, `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`), gold diamond SVG (`#ffaa00`), text `Upgrade` (`13px` weight `600`).

---

## 2. Home Dashboard Components (`/home`)

### 2.1 Ambient Prism Aura (`<HomeOrbBackdrop>`)
- Soft radial multi-stop blur (`filter: blur(70px)`) positioned behind the hero title and onboarding stepper, blending `rgba(0, 196, 255, 0.18)` (cyan), `rgba(194, 89, 255, 0.14)` (purple), and `rgba(4, 211, 214, 0.16)` (teal).

### 2.2 Account Setup 4-Step Stepper (`<AccountSetupStepper>`)
- **Header Row**: Small user outline icon + `Finish your account setup - 0/4` (`14px` weight `600` `#232833`).
- **Outer Container**: `1014×244px`, `border-radius: 20px`, `background: rgba(247, 248, 250, 0.75)`, `backdrop-filter: blur(12px)`, `padding: 16px`, 4 equal columns (`gap: 14px`).
- **Step Cards (`235×212px` each, `border-radius: 16px`, `background: #ffffff`, `padding: 18px`)**:
  - **Step 1 (Active)**: `border: 2px solid #00c4ff`, top row cyan radio ring + `STEP 1` (`11px` weight `700` `#687080`), title `Create your Avatar` (`15px` weight `700`), description `Just 15 seconds, and don't worry about the background or outfit. This step captures how you move; everything else can be changed later.` (`12px/17px` `#687080`), bottom full-width pill button `Get Started` (`height: 36px`, `border: 1px solid #e2e3e6`, `border-radius: 9999px`, `font-weight: 600`).
  - **Step 2 (Locked)**: Subtle pink/violet gradient tint, `STEP 2`, title `Review your Voice`, description `Give your voice a listen. If something feels off, you can improve it anytime.`, footer `Unlocks after step 1` (`12px` `#687080`).
  - **Step 3 (Locked)**: Subtle cyan/mint gradient tint, `STEP 3`, title `Create a Look`, description `Put yourself in any outfit or setting. You'll always still look like you.`, footer `Unlocks after step 1`.
  - **Step 4 (Locked)**: Clean white card, `STEP 4`, title `Make your first video`, description `Start from a script, a prompt, or scene by scene in AI Studio.`, footer `Unlocks after step 2 or 3`.

### 2.3 Video Prompts 3×2 Grid (`<HomeVideoPromptsSection>`)
- **Section Header**: Video camera icon + `Video Prompts` (`14px` weight `600`) on left; underlined `Personalize` button (`13px` weight `600` `#232833`) on right.
- **Grid Layout**: `grid-template-columns: repeat(3, 313px)`, `gap: 16px`.
- **Card Dimensions**: `313×176.0625px` (16:9 aspect ratio), `border-radius: 16px`, `overflow: hidden`, relative positioning:
  - Full-bleed `<img />` with subtle hover scale transition (`transform: scale(1.03)` over `250ms ease`).
  - Top-left title in `"ABC Solar Display"` / bold display font (`22px/26px`, weight `700`, `#ffffff`, text-shadow `0 1px 8px rgba(0,0,0,0.35)`).
  - Bottom-left glassmorphic pill CTA `Create Now ›` (`height: 36px`, `padding: 0 16px`, `border-radius: 9999px`, `background: rgba(255, 255, 255, 0.22)`, `backdrop-filter: blur(10px)`, `border: 1px solid rgba(255, 255, 255, 0.45)`, text `#ffffff` `13px` weight `600`).

---

## 3. Avatar, Voice, Studio & Modal Components

### 3.1 Public Avatar Multi-Look Bento Card (`<PublicAvatarBentoCard>`)
- **Layout**: 2-column grid of large bento cards (`gap: 24px`). Each card has a `2:1` split internal grid (`height: 360px`, `gap: 6px`, `border-radius: 16px`, `overflow: hidden`):
  - **Left Pane (`66%` width)**: Main portrait image/video preview (hover plays talking preview video), optional top-left `NEW` badge (`background: #f5ebd6`, `color: #5c4b28`, `font-size: 11px`, `font-weight: 700`, `padding: 3px 8px`, `border-radius: 9999px`).
  - **Right Pane (`34%` width)**: 2 stacked square/4:3 look thumbnails (`gap: 6px`) showing alternate outfits/environments.
- **Footer**: Avatar name (`Annie`, `Marieke`, `Sawyer`, `Cora`, etc.) in `15px` weight `700` `#232833` below the card (`margin-top: 10px`).

### 3.2 Quick Script Composer Card (`<AvatarScriptComposer>`)
- Used on `/avatar/my-avatars` and `/home/photo-to-video`.
- Mode toggle pill bar (`Presenter` | `Cinematic`, `height: 36px`, `background: #f2f3f5`, `border-radius: 9999px`, active tab white pill with shadow).
- Main card (`max-width: 720px`, `min-height: 260px`, `background: #ffffff`, `border-radius: 20px`, `box-shadow: 0 4px 24px rgba(0,0,0,0.06)`, `border: 1px solid #eaecee`, `padding: 20px`):
  - Left vertical avatar selector slot (`96×168px`, `border-radius: 12px`, `background: #f7f8fa`, `border: 1px dashed #d5d7dc`, user-plus icon).
  - Right script input (`VIDEO SCRIPT` label `11px` uppercase tracking `0.06em` weight `700`, textarea `Type your script, or upload/record`).
  - Bottom action bar: `Avatar V` selector pill, `Motion` pill, `Voice` pill with integrated play preview button, aspect ratio dropdown (`9:16` / `16:9`), resolution dropdown (`720p` / `1080p`), and black pill `Generate` button (`#19191a`, text `#ffffff`, `border-radius: 9999px`).

### 3.3 Voice Library Table & Action Cards (`<VoicesCatalogView>`)
- **Top 3 Action Cards**: Equal-width rounded-2xl cards (`background: #f7f8fa`, `height: 68px`, `padding: 0 20px`) with circular white icon badge (`36×36px`) and bold title (`Create your HeyGen voice`, `Design a voice`, `Import from 3rd party`).
- **Voice Row**: `height: 68px`, `border-bottom: 1px solid #eaecee`, play button (`32×32px`), voice title (`14px` weight `600` `#232833`) + descriptive tags subtitle (`12px` `#687080`), right-aligned green `Public` badge (`background: #e6f9f3`, `color: #00a87e`, `font-size: 11px`, `font-weight: 600`, `padding: 3px 10px`, `border-radius: 6px`), country flag (`22×15px`), and `...` action menu.

### 3.4 Sign-In Modal (`<SignInModal>`)
- Centered dialog (`410×502px`, `border-radius: 20px`, `background: #ffffff`, `padding: 40px 40px 28px`, backdrop `rgba(15, 18, 25, 0.45)` with `backdrop-filter: blur(6px)`).
- Top-right close `×` button (`20×20px`).
- HeyGen stacked logo + Prism orb (`135×80px`).
- Primary OAuth button: `Sign in with Google` (`330×48px`, `background: #232833`, `color: #ffffff`, `border-radius: 9999px`).
- Secondary OAuth button: `Sign in with Apple` (`330×48px`, `background: #ffffff`, `border: 1px solid #e2e3e6`, `color: #232833`, `border-radius: 9999px`).
- Inline text links: `Use email  ·  Use SSO` (`14px` weight `500` `#232833`).
- Footer links: `Terms of Service · Privacy Policy` (`12px` `#687080`).

### 3.5 Settings Modal (`<WorkspaceSettingsModal>`)
- Large two-column modal (`920×660px`, `border-radius: 20px`, `background: #ffffff`, `overflow: hidden`):
  - **Left Sidebar (`210px` wide, `border-right: 1px solid #eaecee`, `padding: 24px 12px`)**:
    - Group `Profile Settings`: `Account`, `Preferences`, `Personalization`, `Shared avatars`.
    - Group `Workspace Settings`: `General`, `Plan & Billing`, `Usage & History`, `Security`, `Connections`.
  - **Right Content Area (`710px` wide, `padding: 28px 36px`, scrollable)**:
    - Profile Picture uploader (`Choose from avatars` black pill, `Upload photo` outline pill), `First Name` / `Last Name` inputs, `Email` (`Change email`), `Password` (`Create password`), `2-factor authentication` switch, `Connected accounts` (`Connect Google`), `Delete Account` (`#e54945` red pill) and `Log out` (`outline pill`).
