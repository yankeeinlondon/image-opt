import sharp from "sharp";
import { ConfigFor, OptimizationKind } from "src/types";
import { fileWithoutExt, getOutputOptions } from "src/utils";

export const convertSizeAndFormat = (
  src: string,
  dest: string,
  kind: OptimizationKind,
  config: ConfigFor,
) => {
  const [fmt, opt] = getOutputOptions(dest, config);
  const size =
    kind === "p3"
      ? Number(fileWithoutExt(dest).replace("-p3", "").replace(/.*\-/, ""))
      : Number(fileWithoutExt(dest).replace(/.*\-/, ""));

  switch (fmt) {
    case "jpg":
      return sharp(src).jpeg(opt).resize(size).toFile(dest);
    case "jxl":
      return sharp(src).jxl(opt).resize(size).toFile(dest);
    case "png":
      return sharp(src).png(opt).resize(size).toFile(dest);
    case "webp":
      return sharp(src).webp(opt).resize(size).toFile(dest);
    case "avif":
      return sharp(src).avif(opt).resize(size).toFile(dest);
    case "gif":
      return sharp(src).gif(opt).resize(size).toFile(dest);
    case "heif":
      return sharp(src).heif(opt).resize(size).toFile(dest);
    default:
      throw new Error(`invalid image format for optimized image: ${dest}`);
  }
};
