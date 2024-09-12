export const fileWithoutPath = (filepath: string): string => {
  const last = filepath.split(/[\/\\]/).pop() as string;
  return last;
};
