import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ChevronDown, Search, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

interface EditorialStyle {
  id: string;
  en: string;
  zh: string;
  img: string;
  badges: string[];
  descEn: string;
  descZh: string;
  bestForEn: string;
  bestForZh: string;
  placementEn: string;
  placementZh: string;
  tags: string[];
  filters: string[];
}

const STYLES_23: EditorialStyle[] = [
  {
    id: 'fine-line',
    en: 'Fine Line',
    zh: '细线',
    img: '/assets/styles/fine-line.webp',
    badges: ['Popular', 'First tattoo'],
    descEn: 'Delicate, precision-driven linework with subtle shading that feels light and refined on skin.',
    descZh: '精致细腻的单针与细线线条，搭配柔和过渡阴影，上身轻盈雅致。',
    bestForEn: 'Botanicals, zodiac symbols, delicate animals, subtle keepsakes',
    bestForZh: '植物花卉、星座符号、精致动物与细腻纪念图案',
    placementEn: 'Inner wrist, forearm, collarbone, rib · Small to medium',
    placementZh: '内手腕、小臂、锁骨、肋骨 · 小至中等尺寸',
    tags: ['Delicate', 'Minimal', 'Black ink'],
    filters: ['first', 'small', 'delicate', 'bg'],
  },
  {
    id: 'minimalist',
    en: 'Minimalist',
    zh: '极简',
    img: '/assets/styles/minimalist.webp',
    badges: ['First tattoo'],
    descEn: 'Stripped-back silhouettes and clean negative space that say more with fewer strokes.',
    descZh: '化繁为简的轮廓与克制留白，用最少线条表达清晰寓意。',
    bestForEn: 'Waves, moons, line portraits, meaningful icons',
    bestForZh: '海浪、弯月、一笔画轮廓与简约符号',
    placementEn: 'Wrist, ankle, behind ear, inner arm · Tiny to small',
    placementZh: '手腕、脚踝、耳后、手臂内侧 · 迷你至小图',
    tags: ['Clean', 'Timeless', 'Subtle'],
    filters: ['first', 'small', 'delicate', 'bg', 'symbolic'],
  },
  {
    id: 'floral',
    en: 'Floral / Botanical',
    zh: '花卉植物',
    img: '/assets/styles/floral.webp',
    badges: ['Popular'],
    descEn: 'Organic stems, petals, and leaves shaped to wrap gracefully around arms, shoulders, and ribs.',
    descZh: '自然舒展的花瓣与枝叶走势，非常适合顺应手臂、肩部与肋骨曲线。',
    bestForEn: 'Birth flowers, wildflowers, olive branches, botanical sleeves',
    bestForZh: '生辰花、野花枝叶、橄榄枝与花卉花臂',
    placementEn: 'Forearm, shoulder, sternum, hip · Small to large',
    placementZh: '小臂、肩部、胸骨、髋部 · 小至大图',
    tags: ['Organic', 'Flowing', 'Versatile'],
    filters: ['first', 'delicate', 'floral', 'bg', 'color'],
  },
  {
    id: 'lettering',
    en: 'Lettering',
    zh: '文字花体',
    img: '/assets/styles/lettering.webp',
    badges: ['Text'],
    descEn: 'Custom script, serif, gothic, and typewriter typography crafted for lasting legibility.',
    descZh: '涵盖手写花体、衬线、哥特与打字机的定制文字，兼顾美感与清晰度。',
    bestForEn: 'Names, dates, coordinates, short personal mottos',
    bestForZh: '名字、纪念日期、坐标与简短座右铭',
    placementEn: 'Forearm, collarbone, rib, wrist · Small to medium',
    placementZh: '小臂、锁骨、肋骨、手腕 · 小至中图',
    tags: ['Typography', 'Personal', 'Clean'],
    filters: ['first', 'small', 'text', 'bg'],
  },
  {
    id: 'realism',
    en: 'Realism',
    zh: '写实',
    img: '/assets/styles/realism.webp',
    badges: ['High detail'],
    descEn: 'Lifelike depth, lighting, and texture rendered without heavy cartoon outlines.',
    descZh: '逼真的光影层次与皮肤质感，摒弃生硬外框线，还原照片级立体感。',
    bestForEn: 'Portraits, wildlife, classical statues, dramatic nature scenes',
    bestForZh: '人物肖像、野生动物、古典雕塑与宏大自然场景',
    placementEn: 'Upper arm, full sleeve, back, thigh · Medium to large',
    placementZh: '上臂、花臂、背部、大腿 · 中至大面积',
    tags: ['Photoreal', 'Depth', 'Statement'],
    filters: ['realistic', 'bg', 'color'],
  },
  {
    id: 'black-grey',
    en: 'Black and Grey',
    zh: '黑灰',
    img: '/assets/styles/black-grey.webp',
    badges: ['Classic'],
    descEn: 'Smooth tonal gradients built solely from black ink and diluted grey wash.',
    descZh: '仅凭黑墨与层次灰雾打造柔和明暗过渡，高级且耐看。',
    bestForEn: 'Mythology, clocks, roses, realistic and illustrative sleeves',
    bestForZh: '神话人物、时钟、玫瑰与写实/插画风格花臂',
    placementEn: 'Sleeve, chest, back, calf · Medium to large',
    placementZh: '花臂、胸口、背部、小腿 · 中至大图',
    tags: ['Smooth shading', 'Classic', 'Monochrome'],
    filters: ['realistic', 'bg'],
  },
  {
    id: 'american-traditional',
    en: 'American Traditional',
    zh: '美式传统',
    img: '/assets/styles/old-school.webp',
    badges: ['Bold'],
    descEn: 'Thick black outlines, limited primary color palette, and iconic sailor-era motifs.',
    descZh: '扎实粗黑外框与经典红黄绿高饱和配色，极具复古硬朗魅力。',
    bestForEn: 'Swallows, daggers, roses, panthers, eagles, anchors',
    bestForZh: '燕子、匕首、玫瑰、黑豹、老鹰与船锚',
    placementEn: 'Forearm, upper arm, calf, chest · Medium',
    placementZh: '小臂、上臂、小腿、胸口 · 中等尺寸',
    tags: ['Old School', 'Bold lines', 'Color'],
    filters: ['bold', 'color', 'cultural'],
  },
  {
    id: 'japanese',
    en: 'Japanese',
    zh: '日式传统',
    img: '/assets/styles/japanese.webp',
    badges: ['Cultural'],
    descEn: 'Flowing irezumi compositions pairing mythological subjects with wind bars, waves, and blossoms.',
    descZh: '讲究整体构图与气韵流动的日式传统风格，常融合海浪、云雾与樱花。',
    bestForEn: 'Koi fish, dragons, tigers, oni masks, cherry blossoms',
    bestForZh: '锦鲤、龙、猛虎、般若面具与樱花',
    placementEn: 'Full sleeve, back piece, chest panel · Large',
    placementZh: '整臂、满背、半胛胸口 · 大面积',
    tags: ['Irezumi', 'Flow', 'Storytelling'],
    filters: ['bold', 'color', 'cultural', 'symbolic'],
  },
  {
    id: 'blackwork',
    en: 'Blackwork',
    zh: '重黑',
    img: '/assets/styles/blackwork.webp',
    badges: ['Bold'],
    descEn: 'High-contrast solid black fills, bold silhouettes, and graphic negative space.',
    descZh: '高对比度的纯黑块面与强烈图形感，极具视觉冲击力。',
    bestForEn: 'Abstract patterns, botanicals, dark illustrative art, cover-ups',
    bestForZh: '抽象几何、暗黑植物、插画图案与遮盖旧图',
    placementEn: 'Forearm, back, leg, sleeve · Medium to large',
    placementZh: '小臂、背部、腿部、整臂 · 中至大图',
    tags: ['High contrast', 'Graphic', 'Black ink'],
    filters: ['bold', 'bg'],
  },
  {
    id: 'geometric',
    en: 'Geometric',
    zh: '几何',
    img: '/assets/styles/geometric.webp',
    badges: ['Symbolic'],
    descEn: 'Sacred geometry, symmetrical line matrices, and crisp architectural precision.',
    descZh: '神圣几何、对称线条矩阵与建筑般的精准结构美感。',
    bestForEn: 'Sacred patterns, compasses, geometric animals, symmetry sleeves',
    bestForZh: '神圣几何、指南针、几何动物与对称花臂',
    placementEn: 'Forearm, sternum, spine, shoulder · Small to large',
    placementZh: '小臂、胸骨、脊柱、肩部 · 小至大图',
    tags: ['Symmetry', 'Precision', 'Modern'],
    filters: ['delicate', 'bg', 'symbolic'],
  },
  {
    id: 'neo-traditional',
    en: 'Neo-Traditional',
    zh: '新传统',
    img: '/assets/styles/neo-traditional.webp',
    badges: ['Color'],
    descEn: 'Evolves traditional bold lines with richer jewel-tone palettes, Art Nouveau framing, and varied line weights.',
    descZh: '在传统粗线条基础上融入更丰富的宝石色调、新艺术边框与粗细变化。',
    bestForEn: 'Phoenixes, animals, portraits, ornate florals',
    bestForZh: '凤凰、动物肖像、华丽花卉与装饰画框',
    placementEn: 'Thigh, upper arm, back, calf · Medium to large',
    placementZh: '大腿、上臂、背部、小腿 · 中至大图',
    tags: ['Rich color', 'Illustrative', 'Bold'],
    filters: ['bold', 'color', 'floral'],
  },
  {
    id: 'micro-realism',
    en: 'Micro Realism',
    zh: '微写实',
    img: '/assets/styles/micro-realism.webp',
    badges: ['Small tattoos'],
    descEn: 'Miniature photographic detail executed with ultra-fine needles for compact statement pieces.',
    descZh: '用极细针法在方寸之间呈现照片级写实细节，精致耐看。',
    bestForEn: 'Pet portraits, fine art miniatures, tiny nature scenes',
    bestForZh: '宠物肖像、名画微缩与精致自然小景',
    placementEn: 'Inner forearm, wrist, ankle, upper arm · Small',
    placementZh: '小臂内侧、手腕、脚踝、上臂 · 小图',
    tags: ['Miniature', 'Ultra-fine', 'Realistic'],
    filters: ['small', 'delicate', 'realistic', 'bg'],
  },
  {
    id: 'watercolor',
    en: 'Watercolor',
    zh: '水彩',
    img: '/assets/styles/watercolor.webp',
    badges: ['Color'],
    descEn: 'Painterly washes, soft color bleeds, and brush-stroke splashes without rigid borders.',
    descZh: '如水彩画般灵动的晕染与笔触飞溅，色彩轻盈通透。',
    bestForEn: 'Abstract florals, birds, galaxies, expressive color accents',
    bestForZh: '写意花卉、飞鸟、星云与艺术色彩点缀',
    placementEn: 'Shoulder, rib, forearm, back · Medium',
    placementZh: '肩部、肋骨、小臂、背部 · 中图',
    tags: ['Painterly', 'Vibrant', 'Artistic'],
    filters: ['color', 'floral'],
  },
  {
    id: 'dotwork',
    en: 'Dotwork',
    zh: '点刺',
    img: '/assets/styles/dotwork.webp',
    badges: ['Delicate'],
    descEn: 'Stippled shading built dot by dot for soft atmospheric depth and intricate texture.',
    descZh: '逐点叠加形成的细腻颗粒雾面，质感独特且层次丰富。',
    bestForEn: 'Mandalas, astronomy, spiritual symbols, shaded florals',
    bestForZh: '曼陀罗、天文星象、灵性符号与点刺花卉',
    placementEn: 'Elbow, forearm, sternum, back · Small to large',
    placementZh: '手肘、小臂、胸骨、背部 · 小至大图',
    tags: ['Stippling', 'Textured', 'Black ink'],
    filters: ['delicate', 'bg', 'symbolic'],
  },
  {
    id: 'ornamental',
    en: 'Ornamental',
    zh: '装饰花纹',
    img: '/assets/styles/ornamental.webp',
    badges: ['Symbolic'],
    descEn: 'Jewelry-inspired filigree, chandeliers, and symmetrical motifs tailored to body contours.',
    descZh: '如珠宝蕾丝般华丽的对称花纹，贴合胸骨、肩背与手背曲线。',
    bestForEn: 'Sternum pieces, spine layouts, hand & shoulder adornment',
    bestForZh: '胸骨吊坠、脊柱延伸、手背与肩部装饰',
    placementEn: 'Sternum, spine, shoulder, hand · Medium to large',
    placementZh: '胸骨、脊柱、肩部、手背 · 中至大图',
    tags: ['Filigree', 'Symmetry', 'Elegant'],
    filters: ['delicate', 'bg', 'symbolic'],
  },
  {
    id: 'anime',
    en: 'Anime / Manga',
    zh: '动漫 / 漫画',
    img: '/assets/styles/anime.webp',
    badges: ['Trend-led'],
    descEn: 'Crisp manga panel linework, screentone shading, or vibrant cel-shaded character art.',
    descZh: '还原漫画分镜线条、网点阴影或鲜明赛璐璐上色的二次元风格。',
    bestForEn: 'Manga panels, iconic characters, mecha, spirits',
    bestForZh: '漫画分镜、经典角色、机甲与幻想生物',
    placementEn: 'Forearm, calf, upper arm, thigh · Medium',
    placementZh: '小臂、小腿、上臂、大腿 · 中图',
    tags: ['Manga', 'Dynamic', 'Expressive'],
    filters: ['trend', 'color', 'bg'],
  },
  {
    id: 'illustrative',
    en: 'Illustrative',
    zh: '插画',
    img: '/assets/styles/illustrative.webp',
    badges: ['Versatile'],
    descEn: 'Storybook etching, woodcut, and editorial ink drawing styles with expressive line character.',
    descZh: '融合版画雕刻、绘本线条与现代插画笔触，故事感极强。',
    bestForEn: 'Folklore creatures, surreal scenes, tarot & engraving motifs',
    bestForZh: '童话神兽、超现实场景、塔罗与版画风格',
    placementEn: 'Forearm, thigh, upper arm, back · Medium to large',
    placementZh: '小臂、大腿、上臂、背部 · 中至大图',
    tags: ['Editorial', 'Engraving', 'Storybook'],
    filters: ['bg', 'color', 'symbolic'],
  },
  {
    id: 'tribal',
    en: 'Tribal / Polynesian',
    zh: '图腾 / 波利尼西亚',
    img: '/assets/styles/tribal.webp',
    badges: ['Cultural'],
    descEn: 'Interlocking geometric motifs and bold black bands sculpted around shoulder and arm anatomy.',
    descZh: '环环相扣的图腾纹样与粗黑条带，极具力量感并贴合肩臂肌肉。',
    bestForEn: 'Shoulder armor, armbands, chest-to-arm cultural pieces',
    bestForZh: '肩甲、臂环与胸臂一体图腾',
    placementEn: 'Shoulder, upper arm, calf, chest · Medium to large',
    placementZh: '肩部、上臂、小腿、胸口 · 中至大图',
    tags: ['Heritage', 'Flow', 'Bold'],
    filters: ['bold', 'cultural', 'bg'],
  },
  {
    id: 'chicano',
    en: 'Chicano',
    zh: '奇卡诺',
    img: '/assets/styles/chicano.webp',
    badges: ['Cultural'],
    descEn: 'Fine black-and-grey realism combined with expressive script and heritage iconography.',
    descZh: '细腻黑灰写实与西海岸花体文字、文化象征的经典融合。',
    bestForEn: 'Portraits, roses, religious icons, lowrider & script sleeves',
    bestForZh: '肖像、玫瑰、宗教象征与花体整臂',
    placementEn: 'Sleeve, chest, back · Large',
    placementZh: '花臂、胸口、背部 · 大图',
    tags: ['Black & Grey', 'Heritage', 'Fine shading'],
    filters: ['cultural', 'realistic', 'bg'],
  },
  {
    id: 'mandala',
    en: 'Mandala',
    zh: '曼陀罗',
    img: '/assets/styles/mandala.webp',
    badges: ['Symbolic'],
    descEn: 'Radial meditative patterns blending fine geometry, petals, and balanced dotwork.',
    descZh: '向心对称的冥想几何与莲瓣点刺纹样，平衡静谧。',
    bestForEn: 'Elbow & knee centers, back focal pieces, lotus mandalas',
    bestForZh: '手肘/膝盖中心、背部主视觉与莲花曼陀罗',
    placementEn: 'Elbow, upper back, sternum, shoulder · Medium',
    placementZh: '手肘、上背、胸骨、肩部 · 中图',
    tags: ['Radial', 'Balance', 'Dotwork'],
    filters: ['symbolic', 'delicate', 'bg'],
  },
  {
    id: 'single-needle',
    en: 'Single Needle',
    zh: '单针极细',
    img: '/assets/styles/single-needle.webp',
    badges: ['Small tattoos'],
    descEn: 'Ultra-delicate one-needle precision for whisper-thin lines and airy micro details.',
    descZh: '单针精密走线，呈现发丝般轻盈的极细线条与微距细节。',
    bestForEn: 'Tiny florals, fine script, delicate celestial marks',
    bestForZh: '迷你花卉、极细文字与精致星月印记',
    placementEn: 'Wrist, ankle, inner arm, collarbone · Tiny to small',
    placementZh: '手腕、脚踝、手臂内侧、锁骨 · 迷你至小图',
    tags: ['Whisper-thin', 'Minimal', 'First tattoo'],
    filters: ['first', 'small', 'delicate', 'bg'],
  },
  {
    id: 'patch',
    en: 'Patch',
    zh: '刺绣贴布',
    img: '/assets/styles/patch-sticker.webp',
    badges: ['Trend-led'],
    descEn: 'Tactile embroidered-thread illusion with stitched borders and subtle 3D drop shadows.',
    descZh: '逼真的刺绣针脚纹理、锁边与立体投影，宛如缝在皮肤上的布贴。',
    bestForEn: 'Playful icons, pop culture badges, floral patches',
    bestForZh: '趣味徽章、流行文化符号与刺绣花卉',
    placementEn: 'Forearm, upper arm, calf · Small to medium',
    placementZh: '小臂、上臂、小腿 · 小至中图',
    tags: ['Embroidery', '3D illusion', 'Playful'],
    filters: ['trend', 'color'],
  },
  {
    id: 'cybersigilism',
    en: 'Cybersigilism',
    zh: '赛博印记',
    img: '/assets/styles/cybersigilism.webp',
    badges: ['Trend-led'],
    descEn: 'Razor-sharp neo-tribal organic webs and futuristic sigil geometry built for modern flow.',
    descZh: '锋利纤细的未来感有机线条与新部落印记，极具先锋潮流张力。',
    bestForEn: 'Abstract body-contouring flows, spine, shoulder & forearm wraps',
    bestForZh: '贴合身体轮廓的抽象线条、脊柱、肩部与小臂环绕',
    placementEn: 'Spine, upper back, forearm, collarbone · Medium to large',
    placementZh: '脊柱、上背、小臂、锁骨 · 中至大图',
    tags: ['Neo-tribal', 'Sharp', 'Avant-garde'],
    filters: ['trend', 'bg', 'symbolic'],
  },
];

