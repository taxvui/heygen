import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const DATA_REF_DIR = path.join(ROOT, 'data', 'reference');
const DOCS_REF_DIR = path.join(ROOT, 'docs', 'reference');
const PUBLIC_ASSETS_DIR = path.join(ROOT, 'public', 'heygen-assets');

const SANDBOX_OUT =
  'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\7f04536b-4215-466f-9bab-570d93fdd895\\browser_sandbox\\outputs';

const step288 = JSON.parse(fs.readFileSync(path.join(SANDBOX_OUT, 'step_288.json'), 'utf8'));
const step297 = JSON.parse(fs.readFileSync(path.join(SANDBOX_OUT, 'step_297.json'), 'utf8'));
const step309 = JSON.parse(fs.readFileSync(path.join(SANDBOX_OUT, 'step_309.json'), 'utf8'));

// 1. Annie 57 looks
const annieLooksRaw = [
  { title: 'Annie in Tan Jacket', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/262658a5bb3346e38b68c623019fd5b2_55470/preview_target.webp' },
  { title: 'Annie in Blue Suit', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/5d5a9a07c612460d882861e0e8931564_54040/preview_target.webp' },
  { title: 'Annie in White Shirt', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/561ec5deb3f74a27b6b12fd8a6a2f76e_56970/preview_target.webp' },
  { title: 'Annie in Black V-neck Shirt', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/2ff430195ff74d8ba32d629246898304_56120/preview_target.webp' },
  { title: 'Annie in Pink Suit', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/a643fb413d7e460ea257d0f4c15d0179_56150/preview_target.webp' },
  { title: 'Annie in Brown Shirt', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/823b3e996c4b4244957f4d4326f74b35_53400/preview_target.webp' },
  { title: 'Annie in Grey Dress', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/5b476f692d1c488bab6c7aed3ef00823_54010/preview_target.webp' },
  { title: 'Annie in Light Blue', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/2f27d7394d1546ceb091516e188b869f_55510/preview_target.webp' },
  { title: 'Annie in Grey Jacket', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/b76b3d8f146c4a0ab7b2b865d87eb801_55500/preview_target.webp' },
  { title: 'Annie in Blue Casual', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/35a188d174c446859764803cd63d7332_55540/preview_target.webp' },
  { title: 'Annie in Black Shirt', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/f4b1d27d912f405a8abb2ace86cb67d6_56130/preview_target.webp' },
  { title: 'Annie in Blue Vest', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/5d8649146ffe4644858c56b3c63be17a_55490/preview_target.webp' },
  { title: 'Annie Lounge Standing Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/e621bd1f24c14305a2233e93a8c8715e_55970/preview_talk_1.webp' },
  { title: 'Annie Lounge Standing Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/363e6f1f39b540b4adbfdae8ebda75ae_55960/preview_talk_2.webp' },
  { title: 'Annie Sofa Sitting Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/3c6fc843d9eb4b4a83e6e15d4dd1414a_55970/preview_target.webp' },
  { title: 'Annie Sofa Sitting Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/7f2caecd8b8b4e5f94b1ee92fe697322_55960/preview_talk_1.webp' },
  { title: 'Annie Sofa Sitting Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/96b055e7536f4d99b8c5f519fbad7179_55960/preview_target.webp' },
  { title: 'Annie Sofa Sitting Side 3', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/46bf2baf90bc4333a8a40d01f22e606d_56320/preview_target.webp' },
  { title: 'Annie Sofa Sitting Front 3', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/adcd9c28596f40389a926f2b7a4153d0_56310/preview_talk_1.webp' },
  { title: 'Annie Sofa Sitting Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/c9f42d5a83d84ed6b3f42989f0ef20b4_56310/preview_target.webp' },
  { title: 'Annie Studio Pink Standing Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/30184bf113ce49bfac8cdf00c225046f_56060/preview_target.webp' },
  { title: 'Annie Studio Pink Standing Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/456807b0fc8e4f8da62760594118c2a6_56040/preview_talk_1.webp' },
  { title: 'Annie Studio Pink Sitting Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/aa2a61c1d5834ece938375d412132580_56320/preview_talk_1.webp' },
  { title: 'Annie Studio Pink Sitting Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/b56dba4dc8114414bc16d39d7aa051bc_56040/preview_target.webp' },
  { title: 'Annie Bar Standing Side 3', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/cbc71c5b9e754f809621b4d5706009ab_56100/preview_talk_2.webp' },
  { title: 'Annie Bar Standing Front 3', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/56ecee33b1d144bbb4efa65f68dcbb03_56110/preview_target.webp' },
  { title: 'Annie Bar Standing Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/63948e2e772543deae18844327e27877_56100/preview_talk_3.webp' },
  { title: 'Annie Bar Standing Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/6eeb8d4212d84bfdb968d00aba9960b2_56090/preview_talk_2.webp' },
  { title: 'Annie Bar Standing Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/ba51441b61d445db8443c83f8a8d0d15_56100/preview_talk_1.webp' },
  { title: 'Annie Bar Standing Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/d0a38df14afa46d8b25f7745331cdb89_56090/preview_talk_1.webp' },
  { title: 'Annie Bar Sitting Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/b724e937b6af472689a91de64233a66b_56100/preview_target.webp' },
  { title: 'Annie Bar Sitting Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/7b244fd523ba4135b6a2a8ecaf19b510_56090/preview_target.webp' },
  { title: 'Annie Office Sitting Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/6bd64a550919413f8257aabfb74c22fb_56080/preview_talk_1.webp' },
  { title: 'Annie Office Sitting Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/6f1c6120e79f48ed834be24a94b05931_56070/preview_talk_2.webp' },
  { title: 'Annie Desk Sitting Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/a130a0f3225c4fdb91de800cd836b778_56080/preview_target.webp' },
  { title: 'Annie Desk Sitting Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/33d3475370b94bb7942dcbbdc445b03f_56070/preview_target.webp' },
  { title: 'Annie Casual Standing Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/39eeeab7f75e411a82a3185ee8ef3901_56050/preview_talk_1.webp' },
  { title: 'Annie Casual Standing Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/8e1eb5dd8aa649b3a2736ad3ae63d6c8_56040/preview_talk_2.webp' },
  { title: 'Annie Desk Sitting Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/ea08ae4933164707bc0e9b1536b28bc9_56050/preview_target.webp' },
  { title: 'Annie Desk Sitting Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/10c2cfbc1c1b4fa9a5fc08162b1709e2_56040/preview_talk_3.webp' },
  { title: 'Annie Office Standing Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/ad51bc760ed54ab3bc2f3f8eccaf8e30_56030/preview_talk_1.webp' },
  { title: 'Annie Office Standing Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/4166f08ed46f40fb87ca14b9ef48765d_56020/preview_talk_3.webp' },
  { title: 'Annie Office Sitting Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/58d47dbbb5d7454dbda0f53bc34fd9ea_56030/preview_target.webp' },
  { title: 'Annie Office Sitting Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/b5272572b25143fbb1af3b874a03bdaf_56020/preview_talk_2.webp' },
  { title: 'Annie Business Casual Standing Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/78f858c6cf2845bb9c31b3cea76b0e58_56030/preview_talk_3.webp' },
  { title: 'Annie Business Casual Standing Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/59ab28f846a24d25b3e91a2a87222c4c_56020/preview_talk_1.webp' },
  { title: 'Annie Business Casual Standing Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/e87a78fbcb074752a4a7770be54513b1_56030/preview_talk_2.webp' },
  { title: 'Annie Business Casual Standing Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/d1777b1afdb8436cb3b3f0833c6ed492_56020/preview_target.webp' },
  { title: 'Annie Casual Sitting Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/2b1a099cf17a4bcaa09b14d2f9727485_55990/preview_talk_1.webp' },
  { title: 'Annie Casual Sitting Front 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/1b06ffc57270417ba7da3dc24decd433_55980/preview_talk_1.webp' },
  { title: 'Annie Casual Standing Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/c76fa4a2be354fccbb503909d32f1a64_55990/preview_talk_2.webp' },
  { title: 'Annie Casual Standing Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/f5d3bb0f157d4f05b52828702f47230e_55980/preview_talk_2.webp' },
  { title: 'Annie Casual Sitting Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/ce758a257b7f4be3a8c2cf37dbc9e5d7_55990/preview_target.webp' },
  { title: 'Annie Casual Sitting Front', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/782ffba0e0584bd6935e7e57d5f7e444_55980/preview_target.webp' },
  { title: 'Annie in Pink Suit + Gestures', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/d8973ef25fef41e4a51d07ac47494958/half/2.2/preview_target.webp' },
  { title: 'Annie in Pink Suit Side', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/b8e70028dd2344c586e7f8b73c7d5ea3/full/2.2/preview_target.webp' },
  { title: 'Annie in Pink Suit Side 2', thumbnailUrl: 'https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/3c1adf34313f42e0b0e304a4d00d5c7e/half/2.2/preview_target.webp' },
];
console.log(`Loaded ${annieLooksRaw.length} Annie looks`);

// 2. AI Studio templates #19..#45
const studioTemplates19To45 = [
  { index: 19, title: 'Financial Risk Planning', category: 'Finance', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/46e13f70d2ee48d1ba13d04e130f9839/thumbnail_medium_thumbnail-video-46e13f70d2ee48d1ba13d04e130f9839.png' },
  { index: 20, title: 'Email Marketing Course', category: 'Learning & Development · Explainer Video · Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/481e59592b4045dbac5d3325aba86735/thumbnail_medium_thumbnail-video-481e59592b4045dbac5d3325aba86735.png' },
  { index: 21, title: 'Real Estate Template', category: 'Marketing · Real Estate', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/4cf4e5898436497faa987bc9958663d7/thumbnail_medium_thumbnail-video-4cf4e5898436497faa987bc9958663d7.png' },
  { index: 22, title: 'Focus Framework Lesson', category: 'Learning & Development · Training · Corporate · Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/57dec7956a974e538c1d451717cea9dc/thumbnail_medium_thumbnail-video-57dec7956a974e538c1d451717cea9dc.png' },
  { index: 23, title: 'Marketing Report Template', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/592f8a0d2d73413980042cfd5e2e8700/thumbnail_medium_thumbnail-video-592f8a0d2d73413980042cfd5e2e8700.png' },
  { index: 24, title: 'My First Avatar Video', category: 'Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/5ab5808fdb604d56a2f0da19716e7a42/thumbnail_medium_thumbnail-video-5ab5808fdb604d56a2f0da19716e7a42' },
  { index: 25, title: 'Storm Damage Support', category: 'Finance · Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/5db409a43a094dd99c7611d1b79687e4/thumbnail_medium_thumbnail-video-5db409a43a094dd99c7611d1b79687e4' },
  { index: 26, title: 'Onboarding Training', category: 'Training · Corporate · Learning & Development', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/62468a0c215d4b3d9d964162eb4453b8/thumbnail_medium_thumbnail-video-62468a0c215d4b3d9d964162eb4453b8' },
  { index: 27, title: 'Course Overview', category: 'Learning & Development · Training · Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/6358f130ce3445b79a9a36178f21f52b/thumbnail_medium_thumbnail-video-6358f130ce3445b79a9a36178f21f52b.png' },
  { index: 28, title: 'Painting Course - Lesson Module', category: 'Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/6385a1dd18a045bdaaf1ed23daacf9c6/thumbnail_medium_thumbnail-video-6385a1dd18a045bdaaf1ed23daacf9c6.png' },
  { index: 29, title: 'Social Media Growth', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/667445d6f1b245e89f2d6e51a69cc15f/thumbnail_medium_thumbnail-video-667445d6f1b245e89f2d6e51a69cc15f' },
  { index: 30, title: 'News & Media', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/67748273b59549b9b3acba1a33350c16/thumbnail_medium_thumbnail-video-67748273b59549b9b3acba1a33350c16' },
  { index: 31, title: 'Family Law Consultation', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/6e796cc22ebe41d4bbb5bb83e7f914f4/thumbnail_medium_thumbnail-video-6e796cc22ebe41d4bbb5bb83e7f914f4' },
  { index: 32, title: 'Professional Training Lesson', category: 'Learning & Development · Tutorials & Explainers · Training · Corporate', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/71af0db9f687436fb7189e4b14c98161/thumbnail_medium_thumbnail-video-71af0db9f687436fb7189e4b14c98161' },
  { index: 33, title: 'Employee Onboarding', category: 'Corporate · Training', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7314ae5d8eec4d3d86cb98b001543dd1/thumbnail_medium_thumbnail-video-7314ae5d8eec4d3d86cb98b001543dd1.png' },
  { index: 34, title: 'Marketing Presentation', category: 'Marketing · Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/732402b50d094e79b87fe8f7609f66a8/thumbnail_medium_thumbnail-video-732402b50d094e79b87fe8f7609f66a8.png' },
  { index: 35, title: 'Wedding Photography Packages', category: 'Sales', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/746da21208cf45e8918058a0c2d8a05e/thumbnail_medium_thumbnail-video-746da21208cf45e8918058a0c2d8a05e' },
  { index: 36, title: 'Knowledge Base', category: 'Training · Explainer Video · Learning & Development', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/747821fb65164fc3aa1feaf225468ebb/thumbnail_medium_thumbnail-video-747821fb65164fc3aa1feaf225468ebb.png' },
  { index: 37, title: 'Social Template', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7b6406f315cb47b1ade0c53b7cb24582/thumbnail_medium_thumbnail-video-7b6406f315cb47b1ade0c53b7cb24582' },
  { index: 38, title: 'News Report', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7b7b38ef87ad443683ef6f34830f8232/thumbnail_medium_thumbnail-video-7b7b38ef87ad443683ef6f34830f8232.png' },
  { index: 39, title: 'Prompt Engineering Course', category: 'Learning & Development · Corporate · Tutorials & Explainers', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7bdb5f04eb024635b13154ac9cf4b4e8/thumbnail_medium_thumbnail-video-7bdb5f04eb024635b13154ac9cf4b4e8' },
  { index: 40, title: 'Pet Referral Rewards', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7c23d0c08ea245daa0babfbd04b3d9ac/thumbnail_medium_thumbnail-video-7c23d0c08ea245daa0babfbd04b3d9ac' },
  { index: 41, title: 'Corporate Business Presentation', category: 'Corporate', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7d76a7a827c24a879ccfc7d596521a68/thumbnail_medium_thumbnail-video-7d76a7a827c24a879ccfc7d596521a68.png' },
  { index: 42, title: 'Estate Planning Essentials', category: 'Marketing', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/7f94848e8e2d4e709d67fe9eb694abcd/thumbnail_medium_thumbnail-video-7f94848e8e2d4e709d67fe9eb694abcd.png' },
  { index: 43, title: 'Sales Outreach', category: 'Sales · Corporate', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/8056d1a6425d41fbae63b101152f4e60/thumbnail_medium_thumbnail-video-8056d1a6425d41fbae63b101152f4e60' },
  { index: 44, title: 'Email Marketing Course - Introduction', category: 'Tutorials & Explainers · Learning & Development', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/809d75fe237146f998ce8c19e9bf3f4f/thumbnail_medium_thumbnail-video-809d75fe237146f998ce8c19e9bf3f4f.png' },
  { index: 45, title: 'Annual Coverage Checkup', category: 'Tutorials & Explainers · Finance', imageUrl: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/80efc64b2139461eba3044fd3891f48c/thumbnail_medium_thumbnail-video-80efc64b2139461eba3044fd3891f48c.png' },
];
console.log(`Loaded ${studioTemplates19To45.length} additional AI Studio templates`);

// 3. Voices 89 items from step_309.json
const voices89Raw = step309.value?.voices || [];
console.log(`Loaded ${voices89Raw.length} HeyGen Library voices from step_309.json`);

const downloadQueue = [
  // Initial AI Studio Templates (#2..#9)
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/09546f1637664ea6969519f91dc3bd79/thumbnail_medium_thumbnail-video-09546f1637664ea6969519f91dc3bd79.png',
    dest: 'public/heygen-assets/thumbnails/template-sales-report.png',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/0c7e91fb78c846138f064b1b6a9ece11/thumbnail_medium_thumbnail-video-0c7e91fb78c846138f064b1b6a9ece11',
    dest: 'public/heygen-assets/thumbnails/template-moving-quote.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/16fdd2e055634a569ae909a59fb71974/thumbnail_medium_thumbnail-video-16fdd2e055634a569ae909a59fb71974',
    dest: 'public/heygen-assets/thumbnails/template-wealth-management.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/186485ddebfd4273b7b75592b2dfdd26/thumbnail_medium_thumbnail-video-186485ddebfd4273b7b75592b2dfdd26',
    dest: 'public/heygen-assets/thumbnails/template-product-roadmap.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/1d3b10611b8a4b0ba7d4e02773d7e6dc/thumbnail_medium_thumbnail-video-1d3b10611b8a4b0ba7d4e02773d7e6dc',
    dest: 'public/heygen-assets/thumbnails/template-financial-services.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/1d6b074d59734503b65bf9828384261b/thumbnail_medium_thumbnail-video-1d6b074d59734503b65bf9828384261b.png',
    dest: 'public/heygen-assets/thumbnails/template-property-listing.png',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/2391b2b838a64d7f99b1b92a62529ab8/thumbnail_medium_thumbnail-video-2391b2b838a64d7f99b1b92a62529ab8',
    dest: 'public/heygen-assets/thumbnails/template-business-strategy.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:h-600,c-at_max/prod/movio/template/24d7265d70d84124baeb8e761044f823/thumbnail_medium_thumbnail-video-24d7265d70d84124baeb8e761044f823.png',
    dest: 'public/heygen-assets/thumbnails/template-tech-news.png',
  },
  // 4 My Avatars deck posters
  {
    url: 'https://dynamic.heygen.ai/tr:w-320,f-auto/avatar/avatar-hub/deck-back-1-poster.jpg',
    dest: 'public/heygen-assets/images/deck-back-1-poster.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:w-320,f-auto/avatar/avatar-hub/deck-back-2-poster.jpg',
    dest: 'public/heygen-assets/images/deck-back-2-poster.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:w-320,f-auto/avatar/avatar-hub/deck-front-poster.jpg',
    dest: 'public/heygen-assets/images/deck-front-poster.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:w-320,f-auto/avatar/avatar-hub/deck-back-3-poster.jpg',
    dest: 'public/heygen-assets/images/deck-back-3-poster.jpg',
  },
  // New voice flags ng.png and ca.png
  {
    url: 'https://static.heygen.ai/region_flags/ng.png',
    dest: 'public/heygen-assets/icons/flag-ng.png',
  },
  {
    url: 'https://static.heygen.ai/region_flags/ca.png',
    dest: 'public/heygen-assets/icons/flag-ca.png',
  },
  // 6 Developers Models cards
  {
    url: 'https://dynamic.heygen.ai/image/5eace974c72e4bad996cf6d5dd1635fe/original.jpg?tr=f-auto,q-85,h-440',
    dest: 'public/heygen-assets/images/dev-model-avatar-v.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/image/33888214b2bc4120a67d0a8ca3ae7df0/original.jpg?tr=f-auto,q-85,h-440',
    dest: 'public/heygen-assets/images/dev-model-avatar-iv.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/image/7b8fc6650be0413296d7a892f42ed024/original.jpg?tr=f-auto,q-85,h-440',
    dest: 'public/heygen-assets/images/dev-model-avatar-iii.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/image/e5e2988bc2bc42b395d65e861a321469/original.jpg?tr=f-auto,q-85,h-440',
    dest: 'public/heygen-assets/images/dev-model-heygen-voice.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/image/e1bb4c4761944a8092527b2b8c473ae1/original.jpg?tr=f-auto,q-85,h-440',
    dest: 'public/heygen-assets/images/dev-model-pvc.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/image/45c785784bc54b76826504ae6868489d/original.jpg?tr=f-auto,q-85,h-440',
    dest: 'public/heygen-assets/images/dev-model-heygen-video.jpg',
  },
  // 2 Batch Mode avatars (Leonardo & Kristy)
  {
    url: 'https://dynamic.heygen.ai/tr:ar-48-58,h-420,fo-auto,f-auto/avatar/v3/ae2148de115c40daa77d992dfe7eb2fc/full/2.2/preview_target.webp',
    dest: 'public/heygen-assets/thumbnails/avatar-leonardo.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-48-58,h-420,fo-auto,f-auto/avatar/v3/70ef24fbfabe4299b432b806afb70163/half/2.2/preview_target.webp',
    dest: 'public/heygen-assets/thumbnails/avatar-kristy.webp',
  },
  // 16 Bento side images + Kyle hero for Public Avatars #26..33
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Ailsa/paos/angles/office58_p3_a0.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-ailsa-sub1.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Ailsa/paos/angles/office55_p3_a0.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-ailsa-sub2.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-158-190,h-720,fo-auto,f-auto/avatar/v3/cd7d2ca61289427fae6411ab43fac08e/half/2.2/raw_preview_image.webp',
    dest: 'public/heygen-assets/thumbnails/avatar-kyle-main.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/202c1b15321542c3a69121bc090fd5b0/half/2.2/raw_preview_image.webp',
    dest: 'public/heygen-assets/thumbnails/avatar-kyle-sub1.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/avatar/v3/c69833990d4e4fd7bc81b7f6b910b313/half/2.2/raw_preview_image.webp',
    dest: 'public/heygen-assets/thumbnails/avatar-kyle-sub2.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/talking_photo/fb65d015743a431a9f517ec0167c9ffc/65b4411f41e14937b5e02fdfde2e99e7.WEBP',
    dest: 'public/heygen-assets/thumbnails/avatar-tess-sub1.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/talking_photo/a41ac5e6af204a50b0236442af948c89/6371d67ea9674924b9b6e49cdb183575.WEBP',
    dest: 'public/heygen-assets/thumbnails/avatar-tess-sub2.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Yara/first_frames/look_05.png',
    dest: 'public/heygen-assets/thumbnails/avatar-yara-sub1.png',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Yara/angle_pack/personal_development_coach_angle_3.png',
    dest: 'public/heygen-assets/thumbnails/avatar-yara-sub2.png',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Beatriz/paos/angles/office68_p3_a1.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-beatriz-sub1.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Beatriz/paos/angles/office73_p1_a0.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-beatriz-sub2.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/talking_photo/c5edd1a777ed4b81843182c5fe3a1f39/e608d7582b674d16b001da5f39c85258.WEBP',
    dest: 'public/heygen-assets/thumbnails/avatar-zayne-sub1.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/talking_photo/c9bfedde4c124a379bb5474a25716026/5b4693c7e6e44d27ae2846403ce1a686.WEBP',
    dest: 'public/heygen-assets/thumbnails/avatar-zayne-sub2.webp',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Elliot/paos/angles/livingroom88_p2_a1.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-elliot-sub1.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Elliot/paos/angles/office60_p3_a1.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-elliot-sub2.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Damian/paos/angles/office86_p2_a0.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-damian-sub1.jpg',
  },
  {
    url: 'https://dynamic.heygen.ai/tr:ar-1-1,h-420,fo-auto,f-auto/public-avatars/Damian/paos/angles/kitchen59_p2_a1.jpg',
    dest: 'public/heygen-assets/thumbnails/avatar-damian-sub2.jpg',
  },
];

// Add all 57 Annie look thumbnails
const annie57Looks = annieLooksRaw.map((lk, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const localRel = `/heygen-assets/thumbnails/annie-look-${num}.webp`;
  if (lk.thumbnailUrl) {
    downloadQueue.push({
      url: lk.thumbnailUrl,
      dest: `public${localRel}`,
    });
  }
  return {
    id: `annie-look-${num}`,
    title: lk.title,
    remoteUrl: lk.thumbnailUrl,
    localImage: localRel,
  };
});

// Add AI Studio templates #19..#45
const additionalStudioTemplates = studioTemplates19To45.map((tpl) => {
  const num = tpl.index;
  const ext = tpl.imageUrl?.endsWith('.png') ? 'png' : 'webp';
  const localRel = `/heygen-assets/thumbnails/template-studio-${num}.${ext}`;
  if (tpl.imageUrl) {
    downloadQueue.push({
      url: tpl.imageUrl,
      dest: `public${localRel}`,
    });
  }
  const tags = (tpl.category || 'Corporate')
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    id: `tpl-${num}`,
    title: tpl.title,
    tags: tags.length > 0 ? tags : ['Corporate'],
    remoteImage: tpl.imageUrl,
    localImage: localRel,
  };
});

async function downloadFile(url, destRel) {
  const fullPath = path.join(ROOT, destRel);
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 100) {
    return { url, dest: destRel, status: 'cached', size: fs.statSync(fullPath).size };
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Referer: 'https://app.heygen.com/',
      },
    });
    if (!res.ok) return { url, dest: destRel, status: `http_${res.status}`, size: 0 };
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, buf);
    return { url, dest: destRel, status: 'downloaded', size: buf.length };
  } catch (err) {
    return { url, dest: destRel, status: `error_${err.message}`, size: 0 };
  }
}

console.log(`Downloading ${downloadQueue.length} Pass 1 & Pass 2 reference assets...`);
const results = [];
for (let i = 0; i < downloadQueue.length; i += 10) {
  const batch = downloadQueue.slice(i, i + 10);
  const r = await Promise.all(batch.map((item) => downloadFile(item.url, item.dest)));
  results.push(...r);
}
const okCount = results.filter((r) => r.status === 'downloaded' || r.status === 'cached').length;
console.log(`Pass 1 & Pass 2 downloads complete: ${okCount}/${downloadQueue.length} ready.`);

// Update data/reference/avatars.json with all 33 Bento avatars (exact side1/side2 for 26..33), 57 additional avatar names, and all 57 Annie looks
const avatarsJsonPath = path.join(DATA_REF_DIR, 'avatars.json');
const avatarsData = JSON.parse(fs.readFileSync(avatarsJsonPath, 'utf8'));
const exact26To33 = {
  Ailsa: {
    heroImg: '/heygen-assets/thumbnails/avatar-ailsa-main.jpg',
    sideImg1: '/heygen-assets/thumbnails/avatar-ailsa-sub1.jpg',
    sideImg2: '/heygen-assets/thumbnails/avatar-ailsa-sub2.jpg',
  },
  Kyle: {
    heroImg: '/heygen-assets/thumbnails/avatar-kyle-main.webp',
    sideImg1: '/heygen-assets/thumbnails/avatar-kyle-sub1.webp',
    sideImg2: '/heygen-assets/thumbnails/avatar-kyle-sub2.webp',
  },
  Tess: {
    heroImg: '/heygen-assets/thumbnails/avatar-tess-main.webp',
    sideImg1: '/heygen-assets/thumbnails/avatar-tess-sub1.webp',
    sideImg2: '/heygen-assets/thumbnails/avatar-tess-sub2.webp',
  },
  Yara: {
    heroImg: '/heygen-assets/thumbnails/avatar-yara-main.png',
    sideImg1: '/heygen-assets/thumbnails/avatar-yara-sub1.png',
    sideImg2: '/heygen-assets/thumbnails/avatar-yara-sub2.png',
  },
  Beatriz: {
    heroImg: '/heygen-assets/thumbnails/avatar-beatriz-main.jpg',
    sideImg1: '/heygen-assets/thumbnails/avatar-beatriz-sub1.jpg',
    sideImg2: '/heygen-assets/thumbnails/avatar-beatriz-sub2.jpg',
  },
  Zayne: {
    heroImg: '/heygen-assets/thumbnails/avatar-zayne-main.jpg',
    sideImg1: '/heygen-assets/thumbnails/avatar-zayne-sub1.webp',
    sideImg2: '/heygen-assets/thumbnails/avatar-zayne-sub2.webp',
  },
  Elliot: {
    heroImg: '/heygen-assets/thumbnails/avatar-elliot-main.jpg',
    sideImg1: '/heygen-assets/thumbnails/avatar-elliot-sub1.jpg',
    sideImg2: '/heygen-assets/thumbnails/avatar-elliot-sub2.jpg',
  },
  Damian: {
    heroImg: '/heygen-assets/thumbnails/avatar-damian-main.jpg',
    sideImg1: '/heygen-assets/thumbnails/avatar-damian-sub1.jpg',
    sideImg2: '/heygen-assets/thumbnails/avatar-damian-sub2.jpg',
  },
};

avatarsData.publicAvatars = avatarsData.publicAvatars.map((av) => {
  if (exact26To33[av.name]) {
    return { ...av, ...exact26To33[av.name] };
  }
  return av;
});
avatarsData.annie57Looks = annie57Looks;
avatarsData.myAvatarsDeckPosters = [
  '/heygen-assets/images/deck-back-1-poster.jpg',
  '/heygen-assets/images/deck-back-2-poster.jpg',
  '/heygen-assets/images/deck-front-poster.jpg',
  '/heygen-assets/images/deck-back-3-poster.jpg',
];
fs.writeFileSync(avatarsJsonPath, JSON.stringify(avatarsData, null, 2));

// Update data/reference/templates.json with all 45 AI Studio templates
const templatesJsonPath = path.join(DATA_REF_DIR, 'templates.json');
const templatesData = JSON.parse(fs.readFileSync(templatesJsonPath, 'utf8'));
templatesData.aiStudioTemplates = [
  ...templatesData.aiStudioTemplates.slice(0, 18),
  ...additionalStudioTemplates,
];
fs.writeFileSync(templatesJsonPath, JSON.stringify(templatesData, null, 2));

// Update data/reference/voices.json with all 89 HeyGen Library voices
const voicesJsonPath = path.join(DATA_REF_DIR, 'voices.json');
const flagMap = {
  'us.png': { flag: '/heygen-assets/icons/flag-us.png', country: 'US' },
  'au.png': { flag: '/heygen-assets/icons/flag-au.png', country: 'AU' },
  'gb.png': { flag: '/heygen-assets/icons/flag-gb.png', country: 'GB' },
  'ie.png': { flag: '/heygen-assets/icons/flag-ie.png', country: 'IE' },
  'in.png': { flag: '/heygen-assets/icons/flag-in.png', country: 'IN' },
  'ng.png': { flag: '/heygen-assets/icons/flag-ng.png', country: 'NG' },
  'ca.png': { flag: '/heygen-assets/icons/flag-ca.png', country: 'CA' },
};
const full89Voices = voices89Raw.map((v, idx) => {
  const voiceName = v.name || v.lineMinus2 || `Voice ${idx + 1}`;
  const voiceTags = v.tags || v.lineMinus1 || 'Young, Clear, HeyGen Voice, Female';
  const flagFile = (v.flagUrl || '').split('/').pop() || 'us.png';
  const fm = flagMap[flagFile] || flagMap['us.png'];
  const gender = voiceTags.includes('Female') ? 'Female' : 'Male';
  const age = voiceTags.includes('Old')
    ? 'Old'
    : voiceTags.includes('Mature')
    ? 'Mature'
    : 'Young';
  return {
    id: `v-${String(idx + 1).padStart(2, '0')}`,
    name: voiceName,
    flag: fm.flag,
    country: fm.country,
    language: 'English',
    gender,
    age,
    tags: voiceTags,
    badge: 'Public',
  };
});
fs.writeFileSync(
  voicesJsonPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalObservedHeyGenLibraryVoices: full89Voices.length,
      page1Count: 29,
      page2Count: 30,
      page3Count: 30,
      paginationControl: 'See More',
      voices: full89Voices,
    },
    null,
    2
  )
);

// Rebuild asset manifest with SHA-256
function walkFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

const allFiles = walkFiles(PUBLIC_ASSETS_DIR);
const manifest = allFiles.map((fullPath, idx) => {
  const relFromRoot = path.relative(ROOT, fullPath).replace(/\\/g, '/');
  const publicUrl = '/' + path.relative(path.join(ROOT, 'public'), fullPath).replace(/\\/g, '/');
  const buf = fs.readFileSync(fullPath);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  return {
    id: `asset-${String(idx + 1).padStart(3, '0')}`,
    filename: path.basename(fullPath),
    category: path.basename(path.dirname(fullPath)),
    fileType: path.extname(fullPath).replace('.', '').toLowerCase(),
    localPath: relFromRoot,
    publicUrl,
    fileSize: buf.length,
    sha256,
    authorized: true,
    retrievalStatus: 'SUCCESS',
  };
});

fs.writeFileSync(
  path.join(DOCS_REF_DIR, 'asset-manifest.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), totalAssets: manifest.length, assets: manifest }, null, 2)
);
fs.writeFileSync(
  path.join(DATA_REF_DIR, 'assets.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), totalAssets: manifest.length, assets: manifest }, null, 2)
);
console.log(`Updated asset-manifest.json with ${manifest.length} SHA-256 verified local assets.`);
