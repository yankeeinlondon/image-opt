import {} from "sharp";
import { OutputFormat, PerFormatOptions } from "../types/sharp-types";
import { useSharp } from "./useSharp";
import { getCacheState } from "../cache";
import { log, shout, whisper } from "../utils";
import chalk from "chalk";
import { missingOutputsFor } from "./missingOutputsFor";
import { BLURRED_SIZE } from "../constants";
import { stripAfter, stripBefore } from "inferred-types";
import { getConfig } from "src/utils/config";

export type ConversionOutput = {
  outputFile: string;
  width: number;
  height: number;
  aspectRatio: number;
};

export const convert = (
  /** the source image */
  source: string,
  /** the filename to save as (including path) */
  to: string,
  format: OutputFormat,
  /**
   * the width to resize to or the string "no-resize" to
   * indicate that the image's size should remain unchanged.
   */
  width: number | "no-resize",
  options: PerFormatOptions,
) => {
  const sharp = useSharp(options);
  const config = getConfig();

  if (getCacheState(source) !== "fresh") {
    log(`- cache stale for ${chalk.green(source)}`);
    sharp.blurredPreImage(source, to, BLURRED_SIZE);
  } else {
    const missing = missingOutputsFor(source);

    if (missing.length === 0) {
      whisper(`- skipping ${chalk.green(source)} as source remains unchanged.`);
    } else {
      log(
        `- the source ${chalk.green(source)} hasn't changed but some outputs are missing:`,
      );
      missing.forEach((m) => log(`    - ${chalk.dim(m)}`));

      for (const i of missing) {
        if (isBlurredImage(i)) {
          sharp.blurredPreImage(i, options.output, BLURRED_SIZE);
        }

        if (isSizedImage(i)) {
          const size = Number(stripAfter(stripBefore(i, "-"), "."));
          sharp.resizeImage(filepath);
        }
      }
    }
  }
};
