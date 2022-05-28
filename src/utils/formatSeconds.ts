import { isNil } from 'lodash';

export default function formatSeconds(seconds?: number) {
  if (isNil(seconds)) {
    return '00:00';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  // eslint-disable-next-line no-nested-ternary
  return [h, m > 9 ? m : h ? `0${m}` : m || '0', s > 9 ? s : `0${s}`]
    .filter(Boolean)
    .join(':');
}
