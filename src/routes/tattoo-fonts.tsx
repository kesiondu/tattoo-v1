import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

interface FontGuideEntry {
  id: string;
  name: string;
  zh: string;
  badge: string;
  img: string;
  feelEn: string;
  feelZh: string;
  chosenEn: string;
  chosenZh: string;
  readabilityEn: string;
  readabilityZh: string;
  bestWhenEn: string;
  bestWhenZh: string;
  watchOutEn: string;
  watchOutZh: string;
  filters: string[];
}

const ALL_20_FONTS: FontGuideEntry[] = [
  {
    id: 'classic',
    name: 'Classic',
    zh: '经典衬线',
    badge: 'Clean',
    img: '/tattoo-font-generator/styles/classic.webp',
    feelEn: 'Timeless, balanced, understated',
    feelZh: '经典、均衡、耐看',
    chosenEn: 'Names, short quotes, literary words',
    chosenZh: '名字、短句、文学单词',
    readabilityEn: 'High — open letter counters stay sharp over time',
    readabilityZh: '高 — 字母留白充足，恢复后长期清晰',
    bestWhenEn: 'You want clean typography that never feels dated.',
    bestWhenZh: '想要永不过时的干净文字质感。',
    watchOutEn: 'Avoid microscopic serifs under 6mm letter height.',
    watchOutZh: '避免单字高度小于 6mm，防止细小衬线粘连。',
    filters: ['names', 'phrases', 'single', 'small'],
  },
  {
    id: 'script',
    name: 'Script',
    zh: '优雅花体',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/script.webp',
    feelEn: 'Flowing, personal, graceful',
    feelZh: '流畅、柔和、个人化',
    chosenEn: 'First names, personal mottos, rib & collarbone lines',
    chosenZh: '人名、座右铭、肋骨与锁骨短句',
    readabilityEn: 'Medium-High when given generous spacing',
    readabilityZh: '中高 — 只要字距舒展就非常清晰',
    bestWhenEn: 'You want warm, expressive movement along body curves.',
    bestWhenZh: '希望文字顺应身体曲线柔和流动。',
    watchOutEn: 'Tight loops can blur together if scaled too small.',
    watchOutZh: '缩小过度会导致连笔圆环糊在一起。',
    filters: ['names', 'phrases'],
  },
  {
    id: 'blackletter',
    name: 'Blackletter',
    zh: '哥特黑体',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/blackletter.webp',
    feelEn: 'Dramatic, medieval, heavy black ink',
    feelZh: '戏剧感、中世纪、厚重黑墨',
    chosenEn: 'Surnames, chest banners, single bold words',
    chosenZh: '姓氏、胸口横幅、醒目单词',
    readabilityEn: 'Medium — strongest at medium-to-large sizes',
    readabilityZh: '中等 — 中大尺寸下最具辨识度与张力',
    bestWhenEn: 'You want unmistakable graphic weight and attitude.',
    bestWhenZh: '追求强烈的黑墨量感与视觉冲击。',
    watchOutEn: 'Dense vertical bars lose breathing room on tiny wrists.',
    watchOutZh: '垂直笔画密集，不适合极小面积手腕纹身。',
    filters: ['initials', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    zh: '打字机',
    badge: 'Vintage',
    img: '/tattoo-font-generator/styles/typewriter.webp',
    feelEn: 'Nostalgic, editorial, intimate',
    feelZh: '复古、文艺、克制',
    chosenEn: 'Dates, coordinates, short poetic lines',
    chosenZh: '纪念日期、坐标、短诗',
    readabilityEn: 'High — monospaced rhythm prevents crowding',
    readabilityZh: '高 — 等宽字距天然避免拥挤',
    bestWhenEn: 'You want a diary-like, literary aesthetic.',
    bestWhenZh: '偏爱书页笔记般的文艺克制感。',
    watchOutEn: 'Keep lines straight with your artist’s stencil alignment.',
    watchOutZh: '转印时注意与肢体自然垂落时的水平对齐。',
    filters: ['dates', 'phrases', 'small'],
  },
  {
    id: 'chicano',
    name: 'Chicano',
    zh: '奇卡诺花体',
    badge: 'Street',
    img: '/tattoo-font-generator/styles/chicano.webp',
    feelEn: 'Sharp, ornate, West Coast heritage',
    feelZh: '锐利、华丽、西海岸街头脉络',
    chosenEn: 'Family names, forearm statements, heritage pieces',
    chosenZh: '家族姓氏、小臂宣言、文化传承题材',
    readabilityEn: 'Medium — intricate tails need generous width',
    readabilityZh: '中等 — 华丽尾饰需要充足横向空间',
    bestWhenEn: 'You want expressive street script with strong presence.',
    bestWhenZh: '想要极富个性的高存在感街头花体。',
    watchOutEn: 'Always test at true forearm or chest width.',
    watchOutZh: '建议按真实小臂或胸口宽度测试，切忌过度压缩。',
    filters: ['names', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'block',
    name: 'Block',
    zh: '粗体方块',
    badge: 'Bold',
    img: '/tattoo-font-generator/styles/block.webp',
    feelEn: 'Solid, architectural, unmistakable',
    feelZh: '硬朗、稳固、一目了然',
    chosenEn: 'Bold words, initials, dates, sports numbers',
    chosenZh: '醒目单词、首字母、日期与数字',
    readabilityEn: 'Very High — among the best aging lettering styles',
    readabilityZh: '极高 — 最经久耐看的纹身字体之一',
    bestWhenEn: 'Legibility and crisp edges decades later matter most.',
    bestWhenZh: '最看重十年后依旧锐利易读。',
    watchOutEn: 'Balance letter tracking so thick strokes stay separated.',
    watchOutZh: '保持适当字距，避免粗笔画之间显得拥挤。',
    filters: ['dates', 'initials', 'single', 'bold'],
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    zh: '极简细线',
    badge: 'Clean',
    img: '/tattoo-font-generator/styles/minimalist.webp',
    feelEn: 'Airy, modern, feather-light',
    feelZh: '轻盈、现代、极简克制',
    chosenEn: 'Small wrist words, initials, quiet reminders',
    chosenZh: '手腕小词、首字母、精致印记',
    readabilityEn: 'High at small-to-medium scale with clean kerning',
    readabilityZh: '高 — 中小尺寸下干净利落',
    bestWhenEn: 'You want subtle everyday ink for a first tattoo.',
    bestWhenZh: '首次纹身想要低调百搭的日常文字。',
    watchOutEn: 'Avoid hairline strokes that fade unevenly on friction zones.',
    watchOutZh: '手掌或指侧等高摩擦部位慎用过细线条。',
    filters: ['names', 'dates', 'initials', 'small'],
  },
  {
    id: 'cursive',
    name: 'Cursive',
    zh: '连笔斜体',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/cursive.webp',
    feelEn: 'Fluid, romantic, continuous',
    feelZh: '流畅、浪漫、连贯自然',
    chosenEn: 'Loved ones’ names, brief affirmations',
    chosenZh: '挚爱姓名、简短寄语',
    readabilityEn: 'Medium-High with open loops',
    readabilityZh: '中高 — 圆环开阔时清晰优雅',
    bestWhenEn: 'You prefer connected cursive without heavy flourishes.',
    bestWhenZh: '喜欢流畅连笔但不希望装饰过于繁复。',
    watchOutEn: 'Keep multi-word quotes to one or two short lines.',
    watchOutZh: '短句尽量控制在一至两行以内。',
    filters: ['names', 'phrases'],
  },
  {
    id: 'handwritten',
    name: 'Handwritten',
    zh: '手写体',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/handwritten.webp',
    feelEn: 'Warm, human, authentic',
    feelZh: '温暖、真实、亲切手写',
    chosenEn: 'Personal notes, tribute signatures, short phrases',
    chosenZh: '纪念笔记、手写签名与短句',
    readabilityEn: 'High — natural spacing feels effortless',
    readabilityZh: '高 — 自然手写间距轻松易读',
    bestWhenEn: 'You want the tattoo to feel like a real note on skin.',
    bestWhenZh: '希望纹身像留在皮肤上的真实手写便签。',
    watchOutEn: 'Ask your artist to slightly thicken hairline upstrokes.',
    watchOutZh: '可请纹身师适度加粗过细的起笔线条。',
    filters: ['names', 'phrases', 'small'],
  },
  {
    id: 'calligraphy',
    name: 'Calligraphy',
    zh: '书法花体',
    badge: 'Script',
    img: '/tattoo-font-generator/styles/calligraphy.webp',
    feelEn: 'Refined, ceremonial, high contrast',
    feelZh: '精致、仪式感、粗细对比',
    chosenEn: 'Names, single words, vertical spine or rib lines',
    chosenZh: '名字、单词、脊柱或肋骨竖排',
    readabilityEn: 'Medium — flourishes shine at medium size',
    readabilityZh: '中等 — 中等以上尺寸最显精致',
    bestWhenEn: 'You want thick-and-thin dip-pen elegance.',
    bestWhenZh: '偏爱蘸水笔般的粗细变化与优雅笔锋。',
    watchOutEn: 'Give swashes room away from joints and creases.',
    watchOutZh: '避开关节折痕，给花饰留出呼吸空间。',
    filters: ['names', 'single', 'dramatic'],
  },
  {
    id: 'old-english',
    name: 'Old English',
    zh: '古英语体',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/oldEnglish.webp',
    feelEn: 'Heritage, ornate, iconic',
    feelZh: '古典、华丽、标志性',
    chosenEn: 'Initials, family names, birth years',
    chosenZh: '首字母、家族姓氏、出生年份',
    readabilityEn: 'Medium — capital initials read strongest',
    readabilityZh: '中等 — 大写首字母与短词最醒目',
    bestWhenEn: 'You want classic Old English legacy lettering.',
    bestWhenZh: '偏爱极具辨识度的经典古英语字母。',
    watchOutEn: 'Avoid all-caps long sentences; stick to 1–2 words.',
    watchOutZh: '切忌用全大写排长句，1–2 个单词效果最佳。',
    filters: ['names', 'initials', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'roman',
    name: 'Roman',
    zh: '罗马体',
    badge: 'Vintage',
    img: '/tattoo-font-generator/styles/roman.webp',
    feelEn: 'Classical, chiselled, dignified',
    feelZh: '古典、庄重、石刻感',
    chosenEn: 'Roman numeral dates, Latin phrases, initials',
    chosenZh: '罗马数字日期、拉丁格言、缩写',
    readabilityEn: 'Very High — crisp serif structure',
    readabilityZh: '极高 — 结构端正严谨',
    bestWhenEn: 'You are tattooing dates like MCMXCVIII or short mottos.',
    bestWhenZh: '专门用于罗马数字纪念日或拉丁短句。',
    watchOutEn: 'Triple-check Roman numeral conversion before inking.',
    watchOutZh: '纹身前务必反复核对罗马数字拼写是否正确。',
    filters: ['dates', 'initials', 'phrases'],
  },
  {
    id: 'gothic',
    name: 'Gothic',
    zh: '暗黑哥特',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/gothic.webp',
    feelEn: 'Sharp, moody, bold',
    feelZh: '锋利、冷峻、暗黑张力',
    chosenEn: 'Single words, initials, dark aesthetics',
    chosenZh: '单词、首字母、暗黑风格搭配',
    readabilityEn: 'Medium — best at medium-to-large scale',
    readabilityZh: '中等 — 中大尺寸下锋芒毕露',
    bestWhenEn: 'You want crisp dark-fantasy or metal-inspired lettering.',
    bestWhenZh: '追求冷冽的暗黑美学字母质感。',
    watchOutEn: 'Leave open gaps inside O, A, and E counters.',
    watchOutZh: '保留字母内部镂空，避免愈合后闭合。',
    filters: ['initials', 'single', 'bold', 'dramatic'],
  },
  {
    id: 'dark',
    name: 'Dark',
    zh: '暗黑荆棘',
    badge: 'Gothic',
    img: '/tattoo-font-generator/styles/dark.webp',
    feelEn: 'Edgy, spiky, contemporary dark',
    feelZh: '先锋、荆棘感、现代暗黑',
    chosenEn: 'Short statement words, cybersigilism pairings',
    chosenZh: '先锋短词、搭配赛博印记图案',
    readabilityEn: 'Stylized — prioritizes silhouette and attitude',
    readabilityZh: '风格化 — 重视整体轮廓与气场',
    bestWhenEn: 'You want lettering that blends with blackwork or sigils.',
    bestWhenZh: '希望文字与重黑或赛博印记融为一体。',
    watchOutEn: 'Best kept to short 3–8 letter words.',
    watchOutZh: '建议控制在 3–8 个字母的短词。',
    filters: ['single', 'dramatic'],
  },
  {
    id: 'gangster',
    name: 'Gangster',
    zh: '街头暗黑',
    badge: 'Street',
    img: '/tattoo-font-generator/styles/gangster.webp',
    feelEn: 'Heavy, condensed, unapologetic',
    feelZh: '厚重、紧凑、硬派街头',
    chosenEn: 'Forearm & chest banners, area codes, nicknames',
    chosenZh: '小臂与胸口横幅、区号与昵称',
    readabilityEn: 'High at medium-to-large placements',
    readabilityZh: '高 — 中大面积下非常醒目',
    bestWhenEn: 'You want bold old-school street banner impact.',
    bestWhenZh: '追求硬派街头横幅的视觉重量。',
    watchOutEn: 'Needs enough height so inner counter spaces breathe.',
    watchOutZh: '确保字高充足，留出内部透气空隙。',
    filters: ['names', 'single', 'bold'],
  },
  {
    id: 'generic',
    name: 'Generic',
    zh: '通用无衬线',
    badge: 'Clean',
    img: '/tattoo-font-generator/styles/generic.png',
    feelEn: 'Neutral, clean, versatile',
    feelZh: '中性、干净、百搭',
    chosenEn: 'Everyday words, dates, first-time drafts',
    chosenZh: '日常词汇、日期与初稿对比',
    readabilityEn: 'Very High across almost every size',
    readabilityZh: '极高 — 各种尺寸下都清晰易读',
    bestWhenEn: 'You want a clean baseline to compare against stylized fonts.',
    bestWhenZh: '适合作为基准字体与花体/哥特体做对比。',
    watchOutEn: 'Pair with thoughtful placement so simplicity looks intentional.',
    watchOutZh: '注重排布位置与留白，让简约更有设计感。',
    filters: ['names', 'dates', 'phrases', 'initials', 'single'],
  },
  {
    id: 'stencil',
    name: 'Stencil',
    zh: '喷绘模板',
    badge: 'Bold',
    img: '/tattoo-font-generator/styles/stencil.png',
    feelEn: 'Industrial, graphic, crisp',
    feelZh: '工业感、利落、硬核',
    chosenEn: 'Dates, coordinates, bold single words',
    chosenZh: '日期、坐标与硬朗单词',
    readabilityEn: 'High — segmented bridges stay distinct',
    readabilityZh: '高 — 镂空断桥结构辨识度高',
    bestWhenEn: 'You want utilitarian graphic precision.',
    bestWhenZh: '喜欢干练克制的工业模板气质。',
    watchOutEn: 'Avoid shrinking bridges so thin they disappear over time.',
    watchOutZh: '避免断桥间隙过细导致恢复后闭合。',
    filters: ['dates', 'initials', 'single', 'bold'],
  },
  {
    id: 'traditional',
    name: 'Traditional',
    zh: '美式传统',
    badge: 'Bold',
    img: '/tattoo-font-generator/styles/traditional.png',
    feelEn: 'Old-school, bold, timeless',
    feelZh: '复古、粗犷、经久耐看',
    chosenEn: 'Banner mottos, tribute words, traditional sleeves',
    chosenZh: '缎带格言、纪念单词与老传统花臂',
    readabilityEn: 'Very High — engineered for tattoo longevity',
    readabilityZh: '极高 — 专为纹身长期稳定而生',
    bestWhenEn: 'You are pairing lettering with roses, daggers, or swallows.',
    bestWhenZh: '适合与玫瑰、匕首、燕子等美式传统图案搭配。',
    watchOutEn: 'Works best in all-caps inside banners or clean arcs.',
    watchOutZh: '搭配全大写与缎带弧形排版效果最佳。',
    filters: ['names', 'phrases', 'single', 'bold'],
  },
  {
    id: 'western',
    name: 'Western',
    zh: '西部衬线',
    badge: 'Vintage',
    img: '/tattoo-font-generator/styles/western.png',
    feelEn: 'Americana, rugged, vintage slab',
    feelZh: '美式复古、粗衬线、西部气息',
    chosenEn: 'Single words, hometowns, bold initials',
    chosenZh: '单词、地名与复古首字母',
    readabilityEn: 'High at medium scale',
    readabilityZh: '高 — 中等尺寸下复古细节分明',
    bestWhenEn: 'You want distinctive vintage Americana character.',
    bestWhenZh: '想要独具辨识度的美式复古粗衬线气质。',
    watchOutEn: 'Spur details need medium sizing to stay crisp.',
    watchOutZh: '字母棘刺细节需要中等以上尺寸才能保持锐利。',
    filters: ['names', 'initials', 'single'],
  },
  {
    id: 'graffiti',
    name: 'Graffiti',
    zh: '涂鸦体',
    badge: 'Street',
    img: '/tattoo-font-generator/styles/graffiti.png',
    feelEn: 'Energetic, urban, expressive',
    feelZh: '动感、街头、张扬个性',
    chosenEn: 'Nicknames, tags, bold forearm pieces',
    chosenZh: '昵称、街头签名与小臂个性图案',
    readabilityEn: 'Stylized — prioritizes urban flow and energy',
    readabilityZh: '风格化 — 突出街头律动与张力',
    bestWhenEn: 'You want dynamic street-art lettering.',
    bestWhenZh: '偏爱富有动感的涂鸦艺术字形。',
    watchOutEn: 'Keep outlines clean so overlapping strokes stay legible.',
    watchOutZh: '控制线条层次，避免重叠笔划过多影响辨认。',
    filters: ['names', 'single', 'bold'],
  },
];

const HERO_STRIP_IDS = [
  'classic',
  'script',
  'blackletter',
  'typewriter',
  'chicano',
  'block',
];

const FAMILIES = [
  {
    en: 'Clean & Minimal',
    zh: '干净极简系',
    descEn: 'Balanced everyday clarity for wrists, dates, and first tattoos.',
    descZh: '清爽耐看，适合手腕、日期与首次纹身。',
    ids: ['classic', 'minimalist', 'generic'],
  },
  {
    en: 'Script & Personal',
    zh: '手写花体系',
    descEn: 'Flowing handwritten and calligraphic styles for names and quotes.',
    descZh: '流畅柔和，适合人名、寄语与短句。',
    ids: ['script', 'cursive', 'handwritten', 'calligraphy'],
  },
  {
    en: 'Bold & Traditional',
    zh: '粗犷传统系',
    descEn: 'High-impact lettering built to stay crisp for decades.',
    descZh: '扎实醒目，历经多年依旧边缘锐利。',
    ids: ['block', 'traditional', 'stencil'],
  },
  {
    en: 'Gothic & Old English',
    zh: '哥特古英语系',
    descEn: 'Dramatic blackletter weight for surnames, initials, and statements.',
    descZh: '浓郁暗黑仪式感，适合姓氏与首字母。',
    ids: ['blackletter', 'old-english', 'gothic', 'dark'],
  },
  {
    en: 'Vintage & Inscription',
    zh: '复古铭文系',
    descEn: 'Literary typewriter, chiselled Roman numerals, and Americana slabs.',
    descZh: '复古打字机、罗马数字与美式粗衬线。',
    ids: ['typewriter', 'roman', 'western'],
  },
  {
    en: 'Street & Chicano',
    zh: '街头奇卡诺系',
    descEn: 'Expressive urban script, banners, and graffiti energy.',
    descZh: '西海岸花体、横幅与动感街头涂鸦。',
    ids: ['chicano', 'gangster', 'graffiti'],
  },
];

const FONT_FILTERS = [
  { id: 'all', en: 'All tattoo fonts', zh: '全部字体' },
  { id: 'names', en: 'Names', zh: '名字' },
  { id: 'dates', en: 'Dates', zh: '日期' },
  { id: 'phrases', en: 'Short phrases', zh: '短句' },
  { id: 'initials', en: 'Initials', zh: '缩写' },
  { id: 'single', en: 'Single words', zh: '单词' },
  { id: 'small', en: 'Small tattoos', zh: '小图' },
  { id: 'bold', en: 'Bold statements', zh: '醒目宣言' },
  { id: 'dramatic', en: 'Dramatic lettering', zh: '戏剧张力' },
].map((fl) => ({
  ...fl,
  count:
    fl.id === 'all'
      ? ALL_20_FONTS.length
      : ALL_20_FONTS.filter((f) => f.filters.includes(fl.id)).length,
}));

const FONTS_FAQS = [
  {
    qEn: 'What are tattoo fonts?',
    qZh: '什么是纹身字体？',
    aEn: 'Tattoo fonts are lettering styles used for word-based tattoos, including names, dates, initials, quotes, surnames, and short phrases. They can look clean, handwritten, script, gothic, Old English, Chicano, vintage, bold, or custom-drawn by a tattoo artist.',
    aZh: '纹身字体是用于文字类纹身（名字、日期、缩写、短句与姓氏等）的字形风格，涵盖极简、手写、花体、哥特、古英语、奇卡诺、复古与粗体等多种方向。',
  },
  {
    qEn: 'What are the best tattoo fonts for names?',
    qZh: '名字纹身最适合哪些字体？',
    aEn: 'Cursive, Script, Handwritten, Chicano, and Classic styles are common starting points for name tattoos. Softer script styles feel personal and emotional, while Chicano, Old English, or bold styles create a stronger statement.',
    aZh: '连笔花体、优雅手写、手写体、奇卡诺和经典衬线都是名字纹身的热门选择：柔和花体更温情，奇卡诺与古英语更有力量感。',
  },
  {
    qEn: 'Which tattoo fonts are easiest to read?',
    qZh: '哪些纹身字体最清晰易读？',
    aEn: 'Clean, Classic, Minimalist, Typewriter, Block, and Traditional styles are usually easier to read because they have clearer letter shapes and less decoration.',
    aZh: '通用无衬线、经典衬线、极简、打字机、粗体方块和美式传统通常最易读，因为字形结构清晰、多余装饰少。',
  },
  {
    qEn: 'What tattoo fonts work best for small tattoos?',
    qZh: '小图纹身适合哪些字体？',
    aEn: 'Small tattoos usually work best with clean, minimalist, classic, typewriter, or simple handwritten lettering. Avoid very thin strokes, tight script loops, and dense gothic shapes.',
    aZh: '小图优先选择极简、经典、打字机或简约手写体，尽量避开过于密集的哥特黑体和紧绷的花体连环。',
  },
  {
    qEn: 'Where do text tattoos look best?',
    qZh: '文字纹身纹在哪些部位最好看？',
    aEn: 'Text tattoos often work well on the inner forearm, wrist, collarbone, ribs, upper arm, chest, back, ankle, or nape. Short words and dates fit smaller areas, while script, gothic, and long quotes need more space.',
    aZh: '小臂内侧、手腕、锁骨、肋骨、上臂、胸口、脚踝与后颈都是文字纹身的热门部位；短词和日期适合小部位，长句与哥特体需要更充裕的面积。',
  },
  {
    qEn: 'Are script tattoo fonts good for long quotes?',
    qZh: '花体适合纹长句子吗？',
    aEn: 'Script tattoo fonts are usually better for names, short phrases, or one-line quotes. Long quotes need larger placement, simple line breaks, and enough spacing between letters.',
    aZh: '花体更适合名字、短语或单行短句；如果纹较长句子，需要更大的面积、合理换行以及宽松字距。',
  },
  {
    qEn: 'Are gothic or Old English tattoo fonts easy to read?',
    qZh: '哥特体和古英语体容易辨认吗？',
    aEn: 'Gothic and Old English tattoo fonts are dramatic and bold, but they work best for initials, surnames, or short words at medium to large sizes.',
    aZh: '哥特与古英语视觉张力强，最适合在中大尺寸下用于首字母、姓氏或简短单词，尺寸太小容易损失内部留白。',
  },
  {
    qEn: 'Are these tattoo fonts downloadable font files?',
    qZh: '这些纹身字体是可安装的字体文件吗？',
    aEn: 'No. The styles on this page are tattoo lettering presets and visual references, not installable font files. They are meant to help you compare lettering directions before generating a tattoo draft.',
    aZh: '不是。本页展示的是纹身字体风格预设与视觉参考，而非电脑安装的 TTF/OTF 字体文件，用于帮您在生成草稿和沟通纹身师前明确方向。',
  },
  {
    qEn: 'Can I use a generated tattoo font as a tattoo stencil?',
    qZh: '可以直接拿生成的字体当作最终转印稿吗？',
    aEn: 'Use generated lettering as a reference, not as the final stencil. A tattoo artist should adjust the spacing, line weight, shape, and placement so the lettering stays readable as it heals and ages.',
    aZh: '建议将其作为清晰参考图而非最终转印稿，由专业纹身师结合您的皮肤与部位微调字距、线宽与比例。',
  },
];

function TattooFontsPage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  const [filter, setFilter] = useState('all');
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroStrip = HERO_STRIP_IDS.map(
    (id) => ALL_20_FONTS.find((f) => f.id === id)!
  );

  const filteredFonts =
    filter === 'all'
      ? ALL_20_FONTS
      : ALL_20_FONTS.filter((f) => f.filters.includes(filter));

  return (
    <InkStudioPageLayout>
      {/* 1. Hero & 6-Card Preview Strip */}
      <section className="py-10 text-center sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {t('Tattoo fonts guide', '纹身字体全指南')}
          </div>
          <h1 className="mt-2 font-sans text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('Tattoo Fonts', '纹身字体风格总览')}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t(
              'Compare 20 tattoo lettering styles with real examples, readability notes, and best-use guidance before generating your draft.',
              '对比 20 种真实纹身字体示例、可读性建议与适用场景，再一键进入生成器预览上身效果。'
            )}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t(
              'These are lettering style presets for tattoo drafts, not installable font files.',
              '说明：本页提供的是纹身字体风格参考预设，并非可安装的电脑字体文件。'
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {[
              t('Real tattoo font examples', '真实纹身字体示例'),
              t('Best uses and readability notes', '适用场景与可读性说明'),
              t('Readability guidance before generating lettering', '生成前的避坑指南'),
            ].map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground"
              >
                <Check className="size-3" />
                <span>{b}</span>
              </span>
            ))}
          </div>

          {/* 6-Column Hero Strip */}
          <div className="mx-auto mt-8 grid max-w-[1104px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {heroStrip.map((f) => (
              <a
                key={f.id}
                href={`#${f.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-white p-2.5 text-left transition-all hover:border-foreground/40 hover:shadow-xs"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-lg bg-[#fafaf9]">
                  <img
                    src={f.img}
                    alt={f.name}
                    className="h-full w-full object-contain p-1 transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {isZh ? f.zh : f.name}
                  </span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {f.badge}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Popular tattoo font families (6 cards) */}
      <section className="border-y border-border bg-muted/20 py-12 sm:py-16">
        <div className="mx-auto max-w-[1216px] px-4 sm:px-6">
          <h2 className="mb-8 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('Popular tattoo font families', '热门纹身字体家族')}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FAMILIES.map((fam) => (
              <div
                key={fam.en}
                className="rounded-xl border border-border bg-white p-5 shadow-2xs"
              >
                <h3 className="text-base font-semibold text-foreground">
                  {isZh ? fam.zh : fam.en}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {isZh ? fam.descZh : fam.descEn}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {fam.ids.map((id) => {
                    const entry = ALL_20_FONTS.find((x) => x.id === id);
                    if (!entry) return null;
                    return (
                      <a
                        key={id}
                        href={`#${id}`}
                        className="rounded-full border border-border bg-[#fafaf9] px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-foreground"
                      >
                        {isZh ? entry.zh : entry.name}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tattoo font styles (9 filters + 20 stacked 2-col cards) */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[1216px] px-4 sm:px-6">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('Tattoo font styles', '20 种纹身字体详解')}
          </h2>

          <div className="mt-5">
            <div className="mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {t('SHOW TATTOO FONTS FOR', '按用途筛选纹身字体')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {FONT_FILTERS.map((fl) => (
                <button
                  key={fl.id}
                  type="button"
                  onClick={() => setFilter(fl.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    filter === fl.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-white text-foreground hover:bg-muted'
                  )}
                >
                  <span>{isZh ? fl.zh : fl.en}</span>
                  <span className="opacity-70">{fl.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {filteredFonts.map((f) => {
              const notesOpen = !!expandedNotes[f.id];
              return (
                <article
                  key={f.id}
                  id={f.id}
                  className="scroll-mt-24 grid grid-cols-1 gap-5 rounded-2xl border border-border bg-white p-5 shadow-2xs lg:grid-cols-[220px_minmax(0,1fr)]"
                >
                  {/* Left 220px Image */}
                  <div className="aspect-[16/11] overflow-hidden rounded-xl border border-border/70 bg-[#fafaf9] lg:aspect-square">
                    <img
                      src={f.img}
                      alt={f.name}
                      loading="lazy"
                      className="h-full w-full object-contain p-3"
                    />
                  </div>

                  {/* Right Details */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {isZh ? `${f.name} · ${f.zh}` : f.name}
                          </h3>
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {f.badge}
                          </span>
                        </div>
                        <Link
                          href="/tattoo-font-generator"
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-foreground px-3.5 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
                        >
                          <span>{t('Try this style', '试用此字体')}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {t('STYLE FEEL', '风格气质')}
                          </div>
                          <div className="mt-1 text-xs text-foreground">
                            {isZh ? f.feelZh : f.feelEn}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {t('OFTEN CHOSEN FOR', '常见用途')}
                          </div>
                          <div className="mt-1 text-xs text-foreground">
                            {isZh ? f.chosenZh : f.chosenEn}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {t('READABILITY', '可读性')}
                          </div>
                          <div className="mt-1 text-xs text-foreground">
                            {isZh ? f.readabilityZh : f.readabilityEn}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                            {t('BEST WHEN', '最适合情况')}
                          </div>
                          <div className="mt-1 text-xs text-foreground">
                            {isZh ? f.bestWhenZh : f.bestWhenEn}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-border pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedNotes((prev) => ({
                            ...prev,
                            [f.id]: !prev[f.id],
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <span>{t('More style notes', '更多避坑与纹身师建议')}</span>
                        <ChevronDown
                          className={cn(
                            'size-3.5 transition-transform',
                            notesOpen && 'rotate-180'
                          )}
                        />
                      </button>

                      {notesOpen && (
                        <div className="mt-2.5 rounded-lg bg-[#fafaf9] p-3 text-xs text-muted-foreground">
                          <strong className="text-foreground">
                            {t('Watch out: ', '注意事项：')}
                          </strong>
                          {isZh ? f.watchOutZh : f.watchOutEn}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How to choose readable tattoo fonts (4-col) */}
      <section className="border-t border-border bg-muted/20 py-12 sm:py-16">
        <div className="mx-auto max-w-[1216px] px-4 sm:px-6">
          <h2 className="mb-8 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t(
              'How to choose readable tattoo fonts',
              '如何挑选持久清晰的纹身字体'
            )}
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                h: t(
                  'Small tattoo fonts need simple forms',
                  '小图字体务必简洁'
                ),
                p: t(
                  'Open counters and minimal flourishes prevent ink from merging as skin naturally ages.',
                  '简洁的笔画与充足留白，能避免皮肤代谢后线条粘连。'
                ),
              },
              {
                h: t(
                  'Long quotes need breathing room',
                  '长句需要留足行距与字距'
                ),
                p: t(
                  'Split quotes into clean lines with open spacing rather than shrinking letters to fit a narrow space.',
                  '宁愿合理换行，也不要为了塞进狭小部位把字缩得过小。'
                ),
              },
              {
                h: t(
                  'Dense lettering needs enough size',
                  '厚重哥特/花体需要足够面积'
                ),
                p: t(
                  'Blackletter, Old English, and Chicano styles shine on forearms, chests, and backs.',
                  '哥特黑体、古英语和奇卡诺在小臂、胸口与背部等中大面积下最出彩。'
                ),
              },
              {
                h: t(
                  'Artists should refine final stencils',
                  '让纹身师做最终转印微调'
                ),
                p: t(
                  'Bring your preview as a direction and let your artist fine-tune kerning and needle gauge.',
                  '把预览图当作明确方向，请纹身师根据肤质微调字距与针号。'
                ),
              },
            ].map((rule) => (
              <div
                key={rule.h}
                className="rounded-xl border border-border bg-white p-5"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {rule.h}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {rule.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Tattoo fonts questions (9 verbatim FAQs) */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6">
          <h2 className="mb-8 text-center font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t('Tattoo fonts questions', '纹身字体常见问题')}
          </h2>

          <div className="divide-y divide-border rounded-2xl border border-border bg-white">
            {FONTS_FAQS.map((item, idx) => {
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

export const Route = createFileRoute('/tattoo-fonts')({
  loader: () => {
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? '纹身字体：20 种风格、示例与适用指南 | InkStudio.ai'
        : 'Tattoo Fonts: Styles, Examples & Best Uses | InkStudio.ai',
      description: isZh
        ? '对比 20 种真实纹身字体风格、可读性说明与常见用途。'
        : 'Compare 20 tattoo lettering styles with real examples, readability notes, and best-use guidance.',
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
  component: TattooFontsPage,
});
