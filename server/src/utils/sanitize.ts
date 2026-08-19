export const sanitizeText = (value?: string) => {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
};
