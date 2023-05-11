export const generateUniqueId = () => {
  const randomNum = Math.floor(Math.random() * 1000);
  return `checkbox-${Date.now()}-${randomNum}`;
};
