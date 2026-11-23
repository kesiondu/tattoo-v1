/**
 * Credit prices for tattoo AI generation. Shared by the server (authoritative
 * charge) and the UI (button labels) so the two can never drift apart.
 *
 * A body-preview task creates and stores the clean artwork master first, then
 * renders the preview from that exact design. Revealing the stored artwork is
 * free. `clean_artwork` remains a separate paid tier for the standalone
 * stencil generator, where no body-preview task exists.
 */
export const TATTOO_GENERATION_COSTS = {
  fast_body_preview: 2,
  hq_body_preview: 2,
  clean_artwork: 2,
} as const;

export type TattooGenerationTier = keyof typeof TATTOO_GENERATION_COSTS;

export const TATTOO_PREVIEW_PLUS_ARTWORK_COST =
  TATTOO_GENERATION_COSTS.fast_body_preview;

/** `ai_task.scene` used to scope tattoo generations. */
export const TATTOO_TASK_SCENE = 'tattoo_generation';
