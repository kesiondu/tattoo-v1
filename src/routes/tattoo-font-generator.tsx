import { useEffect, useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode2,
  Heart,
  Info,
  RotateCcw,
  Sparkles,
  Type,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';
import { FontSurfaceDemo } from '@/components/surface-tattoo-demo';

interface FontVariant {
  fontFamily: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: number;
  textTransform?: 'none' | 'uppercase';
  letterSpacing?: string;
}

interface FontStyleDef {
  id: string;
  name: string;
  zh: string;
  badgeEn: string;
  badgeZh: string;
  example: string;
  img: string;
  isPhoto: boolean;
  variants: FontVariant[];
  cats: ('names' | 'dates' | 'phrases' | 'bold' | 'decorative')[];
  feelEn: string;
  feelZh: string;
  chosenForEn: string;
  chosenForZh: string;
}

const FONT_STYLES: FontStyleDef[] = [
  {
    id: 'generic',
    name: 'Generic',
    zh: '通用',
    badgeEn: 'Clean',
    badgeZh: '简洁',
    example: 'Luna',
    img: '/tattoo-font-generator/styles/generic.png',
    isPhoto: false,
    variants: [
      { fontFamily: "'Nunito Variable', sans-serif", fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.02em' },
      { fontFamily: "'Outfit Variable', sans-serif", fontWeight: 500, letterSpacing: '0.04em' },
      { fontFamily: "'Inter Variable', sans-serif", fontWeight: 400, letterSpacing: '0.06em' },
    ],
    cats: ['dates', 'phrases'],
    feelEn: 'Neutral, clean, and flexible.',
    feelZh: '中性、干净、百搭灵活。',
    chosenForEn: 'First previews, names, dates, and simple words.',
    chosenForZh: '初次预览、名字、日期和简洁单词。',
  },
  {
    id: 'classic',
    name: 'Classic',
    zh: '经典',
    badgeEn: 'Clean',
    badgeZh: '简洁',
    example: 'Only time will tell',
    img: '/tattoo-font-generator/styles/classic.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 400 },
      { fontFamily: "'Source Serif 4 Variable', Georgia, serif", fontWeight: 500 },
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700 },
    ],
    cats: ['names', 'phrases'],
    feelEn: 'Timeless, balanced, and subtly formal.',
    feelZh: '经典耐看、比例均衡、略带正式感。',
    chosenForEn: 'Names, initials, short quotes, and minimalist keepsakes.',
    chosenForZh: '名字、缩写、简短格言与极简纪念文字。',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    zh: '极简',
    badgeEn: 'Clean',
    badgeZh: '简洁',
    example: 'let god',
    img: '/tattoo-font-generator/styles/minimalist.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Outfit Variable', sans-serif", fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase' },
      { fontFamily: "'Inter Variable', sans-serif", fontWeight: 300, letterSpacing: '0.12em' },
      { fontFamily: "'Outfit Variable', sans-serif", fontWeight: 400, letterSpacing: '0.08em' },
    ],
    cats: ['dates'],
    feelEn: 'Subtle, modern, fine-line, and quiet.',
    feelZh: '克制、现代、细线、安静。',
    chosenForEn: 'Dates, initials, coordinates, and tiny words.',
    chosenForZh: '日期、缩写、坐标和小巧单词。',
  },
  {
    id: 'cursive',
    name: 'Cursive',
    zh: '连笔手写',
    badgeEn: 'Handwritten',
    badgeZh: '手写',
    example: 'Always & Forever',
    img: '/tattoo-font-generator/styles/cursive.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: 'italic', fontWeight: 400 },
      { fontFamily: "'Source Serif 4 Variable', Georgia, serif", fontStyle: 'italic', fontWeight: 400 },
    ],
    cats: ['names'],
    feelEn: 'Soft, flowing, and deeply personal.',
    feelZh: '柔和自然、连贯流畅、富有私人情感。',
    chosenForEn: "Loved ones' names, lyrical words, and intimate dedications.",
    chosenForZh: '挚爱名字、抒情词汇与专属寄语。',
  },
  {
    id: 'handwritten',
    name: 'Handwritten',
    zh: '手写体',
    badgeEn: 'Script',
    badgeZh: '手写',
    example: 'te amando',
    img: '/tattoo-font-generator/styles/handwritten.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Nunito Variable', sans-serif", fontStyle: 'italic', fontWeight: 400 },
      { fontFamily: "'Nunito Variable', sans-serif", fontWeight: 500 },
    ],
    cats: ['names'],
    feelEn: 'Intimate, natural, and personal.',
    feelZh: '亲密、自然、真实手写感。',
    chosenForEn: 'Real handwriting, loved-one phrases, nicknames, and personal reminders.',
    chosenForZh: '亲笔字迹、挚爱短语、昵称与个人备忘。',
  },
  {
    id: 'calligraphy',
    name: 'Calligraphy',
    zh: '花体书法',
    badgeEn: 'Script',
    badgeZh: '手写',
    example: 'Grace & Grit',
    img: '/tattoo-font-generator/styles/calligraphy.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Source Serif 4 Variable', Georgia, serif", fontStyle: 'italic', fontWeight: 600 },
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: 'italic', fontWeight: 700 },
    ],
    cats: ['names', 'phrases', 'decorative'],
    feelEn: 'Refined, formal, and fluid with classic pen strokes.',
    feelZh: '优雅流畅、正式且带有经典钢笔书法韵味。',
    chosenForEn: 'Vows, names, and elegant short phrases.',
    chosenForZh: '誓言、人名与精致短句。',
  },
  {
    id: 'block',
    name: 'Block',
    zh: '方块',
    badgeEn: 'Bold',
    badgeZh: '粗体',
    example: 'FEARLESS',
    img: '/tattoo-font-generator/styles/block.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Inter Variable', sans-serif", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' },
      { fontFamily: "'Outfit Variable', sans-serif", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' },
    ],
    cats: ['bold'],
    feelEn: 'Heavy, direct, and unmistakably legible.',
    feelZh: '粗犷硬朗、直接醒目、辨识度极高。',
    chosenForEn: 'Acronyms, one-word statements, and high-impact lettering.',
    chosenForZh: '缩写字母、单词纹身与强态度宣言。',
  },
  {
    id: 'stencil',
    name: 'Stencil',
    zh: '镂空模板',
    badgeEn: 'Bold',
    badgeZh: '粗体',
    example: '1987',
    img: '/tattoo-font-generator/styles/stencil.png',
    isPhoto: false,
    variants: [
      { fontFamily: "ui-monospace, 'Cascadia Mono', monospace", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' },
      { fontFamily: "'Courier New', ui-monospace, monospace", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' },
    ],
    cats: ['dates'],
    feelEn: 'Industrial, cutout, and utility-like.',
    feelZh: '工业风、镂空切割、实用硬朗。',
    chosenForEn: 'Dates, labels, initials, and bold short text.',
    chosenForZh: '日期、标签、缩写与醒目短文字。',
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    zh: '打字机',
    badgeEn: 'Vintage',
    badgeZh: '复古',
    example: 'It is both a blessing and a curse to feel everything so very deeply',
    img: '/tattoo-font-generator/styles/typewriter.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Courier New', ui-monospace, monospace", fontWeight: 400 },
      { fontFamily: "ui-monospace, monospace", fontWeight: 500, letterSpacing: '0.04em' },
    ],
    cats: ['dates', 'phrases'],
    feelEn: 'Literary, archival, and understated.',
    feelZh: '文艺、档案感、低调内敛。',
    chosenForEn: 'Quotes, dates, coordinates, and short phrases.',
    chosenForZh: '引言、日期、坐标和短句。',
  },
  {
    id: 'chicano',
    name: 'Chicano',
    zh: '奇卡诺',
    badgeEn: 'Street',
    badgeZh: '街头',
    example: 'Loyalty Above All',
    img: '/tattoo-font-generator/styles/chicano.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Source Serif 4 Variable', Georgia, serif", fontStyle: 'italic', fontWeight: 700 },
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: 'italic', fontWeight: 700 },
    ],
    cats: ['names', 'decorative'],
    feelEn: 'Ornate, expressive, and rooted in classic black-and-grey ink culture.',
    feelZh: '华丽张扬、富有情感，源自经典黑灰纹身文化。',
    chosenForEn: 'Family names, memorial dates, and words of faith or loyalty.',
    chosenForZh: '家族词汇、纪念短语、信仰与忠诚词。',
  },
  {
    id: 'gangster',
    name: 'Gangster',
    zh: '街头重体',
    badgeEn: 'Street',
    badgeZh: '街头',
    example: 'Not everyone deserve you',
    img: '/tattoo-font-generator/styles/gangster.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 800, textTransform: 'uppercase' },
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 700 },
    ],
    cats: ['bold'],
    feelEn: 'Heavy, street-influenced, bold, and hard-edged.',
    feelZh: '厚重、街头风格、醒目且棱角分明。',
    chosenForEn: 'Nicknames, initials, and short statement words.',
    chosenForZh: '昵称、缩写和简短宣言词。',
  },
  {
    id: 'graffiti',
    name: 'Graffiti',
    zh: '涂鸦',
    badgeEn: 'Street',
    badgeZh: '街头',
    example: 'Rebel',
    img: '/tattoo-font-generator/styles/graffiti.png',
    isPhoto: false,
    variants: [
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 700, letterSpacing: '0.02em' },
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 800, fontStyle: 'italic' },
    ],
    cats: ['decorative'],
    feelEn: 'Energetic, urban, and expressive.',
    feelZh: '充满活力、都市感强、表现力十足。',
    chosenForEn: 'Nicknames, tags, single words, and street-art expression.',
    chosenForZh: '昵称、标签、单词与街头艺术表达。',
  },
  {
    id: 'roman',
    name: 'Roman',
    zh: '罗马体',
    badgeEn: 'Vintage',
    badgeZh: '复古',
    example: 'LOVE',
    img: '/tattoo-font-generator/styles/roman.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Libre Baskerville', 'Times New Roman', serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' },
    ],
    cats: ['dates'],
    feelEn: 'Classical, inscription-like, and formal.',
    feelZh: '古典、碑刻感、庄重正式。',
    chosenForEn: 'Roman numerals, dates, initials, and formal names.',
    chosenForZh: '罗马数字、日期、缩写与正式名字。',
  },
  {
    id: 'blackletter',
    name: 'Blackletter',
    zh: '黑书体',
    badgeEn: 'Gothic',
    badgeZh: '哥特',
    example: 'Born to be free',
    img: '/tattoo-font-generator/styles/blackletter.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700 },
    ],
    cats: ['decorative'],
    feelEn: 'Medieval, bold, dense, and dramatic.',
    feelZh: '中世纪感、厚重正式、极具戏剧张力。',
    chosenForEn: 'Initials, surnames, family mottos, and short single words.',
    chosenForZh: '字母缩写、姓氏、家族格言与简短单词。',
  },
  {
    id: 'old-english',
    name: 'Old English',
    zh: '古英语体',
    badgeEn: 'Gothic',
    badgeZh: '哥特',
    example: 'No Risk No Story',
    img: '/tattoo-font-generator/styles/oldEnglish.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Source Serif 4 Variable', Georgia, serif", fontWeight: 700 },
    ],
    cats: ['decorative'],
    feelEn: 'Ornate, ceremonial, and classic blackletter.',
    feelZh: '华丽、仪式感、经典黑体风格。',
    chosenForEn: 'Names, surnames, family words, and initials.',
    chosenForZh: '名字、姓氏、家族词汇和缩写。',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    zh: '美式传统',
    badgeEn: 'Bold',
    badgeZh: '粗体',
    example: 'MOM',
    img: '/tattoo-font-generator/styles/traditional.png',
    isPhoto: false,
    variants: [
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 800, textTransform: 'uppercase' },
    ],
    cats: ['bold'],
    feelEn: 'Old-school, tattoo-native, and sturdy.',
    feelZh: '复古传统、原生纹身感、结实耐看。',
    chosenForEn: 'Banners, names, classic words, and memorial text.',
    chosenForZh: '缎带标语、名字、经典词和纪念文字。',
  },
  {
    id: 'western',
    name: 'Western',
    zh: '西部衬线',
    badgeEn: 'Vintage',
    badgeZh: '复古',
    example: 'Ace',
    img: '/tattoo-font-generator/styles/western.png',
    isPhoto: false,
    variants: [
      { fontFamily: "'Libre Baskerville', Georgia, serif", fontWeight: 700, textTransform: 'uppercase' },
    ],
    cats: ['bold'],
    feelEn: 'Vintage, frontier, and saloon-display.',
    feelZh: '复古、西部荒野感、酒馆招牌风格。',
    chosenForEn: 'Nicknames, short names, one-word marks, and Americana themes.',
    chosenForZh: '昵称、短名字、单词印记和美式复古主题。',
  },
  {
    id: 'script',
    name: 'Script',
    zh: '优雅手写',
    badgeEn: 'Script',
    badgeZh: '手写',
    example: 'Angel',
    img: '/tattoo-font-generator/styles/script.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Source Serif 4 Variable', Georgia, serif", fontStyle: 'italic', fontWeight: 400 },
    ],
    cats: ['names', 'phrases', 'decorative'],
    feelEn: 'Polished, flowing, and romantic.',
    feelZh: '精致、流畅、富有浪漫气息。',
    chosenForEn: 'Names, short quotes, love words, and family words.',
    chosenForZh: '名字、短句、爱意词汇和家族文字。',
  },
  {
    id: 'gothic',
    name: 'Gothic',
    zh: '暗黑哥特',
    badgeEn: 'Gothic',
    badgeZh: '哥特',
    example: 'DIVINE',
    img: '/tattoo-font-generator/styles/gothic.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 800 },
    ],
    cats: ['bold', 'decorative'],
    feelEn: 'Dark, sharp, and dramatic.',
    feelZh: '暗黑、锐利、富有戏剧张力。',
    chosenForEn: 'Dramatic short words, music-inspired lettering, and gothic expression.',
    chosenForZh: '戏剧感短词、音乐灵感文字与哥特风格表达。',
  },
  {
    id: 'dark',
    name: 'Dark',
    zh: '暗黑重体',
    badgeEn: 'Bold',
    badgeZh: '粗体',
    example: 'I am flesh, bones. I am skin, soul.',
    img: '/tattoo-font-generator/styles/dark.webp',
    isPhoto: true,
    variants: [
      { fontFamily: "'Syne Variable', sans-serif", fontWeight: 700, letterSpacing: '0.08em' },
    ],
    cats: ['bold'],
    feelEn: 'Heavy, intense, black, and dramatic.',
    feelZh: '厚重、强烈、浓郁暗黑与戏剧感。',
    chosenForEn: 'Single statement words and metal, horror, or gothic moods.',
    chosenForZh: '强声明单词以及金属、暗黑或哥特氛围。',
  },
];

