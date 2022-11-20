import { addTest } from './second';

const circular = () => {
  console.log('addTest', addTest);
  console.log('Testing circular dependency');
};

export default circular;
