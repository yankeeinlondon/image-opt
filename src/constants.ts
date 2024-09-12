import { PerFormatOptions } from "./types";

export const INPUT_FILE_EXT = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "tiff",
] as const;

export const OUTPUT_FILE_EXT = [
  "jpg",
  "jxl",
  "png",
  "webp",
  "avif",
  "gif",
  "heif",
] as const;

export const CACHE_FILE = `.img-cache.json` as const;
export const CONFIG_FILE = `.img-config.json` as const;

export const BLURRED_SIZE = 128;
export const BLURRED_AMOUNT = 5;

export const SHARP_DEFAULTS_FOR_IMAGE_FORMATS = {
  jpg: {
    chromaSubsampling: "4:2:0",
    force: true,
    mozjpeg: false,
    optimizeCoding: true,
    optimizeScans: false,
    overshootDeringing: false,
    quality: 80,
    quantizationTable: 0,
    trellisQuantisation: false,
  },
  png: {
    adaptiveFiltering: false,
    colors: 256,
    compressionLevel: 6,
    dither: 1.0,
    effort: 7,
    force: true,
    palette: false,
    quality: 100,
  },
  avif: {
    bitdepth: 8,
    chromaSubsampling: "4:4:4",
    effort: 4,
    force: true,
    lossless: false,
    quality: 50,
  },
  webp: {
    alphaQuality: 100,
    delay: undefined,
    effort: 4,
    force: true,
    loop: 0,
    lossless: false,
    minSize: false,
    mixed: false,
    nearLossless: false,
    preset: "default",
    quality: 80,
    smartSubsample: false,
  },
  jxl: {
    decodingTier: 0,
    distance: 1.0,
    effort: 7,
    force: true,
    lossless: false,
    quality: undefined,
  },
  gif: {
    colors: 256,
    delay: undefined,
    dither: 1.0,
    force: true,
    interFrameMaxError: 0,
    interPaletteMaxError: 3,
    reuse: undefined,
  },
  heif: {
    bitdepth: 8,
    chromaSubsampling: "4:4:4",
    compression: "av1",
    effort: 4,
    force: true,
    lossless: false,
    quality: 50,
  },
  tiff: {
    bitdepth: 8,
    compression: "jpeg",
    force: true,
    miniswhite: false,
    predictor: "horizontal",
    pyramid: false,
    quality: 80,
    resolutionUnit: "inch",
    tile: false,
    tileHeight: 256,
    tileWidth: 256,
    xres: 1.0,
    yres: 1.0,
  },
} as const satisfies PerFormatOptions;
