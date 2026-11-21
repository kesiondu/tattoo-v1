/**
 * Credit prices for tattoo AI generation. Shared by the server (authoritative
 * charge) and the UI (button labels) so the two can never drift apart.
 *
 * `fast_body_preview` and `hq_body_preview` are separate tasks, and
 * `clean_artwork` is a third task: preview + clean artwork is 2 + 2 = 4
 * credits because the user runs both buttons.
 */
export const TATTOO_GENERATION_COSTS = {
  fast_body_preview: 2,
  hq_body_preview: 2,
  clean_artwork: 2,
} as const;

export type TattooGenerationTier = keyof typeof TATTOO_GENERATION_COSTS;

export const TATTOO_PREVIEW_PLUS_ARTWORK_COST =
  TATTOO_GENERATION_COSTS.hq_body_preview +
  TATTOO_GENERATION_COSTS.clean_artwork;

/** `ai_task.scene` used to scope tattoo generations. */
export const TATTOO_TASK_SCENE = 'tattoo_generation';
