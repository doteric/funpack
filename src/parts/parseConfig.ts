import { z, ZodError } from 'zod';

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
      // Remove the output directory before packaging
      cleanupOutputDir: z.boolean().default(true),
      // Whether to also zip the function
      zip: z.boolean().default(false),
      // Remove directories of functions, leaving only the zip files
      removeDirAfterZip: z.boolean().default(false),
      // Custom values to append to the packge.json
      customPackageFields: z.record(z.string(), z.any()).default({}),
    }),
  },
  { required_error: 'Missing funpack config inside package.json!' }
);

export type ConfigSchemaType = z.infer<typeof configSchema>;

const parseConfig = (config: unknown) => {
  try {
    // TODO: Use strict (https://github.com/colinhacks/zod#strict)
    return configSchema.parse(config);
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.issues);
    } else {
      console.error(e);
    }
    process.exit();
  }
};

export default parseConfig;
