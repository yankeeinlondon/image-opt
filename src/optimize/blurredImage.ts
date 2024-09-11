import sharp from "sharp";
import { BLURRED_SIZE } from "src/constants";
import { ConfigFor } from "src/types";
import { getOutputOptions } from "src/utils";

export const blurredImage = (src: string, dest: string, config: ConfigFor) => {
  const [_, opt] = getOutputOptions(dest, config);
  return sharp(src).resize(BLURRED_SIZE).blur().jpeg(opt).toFile(dest);
};
