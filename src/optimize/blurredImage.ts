import type { Sharp } from "sharp";
import { ConfigFor } from "src/types";
import { getOutputOptions, log } from "src/utils";

export const blurredImage = (
  sharp: Sharp, //
  dest: string,
  config: ConfigFor,
) => {
  const [_, opt] = getOutputOptions(dest, config);

  return sharp
    .resize(config.blurSize)
    .blur(config.blurAmount)
    .toFormat("jpg")
    .jpeg(opt)
    .toFile(dest);
};