const FILTER_PILLS = [
  { id: 'all', en: 'All styles', zh: '全部风格' },
  { id: 'first', en: 'First tattoo', zh: '首次纹身' },
  { id: 'small', en: 'Small tattoos', zh: '小图推荐' },
  { id: 'delicate', en: 'Delicate', zh: '精致细腻' },
  { id: 'bold', en: 'Bold', zh: '粗犷醒目' },
  { id: 'realistic', en: 'Realistic', zh: '写实立体' },
  { id: 'floral', en: 'Floral', zh: '花卉植物' },
  { id: 'text', en: 'Text', zh: '文字花体' },
  { id: 'bg', en: 'Black & Grey', zh: '黑灰单色' },
  { id: 'color', en: 'Color', zh: '彩色上色' },
  { id: 'symbolic', en: 'Symbolic', zh: '象征几何' },
  { id: 'cultural', en: 'Cultural', zh: '传统脉络' },
  { id: 'trend', en: 'Trend-led', zh: '潮流先锋' },
];

const COMPARISONS = [
  {
    titleEn: 'Fine Line vs. Minimalist',
    titleZh: '细线 vs 极简',
    descEn: 'Fine Line can hold rich botanical or micro detail with ultra-thin strokes, while Minimalist strips the subject down to its cleanest essential lines.',
    descZh: '细线风格可以用极细针法刻画丰富花卉或微距细节；极简则更强调极致精炼的轮廓与大面积留白。',
  },
  {
    titleEn: 'American Traditional vs. Neo-Traditional',
    titleZh: '美式传统 vs 新传统',
    descEn: 'American Traditional sticks to uniform bold outlines and classic primary colors; Neo-Traditional adds varied line weights, richer gradients, and Art Nouveau flair.',
    descZh: '美式传统坚持统一粗黑线与经典三原色；新传统在此基础上加入线条粗细变化与更丰富的宝石色调。',
  },
  {
    titleEn: 'Realism vs. Micro Realism',
    titleZh: '大面积写实 vs 微写实',
    descEn: 'Full Realism uses larger canvas areas for deep contrast and longevity; Micro Realism compresses lifelike detail into palm-sized or smaller placements.',
    descZh: '传统写实适合大面积展现强烈光影与长久稳定度；微写实将照片级细节浓缩在掌心以内的小图面积。',
  },
  {
    titleEn: 'Blackwork vs. Dotwork',
    titleZh: '重黑 vs 点刺',
    descEn: 'Blackwork relies on saturated solid black shapes and sharp contrast; Dotwork builds airy, velvety gradients one stippled dot at a time.',
    descZh: '重黑强调饱和纯黑块面与强烈黑白对比；点刺则通过细密点阵营造通透柔和的雾面过渡。',
  },
  {
    titleEn: 'Geometric vs. Ornamental',
    titleZh: '几何 vs 装饰花纹',
    descEn: 'Geometric emphasizes mathematical precision and straight or radial grids; Ornamental leans into jewelry-like curves, filigree, and body-contouring flow.',
    descZh: '几何偏向数学感的精准直线与网格结构；装饰花纹则如同珠宝蕾丝，更注重柔和曲线与贴合身体轮廓。',
  },
];

