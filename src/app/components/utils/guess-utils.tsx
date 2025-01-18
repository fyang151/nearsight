export const normalizeString = (str: string) => {
  return str.replace(/[^a-z0-9]/gi, "").toLowerCase();
};