// Exact guide card order matching https://www.inkstudio.ai/tattoo-font-generator
const GUIDE_STYLE_ORDER = [
  'blackletter',
  'block',
  'calligraphy',
  'chicano',
  'classic',
  'cursive',
  'dark',
  'gangster',
  'gothic',
  'minimalist',
  'old-english',
  'roman',
  'script',
  'typewriter',
  'handwritten',
  'generic',
  'stencil',
  'traditional',
  'western',
  'graffiti',
];

const GUIDE_FONT_STYLES: FontStyleDef[] = GUIDE_STYLE_ORDER.map(
  (id) => FONT_STYLES.find((s) => s.id === id)!
);

// Natural skin anchor coordinates, angle & scale per placement so text ALWAYS lands squarely on skin
const PLACEMENTS = [
  { id: 'inner-wrist', en: 'Inner wrist', zh: '内手腕', x: 56, y: 52, defaultRotation: 52, defaultSize: 82 },
  { id: 'outer-wrist', en: 'Outer wrist', zh: '外手腕', x: 49, y: 56, defaultRotation: 0, defaultSize: 66 },
  { id: 'inner-forearm', en: 'Inner forearm', zh: '小臂内侧', x: 47, y: 47, defaultRotation: 65, defaultSize: 85 },
  { id: 'inner-upper-arm', en: 'Inner upper arm', zh: '上臂内侧', x: 68, y: 69, defaultRotation: 0, defaultSize: 86 },
  { id: 'upper-chest', en: 'Upper chest', zh: '上胸', x: 50, y: 40, defaultRotation: 0, defaultSize: 100 },
  { id: 'upper-back', en: 'Upper back', zh: '上背', x: 50, y: 34, defaultRotation: 0, defaultSize: 100 },
  { id: 'front-thigh', en: 'Front thigh', zh: '大腿前侧', x: 50, y: 42, defaultRotation: 0, defaultSize: 92 },
  { id: 'side-ankle', en: 'Side ankle', zh: '脚踝外侧', x: 71, y: 52, defaultRotation: 0, defaultSize: 56 },
];

