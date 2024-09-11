import { ask, survey } from "@yankeeinlondon/ask";

export const defaultImageFormats = ask.checkbox(
  "formats",
  "What image format's would you like to export?",
  {
    JPEG: "jpg",
    GIF: "gif",
    AVIF: "avif",
    WebP: "webp",
    HEIF: "heif",
    "JPEG XL": "jxl",
  },
  {
    default: ["jpg", "avif", "webp", "jxl"],
  },
);

export const defaultImageSizes = ask.checkbox(
  "sizes",
  "What image sizes should be the 'default' image sizes we'll scale the source images to when optimizing? Units represent pixels and are meant to match the image width not height.",
  [64, 128, 256, 512, 768, 1024, 1200, 1600, 2400],
  {
    default: [512, 768, 1024, 1200, 1600],
  },
);

export const defaultMetaPolicy = ask.select(
  "metaPolicy",
  "What would you like your default policy to be regarding metadata in source images being preserved into optimized images?",
  {
    "Remove all metadata": "remove",
    "Keep all metadata": "keep",
    // "Choose policy on specific properties": "custom",
  },
  {
    default: "remove",
  },
);

export const useP3Images = ask.confirm(
  "useP3",
  "Do you want to produce P3 colorspaced images (in addition to sRGB images)?",
);

export const defaultOutputDir = ask.input(
  "outputDirectory",
  "What should be the default output directory for optimized images?",
  {
    default: "public",
  },
);

export const startWithSharpDefaults = ask.confirm(
  "ok",
  "Are you ok to use Sharp's defaults as a starting point for your defaults?",
);

export const sourceGlob = ask.input(
  "glob",
  "Each 'source rule' in your configuration will have a 'glob pattern' to identify the files it includes as source images. You need at least one rule to have Image Opt make any optimizations so let's setup that glob patterns now.",
  {
    default: "design-assets/**/*.{jpg,png,tiff}",
  },
);

export const confirmNoOverrides = ask.confirm(
  "noOverrides",
  "Can we keep your default configuration for this source for now?",
);

export const sourceFormats = ask
  .withRequirements({ formats: "Array<string(jpg,gif,avif,webp,heif,jxl)>" })
  .checkbox(
    "sourceFormats",
    "What image format's would you like to export for this rule (your default chosen earlier is the default for now):",
    {
      JPEG: "jpg",
      GIF: "gif",
      AVIF: "avif",
      WebP: "webp",
      HEIF: "heif",
      "JPEG XL": "jxl",
    },
    {
      default: (a) => a.formats,
    },
  );

export const sourceImageSizes = ask
  .withRequirements({
    sizes: "Array<number(64,128,256,768,1024,1200,1600,2400)>",
  })
  .checkbox(
    "sourceSize",
    "What optimized image sizes should be produced for this rule?",
    [64, 128, 256, 512, 768, 1024, 1200, 1600, 2400],
    {
      default: (a) => a.sizes,
    },
  );

export const sourceMetaPolicy = ask
  .withRequirements({ defaultMetaPolicy: "string(remove,keep,custom)" })
  .select(
    "sourceMetaPolicy",
    "What metadata policy should we use when producing opimized image using this source rule??",
    {
      "Remove all metadata": "remove",
      "Keep all metadata": "keep",
      "Choose policy on specific properties": "custom",
    },
    {
      default: (a) => a.defaultMetaPolicy,
    },
  );

/**
 * Asks the user for all "core" defaults before asking if other defaults are ok to keep
 * in line with what Sharp provides.
 */
export const getCoreDefaults = survey(
  defaultImageFormats,
  defaultImageSizes,
  defaultMetaPolicy,
  useP3Images,
  defaultOutputDir,
);

export const getSourceGlobAndConfirmNoOverrides = survey(
  sourceGlob,
  confirmNoOverrides,
);
