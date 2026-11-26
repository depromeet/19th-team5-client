export function secondsBetween(from: number, to: number) {
  return Math.max(0, Math.floor((to - from) / 1000));
}
