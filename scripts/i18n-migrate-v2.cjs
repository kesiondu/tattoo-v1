// Corrected, single-pass i18n migration for the tattoo pages.
// Rules (matching .claude/skills):
//  1. `t('en','zh')` calls -> m['key']()
//  2. ONLY condition === isZh ternaries with literal branches -> m['key']()
//     (NEVER touch `active ? styleA : styleB` UI-state ternaries)
//  3. In loaders: m['key']({}, { locale }); rewrite `const isZh = getLocale() === 'zh'`
//     -> `const locale = getLocale()`
//  4. Data-object bilingual field pairs (xxxEn/xxxZh, en/zh, name/zh) -> message key,
//     consumer accesses -> tDynamic(...)
//  5. Template/插值 bilingual text -> parameterized message key
//  6. Remove now-unused `const t` definition.
// Dry-run by default. --apply to write.
const fs = require('fs'), path = require('path'), ts = require('typescript');
const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

const TARGETS = [
  { file: 'src/routes/ai-model-disclosure.tsx', ns: 'pages.aup' },
  { file: 'src/routes/pricing.tsx', ns: 'pages.pricing' },
  { file: 'src/routes/tattoo-try-on.tsx', ns: 'pages.tryon' },
  { file: 'src/routes/tattoo-font-generator.tsx', ns: 'pages.fontgen' },
  { file: 'src/routes/tattoo-fonts.tsx', ns: 'pages.fonts2' },
  { file: 'src/routes/tattoo-ideas.tsx', ns: 'pages.ideas' },
  { file: 'src/routes/tattoo-price-calculator.tsx', ns: 'pages.price' },
  { file: 'src/routes/tattoo-styles.tsx', ns: 'pages.styles2' },
];
const EXTRA = { file: 'src/components/hero-generator.tsx', ns: 'pages.home' };

const enJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/en.json'), 'utf8'));
const zhJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/zh.json'), 'utf8'));
const pairToKey = new Map();
const added = [];
let NS = '';
function keyFor(prefix, en, zh) {
  const id = NS + '\u0000' + en + '\u0000' + zh;
  if (pairToKey.has(id)) return pairToKey.get(id);
  const base = `${NS}.${prefix}`;
  let n = 1, key;
  do { key = `${base}${String(n).padStart(3, '0')}`; n++; }
  while (enJson[key] !== undefined || zhJson[key] !== undefined);
  pairToKey.set(id, key);
  enJson[key] = en; zhJson[key] = zh; added.push({ key, en, zh });
  return key;
}
const isLiteral = n => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n);
const lit = n => isLiteral(n) ? n.text : null;
const isIsZh = n => ts.isIdentifier(n) && n.text === 'isZh';

