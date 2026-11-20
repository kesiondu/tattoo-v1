import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Download, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

const FONT_CHOICES = [
  {
    id: 'serif',
    en: 'Classic serif',
    zh: '经典衬线',
    family: 'Georgia, "Times New Roman", serif',
    style: 'normal',
  },
  {
    id: 'script',
    en: 'Soft script',
    zh: '柔和手写',
    family: '"Brush Script MT", "Segoe Script", cursive',
    style: 'italic',
  },
  {
    id: 'bold',
    en: 'Bold display',
    zh: '醒目粗体',
    family: 'Impact, "Arial Black", sans-serif',
    style: 'normal',
  },
  {
    id: 'typewriter',
    en: 'Typewriter',
    zh: '打字机',
    family: '"Courier New", monospace',
    style: 'normal',
  },
];

function NameTattooGeneratorPage() {
  const isZh = getLocale() === 'zh';
  const [name, setName] = useState('Luna');
  const [selectedFont, setSelectedFont] = useState(FONT_CHOICES[0].id);
  const [downloadError, setDownloadError] = useState('');
  const font = FONT_CHOICES.find((item) => item.id === selectedFont)!;
  const direction = isZh
    ? '在输入框中写下名字，选择字形并下载 PNG 参考图。它适合比较方向，不是可直接转印的最终字稿。'
    : 'Type a name, compare lettering directions, and download a PNG reference. It is a design preview—not a final transfer stencil.';

  const title = isZh
    ? '名字纹身生成器：在线预览姓名纹身字体 | TattooGenerator.online'
    : 'Name Tattoo Generator: Preview Name Tattoo Fonts | TattooGenerator.online';
  const description = isZh
    ? '输入姓名，比较经典衬线、手写、粗体和打字机风格的纹身字样，并下载 PNG 参考图，方便与纹身师讨论。'
    : 'Preview a name in classic serif, script, bold, and typewriter lettering. Download a PNG reference to discuss size, spacing, and custom lettering with your tattoo artist.';

  const canvasText = useMemo(() => name.trim().slice(0, 30), [name]);

  function downloadPng() {
    setDownloadError('');
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 500;
    const context = canvas.getContext('2d');
    if (!context) {
      setDownloadError(
        isZh
          ? '无法创建图片，请重试。'
          : 'Could not create the image. Please try again.'
      );
      return;
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#171717';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `${font.style} 112px ${font.family}`;
    context.fillText(
      canvasText || (isZh ? '你的名字' : 'Your name'),
      800,
      245,
      1440
    );
    canvas.toBlob((blob) => {
      if (!blob) {
        setDownloadError(
          isZh
            ? '图片导出失败，请重试。'
            : 'PNG export failed. Please try again.'
        );
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'name-tattoo-lettering-reference.png';
      link.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  return (
    <InkStudioPageLayout>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="text-muted-foreground mb-8 text-sm"
        >
          <Link href="/" className="underline underline-offset-4">
            {isZh ? '首页' : 'Home'}
          </Link>
          <span className="mx-2">/</span>
          {isZh ? '名字纹身生成器' : 'Name Tattoo Generator'}
        </nav>
        <header className="max-w-3xl">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            {isZh ? '文字纹身工具' : 'LETTERING TOOL'}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {isZh ? '名字纹身生成器' : 'Name Tattoo Generator'}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-8">
            {isZh
              ? '先比较字形，再和纹身师一起确定笔画、字距与尺寸。'
              : 'Compare the letterforms first; decide stroke weight, spacing, and final size with your tattoo artist.'}
          </p>
        </header>

        <section
          className="bg-card mt-9 rounded-2xl border p-5 sm:p-8"
          aria-label={isZh ? '姓名预览工具' : 'Name preview tool'}
        >
          <label htmlFor="name-input" className="text-sm font-semibold">
            {isZh ? '输入姓名或短词' : 'Name or short word'}
          </label>
          <input
            id="name-input"
            value={name}
            maxLength={30}
            onChange={(event) => setName(event.target.value)}
            className="bg-background mt-2 w-full rounded-lg border px-4 py-3 text-base"
            placeholder={isZh ? '例如：Luna' : 'e.g. Luna'}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {isZh
              ? '最多 30 个字符。请仔细核对拼写、大小写和重音符号。'
              : 'Up to 30 characters. Check spelling, capitalization, and accent marks carefully.'}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {FONT_CHOICES.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => setSelectedFont(choice.id)}
                aria-pressed={selectedFont === choice.id}
                className={`rounded-xl border p-4 text-left transition-colors ${selectedFont === choice.id ? 'border-foreground ring-foreground ring-1' : 'hover:border-foreground/50'}`}
              >
                <span className="text-muted-foreground text-xs font-medium">
                  {isZh ? choice.zh : choice.en}
                </span>
                <span
                  className="mt-3 block overflow-hidden text-3xl text-ellipsis whitespace-nowrap"
                  style={{ fontFamily: choice.family, fontStyle: choice.style }}
                >
                  {canvasText || (isZh ? '你的名字' : 'Your name')}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadPng}
              className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              <Download className="size-4" />
              {isZh ? '下载 PNG 参考图' : 'Download PNG reference'}
            </button>
            <Link
              href={`/tattoo-font-generator${name.trim() ? `?name=${encodeURIComponent(name.trim())}` : ''}`}
              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold"
            >
              <Sparkles className="size-4" />
              {isZh ? '打开完整字体生成器' : 'Open full font generator'}
            </Link>
          </div>
          {downloadError && (
            <p role="alert" className="text-destructive mt-3 text-sm">
              {downloadError}
            </p>
          )}
          <p className="text-muted-foreground mt-4 text-xs leading-5">
            {direction}
          </p>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">
              {isZh
                ? '选名字字体，别只看屏幕预览'
                : 'Choose lettering beyond the screen preview'}
            </h2>
            <p className="text-muted-foreground mt-3 leading-7">
              {isZh
                ? '名字纹身的字形会随尺寸、皮肤曲面和字母间距改变观感。弯曲的手写连笔在手机上看起来轻盈，缩到手腕的实际尺寸后却可能挤在一起；衬线与粗体轮廓通常更容易辨认，但仍要看具体字母组合。把同一个名字放进不同字形比较，再请擅长 lettering 的纹身师根据实际部位重新排字。'
                : 'Letterforms change with scale, skin curvature, and spacing. A flowing script can look airy on a phone but crowd together at wrist size; a serif or bold outline may read more clearly, yet the actual letter sequence still matters. Compare the same name across styles, then ask a lettering-focused tattoo artist to redraw it for the intended placement.'}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {isZh
                ? '小尺寸要给笔画留空间'
                : 'Small lettering needs room between strokes'}
            </h2>
            <p className="text-muted-foreground mt-3 leading-7">
              {isZh
                ? '连笔、双写字母、细小字腔和装饰尾笔容易在缩小后相互靠近。不存在适用于所有字体和皮肤的统一最小尺寸；让纹身师按实际模板检查字腔、字距和线条粗细，并在自然站姿下观察弧形部位的排列。导出的 PNG 是沟通参考，不等同于纹身师制作的最终转印稿。'
                : 'Connected letters, repeated verticals, tiny counters, and flourishes can collide when reduced. There is no single minimum size that fits every typeface, placement, and skin. Have the artist inspect counters, spacing, and line weight on a stencil at the intended scale, and check curved placements in a relaxed posture. The PNG is a conversation aid, not an artist-prepared transfer stencil.'}
            </p>
          </div>
        </section>
      </main>
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/name-tattoo-generator')({
  loader: () => {
    const locale = getLocale();
    return {
      locale,
      title:
        locale === 'zh'
          ? '名字纹身生成器：在线预览姓名纹身字体 | TattooGenerator.online'
          : 'Name Tattoo Generator: Preview Name Tattoo Fonts | TattooGenerator.online',
      description:
        locale === 'zh'
          ? '输入姓名，比较经典衬线、手写、粗体和打字机风格的纹身字样，并下载 PNG 参考图，方便与纹身师讨论。'
          : 'Preview a name in classic serif, script, bold, and typewriter lettering. Download a PNG reference to discuss size, spacing, and custom lettering with your tattoo artist.',
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    return buildSeoHead({
      locale,
      path: '/name-tattoo-generator',
      title,
      description,
      jsonLd: [
        webAppJsonLd({
          name: title.split(':')[0],
          description,
          path: '/name-tattoo-generator',
          locale,
        }),
        breadcrumbJsonLd(
          [
            { name: locale === 'zh' ? '首页' : 'Home', path: '/' },
            {
              name:
                locale === 'zh' ? '名字纹身生成器' : 'Name Tattoo Generator',
              path: '/name-tattoo-generator',
            },
          ],
          locale
        ),
        faqJsonLd([
          {
            q:
              locale === 'zh'
                ? '可以直接把下载的 PNG 当作转印稿吗？'
                : 'Can I use the downloaded PNG as my final stencil?',
            a:
              locale === 'zh'
                ? '不可以。它是字体方向参考图。纹身师应根据实际皮肤部位、尺寸和字距重新检查并制作适用的转印稿。'
                : 'No. It is a lettering reference. Your tattoo artist should check it at the actual placement and size, adjust spacing, and prepare the final transfer stencil.',
          },
          {
            q:
              locale === 'zh'
                ? '哪种字体最适合名字纹身？'
                : 'Which font is best for a name tattoo?',
            a:
              locale === 'zh'
                ? '取决于名字拼写、预期尺寸、部位和个人审美。比较同一名字的多种字形，并让擅长文字纹身的纹身师检查细节。'
                : 'It depends on the name, intended size, placement, and taste. Compare the same lettering in several styles and ask a lettering-focused tattoo artist to review the details.',
          },
        ]),
      ],
    });
  },
  component: NameTattooGeneratorPage,
});
