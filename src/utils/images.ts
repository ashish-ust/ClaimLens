/**
 * Photos are labelled by their position in the list ("Photo 1", "Photo 2").
 * `index` values from the API are used only to match references (e.g. duplicate matches),
 * so the labels stay correct whether the backend numbers images from 0 or from 1.
 */

export function findImageByIndex<T extends { index: number }>(images: T[], index: number): T | undefined {
  return images.find((image) => image.index === index);
}

export function photoLabel<T extends { index: number }>(images: T[], index: number): string {
  const position = images.findIndex((image) => image.index === index);
  return position >= 0 ? `Photo ${position + 1}` : `Photo ${index + 1}`;
}

/** The uploaded photo that is NOT the given index (the "other" photo in a two-photo claim). */
export function otherImage<T extends { index: number }>(images: T[], index: number): T | undefined {
  return images.find((image) => image.index !== index);
}
