export const error = (...messages: string[]) => {
  throw new Error(`\x1b[31m Error: ${messages.join(' ')} \x1b[0m`);
};
