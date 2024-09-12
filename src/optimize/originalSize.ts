import { Sharp } from "sharp";
import { ConfigFor } from "src/types";
import { getOutputOptions } from "src/utils";

export const originalSize = (sharp: Sharp, dest: string, config: ConfigFor) => {
  const [fmt, opt] = getOutputOptions(dest, config);

  if (config.metaPolicy === "keep") {
    sharp = sharp.keepMetadata();
  }

  if (dest.includes("-p3")) {
    sharp = sharp.toColorspace("p3").withIccProfile("p3");
  }

  switch (fmt) {
    case "jpg":
      return sharp.jpeg(opt).toFormat("jpg").toFile(dest);
    case "jxl":
      return sharp.jxl(opt).toFormat("jxl").toFile(dest);
    case "png":
      return sharp.png(opt).toFormat("png").toFile(dest);
    case "webp":
      return sharp.webp(opt).toFormat("webp").toFile(dest);
    case "avif":
      return sharp.avif(opt).toFormat("avif").toFile(dest);
    case "gif":
      return sharp.gif(opt).toFormat("gif").toFile(dest);
    case "heif":
      return sharp.heif(opt).toFormat("heif").toFile(dest);
    default:
      throw new Error(`invalid image format for optimized image: ${dest}`);
  }
};
