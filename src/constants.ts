
export const INPUT_FILE_EXT = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff"
] as const;

export const OUTPUT_FILE_EXT = [
  "jpg",
  "png",
  "webp",
  "avif",
  "gif",
  "heif"
] as const;


export const CACHE_FILE = `.img-cache.json` as const;
export const CONFIG_FILE = `.img-config.json` as const;

export const BLURRED_SIZE = 64;
