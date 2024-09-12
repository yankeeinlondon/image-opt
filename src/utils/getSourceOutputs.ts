import { ConfigFile, OptimizationKind, SourceConfig } from "src/types";
import { join } from "pathe";
import { existsSync, statSync } from "fs";
import { configFor } from "./configFor";
import { log } from "./logging";

export type SourceFileInput = {
  file: string;
  outputs: Record<string, SourceOutputFile>;
};

export type SourceOutputFile = {
  /** the source image being optimized */
  source: string;
  /** the output filename and path for the optimized image */
  sink: string;
  kind: OptimizationKind;
  /** sink exists in filesystem */
  exists: boolean;
  /** the sink is newer than the source image, indicating it is fresh */
  fresh: boolean;
};

const produceVariants = (
  file: string,
  dir: string,
  config: {
    formats: ConfigFile["defaults"]["formats"];
    sizes: ConfigFile["defaults"]["sizes"];
    useP3: boolean;
  },
) => {
  let variants: string[] = [];
  const { formats, sizes, useP3 } = config;

  // fallback image
  variants.push(`${dir}/${file}.jpg`);
  // blurred image
  variants.push(`${dir}/${file}-blurred.jpg`);

  for (const format of formats) {
    const orig = `${file}-original-size.${format}`;
    variants.push(join(dir, orig));

    for (const size of sizes) {
      const filename = `${file}-${size}.${format}`;
      const filename_p3 = `${file}-${size}-p3.${format}`;
      variants.push(join(dir, filename));
      if (useP3) {
        variants.push(join(dir, filename_p3));
      }
    }
  }

  return variants;
};

/**
 * Provides an array of output files for a given source image
 */
export const getSourceOutputs = (
  source: string,
  sourceConfig: SourceConfig,
): SourceOutputFile[] => {
  const config = configFor(sourceConfig);
  const { formats, sizes, useP3 } = config;
  const { baseFile, sourceStats } = config.sourceFile(source);

  const outputs = produceVariants(baseFile, config.outputDirectory, {
    formats,
    sizes,
    useP3,
  });

  const kind = (key: string) =>
    key.includes("-blurred")
      ? "blurred"
      : key.includes("-original-size")
        ? "original"
        : key.replace(/-[0-9]+\./, "") !== key
          ? key.includes("-p3")
            ? "p3"
            : "resized"
          : "fallback";

  const withMeta = outputs.reduce((acc, key) => {
    const exists = existsSync(key);
    return [
      ...acc,
      {
        source,
        sink: key,
        kind: kind(key),
        exists,
        fresh: exists && statSync(key).mtimeMs > sourceStats.mtimeMs,
      } as SourceOutputFile,
    ];
  }, [] as SourceOutputFile[]);

  return withMeta;
};
