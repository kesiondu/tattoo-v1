/**
 * Credit prices for tattoo AI generation. Shared by the server (authoritative
 * charge) and the UI (button labels) so the two can never drift apart.
 *
 * A standard generation is a single 4-credit design pack: an on-body preview
 * followed automatically by its clean flat reference extraction.
 */
export const TATTOO_GENERATION_COSTS = {
  fast_body_preview: 2,
  hq_body_preview: 2,
  clean_artwork: 2,
  stencil_from_preview: 2,
} as const;

export type TattooGenerationTier = keyof typeof TATTOO_GENERATION_COSTS;

export const TATTOO_PREVIEW_PLUS_ARTWORK_COST =
  TATTOO_GENERATION_COSTS.fast_body_preview +
  TATTOO_GENERATION_COSTS.stencil_from_preview;

/** `ai_task.scene` used to scope tattoo generations. */
export const TATTOO_TASK_SCENE = 'tattoo_generation';
