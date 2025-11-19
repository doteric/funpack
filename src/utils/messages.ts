export const error = (...messages: string[]) => {
  // TODO: Consider only returning error without throwing and throw error inside caller
  throw new Error(`\x1b[31m Error: ${messages.join(' ')} \x1b[0m`);
};