const SKIN_TONES = [
  { id: 'fair', hex: '#EBD1C3', filter: 'brightness(1.12) saturate(0.85)', en: 'Natural fair', zh: '白皙' },
  { id: 'ivory', hex: '#E5C0A9', filter: 'brightness(1.06) saturate(0.95)', en: 'Warm ivory', zh: '暖象牙' },
  { id: 'medium-light', hex: '#D7BD96', filter: 'brightness(1.02)', en: 'Medium-light', zh: '自然浅棕' },
  { id: 'medium', hex: '#9F7D54', filter: 'none', en: 'Medium', zh: '自然小麦' },
  { id: 'medium-deep', hex: '#815D44', filter: 'brightness(0.84) contrast(1.06)', en: 'Medium-deep', zh: '深棕' },
  { id: 'deep', hex: '#3A312A', filter: 'brightness(0.62) contrast(1.12)', en: 'Deep', zh: '深古铜' },
];

const FAQS = [
  {
    qEn: 'Is the tattoo font generator really free?',
    qZh: '纹身字体生成器真的免费吗？',
    aEn: 'Yes. You can test all 20 tattoo fonts, preview them across body areas and skin tones, and download PNG or SVG references completely free with no login required.',
    aZh: '是的。您可以免费试戴全部 20 种纹身字体、切换不同肤色和身体部位预览，并免费导出 PNG 或 SVG 参考图，全程无需登录。',
  },
  {
    qEn: 'How many characters work best for a tattoo text preview?',
    qZh: '纹身文字预览最适合输入多少个字符？',
    aEn: 'Short inputs of 1 to 20 characters—such as a single word, name, date, or 2–4 word phrase—deliver the cleanest and most realistic preview.',
    aZh: '建议控制在 1 到 20 个字符以内（如单个单词、人名、纪念日期或 2–4 个词的短句），这样在皮肤和 3D 模型上的排版最清晰自然。',
  },
  {
    qEn: 'What is the difference between skin preview and 3D preview?',
    qZh: '皮肤预览和 3D 预览有什么区别？',
    aEn: 'The skin preview lets you quickly compare font styles against different skin tones and body zones, while the 3D preview wraps your chosen lettering over natural body contours to show realistic curvature.',
    aZh: '皮肤预览适合快速切换对比不同字体、肤色和部位的平面视觉；3D 预览则会将字稿贴合在立体的身体曲面上，帮您判断实际弧度下的观感。',
  },
  {
    qEn: 'Which tattoo font ages the best over time?',
    qZh: '哪种纹身字体恢复后最耐看？',
    aEn: 'Fonts with clear spacing and moderate stroke weight—like Classic, Block, Typewriter, and clean Traditional lettering—hold their sharpness best as ink settles over the years.',
    aZh: '笔画粗细适中、字母间距清晰的字体最抗晕色，例如经典体（Classic）、方块粗体（Block）和打字机字体（Typewriter），多年后依然利落。',
  },
  {
    qEn: 'Should I download PNG or SVG to show my tattoo artist?',
    qZh: '给纹身师看参考图，应该下载 PNG 还是 SVG？',
    aEn: 'Use PNG to quickly compare ideas on your phone or share on social media. Download SVG when you are ready for your appointment, as artists can scale vector outlines to any size without losing quality.',
    aZh: '日常发朋友圈或手机里对比选款，保存 PNG 即可；正式预约纹身时建议导出 SVG，无损矢量格式方便纹身师任意缩放并直接出转印稿。',
  },
  {
    qEn: 'Can I preview dates and Roman numerals?',
    qZh: '可以预览日期和罗马数字吗？',
    aEn: 'Yes. Simply type standard numbers (e.g., 1998, 05.12.2024) or Roman numerals (e.g., MCMXCVIII) into the text box to test them across Classic, Typewriter, and Blackletter styles.',
    aZh: '可以。直接在输入框输入数字日期（如 1998、2024.05.12）或罗马数字（如 MCMXCVIII），即可一键对比经典体、打字机和哥特黑书体效果。',
  },
  {
    qEn: 'Why do decorative script or gothic fonts need a larger tattoo area?',
    qZh: '为什么装饰性强的花体/哥特体需要更大的纹身面积？',
    aEn: 'Intricate flourishes and tight negative spaces tend to blur together as skin ages. Giving ornate styles more surface area preserves every loop and sharp edge.',
    aZh: '复杂花体和哥特体的笔画转折多、留白窄，如果纹得太小，几年后墨水自然微扩散容易糊成一团。留出足够面积才能保住精致细节。',
  },
  {
    qEn: 'Will a tattoo artist copy the generated font exactly?',
    qZh: '纹身师会完全照搬生成的字体吗？',
    aEn: 'Most artists use your exported font as a direct blueprint, then subtly tweak line thickness and letter spacing so the tattoo heals cleanly on your specific body part.',
    aZh: '大多数纹身师会以您导出的字稿为蓝本，再结合您的皮肤张力和肌肉走向，对笔画粗细与字距做微调，确保最终成品既还原又耐看。',
  },
  {
    qEn: 'Can I combine tattoo lettering with AI-generated tattoo artwork?',
    qZh: '可以把字体和 AI 生成的纹身图案结合起来吗？',
    aEn: 'Yes. You can generate your custom lettering here and pair it with our main AI Tattoo Generator to design surrounding elements like florals, banners, or fine-line frames.',
    aZh: '可以。您可以先在这里定好文字风格，再搭配我们的 AI 纹身生成器，为文字加上花卉、丝带、几何边框等定制图案元素。',
  },
];

function TattooFontGeneratorPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const { data: session } = useSession();

  const [text, setText] = useState('Stay True');
  const [selectedStyleId, setSelectedStyleId] = useState('generic');
  const [variantIdx, setVariantIdx] = useState(0);
  const [showAllLeftStyles, setShowAllLeftStyles] = useState(false);
  const [generated, setGenerated] = useState(false);

  const [placementId, setPlacementId] = useState('inner-wrist');
  const [skinId, setSkinId] = useState('medium');
  const [previewMode, setPreviewMode] = useState<'2d' | '3d' | 'font'>('2d');
  const [sizePct, setSizePct] = useState(PLACEMENTS[0].defaultSize);
  const [rotation, setRotation] = useState(PLACEMENTS[0].defaultRotation);
  const [opacity, setOpacity] = useState(86);
  const [posX, setPosX] = useState(PLACEMENTS[0].x);
  const [posY, setPosY] = useState(PLACEMENTS[0].y);
  const [isDragging, setIsDragging] = useState(false);
  const previewBoxRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const [saved, setSaved] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!downloadMenuOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (
        downloadMenuRef.current &&
        !downloadMenuRef.current.contains(e.target as Node)
      ) {
        setDownloadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [downloadMenuOpen]);

  const [guideCat, setGuideCat] = useState<string>('all');
  const [showAllGuide, setShowAllGuide] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeStyle =
    FONT_STYLES.find((s) => s.id === selectedStyleId) ?? FONT_STYLES[0];
  const activeVariant =
    activeStyle.variants[variantIdx % activeStyle.variants.length] ??
    activeStyle.variants[0];
  const activePlacement =
    PLACEMENTS.find((p) => p.id === placementId) ?? PLACEMENTS[0];
  const activeSkin =
    SKIN_TONES.find((s) => s.id === skinId) ?? SKIN_TONES[3];

  const leftStyles = showAllLeftStyles ? FONT_STYLES : FONT_STYLES.slice(0, 12);

  const guideCategories = [
    { id: 'all', label: t('All', '全部'), count: 20 },
    { id: 'names', label: t('Names', '名字'), count: 6 },
    { id: 'dates', label: t('Dates / initials', '日期 / 缩写'), count: 5 },
    { id: 'phrases', label: t('Short phrases', '短句'), count: 5 },
    { id: 'bold', label: t('Bold words', '醒目单词'), count: 6 },
    { id: 'decorative', label: t('Decorative styles', '装饰风格'), count: 7 },
  ];

  const filteredGuide =
    guideCat === 'all'
      ? GUIDE_FONT_STYLES
      : GUIDE_FONT_STYLES.filter((s) => s.cats.includes(guideCat as any));
  const visibleGuide = showAllGuide ? filteredGuide : filteredGuide.slice(0, 6);

  function selectPlacement(nextId: string) {
    setPlacementId(nextId);
    const next = PLACEMENTS.find((p) => p.id === nextId) ?? PLACEMENTS[0];
    setPosX(next.x);
    setPosY(next.y);
    setRotation(next.defaultRotation);
    setSizePct(next.defaultSize);
  }

  function resetAdjustments() {
    setPosX(activePlacement.x);
    setPosY(activePlacement.y);
    setSizePct(activePlacement.defaultSize);
    setRotation(activePlacement.defaultRotation);
    setOpacity(86);
  }

  function handleTattooPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (previewMode === 'font') return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStateRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: posX,
      startY: posY,
    };
    setIsDragging(true);
  }

  function handleTattooPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    const box = previewBoxRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !box) return;
    const rect = box.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const dxPct = ((e.clientX - drag.startClientX) / rect.width) * 100;
    const dyPct = ((e.clientY - drag.startClientY) / rect.height) * 100;
    setPosX(Math.min(92, Math.max(8, Number((drag.startX + dxPct).toFixed(1)))));
    setPosY(Math.min(92, Math.max(8, Number((drag.startY + dyPct).toFixed(1)))));
  }

  function handleTattooPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const drag = dragStateRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  }

  function getRenderedText() {
    const content = text.trim() || 'Stay True';
    return activeVariant.textTransform === 'uppercase'
      ? content.toUpperCase()
      : content;
  }

  function handleDownloadLetteringPng() {
    setDownloadMenuOpen(false);
    const rendered = getRenderedText();
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Transparent RGBA background (0, 0, 0, 0) matching InkStudio.ai lettering export
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#111111';
    ctx.font = `${activeVariant.fontStyle === 'italic' ? 'italic ' : ''}${activeVariant.fontWeight ?? 600} 84px ${activeVariant.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(rendered, canvas.width / 2, canvas.height / 2);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `inkstudio-${activeStyle.id}.png`;
    a.click();
    toast.success(
      t('Transparent lettering PNG downloaded', '已下载透明背景字稿 PNG')
    );
  }

  function handleDownloadLetteringSvg() {
    setDownloadMenuOpen(false);
    const rendered = getRenderedText()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const fontFamilyAttr = activeVariant.fontFamily.replace(/"/g, "'");
    const fontStyleAttr = activeVariant.fontStyle ?? 'normal';
    const fontWeightAttr = activeVariant.fontWeight ?? 600;
    const letterSpacingAttr = activeVariant.letterSpacing ?? '0.02em';

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 512" width="768" height="512" fill="none">
  <text
    x="50%"
    y="50%"
    dominant-baseline="central"
    text-anchor="middle"
    fill="#111111"
    font-family="${fontFamilyAttr}"
    font-style="${fontStyleAttr}"
    font-weight="${fontWeightAttr}"
    font-size="84"
    letter-spacing="${letterSpacingAttr}"
  >${rendered}</text>
</svg>`;

    const blob = new Blob([svgContent], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inkstudio-${activeStyle.id}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(t('Vector lettering SVG downloaded', '已下载矢量字稿 SVG'));
  }

  function handleDownloadSkinPng() {
    setDownloadMenuOpen(false);
    const rendered = getRenderedText();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || 768;
      const h = img.naturalHeight || 1152;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#e5e5e5';
      ctx.fillRect(0, 0, w, h);
      ctx.filter = activeSkin.filter === 'none' ? 'none' : activeSkin.filter;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.filter = 'none';

      ctx.save();
      ctx.translate((posX / 100) * w, (posY / 100) * h);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(sizePct / 100, sizePct / 100);
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = '#1c1917';
      const basePx = Math.round(w * 0.072);
      ctx.font = `${activeVariant.fontStyle === 'italic' ? 'italic ' : ''}${activeVariant.fontWeight ?? 600} ${basePx}px ${activeVariant.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(rendered, 0, 0);
      ctx.restore();

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `inkstudio-${activeStyle.id}-${placementId}.png`;
      a.click();
      toast.success(t('Skin preview PNG downloaded', '已下载皮肤预览 PNG'));
    };
    img.src = `/tattoo-font-generator/placements/${placementId}/medium.webp`;
  }

  return (
    <InkStudioPageLayout>
      {({ openAuth }) => (
        <>
          {/* 1. Hero Header */}
          <section className="pt-7 pb-4 text-center sm:pt-9 sm:pb-5 lg:pt-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t(
                  'Tattoo Font Generator: Realistic Skin & 3D Preview',
                  '在线纹身字体生成器：真实皮肤与 3D 试戴预览'
                )}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t(
                  'Type a name, date, initials, or short quote to compare 20 tattoo fonts across skin tones and body placements—then inspect how the lettering wraps on skin in 3D.',
                  '输入名字、纪念日、缩写或短句，一键对比 20 种热门纹身字体在不同肤色与身体部位的真实贴合效果，并通过 3D 查看皮肤自然起伏。'
                )}
              </p>
            </div>
          </section>

          {/* 2. Interactive 2-Column Workspace */}
          <section
            id="font-workspace"
            className="scroll-mt-24 pt-3 pb-8 sm:pt-4 sm:pb-10"
          >
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 sm:px-6 lg:grid-cols-[430px_minmax(0,1fr)] lg:px-8">
              {/* Left Sticky Card: Text & style */}
              <div className="flex flex-col justify-between rounded-xl border border-foreground/10 bg-white p-5 shadow-2xs ring-1 ring-foreground/5 lg:sticky lg:top-24 lg:min-h-[600px]">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-foreground">
                      <Type className="size-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {t('Text & style', '文字与风格')}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {t(
                          'Enter your text and choose a lettering style.',
                          '输入文字，并选择字稿风格。'
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Your text input */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <label className="font-medium text-foreground">
                        {t('Your text', '文字内容')}
                      </label>
                      <span className="text-muted-foreground">
                        {text.length}/30
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={30}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Stay True, Luna, Amor Fati"
                      className="h-11 w-full rounded-lg border border-input bg-white px-3.5 text-sm text-foreground transition-all outline-none placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-foreground/10"
                    />
                  </div>

                  {/* Lettering style 3-col grid — left-aligned with right checkmark */}
                  <div className="mt-5">
                    <div className="mb-2 text-xs font-medium text-foreground">
                      {t('Lettering style', '字体风格')}
                    </div>
                    <div className="grid max-h-[268px] grid-cols-3 gap-2 overflow-y-auto pr-0.5">
                      {leftStyles.map((st) => {
                        const active = selectedStyleId === st.id;
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => {
                              setSelectedStyleId(st.id);
                              setVariantIdx(0);
                            }}
                            className={cn(
                              'flex h-11 items-center justify-between rounded-lg border px-3 text-left text-xs font-medium transition-all',
                              active
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-white text-foreground hover:bg-muted/60'
                            )}
                          >
                            <span className="truncate">
                              {isZh ? st.zh : st.name}
                            </span>
                            {active && <Check className="size-3.5 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAllLeftStyles((v) => !v)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ChevronDown
                        className={cn(
                          'size-3.5 transition-transform',
                          showAllLeftStyles && 'rotate-180'
                        )}
                      />
                      <span>
                        {showAllLeftStyles
                          ? t('Show fewer styles', '收起部分字体')
                          : t('Show all 20 styles', '显示全部 20 种字体')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-5 border-t border-border pt-4">
                  <div className="mb-2.5 text-center text-[11px] text-muted-foreground">
                    {t('Free · No sign-up required', '免费 · 无需登录')}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGenerated(true);
                      setVariantIdx(0);
                    }}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-semibold text-background transition-all hover:bg-foreground/90"
                  >
                    <Type className="size-4" />
                    <span>
                      {t('Generate Font Preview', '生成字体预览')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Card: Skin Preview + Dynamic Right Pane */}
              <div className="rounded-xl border border-border bg-white p-4 shadow-2xs">
                {/* Toolbar: 8 Placement Thumbs + "肤色" label + 6 Skin Tone Swatches */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {PLACEMENTS.map((p) => {
                      const active = placementId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          title={isZh ? p.zh : p.en}
                          onClick={() => selectPlacement(p.id)}
                          className={cn(
                            'relative aspect-[2/3] w-8 overflow-hidden rounded-md border transition-all',
                            active
                              ? 'border-foreground ring-1 ring-foreground'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          )}
                        >
                          <img
                            src={`/tattoo-font-generator/placements/${p.id}/medium.webp`}
                            alt={isZh ? p.zh : p.en}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t('Skin tone', '肤色')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {SKIN_TONES.map((tone) => {
                        const active = skinId === tone.id;
                        return (
                          <button
                            key={tone.id}
                            type="button"
                            title={isZh ? tone.zh : tone.en}
                            onClick={() => setSkinId(tone.id)}
                            className={cn(
                              'size-4 rounded-full border border-black/15 transition-all',
                              active && 'ring-2 ring-foreground ring-offset-2'
                            )}
                            style={{ backgroundColor: tone.hex }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2-Column Body: Left Preview Canvas + Right Controls (when generated) or 3D Example (before generate) */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Left: Skin or Font-Only Preview */}
                  <div
                    ref={previewBoxRef}
                    className={cn(
                      'relative aspect-[2/3] overflow-hidden rounded-xl select-none',
                      previewMode === 'font'
                        ? 'border border-border bg-white bg-[linear-gradient(45deg,rgba(0,0,0,0.035)_25%,transparent_25%),linear-gradient(-45deg,rgba(0,0,0,0.035)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(0,0,0,0.035)_75%),linear-gradient(-45deg,transparent_75%,rgba(0,0,0,0.035)_75%)] bg-[position:0_0,0_12px,12px_-12px,-12px_0] bg-[length:24px_24px]'
                        : 'bg-[#e5e5e5]'
                    )}
                  >
                    {previewMode !== 'font' && (
                      <>
                        <img
                          src={`/tattoo-font-generator/placements/${placementId}/medium.webp`}
                          alt={activePlacement.en}
                          draggable={false}
                          className="pointer-events-none h-full w-full object-cover transition-all duration-300"
                          style={{ filter: activeSkin.filter }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_42%,transparent_0%,transparent_40%,rgba(0,0,0,0.08)_100%)]" />
                      </>
                    )}

                    {generated ? (
                      <>
                        {/* Alpha-masked skin overlay so tattoo ink stays strictly on the body silhouette */}
                        <div
                          className="absolute inset-0"
                          style={
                            previewMode !== 'font'
                              ? {
                                  maskImage: `url(/tattoo-font-generator/placements/${placementId}/medium.webp)`,
                                  WebkitMaskImage: `url(/tattoo-font-generator/placements/${placementId}/medium.webp)`,
                                  maskSize: 'cover',
                                  WebkitMaskSize: 'cover',
                                  maskPosition: 'center',
                                  WebkitMaskPosition: 'center',
                                  maskRepeat: 'no-repeat',
                                  WebkitMaskRepeat: 'no-repeat',
                                }
                              : undefined
                          }
                        >
                          <div
                            onPointerDown={handleTattooPointerDown}
                            onPointerMove={handleTattooPointerMove}
                            onPointerUp={handleTattooPointerUp}
                            onPointerCancel={handleTattooPointerUp}
                            className={cn(
                              'absolute rounded px-2 py-1 select-none',
                              previewMode !== 'font' &&
                                'touch-none cursor-grab active:cursor-grabbing',
                              previewMode !== 'font' &&
                                (isDragging
                                  ? 'ring-1 ring-foreground/45 ring-dashed bg-black/5'
                                  : 'hover:ring-1 hover:ring-foreground/30 hover:ring-dashed')
                            )}
                            style={{
                              left:
                                previewMode === 'font' ? '50%' : `${posX}%`,
                              top:
                                previewMode === 'font' ? '50%' : `${posY}%`,
                              transform:
                                previewMode === 'font'
                                  ? 'translate(-50%, -50%)'
                                  : `translate(-50%, -50%) perspective(480px) rotateY(${((posX - activePlacement.x) * 0.6).toFixed(1)}deg) rotateX(${((activePlacement.y - posY) * 0.25).toFixed(1)}deg) scale(${sizePct / 100}) rotateZ(${rotation}deg)`,
                              opacity:
                                previewMode === 'font' ? 1 : opacity / 100,
                            }}
                          >
                            <span
                              className={cn(
                                'block whitespace-nowrap text-center',
                                previewMode === 'font'
                                  ? 'text-4xl text-[#111111] sm:text-[42px]'
                                  : 'text-2xl text-[#1c1917] mix-blend-multiply sm:text-[26px]'
                              )}
                              style={{
                                fontFamily: activeVariant.fontFamily,
                                fontStyle: activeVariant.fontStyle ?? 'normal',
                                fontWeight: activeVariant.fontWeight ?? 500,
                                letterSpacing:
                                  activeVariant.letterSpacing ?? '0.02em',
                                textTransform:
                                  activeVariant.textTransform ?? 'none',
                              }}
                            >
                              {text.trim() || 'Stay True'}
                            </span>
                          </div>
                        </div>

                        {previewMode !== 'font' && (
                          <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium text-foreground/80 shadow-xs backdrop-blur-xs">
                            {t('Drag to move', '拖动文字可调整位置')}
                          </span>
                        )}
                      </>
                    ) : (
                      <div className="absolute right-3 bottom-3 left-3 flex justify-center">
                        <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-center text-xs font-medium text-foreground shadow-xs backdrop-blur-xs">
                          {t(
                            'Click Generate Font Preview to see your lettering on this skin tone and placement.',
                            '点击“生成字体预览”，即可在此肤色与身体部位上查看真实效果。'
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Before Generate -> 3D Surface JS Demo; After Generate -> Exact Preview Controls Panel */}
                  {!generated ? (
                    <FontSurfaceDemo
                      text={text}
                      label={t('3D Example', '3D 示例')}
                    />
                  ) : (
                    <div className="flex flex-col justify-between rounded-xl border border-border bg-white p-5">
                      <div>
                        {/* Preview mode header + 3 tabs */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            {t('Preview mode', '预览模式')}
                          </span>
                          <Info className="size-3.5 text-muted-foreground" />
                        </div>

                        <div className="relative mt-3 grid grid-cols-3 rounded-lg bg-muted p-1">
                          <button
                            type="button"
                            onClick={() => setPreviewMode('2d')}
                            className={cn(
                              'rounded-md py-1.5 text-xs font-medium transition-all',
                              previewMode === '2d'
                                ? 'bg-white text-foreground shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {t('2D Skin', '2D 皮肤')}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (!session?.user) {
                                openAuth();
                                return;
                              }
                              setPreviewMode('3d');
                              toast.info(
                                t(
                                  '3D Surface preview active',
                                  '已开启 3D 曲面贴合预览'
                                )
                              );
                            }}
                            className={cn(
                              'relative rounded-md py-1.5 text-xs font-medium transition-all',
                              previewMode === '3d'
                                ? 'bg-white text-foreground shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            <span className="absolute -top-2.5 right-1 inline-flex items-center gap-0.5 rounded bg-neutral-200 px-1.5 py-0.5 text-[9px] leading-none font-semibold text-neutral-800">
                              <Sparkles className="size-2" />
                              Pro
                            </span>
                            {t('3D Surface', '3D 曲面')}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewMode('font')}
                            className={cn(
                              'rounded-md py-1.5 text-xs font-medium transition-all',
                              previewMode === 'font'
                                ? 'bg-white text-foreground shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {t('Font only', '单字体')}
                          </button>
                        </div>

                        {/* Previous / Next variant switcher */}
                        <div className="mt-3 grid grid-cols-2 rounded-lg bg-muted/50 p-1">
                          <button
                            type="button"
                            onClick={() =>
                              setVariantIdx(
                                (i) =>
                                  (i - 1 + activeStyle.variants.length) %
                                  activeStyle.variants.length
                              )
                            }
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-md text-xs font-medium text-foreground transition-colors hover:bg-white"
                          >
                            <ChevronLeft className="size-3.5" />
                            <span>{t('Previous', '上一个')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setVariantIdx(
                                (i) => (i + 1) % activeStyle.variants.length
                              )
                            }
                            className="inline-flex h-8 items-center justify-center gap-1 rounded-md text-xs font-medium text-foreground transition-colors hover:bg-white"
                          >
                            <span>{t('Next', '下一个')}</span>
                            <ChevronRight className="size-3.5" />
                          </button>
                        </div>

                        {/* Adjust lettering sliders */}
                        <div className="mt-5 border-t border-border pt-4">
                          <div className="mb-3 text-xs font-semibold text-foreground">
                            {t('Adjust lettering', '调整字稿')}
                          </div>

                          <div className="space-y-3.5 text-xs">
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-foreground">
                                  {t('Size', '大小')}
                                </span>
                                <span className="text-muted-foreground">
                                  {sizePct}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min={60}
                                max={160}
                                value={sizePct}
                                onChange={(e) =>
                                  setSizePct(Number(e.target.value))
                                }
                                className="h-1.5 w-full cursor-pointer accent-foreground"
                              />
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-foreground">
                                  {t('Rotation', '旋转')}
                                </span>
                                <span className="text-muted-foreground">
                                  {rotation}°
                                </span>
                              </div>
                              <input
                                type="range"
                                min={-45}
                                max={45}
                                value={rotation}
                                onChange={(e) =>
                                  setRotation(Number(e.target.value))
                                }
                                className="h-1.5 w-full cursor-pointer accent-foreground"
                              />
                            </div>

                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-foreground">
                                  {t('Opacity', '透明度')}
                                </span>
                                <span className="text-muted-foreground">
                                  {opacity}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min={30}
                                max={100}
                                value={opacity}
                                onChange={(e) =>
                                  setOpacity(Number(e.target.value))
                                }
                                className="h-1.5 w-full cursor-pointer accent-foreground"
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={resetAdjustments}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                            >
                              <RotateCcw className="size-3" />
                              <span>{t('Reset adjustments', '重置调整')}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Actions: Try on your own body + Download + Save */}
                      <div className="mt-5 border-t border-border pt-4">
                        <div className="text-xs font-semibold text-foreground">
                          {t('Try on your own body', '在你自己的身体上试戴')}
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {t(
                            'Upload your photo in Tattoo Try-On for a personalized skin preview.',
                            '前往纹身试戴上传你的照片，查看专属于你的皮肤预览效果。'
                          )}
                        </p>

                        <Link
                          href="/tattoo-try-on"
                          className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-foreground text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
                        >
                          <Sparkles className="size-3.5" />
                          <span>{t('Try on my body', '在我的身体上试戴')}</span>
                        </Link>

                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
                          <div ref={downloadMenuRef} className="relative">
                            <button
                              type="button"
                              aria-haspopup="menu"
                              aria-expanded={downloadMenuOpen}
                              onClick={() => setDownloadMenuOpen((v) => !v)}
                              className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-muted/60 px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                            >
                              <Download className="size-3.5 shrink-0" />
                              <span className="truncate">
                                {t('Download', '下载')}
                              </span>
                            </button>

                            {downloadMenuOpen && (
                              <div
                                role="menu"
                                className="absolute bottom-full left-0 z-30 mb-2 flex w-52 flex-col gap-1 rounded-lg border border-border bg-white p-1.5 shadow-md ring-1 ring-foreground/10"
                              >
                                {previewMode !== 'font' && (
                                  <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleDownloadSkinPng}
                                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                  >
                                    <Download className="size-3.5 shrink-0 text-muted-foreground" />
                                    <span>
                                      {t(
                                        'Download skin preview (PNG)',
                                        '下载皮肤预览 (PNG)'
                                      )}
                                    </span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={handleDownloadLetteringPng}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                  <Download className="size-3.5 shrink-0 text-muted-foreground" />
                                  <span>
                                    {t(
                                      'Download lettering (PNG)',
                                      '下载字稿 (PNG)'
                                    )}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  role="menuitem"
                                  onClick={handleDownloadLetteringSvg}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                >
                                  <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" />
                                  <span>
                                    {t(
                                      'Download lettering (SVG)',
                                      '下载字稿 (SVG)'
                                    )}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!session?.user) {
                                openAuth();
                                return;
                              }
                              setSaved((v) => !v);
                              toast.success(
                                saved
                                  ? t('Removed from favorites', '已取消收藏')
                                  : t('Saved to your favorites', '已收藏此字体')
                              );
                            }}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-muted/60 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            <Heart
                              className={cn(
                                'size-3.5',
                                saved && 'fill-foreground'
                              )}
                            />
                            <span>{t('Save this font', '收藏此字体')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Tattoo Font Generator Guide */}
          <section className="border-y border-border bg-muted/20 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="lg:col-span-6">
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {t('Tattoo Font Generator guide', '纹身字体指南')}
                  </div>
                  <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {t(
                      'Find the Best Font Style for Your Tattoo Lettering',
                      '为您的纹身文字挑选最合适的字体风格'
                    )}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {t(
                      'Every typeface ages differently on skin. Filter by text type to choose a style that stays crisp and readable.',
                      '不同字体在皮肤上的线条走势与后期留色各不相同，按文字用途筛选最清晰耐看的方案。'
                    )}
                  </p>
                  <Link
                    href="/tattoo-fonts"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:underline"
                  >
                    <span>
                      {t('Compare all tattoo font styles', '对比全部纹身字体风格')}
                    </span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-white p-5 lg:col-span-6">
                  <div className="text-xs font-semibold text-foreground">
                    {t('Start with your tattoo text', '从您的文字类型开始')}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {[
                      {
                        t: t('Names', '名字'),
                        d: t('Cursive, Script, Fine', '连笔、手写、细线'),
                        cat: 'names',
                      },
                      {
                        t: t('Dates & initials', '日期与缩写'),
                        d: t('Roman, Typewriter', '罗马、打字机'),
                        cat: 'dates',
                      },
                      {
                        t: t('Short quotes', '短句'),
                        d: t('Classic, Handwritten', '经典、手写'),
                        cat: 'phrases',
                      },
                      {
                        t: t('Bold words', '醒目单词'),
                        d: t('Block, Blackletter', '粗体、哥特黑体'),
                        cat: 'bold',
                      },
                    ].map((box) => (
                      <button
                        key={box.cat}
                        type="button"
                        onClick={() => setGuideCat(box.cat)}
                        className="rounded-lg border border-border bg-[#fafaf9] p-3 text-left transition-colors hover:border-foreground/40"
                      >
                        <div className="text-xs font-semibold text-foreground">
                          {box.t}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground">
                          {box.d}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {guideCategories.map((c) => {
                  const active = guideCat === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setGuideCat(c.id);
                        setShowAllGuide(false);
                      }}
                      className={cn(
                        'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors',
                        active
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                      )}
                    >
                      <span>{c.label}</span>
                      <span className="opacity-70">{c.count}</span>
                    </button>
                  );
                })}
              </div>

              {/* 3-Column Style Example Grid */}
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleGuide.map((st) => (
                  <article
                    key={st.id}
                    className="flex overflow-hidden rounded-lg border bg-background transition-colors hover:border-foreground/25"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div
                        className={cn(
                          'relative aspect-square overflow-hidden border-b bg-white',
                          st.isPhoto ? 'p-0' : 'p-4'
                        )}
                      >
                        <span className="pointer-events-none absolute top-3 left-3 z-10 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-neutral-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-neutral-800 shadow-sm backdrop-blur">
                          {isZh ? `示例：${st.example}` : `Example: ${st.example}`}
                        </span>
                        <img
                          src={st.img}
                          alt={isZh ? st.zh : st.name}
                          loading="lazy"
                          className={cn(
                            'size-full',
                            st.isPhoto ? 'object-cover' : 'object-contain'
                          )}
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <h3 className="min-w-0 truncate font-semibold text-foreground">
                            {isZh ? st.zh : st.name}
                          </h3>
                          <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                            <span className="rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                              {isZh ? st.badgeZh : st.badgeEn}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 border-t pt-4 text-sm leading-relaxed">
                          <div>
                            <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                              {t('Vibe', '风格感觉')}
                            </div>
                            <p className="mt-1 text-foreground">
                              {isZh ? st.feelZh : st.feelEn}
                            </p>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                              {t('Best for', '常用于')}
                            </div>
                            <p className="mt-1 text-foreground">
                              {isZh ? st.chosenForZh : st.chosenForEn}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredGuide.length > 6 && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllGuide((v) => !v)}
                    className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border border-border bg-white px-5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <span>
                      {showAllGuide
                        ? t('Show fewer styles', '收起部分风格')
                        : t(
                            `Show all ${filteredGuide.length} styles`,
                            `显示全部 ${filteredGuide.length} 种风格`
                          )}
                    </span>
                    <ChevronDown
                      className={cn(
                        'size-3.5 transition-transform duration-150',
                        showAllGuide && 'rotate-180'
                      )}
                    />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* 4. Tips Section */}
          <section className="py-12 sm:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-8">
              <div>
                <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {t('Tattoo lettering tips', '纹身文字建议')}
                </div>
                <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {t(
                    'How to Choose Tattoo Lettering That Stays Sharp',
                    '如何挑选多年后依然清晰的纹身文字？'
                  )}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-6">
                  <h3 className="text-base font-semibold text-foreground">
                    {t("Do's (What Works Best)", '推荐做法')}
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      •{' '}
                      {t(
                        'Stick to concise names, milestone years, coordinates, or 1–4 word mottos.',
                        '优先选择简短的英文名、纪念年份、经纬度坐标或 1–4 个词的座右铭。'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        "Leave breathing room between letters so natural ink spread won't blur the text over time.",
                        '适当拉大字母间距，防止纹身恢复后因墨水轻微晕染导致字迹粘连。'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Align the text flow with the natural lines of your forearm, collarbone, or ribs.',
                        '顺着小臂、锁骨或肋骨的肌肉线条排布文字，视觉上更自然流畅。'
                      )}
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-white p-6">
                  <h3 className="text-base font-semibold text-foreground">
                    {t("Don'ts (What to Avoid)", '避坑提醒')}
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      •{' '}
                      {t(
                        'Avoid cramming intricate Gothic or Chicano script onto tiny areas like fingers or inner wrists.',
                        '避免在手指、耳后、内手腕等极小面积使用笔画密集的哥特体或奇卡诺花体。'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        "Don't force long paragraphs into a narrow patch of skin.",
                        '不要把一整段长句子硬塞进狭小的皮肤区域。'
                      )}
                    </li>
                    <li>
                      •{' '}
                      {t(
                        'Never commit to ultra-fine lines without checking needle gauge and ink retention with your artist.',
                        '选极细线条前，先和纹身师确认最小针号与该部位的后期留色率。'
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 5. After You Download */}
          <section className="border-y border-border bg-muted/20 py-12 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    {t('After you download', '导出参考图之后')}
                  </div>
                  <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {t(
                      'Bring Clean Font References to Your Tattoo Artist',
                      '导出高清字稿，直接带给纹身师参考'
                    )}
                  </h2>
                </div>

                <div className="rounded-xl border border-border bg-white p-5 lg:col-span-5">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('Double-Check Before Stenciling', '转印前最后核对')}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {t(
                      'Once the stencil is on your skin, check spelling, Roman numerals, accents, and orientation in a mirror.',
                      '贴上转印纸后，务必对着镜子逐字检查拼写、罗马数字、重音符号及正反方向。'
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    h: t('Save PNGs for Quick Comparison', '下载 PNG 快速比选'),
                    p: t(
                      'Download 2–3 favorite font options to your phone so you can compare placements before your session.',
                      '把心仪的 2–3 款字体存到手机里，预约前随时对比不同部位的视觉效果。'
                    ),
                  },
                  {
                    h: t('Export SVG for Crisp Scaling', '导出 SVG 无损缩放'),
                    p: t(
                      'Share a lossless vector file with your artist so they can resize and print an exact stencil.',
                      '提供无损矢量轮廓给纹身师，方便按实际尺寸精准打印转印稿。'
                    ),
                  },
                  {
                    h: t('Let Your Artist Refine the Details', '听取纹身师微调建议'),
                    p: t(
                      'Ask your artist to adjust stroke weight and kerning for your specific skin type and placement.',
                      '结合您的肤质与部位，让纹身师适当调整笔画粗细与字距，确保长久耐看。'
                    ),
                  },
                ].map((card) => (
                  <div
                    key={card.h}
                    className="rounded-xl border border-border bg-white p-5"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      {card.h}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {card.p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. FAQ (9 Items) */}
          <section className="border-t border-border py-12 sm:py-16">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <h2 className="mb-8 text-center font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t('Tattoo Font Generator FAQ', '纹身字体生成器常见问题')}
              </h2>

              <div className="divide-y divide-border rounded-2xl border border-border bg-white">
                {FAQS.map((item, idx) => {
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
        </>
      )}
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-font-generator')({
  loader: () => {
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? '免费在线纹身字体生成器：皮肤与 3D 效果预览 | TattooGenerator.online'
        : 'Free Tattoo Font Generator: Skin & 3D Preview | TattooGenerator.online',
      description: isZh
        ? '在线生成 20 种热门纹身字体，支持手腕、小臂、锁骨等身体部位与多肤色实时预览，免费导出 PNG/SVG 高清转印字稿，轻松打造专属名字与短句纹身。'
        : 'Generate 20+ tattoo font styles online. Preview names, dates, and quotes on wrists, forearms, and multiple skin tones in 3D, then export free PNG or SVG stencils.',
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
  component: TattooFontGeneratorPage,
});
