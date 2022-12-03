import circular from './circular';

export const handler = (event: unknown) => {
  console.log('Hello world!', 'event:', event);
  circular();

  return {
    status: 200,
  };
};