function migrate({ file, ns }) {
  NS = ns;
  const abs = path.join(ROOT, file);
  const src = fs.readFileSync(abs, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const stats = { calls: 0, tern: 0, loaderDecl: 0, dataPairs: 0, wrapped: 0 };

  // ---------- Pass 1: literal text ----------
  function isLoaderProp(n) {
    return ts.isPropertyAssignment(n) && ts.isIdentifier(n.name) && n.name.text === 'loader';
  }
  function isIsZhDecl(n) {
    if (!ts.isVariableStatement(n) || n.declarationList.declarations.length !== 1) return false;
    const d = n.declarationList.declarations[0];
    return ts.isIdentifier(d.name) && d.name.text === 'isZh' && !!d.initializer;
  }
  function walkText(n, inLoader) {
    const next = inLoader || isLoaderProp(n);
    if (inLoader && isIsZhDecl(n)) {
      edits.push({ s: n.getStart(sf), e: n.getEnd(), t: 'const locale = getLocale();' });
      stats.loaderDecl++;
      return;
    }
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 't' && n.arguments.length === 2) {
      const en = lit(n.arguments[0]), zh = lit(n.arguments[1]);
      if (en !== null && zh !== null) {
        const key = keyFor('m', en, zh);
        edits.push({ s: n.getStart(sf), e: n.getEnd(), t: `m['${key}']()` });
        stats.calls++;
        return;
      }
    }
    // CRITICAL: only isZh-condition ternaries are bilingual text.
    if (ts.isConditionalExpression(n) && isIsZh(n.condition)) {
      const zh = lit(n.whenTrue), en = lit(n.whenFalse);
      if (zh !== null && en !== null) {
        const key = keyFor('m', en, zh);
        const t = inLoader ? `m['${key}']({}, { locale })` : `m['${key}']()`;
        edits.push({ s: n.getStart(sf), e: n.getEnd(), t });
        stats.tern++;
        return;
      }
    }
    ts.forEachChild(n, c => walkText(c, next));
  }
  walkText(sf, false);

  // ---------- Pass 2: data-object bilingual fields (per-object, no global set) ----------
  const bilingualNames = new Set();
  (function walkData(n) {
    if (ts.isObjectLiteralExpression(n)) {
      const f = {}; // field name -> {v, node}
      for (const p of n.properties) {
        if (!ts.isPropertyAssignment(p)) continue;
        const name = ts.isIdentifier(p.name) ? p.name.text : ts.isStringLiteral(p.name) ? p.name.text : null;
        if (!name) continue;
        const v = lit(p.initializer);
        if (v === null) continue;
        f[name] = { v, node: p.initializer };
      }
      const pair = (enName, zhName) => {
        if (!f[enName] || !f[zhName]) return false;
        if (f[enName].v.startsWith('pages.') || f[zhName].v.startsWith('pages.')) return false;
        const key = keyFor('d', f[enName].v, f[zhName].v);
        edits.push({ s: f[enName].node.getStart(sf), e: f[enName].node.getEnd(), t: `'${key}'` });
        edits.push({ s: f[zhName].node.getStart(sf), e: f[zhName].node.getEnd(), t: `'${key}'` });
        bilingualNames.add(enName); bilingualNames.add(zhName);
        stats.dataPairs++;
        return true;
      };
      // xxxEn / xxxZh
      for (const name of Object.keys(f)) {
        if (/Zh$/.test(name)) pair(name.replace(/Zh$/, 'En'), name);
      }
      // en/zh  OR  name/zh
      if (f.zh && !bilingualNames.has('zh')) {
        if (!pair('en', 'zh')) pair('name', 'zh');
      } else if (f.zh) {
        pair('en', 'zh') || pair('name', 'zh');
      }
    }
    ts.forEachChild(n, walkData);
  })(sf);

  // ---------- Pass 3: wrap bilingual field accesses with tDynamic ----------
  (function walkWrap(n) {
    if (ts.isPropertyAccessExpression(n) && bilingualNames.has(n.name.text)) {
      const expr = src.slice(n.getStart(sf), n.getEnd());
      edits.push({ s: n.getStart(sf), e: n.getEnd(), t: `tDynamic(${expr})` });
      stats.wrapped++;
      return;
    }
    ts.forEachChild(n, walkWrap);
  })(sf);

  // ---------- Apply edits (descending, no overlaps) ----------
  edits.sort((a, b) => b.s - a.s || b.e - a.e);
  let out = src;
  let prevS = Infinity;
  for (const e of edits) {
    if (e.e > prevS) continue; // skip edits contained in an already-applied one
    out = out.slice(0, e.s) + e.t + out.slice(e.e);
    prevS = e.s;
  }

  // remove now-unused `const t = ...` (whole line only, keep surrounding newlines)
  out = out.replace(/^[^\S\r\n]*const t = \(en: string, zh: string\) => \(isZh \? zh : en\);[^\S\r\n]*\r?\n/gm, '');
  // remove `const isZh = ...` when it is no longer referenced at all
  if ((out.match(/\bisZh\b/g) || []).length <= 1) {
    out = out.replace(/^[^\S\r\n]*const isZh = getLocale\(\) === 'zh';[^\S\r\n]*\r?\n/gm, '');
  }

  // imports: insert AFTER the last import declaration (incl. multiline ones)
  const needM = stats.calls + stats.tern > 0 || /m\['pages\./.test(out);
  const importLines = [];
  if (needM && !/import\s*\{[^}]*\bm\b[^}]*\}\s*from\s*['"]@\/paraglide\/messages/.test(out)) {
    importLines.push(`import { m } from '@/paraglide/messages.js';`);
  }
  if (stats.wrapped && !/import\s*\{[^}]*\btDynamic\b[^}]*\}\s*from\s*['"]@\/core\/i18n\/dynamic/.test(out)) {
    importLines.push(`import { tDynamic } from '@/core/i18n/dynamic';`);
  }
  if (importLines.length) out = insertImportAfterAll(out, importLines.join('\n'));

  if (APPLY) fs.writeFileSync(abs, out, 'utf8');
  console.log(`${file}: t=${stats.calls} isZhTern=${stats.tern} loader=${stats.loaderDecl} dataPairs=${stats.dataPairs} wrapped=${stats.wrapped}`);
  return { file, out };
}