const STYLE_FAQS = [
  {
    qEn: 'How do I pick the best tattoo style for my first tattoo?',
    qZh: '第一次纹身该如何挑选风格？',
    aEn: 'Start with Fine Line, Minimalist, Floral, or Lettering if you want something subtle and easy to place, or American Traditional if you prefer bold lines that age effortlessly.',
    aZh: '如果想要精致低调且好驾驭，推荐细线、极简、花卉或文字；如果喜欢经久耐看的粗黑质感，美式传统是经典之选。',
  },
  {
    qEn: 'Which styles work best for small tattoos?',
    qZh: '哪些风格最适合小图纹身？',
    aEn: 'Minimalist, Single Needle, Fine Line, Micro Realism, and clean Lettering translate cleanly to wrist, ankle, and behind-the-ear sizing.',
    aZh: '极简、单针、细线、微写实和简约文字在手腕、脚踝和耳后等小尺寸区域表现最为清晰。',
  },
  {
    qEn: 'Can I mix two tattoo styles in one design?',
    qZh: '可以把两种纹身风格融合在一个图案里吗？',
    aEn: 'Yes — combinations like Fine Line + Geometric, Blackwork + Dotwork, or Realism + Watercolor are popular. Describe both in the AI Generator prompt to preview how they blend.',
    aZh: '完全可以，例如细线+几何、重黑+点刺、写实+水彩都非常热门。只需在首页 AI 生成器的描述中同时说明即可预览融合效果。',
  },
  {
    qEn: 'Does body placement affect which style I should choose?',
    qZh: '身体部位会影响风格选择吗？',
    aEn: 'Yes. High-movement areas like hands and ribs favor cleaner contrast and open spacing, while larger flat areas like the back, thigh, or upper arm support intricate Realism or Japanese work.',
    aZh: '会。手部和肋骨等活动频繁或皮肤较薄的部位更适合线条干净、留白充足的风格；背部、大腿和上臂等大面积平滑区域则最适合写实或日式大图。',
  },
  {
    qEn: 'How can I preview a style on my own body before booking?',
    qZh: '预约前如何提前在自己身上预览某种风格？',
    aEn: 'Click Generate on any style above to create a body preview on the homepage, then extract clean artwork and test it on your photo in Tattoo Try-On.',
    aZh: '点击任意风格卡片上的“立即生成”，在首页生成上身预览并提取清晰线稿，随后进入 3D 试戴上传自己的照片即可提前查看效果。',
  },
];

function TattooStylesPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = STYLES_23.filter((st) => {
    const matchFilter =
      activeFilter === 'all' || st.filters.includes(activeFilter);
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      st.en.toLowerCase().includes(q) ||
      st.zh.includes(q) ||
      st.descEn.toLowerCase().includes(q) ||
      st.bestForEn.toLowerCase().includes(q) ||
      st.placementEn.toLowerCase().includes(q) ||
      st.tags.some((tg) => tg.toLowerCase().includes(q));
    return matchFilter && matchQuery;
  });

  return (
    <InkStudioPageLayout>
      {/* 1. Centered Hero Header */}
      <section className="pt-10 pb-4 text-center sm:pt-14 sm:pb-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-medium text-muted-foreground">
            {t('Tattoo style decision hub', '纹身风格决策指南')}
          </div>
          <h1 className="mt-2.5 font-sans text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {t('Explore Tattoo Styles', '探索全部纹身风格')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t(
              'Find the tattoo style that fits your idea, placement, size, and long-term look.',
              '结合您的想法、身体部位、尺寸与长久耐看度，找到最适合您的纹身风格。'
            )}
          </p>
        </div>
      </section>

      {/* 2. Style Catalog (23 Editorial 2-Col Articles) */}
      <section
        id="style-catalog"
        className="scroll-mt-24 pt-8 pb-14 sm:pb-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-border pb-6">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t('All tattoo styles', '全部纹身风格')}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t(
                'Browse popular, technical, cultural, and trend-led tattoo styles in one continuous list. Use the filters when you want to narrow the decision.',
                '在一个连续列表中浏览热门、技法、传统与潮流纹身风格。需要缩小选择范围时可使用下方筛选标签。'
              )}
            </p>

            <div className="mt-6 border-t border-border pt-6">
              <div className="relative w-full max-w-[460px]">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t(
                    'Search style, motif, placement, or vibe...',
                    '搜索风格、元素、部位或氛围…'
                  )}
                  className="h-10 w-full rounded-lg border border-input bg-white pr-4 pl-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground"
                />
              </div>

              <div className="mt-5">
                <div className="mb-2.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {t('FILTER BY USE CASE', '按需求场景筛选')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTER_PILLS.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setActiveFilter(pill.id)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                        activeFilter === pill.id
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-white text-foreground hover:bg-muted'
                      )}
                    >
                      {isZh ? pill.zh : pill.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 23 Stacked Editorial 2-Col Articles */}
          <div className="divide-y divide-border">
            {filtered.map((st, idx) => (
              <article
                key={st.id}
                className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[minmax(210px,300px)_minmax(0,1fr)] md:items-start"
              >
                {/* Left 300x300 Square Preview Card */}
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white">
                  <img
                    src={st.img}
                    alt={st.en}
                    loading="lazy"
                    className="h-full w-full object-contain p-4"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {st.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-border bg-white/95 px-2.5 py-0.5 text-[10px] font-medium text-foreground shadow-2xs"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Editorial Content */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                          <span>{String(idx + 1).padStart(2, '0')}</span>
                          <span className="inline-block h-px w-5 bg-border" />
                          <span>{st.badges[0] || 'STYLE'}</span>
                        </div>
                        <h4 className="mt-1.5 font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                          {isZh ? `${st.en} · ${st.zh}` : st.en}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/?style=${st.id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-3.5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
                        >
                          <Sparkles className="size-3.5" />
                          <span>{t('Generate', '生成')}</span>
                        </Link>
                        <Link
                          href={`/tattoo-ideas?style=${st.id}`}
                          className="inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-white px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          <span>{t('View details', '查看详情')}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>

                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {isZh ? st.descZh : st.descEn}
                    </p>
                  </div>

                  {/* 3-Column Metadata Strip */}
                  <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-border bg-[#fafaf9] p-4 sm:grid-cols-3">
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t('BEST FOR', '最适合题材')}
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-foreground">
                        {isZh ? st.bestForZh : st.bestForEn}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t('WORKS WELL ON / SIZE FIT', '推荐部位与尺寸')}
                      </div>
                      <div className="mt-1 text-xs leading-relaxed text-foreground">
                        {isZh ? st.placementZh : st.placementEn}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        {t('TAGS', '风格标签')}
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {st.tags.map((tg) => (
                          <span
                            key={tg}
                            className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] font-medium text-foreground"
                          >
                            {tg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Compare Similar Tattoo Styles (5 Cards) */}
      <section className="border-y border-border bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('Compare similar tattoo styles', '对比相近的纹身风格')}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {COMPARISONS.map((c) => (
              <div
                key={c.titleEn}
                className="rounded-lg border border-border bg-white p-5 shadow-2xs"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {isZh ? c.titleZh : c.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {isZh ? c.descZh : c.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How to Choose the Right Tattoo Style (4 Numbered Steps) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t('How to choose the right tattoo style', '如何选择最适合自己的风格')}
            </h2>
            <Link
              href="/tattoo-fonts"
              className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline"
            >
              <span>
                {t(
                  'Compare tattoo fonts for names and lettering',
                  '对比名字与文字纹身字体'
                )}
              </span>
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '01',
                h: t('Match style to size', '按尺寸匹配风格'),
                p: t(
                  'Small areas suit Minimalist, Fine Line, and Single Needle; larger panels unlock Realism and Japanese storytelling.',
                  '小面积适合极简、细线与单针；大面积则能充分展现写实与日式叙事构图。'
                ),
              },
              {
                n: '02',
                h: t('Consider long-term aging', '考虑长期恢复效果'),
                p: t(
                  'Strong contrast and breathing room between lines keep designs crisp for decades.',
                  '清晰的黑白对比与充足留白，能让纹身十年后依然利落清晰。'
                ),
              },
              {
                n: '03',
                h: t('Preview on the body', '先看上身比例'),
                p: t(
                  'Generate 2–3 style variations on the same placement to see which line weight fits your frame.',
                  '在同一部位生成 2–3 种不同风格，直观对比哪种线条粗细更适合自己。'
                ),
              },
              {
                n: '04',
                h: t('Confirm with a specialist', '找对应风格的纹身师'),
                p: t(
                  'Bring your body preview and clean artwork to an artist whose portfolio specializes in that style.',
                  '带上您的上身预览与清晰线稿，预约擅长该细分风格的纹身师。'
                ),
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-xl border border-border bg-white p-5"
              >
                <div className="font-mono text-xs font-semibold text-muted-foreground">
                  {step.n}
                </div>
                <h3 className="mt-2.5 text-base font-semibold text-foreground">
                  {step.h}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Dark CTA Banner */}
      <section className="border-y border-border bg-foreground py-12 text-background sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-background sm:text-3xl">
              {t('Still not sure which style fits?', '还不确定哪种风格最适合你？')}
            </h2>
            <p className="mt-2 text-sm text-background/75 sm:text-base">
              {t(
                'Describe your idea and let Pick for me match the best tattoo style automatically.',
                '只需描述你的灵感，选择“智能匹配风格”即可自动推荐最契合的纹身风格。'
              )}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
          >
            <span>{t('Start from an idea', '从灵感开始生成')}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* 6. Tattoo Style Questions (5 FAQs) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 text-center font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('Tattoo style questions', '纹身风格常见问题')}
          </h2>

          <div className="divide-y divide-border rounded-2xl border border-border bg-white">
            {STYLE_FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.qEn}>
                  <h3 className="flex">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
                    >
                      <span>{isZh ? item.qZh : item.qEn}</span>
                      <ChevronDown
                        className={cn(
                          'size-4 shrink-0 text-muted-foreground transition-transform',
                          isOpen && 'rotate-180'
                        )}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                      {isZh ? item.aZh : item.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-styles')({
  loader: () => {
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? '23 种纹身风格决策指南与 AI 生成器 | InkStudio.ai'
        : 'Tattoo Styles Guide and AI Generator | InkStudio.ai',
      description: isZh
        ? '探索 23 种经典与现代纹身风格，对比适用题材、部位与尺寸。'
        : 'Find the tattoo style that fits your idea, placement, size, and long-term look.',
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: TattooStylesPage,
});
