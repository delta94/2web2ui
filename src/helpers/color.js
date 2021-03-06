import color from 'color';

/**
 * Generates a color palette for pie chart data
 * @param  {Array} arr        array of objects
 * @param  {String} baseColor     Hex value
 * @param  {Number} rotate    hue rotation multiplier, divided by array length
 * @param  {Number} saturate  hue saturation multiplier, divided by array length
 * @return {Array}            array with 'fill' key added
 */
export function generateColors(arr, { baseColor = '#123456', rotate = 60, saturate = 0.1 } = {}) {
  const base = color(baseColor);
  const length = arr.length;
  const r = rotate / length;
  const s = saturate / length;

  return arr.map((item, i) => ({
    ...item,
    fill: base.rotate(r * i).saturate(s * i).string()
  }));
}
