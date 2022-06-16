import { z } from 'zod';

const configSchema = z.object(
  {
    // TODO: Add settings per function
    functions: z.record(z.string(), z.string(), {
      required_error: 'Make sure you are declaring the functions!',
    }),
    settings: z.object({
      // Esbuild configuration that is used for additional build settings
      esbuildConfigOverride: z.record(z.string(), z.any()).default({}),
      // Directory to output your built functions
      outputDir: z.string().default('dist'),
      // Fields from the root package.json to copy
      packageFieldsToCopy: z.array(z.string()).default([]),
      // Whether to also zip the function
      zip: z.boolean().default(false),
    }),
  },
  { required_error: 'Missing funpack config inside package.json!' }
);

export type ConfigSchemaType = z.infer<typeof configSchema>;

const parseConfig = (config: unknown) => {
  return configSchema.parse(config);
};

export default parseConfig;
