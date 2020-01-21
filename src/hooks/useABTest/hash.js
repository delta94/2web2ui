export const hash = str => {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }

  for (let i = 0, l = str.length; i < l; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};
