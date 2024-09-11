import { getConfigFile } from "src/cache";
import { SourceConfig } from "src/types";
/**
 * Provides the _source rules_ found in the configuration file.
 */
export const getSourceRules = (): SourceConfig[] => {
  const config = getConfigFile();
  return config.sources;
};