function insertImportAfterAll(src, lines) {
  // Use TS AST to find the end of the last import declaration (handles multiline).
  const sf = ts.createSourceFile('x.tsx', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let end = -1;
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) end = Math.max(end, st.getEnd());
  }
  if (end < 0) return lines + '\n' + src;
  // append right after the last import's semicolon/newline
  let at = end;
  while (at < src.length && (src[at] === '\r' || src[at] === '\n')) at++;
  return src.slice(0, at) + lines + '\n' + src.slice(at);
}

const results = [...TARGETS, EXTRA].map(migrate);

// ---------- Special cases: template/interpolation bilingual text ----------
// These are handled by adding parameterized messages and rewriting consumers.
const special = [
  {
    file: 'src/routes/tattoo-font-generator.tsx',
    from: "{isZh ? `示例：${st.example}` : `Example: ${st.example}`}",
    to: "{m['pages.fontgen.example_prefix']({ example: st.example })}",
    key: 'pages.fontgen.example_prefix',
    en: 'Example: {example}', zh: '示例：{example}',
  },
  {
    file: 'src/routes/tattoo-font-generator.tsx',
    from: null, // handled by regex below (multiline t() with template args)
    to: null,
    key: 'pages.fontgen.show_all_styles',
    en: 'Show all {count} styles', zh: '显示全部 {count} 种风格',
  },
];
for (const s of special) {
  if (enJson[s.key] === undefined) { enJson[s.key] = s.en; zhJson[s.key] = s.zh; added.push({ key: s.key, en: s.en, zh: s.zh }); }
}
if (APPLY) {
  for (const s of special) {
    if (!s.from) continue;
    const r = results.find(x => x.file === s.file);
    if (r && r.out.includes(s.from)) r.out = r.out.replace(s.from, s.to);
    else console.log('WARN special not found: ' + s.key);
  }
  // remaining t() with template-literal args -> parameterized message
  const r = results.find(x => x.file === 'src/routes/tattoo-font-generator.tsx');
  if (r) {
    const re = /t\(\s*`Show all \$\{filteredGuide\.length\} styles`\s*,\s*`显示全部 \$\{filteredGuide\.length\} 种风格`\s*\)/;
    if (re.test(r.out)) r.out = r.out.replace(re, `m['pages.fontgen.show_all_styles']({ count: filteredGuide.length })`);
    else console.log('WARN show_all t() not found');
  }
  for (const r of results) fs.writeFileSync(path.join(ROOT, r.file), r.out, 'utf8');

  fs.writeFileSync(path.join(ROOT, 'messages/en.json'), JSON.stringify(enJson, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(ROOT, 'messages/zh.json'), JSON.stringify(zhJson, null, 2) + '\n', 'utf8');
}

console.log(`\nnew keys=${added.length}  ${APPLY ? 'APPLIED' : 'DRY RUN'}`);
