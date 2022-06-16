import type { ConfigSchemaType } from './parts/parseConfig';

export type PackageObjectType = Record<string, unknown> & {
  funpack: ConfigSchemaType;
};
