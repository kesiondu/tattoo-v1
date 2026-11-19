import { createFileRoute } from '@tanstack/react-router';
import { Mail } from 'lucide-react';

import { getLocale } from '@/paraglide/runtime.js';
import { InkStudioPageLayout } from '@/components/inkstudio-page-layout';

function AiModelDisclosurePage() {
  const isZh = getLocale() === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  return (
    <InkStudioPageLayout>
      <section className="border-b border-border py-16 text-center sm:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <p className="text-sm font-medium text-primary">
            {t('AI transparency', 'AI 透明说明')}
          </p>
          <h1 className="mt-3 font-sans text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t('AI Model Disclosure', 'AI 模型说明')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            {t(
              'InkStudio.ai is an independent tattoo design platform that uses third-party AI image generation models through our own tattoo-focused interface.',
              'InkStudio.ai 是一个独立的纹身设计平台，通过自有的纹身设计界面调用第三方 AI 图像生成模型。'
            )}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <section>
          <div className="max-w-2xl">
            <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
              {t('Models Used by InkStudio.ai', 'InkStudio.ai 使用的模型')}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t(
                'The models below currently power the main tattoo generation workflow.',
                '以下模型目前支持主要的纹身生成流程。'
              )}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-foreground">
                {t('Fast Body Preview', '快速身体预览')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  'Fast preview generation currently uses Google Gemini 3.1 Flash Image (Nano Banana 2).',
                  '快速预览生成目前使用 Google Gemini 3.1 Flash Image（Nano Banana 2）。'
                )}
              </p>
            </article>

            <article className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-foreground">
                {t('High-Quality Outputs', '高质量输出')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  'High Quality Body Preview and Clean Artwork outputs currently use Nano Banana Pro.',
                  '高质量身体预览和白底图稿目前使用 Nano Banana Pro。'
                )}
              </p>
            </article>

            <article className="rounded-lg border border-border bg-white p-6">
              <h3 className="font-semibold text-foreground">
                {t('Content Safety', '内容安全')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  'Prompts and eligible uploaded images are screened before generation, and eligible generated images are screened before they are saved or shown.',
                  '生成前会审核提示词和适用的上传图片，适用的生成图片也会在保存或展示前接受审核。'
                )}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16 border-t border-border pt-16">
          <h2 className="font-sans text-3xl font-semibold tracking-tight text-foreground">
            {t(
              'Independence and Provider Relationship',
              '独立性与模型提供方关系'
            )}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <article>
              <h3 className="font-semibold text-foreground">
                {t('Independent Product', '独立产品')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  'InkStudio.ai is not affiliated with, endorsed by, or sponsored by Google or any underlying AI model provider.',
                  'InkStudio.ai 与 Google 或任何底层 AI 模型提供方没有从属、背书或赞助关系。'
                )}
              </p>
            </article>

            <article>
              <h3 className="font-semibold text-foreground">
                {t('Tattoo-Focused Experience', '面向纹身的体验')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  'InkStudio.ai adds tattoo-specific controls, body placement previews, style guidance, and output formats that help users plan tattoo designs.',
                  'InkStudio.ai 提供纹身相关的控制项、身体部位预览、风格指导和输出格式，帮助用户规划纹身设计。'
                )}
              </p>
            </article>

            <article>
              <h3 className="font-semibold text-foreground">
                {t('Model Updates', '模型更新')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  'We may update the underlying models to improve quality, speed, reliability, or safety. When model routing changes materially, this disclosure page will be updated.',
                  '我们可能会更新底层模型，以提升质量、速度、可靠性或安全性。当模型路由发生重要变化时，本说明页会同步更新。'
                )}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-16 rounded-lg border border-border bg-muted/30 p-6 sm:p-8">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
            {t('Questions about AI model use?', '对 AI 模型使用有疑问？')}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t(
              'Contact support@inkstudio.ai if you need more information about model use, content safety, or generated outputs.',
              '如需了解模型使用、内容安全或生成结果相关信息，请联系 support@inkstudio.ai。'
            )}
          </p>
          <a
            href="mailto:support@inkstudio.ai"
            className="mt-6 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80"
          >
            <Mail className="mr-1 size-4" />
            <span>{t('Contact Support', '联系支持')}</span>
          </a>
        </section>
      </div>
    </InkStudioPageLayout>
  );
}

export const Route = createFileRoute('/ai-model-disclosure')({
  loader: () => {
    const isZh = getLocale() === 'zh';
    return {
      title: isZh
        ? 'AI 模型说明 | InkStudio.ai'
        : 'AI Model Disclosure | InkStudio.ai',
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : [],
  }),
  component: AiModelDisclosurePage,
});
