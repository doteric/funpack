import { build } from 'esbuild';
import type { BuildOptions } from 'esbuild';

const useEsbuild = async (
  entrypoint: string,
  outfile: string,
  esbuildConfig: BuildOptions = {}
) => {
  const result = await build({
    entryPoints: [entrypoint],
    bundle: true,
    platform: 'node',
    outfile,
    metafile: true,
    ...esbuildConfig,
  });
  return result;
};

export default useEsbuild;
