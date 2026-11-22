// 시안의 500 대비 색상각 차이, 채도 비율, 흰색(+) 또는 검은색(-)까지의 명도 비율.
export function primaryTone(
  base: string,
  hue: number,
  saturation: number,
  lightness: number,
) {
  const light =
    lightness > 0 ? `l + (100 - l) * ${lightness}` : `l * ${1 + lightness}`;
  return `hsl(from ${base} calc(h + ${hue}) calc(s * ${saturation}) calc(${light}))`;
}
