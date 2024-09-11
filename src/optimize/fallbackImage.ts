import sharp from "sharp";
import { ConfigFor } from "src/types";
import { getOutputOptions } from "src/utils";

export const fallbackImage = (src: string, dest: string, config: ConfigFor) => {
  const [_, opt] = getOutputOptions(dest, config);
  return sharp(src).jpeg(opt).toFile(dest);
};
