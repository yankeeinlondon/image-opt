import { Sharp } from "sharp";
import { ConfigFor, OptimizationKind } from "src/types";
import { fileWithoutExt, getOutputOptions, shout } from "src/utils";

export const convertSizeAndFormat = (
  sharp: Sharp,
  dest: string,
  kind: OptimizationKind,
  config: ConfigFor,
) => {
  const [fmt, opt] = getOutputOptions(dest, config);
  const size =
    kind === "p3"
      ? Number(fileWithoutExt(dest).replace("-p3", "").replace(/.*\-/, ""))
      : Number(fileWithoutExt(dest).replace(/.*\-/, ""));

  if (isNaN(size)) {
    shout(
      `- The size value for image "${dest}" is malformed:`,
      fileWithoutExt(dest).replace(/.*\-/, ""),
    );
    process.exit(1);
  }

  if (config.metaPolicy === "keep") {
    sharp = sharp.keepMetadata();
  }

  if (dest.includes("-p3")) {
    sharp = sharp.withIccProfile("p3");
  }

  sharp = sharp.resize({
    width: size,
    withoutEnlargement: true,
  });

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
