import rimraf from 'rimraf';

export const addTest = (a: number, b: number) => a + b;

const test = () => {
  console.log('rimraf', rimraf);
};

export default test;
