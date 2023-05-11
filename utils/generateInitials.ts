export const generateInitials = (name: string) => {
  const nameArr = name.split(' ');

  return nameArr[0].charAt(0) + (nameArr?.[1]?.charAt(0) || '');
};
