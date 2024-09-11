import { getConfigFile } from "src/cache";
import { ConfigFor, SourceConfig } from "src/types";
import { fileWithoutExt } from "./fileWithoutExt";
import { dirname } from "pathe";
import { statSync } from "node:fs";

/**
 * merges the configuration for a specific _source config_ with the
 * the default configuration to provide a fully qualified configuration.
 */
export const configFor = (source: SourceConfig): ConfigFor => {
  const defaultConfig = getConfigFile().defaults;
  const formats = source?.formats ? source.formats : defaultConfig.formats;
  const sizes = source?.sizes ? source.sizes : defaultConfig.sizes;
  const useP3 = source?.useP3 ? source.useP3 : defaultConfig.useP3;
  const metaPolicy = source?.metaPolicy
    ? source.metaPolicy
    : defaultConfig.metaPolicy;
  const perFormatOptions = source?.perFormatOptions
    ? source.perFormatOptions
    : defaultConfig.perFormatOptions;

  const outputDirectory = source?.outputDirectory
    ? source.outputDirectory
    : defaultConfig.outputDirectory;

  return {
    glob: source.glob,
    formats,
    sizes,
    useP3,
    metaPolicy,
    perFormatOptions,
    outputDirectory,

    sourceFile: (file: string) => {
      const baseFile = fileWithoutExt(file);
      const dirOffset = dirname(file);
      const sourceStats = statSync(file);

      return {
        baseFile,
        dirOffset,
        sourceStats,
      };
    },
  };
};
