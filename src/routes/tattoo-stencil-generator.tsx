import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ImagePlus, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  breadcrumbJsonLd,
  buildSeoHead,
  faqJsonLd,
  webAppJsonLd,
} from '@/lib/seo';
import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

function TattooStencilGeneratorPage() {
  const isZh = getLocale() === 'zh';
  const copy = isZh
    ? {
        eyebrow: '纹身设计与线稿参考',
        title: '纹身线稿生成器指南',
        intro:
          '从文字描述生成纹身概念，导出 PNG 或 SVG 设计参考，并在上身预览前检查轮廓、留白和构图。',
        note: '此页面引导你使用文字生成新的纹身概念，不会把上传的照片自动描成线稿或导出转印文件。最终转印稿应由纹身师按实际部位和皮肤情况调整。',
        stepsTitle: '从想法到可讨论的设计稿',
        steps: [
          [
            '描述图案',
            '先写清主体、风格、构图和不想出现的元素。例如：单色植物枝条，纵向构图，保留开放留白。',
          ],
          [
            '检查轮廓与负空间',
            '在屏幕上放大查看细节是否拥挤，并比较不同身体部位的比例。线稿预览是设计参考，不代表所有细线都适合任意尺寸。',
          ],
          [
            '带给纹身师修改',
            '讨论最终尺寸、针法、皮肤曲面和转印方式。纹身师应审核图案并制作适合实际操作的稿件。',
          ],
        ],
        limitationTitle: '先说清楚工具能做什么',
        limitation:
          '这里引导生成新设计概念，不会从照片提取既有纹身，也不会输出经工作室验证的热敏转印文件。AI 可能遗漏细节或生成不连贯的线条；请在定稿前逐处检查，尤其是小型文字、重叠线条和需要准确对称的图案。',
        cta: '打开 AI 纹身生成器',
        faq: [
          [
            '这是照片转纹身线稿工具吗？',
            '不是。本页面链接到文字生成设计的流程，不会自动从照片中提取轮廓。',
          ],
          [
            '下载的图能直接纹吗？',
            '不能保证。它是视觉参考稿；纹身师需要确认比例、线条、可操作性和转印安排。',
          ],
          [
            '细线设计适合做得很小吗？',
            '不能只看屏幕缩略图判断。实际可行性取决于细节密度、部位、皮肤和纹身师手法，应让纹身师按实际尺寸审核。',
          ],
        ],
      }
    : {
        eyebrow: 'TATTOO DESIGN & LINEWORK REFERENCE',
        title: 'Tattoo Stencil Generator Guide',
        intro:
          'Generate a tattoo concept from a text brief, then review its outline, negative space, and composition before discussing the design with an artist.',
        note: 'This page guides you to create a new tattoo concept from text. It does not automatically trace an uploaded photo or export a transfer stencil. A tattoo artist should adapt the final stencil to the actual placement and skin.',
        stepsTitle: 'Turn a brief into an artist-ready conversation',
        steps: [
          [
            'Describe the motif',
            'Specify the subject, visual style, composition, and what to leave out. For example: a monochrome botanical branch, vertical flow, and open negative space.',
          ],
          [
            'Inspect contours and spacing',
            'Zoom in for crowded details and compare the design at different body placements. A linework preview does not mean every fine line works at every size.',
          ],
          [
            'Review it with an artist',
            'Discuss final scale, technique, skin curvature, and transfer method. The artist should review the artwork and prepare the version used for tattooing.',
          ],
        ],
        limitationTitle: 'What this tool does—and does not do',
        limitation:
          'This is a text-based new-design concept workflow, not a photo extractor and not an export tool for studio-validated thermal transfer files. AI may omit details or create inconsistent lines. Review the artwork before finalizing, especially small lettering, intersecting lines, and motifs that depend on exact symmetry.',
        cta: 'Open the AI Tattoo Generator',
        faq: [
          [
            'Does this convert a photo into a tattoo stencil?',
            'No. The linked workflow generates new concepts from text; it does not automatically trace contours from an uploaded photo.',
          ],
          [
            'Can I tattoo the downloaded image as-is?',
            'That is not guaranteed. Treat it as a visual reference; an artist should verify scale, linework, feasibility, and transfer setup.',
          ],
          [
            'Can fine-line designs always be made tiny?',
            'A screen preview cannot answer that. Feasibility depends on detail density, placement, skin, and the artist’s technique; ask the artist to review it at the intended size.',
          ],
        ],
      };

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
          {copy.title}
        </nav>
        <header className="max-w-3xl">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-8">
            {copy.intro}
          </p>
        </header>
        <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm leading-7">
          <div className="flex gap-3">
            <ImagePlus className="mt-1 size-5 shrink-0" />
            <p>{copy.note}</p>
          </div>
        </div>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">{copy.stepsTitle}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {copy.steps.map(([title, text], i) => (
              <article key={title} className="bg-card rounded-xl border p-5">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  {isZh ? `第 ${i + 1} 步` : `STEP 0${i + 1}`}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="bg-muted/30 mt-12 rounded-2xl border p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">{copy.limitationTitle}</h2>
          <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
            {copy.limitation}
          </p>
          <Link
            href="/"
            className="bg-primary text-primary-foreground mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
          >
            <Sparkles className="size-4" />
            {copy.cta}
            <ArrowRight className="size-4" />
          </Link>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold">
            {isZh ? '常见问题' : 'Questions about tattoo stencil references'}
          </h2>
          <div className="bg-card mt-5 divide-y rounded-xl border px-5">
            {copy.faq.map(([question, answer]) => (
              <article key={question} className="py-5">
                <h3 className="font-semibold">{question}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">
                  {answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/tattoo-stencil-generator')({
  loader: () => {
    const locale = getLocale();
    return locale === 'zh'
      ? {
          locale,
          title:
            '纹身线稿生成器指南：生成可讨论的设计参考 | TattooGenerator.online',
          description:
            '使用文字生成纹身概念，并与纹身师一起审核轮廓、留白与尺寸；本页面不提供照片自动描线或转印文件导出。',
        }
      : {
          locale,
          title:
            'Tattoo Stencil Generator Guide: Text-Based Concept Workflow | TattooGenerator.online',
          description:
            'Use a text-based tattoo concept workflow and review linework, negative space, and sizing with an artist; this page does not trace photos or export transfer files.',
        };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description } = loaderData;
    return buildSeoHead({
      locale,
      path: '/tattoo-stencil-generator',
      title,
      description,
      jsonLd: [
        webAppJsonLd({
          name: title.split(':')[0],
          description,
          path: '/tattoo-stencil-generator',
          locale,
        }),
        breadcrumbJsonLd(
          [
            { name: locale === 'zh' ? '首页' : 'Home', path: '/' },
            { name: title.split(':')[0], path: '/tattoo-stencil-generator' },
          ],
          locale
        ),
        faqJsonLd(
          locale === 'zh'
            ? [
                {
                  q: '这是照片转纹身线稿工具吗？',
                  a: '不是。本页面链接到文字生成设计的流程，不会自动从照片中提取轮廓。',
                },
                {
                  q: '下载的图能直接纹吗？',
                  a: '不能保证。它是视觉参考稿；纹身师需要确认比例、线条、可操作性和转印安排。',
                },
                {
                  q: '细线设计适合做得很小吗？',
                  a: '实际可行性取决于细节密度、部位、皮肤和纹身师手法，应让纹身师按实际尺寸审核。',
                },
              ]
            : [
                {
                  q: 'Does this convert a photo into a tattoo stencil?',
                  a: 'No. The linked workflow generates new concepts from text; it does not automatically trace contours from an uploaded photo.',
                },
                {
                  q: 'Can I tattoo the downloaded image as-is?',
                  a: 'That is not guaranteed. Treat it as a visual reference; an artist should verify scale, linework, feasibility, and transfer setup.',
                },
                {
                  q: 'Can fine-line designs always be made tiny?',
                  a: 'Feasibility depends on detail density, placement, skin, and the artist’s technique; ask the artist to review it at the intended size.',
                },
              ]
        ),
      ],
    });
  },
  component: TattooStencilGeneratorPage,
});
