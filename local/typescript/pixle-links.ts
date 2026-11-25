/**
 * Absolute URLs of the deployed Pixle apps and pages.
 *
 * Pixle has no fixed domain at the moment, so nothing in the apps may depend on one.
 * Leave a value empty as long as it is unknown: links pointing to an empty URL are not rendered.
 * Shared puzzles link to the address the game is currently running on.
 */
export const PIXLE_LINKS: Readonly<
  Record<'game' | 'landing' | 'howToPlay' | 'privacyPolicy' | 'imprint', string>
> = {
  /** The game (projects/pixle-game) */
  game: '',
  /** The landing page (projects/pixle-landing) */
  landing: '',
  /** The how-to guide on the landing page */
  howToPlay: '',
  privacyPolicy: '',
  imprint: '',
};

export const PIXLE_REPOSITORY_URL: string = 'https://github.com/141512114/pixle';
