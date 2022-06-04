export default function formatSeconds(seconds?: number) {
  if (seconds === undefined) {
    return '00:00';
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const paddedS = s > 9 ? s : `0${s}`;
  const paddedM = m > 9 ? m : `0${m}`;
  return [h, paddedM, paddedS]
    .filter(Boolean)
    .join(':');
}
