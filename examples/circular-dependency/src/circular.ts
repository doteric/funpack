import { handler } from './main';

console.log(handler);

const circular = () => {
  console.log('Hello from circular');
};

export default circular;
