import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';

const useEsbuild = async (
  entrypoint: string,
  outputDir: string,
  outputName: string,
  esbuildConfig: BuildOptions = {}
) => {
  const result = await build({
    entryPoints: {
      [outputName]: entrypoint,
    },
    outdir: outputDir,
    bundle: true,
    platform: 'node',
    metafile: true,
    absWorkingDir: process.cwd(),
    ...esbuildConfig,
  });
  return result;
};

export default useEsbuild;
