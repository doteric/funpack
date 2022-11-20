import rimraf from 'rimraf';

import circular from './circular';

export const addTest = (a: number, b: number) => a + b;

const test = () => {
  console.log('circular', circular);
  console.log('rimraf', rimraf);
};

export default test;
