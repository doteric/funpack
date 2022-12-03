export const handler = (event: unknown) => {
  console.log('Hello world!', 'event:', event);

  return {
    status: 200,
  };
};
