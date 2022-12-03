const example = {
  second: () => import('./second.js'),
  third: () => import('./third'),
};

export const handler = (event: unknown) => {
  if (event === 'second') {
    example.second();
  } else {
    example.third();
  }
};
