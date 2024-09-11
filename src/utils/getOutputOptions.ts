import { ConfigFor, OutputFormat } from "src/types";

export const getOutputOptions = (
  file: string,
  config: ConfigFor,
): [OutputFormat, ConfigFor["perFormatOptions"][OutputFormat]] => {
  const ext = file.split(/\./).pop() as OutputFormat;

  switch (ext) {
    case "jpg":
      return [ext, config.perFormatOptions.jpg];
    case "jxl":
      return [ext, config.perFormatOptions.jxl];
    case "png":
      return [ext, config.perFormatOptions.png];
    case "avif":
      return [ext, config.perFormatOptions.avif];
    case "gif":
      return [ext, config.perFormatOptions.gif];
    case "heif":
      return [ext, config.perFormatOptions.heif];
    case "webp":
      return [ext, config.perFormatOptions.webp];
  }
};
