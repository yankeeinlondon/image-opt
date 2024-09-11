import sharp from "sharp";
import { ConfigFor } from "src/types";
import { getOutputOptions } from "src/utils";

export const originalSize = (src: string, dest: string, config: ConfigFor) => {
  const [fmt, opt] = getOutputOptions(dest, config);

  switch (fmt) {
    case "jpg":
      return sharp(src).jpeg(opt).toFile(dest);
    case "jxl":
      return sharp(src).jxl(opt).toFile(dest);
    case "png":
      return sharp(src).png(opt).toFile(dest);
    case "webp":
      return sharp(src).webp(opt).toFile(dest);
    case "avif":
      return sharp(src).avif(opt).toFile(dest);
    case "gif":
      return sharp(src).gif(opt).toFile(dest);
    case "heif":
      return sharp(src).heif(opt).toFile(dest);
    default:
      throw new Error(`invalid image format for optimized image: ${dest}`);
  }
};
