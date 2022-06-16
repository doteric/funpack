import rimraf from 'rimraf';

export const addTest = (a: number, b: number) => a + b;

export const test = () => {
  console.log('rimraf', rimraf);
};
