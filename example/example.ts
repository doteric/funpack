const test = {
  second: () => import('./second'),
  third: () => import('./third'),
};

type testKeysType = keyof typeof test;

export const handler = async (payload: unknown = 'second') => {
  if (typeof payload === 'string' && payload in test) {
    test[payload as testKeysType]();
  }
};
