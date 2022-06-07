/* eslint-disable import/prefer-default-export */

export function convertRemToPixels(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

type RemOrPx = 'rem' | 'px';

export function calcColWidth(
  containerWidth: number,
  containerWidthUnit: RemOrPx,
  spacing: number,
  spacingUnit: RemOrPx,
  colCount: number,
) {
  if (containerWidth <= 0 || colCount <= 0) {
    return 0;
  }
  const containerWidthPx = containerWidthUnit === 'px'
    ? containerWidth
    : convertRemToPixels(containerWidth);
  const actualSpacing = spacing < 0 ? 0 : spacing;
  const spacingPx = spacingUnit === 'px' ? actualSpacing : convertRemToPixels(actualSpacing);
  const width = (containerWidthPx - ((colCount - 1) * spacingPx)) / colCount;
  if (width < 0) {
    return 0;
  }
  return width;
}
