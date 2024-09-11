// src/types/type-guards.ts
import { isArray, isObject, isString } from "inferred-types";

// src/constants.ts
var CONFIG_FILE = `.img-config.json`;
var SHARP_DEFAULTS_FOR_IMAGE_FORMATS = {
  jpg: {
    chromaSubsampling: "4:2:0",
    force: true,
    mozjpeg: false,
    optimizeCoding: true,
    optimizeScans: false,
    overshootDeringing: false,
    quality: 80,
    quantizationTable: 0,
    trellisQuantisation: false
  },
  png: {
    adaptiveFiltering: false,
    colors: 256,
    compressionLevel: 6,
    dither: 1,
    effort: 7,
    force: true,
    palette: false,
    quality: 100
  },
  avif: {
    bitdepth: 8,
    chromaSubsampling: "4:4:4",
    effort: 4,
    force: true,
    lossless: false,
    quality: 50
  },
  webp: {
    alphaQuality: 100,
    delay: void 0,
    effort: 4,
    force: true,
    loop: 0,
    lossless: false,
    minSize: false,
    mixed: false,
    nearLossless: false,
    preset: "default",
    quality: 80,
    smartSubsample: false
  },
  jxl: {
    decodingTier: 0,
    distance: 1,
    effort: 7,
    force: true,
    lossless: false,
    quality: void 0
  },
  gif: {
    colors: 256,
    delay: void 0,
    dither: 1,
    force: true,
    interFrameMaxError: 0,
    interPaletteMaxError: 3,
    reuse: void 0
  },
  heif: {
    bitdepth: 8,
    chromaSubsampling: "4:4:4",
    compression: "av1",
    effort: 4,
    force: true,
    lossless: false,
    quality: 50
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
    xres: 1,
    yres: 1
  }
};

// src/cli/options.ts
import chalk from "chalk";
var CMD = { name: "cmd", type: String, defaultOption: true, multiple: false };
var command_options = {
  info: [
    CMD,
    {
      name: "filter",
      type: String,
      alias: "f",
      multiple: true,
      typeLabel: chalk.underline("substr[]"),
      description: `only report on symbols which match filter string`
    },
    {
      name: "clear",
      defaultValue: false,
      type: Boolean,
      description: `clear the cache and rebuild fully`
    }
  ],
  optimize: [CMD]
};
var commands_union = Object.keys(command_options).join(
  `${chalk.gray(" | ")}`
);
var global_options = [
  {
    name: "quiet",
    alias: "q",
    defaultValue: false,
    type: Boolean,
    description: `quiet stdout output to a minimum`
  },
  {
    name: "verbose",
    type: Boolean,
    alias: "v",
    defaultValue: false,
    description: `more verbose output when analyzing`
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    defaultValue: false,
    description: `this help menu`
  }
];
var command_descriptions = {
  info: `provides an overview of the various source patterns defined, how many source images there are, current state of cache, etc.`,
  optimize: `runs the optimization over all images, leveraging the cache to avoid unnecessary work unless instructed to otherwise`
};

// src/types/type-guards.ts
var isCommand = (val) => {
  return isString(val) && Object.keys(command_options).includes(val);
};
var isConfigFile = (val) => {
  return isObject(val) && "defaults" in val && "sources" in val && isObject(val.defaults) && isArray(val.sources);
};

// src/utils/logging.ts
var verbosity = "normal";
var setVerbosity = (v) => {
  verbosity = v;
};
var log = (...things) => {
  if (verbosity !== "quiet") {
    console.log(...things);
  }
};
var shout = (...things) => {
  console.log(...things);
};

// src/utils/removePath.ts
var removePath = (filepath) => {
  const last = filepath.split(/[\/\\]/).pop();
  return last;
};

// src/utils/sourceImages.ts
import { globSync } from "fast-glob";
var sourceImages = (glob) => {
  const files = globSync(glob);
  return files;
};

// src/utils/fileWithoutExt.ts
var fileWithoutExt = (file) => removePath(file).replace(/\.\s*$/, "");

// node_modules/.pnpm/pathe@1.1.2/node_modules/pathe/dist/shared/pathe.ff20891b.mjs
var _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
var _UNC_REGEX = /^[/\\]{2}/;
var _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
var _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
var normalize = function(path2) {
  if (path2.length === 0) {
    return ".";
  }
  path2 = normalizeWindowsPath(path2);
  const isUNCPath = path2.match(_UNC_REGEX);
  const isPathAbsolute = isAbsolute(path2);
  const trailingSeparator = path2[path2.length - 1] === "/";
  path2 = normalizeString(path2, !isPathAbsolute);
  if (path2.length === 0) {
    if (isPathAbsolute) {
      return "/";
    }
    return trailingSeparator ? "./" : ".";
  }
  if (trailingSeparator) {
    path2 += "/";
  }
  if (_DRIVE_LETTER_RE.test(path2)) {
    path2 += "/";
  }
  if (isUNCPath) {
    if (!isPathAbsolute) {
      return `//./${path2}`;
    }
    return `//${path2}`;
  }
  return isPathAbsolute && !isAbsolute(path2) ? `/${path2}` : path2;
};
var join = function(...arguments_) {
  if (arguments_.length === 0) {
    return ".";
  }
  let joined;
  for (const argument of arguments_) {
    if (argument && argument.length > 0) {
      if (joined === void 0) {
        joined = argument;
      } else {
        joined += `/${argument}`;
      }
    }
  }
  if (joined === void 0) {
    return ".";
  }
  return normalize(joined.replace(/\/\/+/g, "/"));
};
function normalizeString(path2, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path2.length; ++index) {
    if (index < path2.length) {
      char = path2[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ;
      else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path2.slice(lastSlash + 1, index)}`;
        } else {
          res = path2.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
var isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
var dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

// src/utils/getSourceOutputs.ts
import { existsSync as existsSync2, statSync as statSync2 } from "fs";

// src/cache/cache.ts
import xxhash from "xxhash-wasm";

// src/cache/config.ts
import { existsSync, readFileSync, writeFileSync } from "fs";
var config = null;
var hasConfigFile = () => {
  return existsSync(CONFIG_FILE);
};
var getConfigFile = () => {
  if (hasConfigFile()) {
    const data = readFileSync(CONFIG_FILE, "utf8");
    try {
      const c = JSON.parse(data);
      if (isConfigFile(c)) {
        config = c;
        return c;
      } else {
        throw new Error(
          `The configuration file at "${CONFIG_FILE}" appears to be damaged and can not be used.`
        );
      }
    } catch (e) {
      throw new Error(
        `The configuration file at "${CONFIG_FILE}" was not able to parsed and therefore can not be used!`
      );
    }
  } else {
    throw new Error(
      `Call to getConfigFile() when no configuration file exists!`
    );
  }
};
var saveConfig = (cfg) => {
  writeFileSync(CONFIG_FILE, JSON.stringify(cfg), "utf8");
  config = cfg;
};

// src/utils/configFor.ts
import { statSync } from "node:fs";
var configFor = (source) => {
  const defaultConfig = getConfigFile().defaults;
  const formats = source?.formats ? source.formats : defaultConfig.formats;
  const sizes = source?.sizes ? source.sizes : defaultConfig.sizes;
  const useP3 = source?.useP3 ? source.useP3 : defaultConfig.useP3;
  const outputDirectory = source?.outputDirectory ? source.outputDirectory : defaultConfig.outputDirectory;
  return {
    /**
     * the glob pattern used by source rule to identify source images
     */
    glob: source.glob,
    /** the image formats to convert to */
    formats,
    /** the image sizes to convert to */
    sizes,
    /** whether additional images targetting P3 colorspace should be created */
    useP3,
    /** the base _output directory_ to put optimized images */
    outputDirectory,
    /**
     * a function which will provide file based characterisics for a source image
     * which was identified by the source rule being conveyed.
     */
    sourceFile: (file) => {
      const baseFile = fileWithoutExt(file);
      const dirOffset = dirname(file);
      const sourceStats = statSync(file);
      return {
        /** the image filename without path or extension */
        baseFile,
        /**
         * the directory offset coming from the source image which should be
         * applied to the destination as an offset to the base output directory
         */
        dirOffset,
        /**
         * the file stats of the source image
         */
        sourceStats
      };
    }
  };
};

// src/utils/getSourceOutputs.ts
var produceVariants = (file, dir, config2) => {
  let variants = [];
  const { formats, sizes, useP3 } = config2;
  variants.push(`${file}-blurred.jpg`);
  for (const format2 of formats) {
    const orig = `${file}-original-size.${format2}`;
    variants.push(join(dir, orig));
    for (const size of sizes) {
      const filename = `${file}-${size}.${format2}`;
      const filename_p3 = `${file}-${size}-p3.${format2}`;
      variants.push(join(dir, filename));
      if (useP3) {
        variants.push(join(dir, filename_p3));
      }
    }
  }
  return variants;
};
var getSourceOutputs = (source, sourceConfig) => {
  const config2 = configFor(sourceConfig);
  const { formats, sizes, useP3 } = config2;
  const { baseFile, dirOffset, sourceStats } = config2.sourceFile(source);
  const outputs = produceVariants(
    baseFile,
    join(config2.outputDirectory, dirOffset),
    {
      formats,
      sizes,
      useP3
    }
  );
  const withMeta = outputs.reduce((acc, key) => {
    const exists = existsSync2(key);
    return [
      ...acc,
      {
        source,
        sink: key,
        exists,
        fresh: exists && statSync2(key).mtimeMs > sourceStats.mtimeMs
      }
    ];
  }, []);
  return withMeta;
};

// src/cli/create_cli.ts
import commandLineArgs from "command-line-args";
var create_cli = () => {
  const argv = process.argv[2]?.split(" ") || [];
  const cmd_candidate = argv[0] || "not-command";
  return isCommand(cmd_candidate) ? [
    cmd_candidate,
    commandLineArgs(
      [...command_options[cmd_candidate], ...global_options],
      { stopAtFirstUnknown: true }
    )
  ] : [
    void 0,
    commandLineArgs(global_options, { stopAtFirstUnknown: true })
  ];
};

// src/cli/info_command.ts
import chalk2 from "chalk";
import { exit } from "process";
import { isDefined } from "inferred-types";
var info_command = async (_opt) => {
  log("info");
  if (!hasConfigFile()) {
    shout("- \u{1F640} no configuration file found; this repo is not initialized.");
    shout(
      `- run ${chalk2.blue("io optimize")} for an interactive configuration`
    );
    shout(
      `- alternatively you can add a config file manually at ${chalk2.blue(`./${CONFIG_FILE}`)}`
    );
    shout();
    exit();
  }
  shout();
  shout(chalk2.bold(`Image Optimization: INFO`));
  shout(chalk2.bold(`------------------------`));
  const config2 = getConfigFile();
  const sources = config2.sources.map((s) => ({
    ...s,
    sourceImages: sourceImages(s.glob)
  }));
  const sourceImageCount = sources.reduce(
    (total, i) => i.sourceImages.length + total,
    0
  );
  shout(
    `- you have ${chalk2.bold.yellow(config2.sources.length)} source(${chalk2.italic.dim("s")}) configured`
  );
  shout(
    `- in aggregate these source(${chalk2.italic.dim("s")}) identify ${chalk2.bold.yellow(sourceImageCount)} source images`
  );
  shout();
  for (const source of sources) {
    for (const img of source.sourceImages) {
      let formats = (source.formats || config2.defaults.formats).map((i) => chalk2.dim(i)).join(", ");
      let sizes = (source.sizes || config2.defaults.sizes).map((i) => chalk2.dim(i)).join(", ");
      let p3 = (isDefined(source.useP3) ? source.useP3 : config2.defaults.useP3) ? `, P3 included` : "";
      let outputs = getSourceOutputs(img, source);
      let existingOutputCount = outputs.filter((f) => f.exists);
      let fresh = existingOutputCount.filter((f) => f.fresh);
      shout(
        chalk2.bold(`- ${removePath(img)}: `) + `[${formats}] x [${sizes}]${p3}`
      );
      shout(
        `    - produces ${chalk2.bold.yellow(outputs.length)} optimized image variants`
      );
      if (existingOutputCount.length === 0) {
        shout(`    - \u{1F62C} none of the optimized images exist currently`);
      } else if (fresh.length === 0) {
        shout(
          `   - ${chalk2.yellow(existingOutputCount.length)} already exist but NONE appear to be fresh \u{1F4A9}`
        );
      } else if (fresh.length === outputs.length) {
        shout(
          `    - \u{1F389} all optimized images have been created and appear fresh`
        );
      } else {
        shout(
          `    - ${chalk2.green.bold(fresh.length)} optimized images appear to be fresh`
        );
        shout(
          `    - ${chalk2.yellow(existingOutputCount.length - fresh.length)} appear to be stale and will need to be redone`
        );
        shout(
          `    - ${chalk2.red(outputs.length - existingOutputCount.length)} optimized files do not yet exist`
        );
      }
    }
  }
};

// src/cli/optimize_command.ts
import chalk4 from "chalk";
import { ask as ask2 } from "@yankeeinlondon/ask";

// src/interactive/questions.ts
import { ask, survey } from "@yankeeinlondon/ask";
var defaultImageFormats = ask.checkbox(
  "formats",
  "What image format's would you like to export?",
  {
    JPEG: "jpg",
    GIF: "gif",
    AVIF: "avif",
    WebP: "webp",
    HEIF: "heif",
    "JPEG XL": "jxl"
  },
  {
    default: ["jpg", "avif", "webp", "jxl"]
  }
);
var defaultImageSizes = ask.checkbox(
  "sizes",
  "What image sizes should be the 'default' image sizes we'll scale the source images to when optimizing? Units represent pixels and are meant to match the image width not height.",
  [64, 128, 256, 512, 768, 1024, 1200, 1600, 2400],
  {
    default: [512, 768, 1024, 1200, 1600]
  }
);
var defaultMetaPolicy = ask.select(
  "metaPolicy",
  "What would you like your default policy to be regarding metadata in source images being preserved into optimized images?",
  {
    "Remove all metadata": "remove",
    "Keep all metadata": "keep"
    // "Choose policy on specific properties": "custom",
  },
  {
    default: "remove"
  }
);
var useP3Images = ask.confirm(
  "useP3",
  "Do you want to produce P3 colorspaced images (in addition to sRGB images)?"
);
var defaultOutputDir = ask.input(
  "outputDirectory",
  "What should be the default output directory for optimized images?",
  {
    default: "public"
  }
);
var startWithSharpDefaults = ask.confirm(
  "ok",
  "Are you ok to use Sharp's defaults as a starting point for your defaults?"
);
var sourceGlob = ask.input(
  "glob",
  "Each 'source rule' in your configuration will have a 'glob pattern' to identify the files it includes as source images. You need at least one rule to have Image Opt make any optimizations so let's setup that glob patterns now.",
  {
    default: "design-assets/**/*.{jpg,png,tiff}"
  }
);
var confirmNoOverrides = ask.confirm(
  "noOverrides",
  "Can we keep your default configuration for this source for now?"
);
var sourceFormats = ask.withRequirements({ formats: "Array<string(jpg,gif,avif,webp,heif,jxl)>" }).checkbox(
  "sourceFormats",
  "What image format's would you like to export for this rule (your default chosen earlier is the default for now):",
  {
    JPEG: "jpg",
    GIF: "gif",
    AVIF: "avif",
    WebP: "webp",
    HEIF: "heif",
    "JPEG XL": "jxl"
  },
  {
    default: (a) => a.formats
  }
);
var sourceImageSizes = ask.withRequirements({
  sizes: "Array<number(64,128,256,768,1024,1200,1600,2400)>"
}).checkbox(
  "sourceSize",
  "What optimized image sizes should be produced for this rule?",
  [64, 128, 256, 512, 768, 1024, 1200, 1600, 2400],
  {
    default: (a) => a.sizes
  }
);
var sourceMetaPolicy = ask.withRequirements({ defaultMetaPolicy: "string(remove,keep,custom)" }).select(
  "sourceMetaPolicy",
  "What metadata policy should we use when producing opimized image using this source rule??",
  {
    "Remove all metadata": "remove",
    "Keep all metadata": "keep",
    "Choose policy on specific properties": "custom"
  },
  {
    default: (a) => a.defaultMetaPolicy
  }
);
var getCoreDefaults = survey(
  defaultImageFormats,
  defaultImageSizes,
  defaultMetaPolicy,
  useP3Images,
  defaultOutputDir
);
var getSourceGlobAndConfirmNoOverrides = survey(
  sourceGlob,
  confirmNoOverrides
);

// src/interactive/setupConfiguration.ts
import chalk3 from "chalk";
var setupConfiguration = async () => {
  shout(chalk3.bold`\nInteractive Configuration Setup`);
  shout(chalk3.bold`-------------------------------\n`);
  shout(`First step is to setup your "defaults" for:`);
  shout(`  - image ${chalk3.italic("formats")}.`);
  shout(`  - image ${chalk3.italic("sizes")}.`);
  shout(`  - image ${chalk3.italic("meta data")}.`);
  shout(
    `  - image ${chalk3.italic("conversion to")} ${chalk3.bold("P3")} (in addition to ${chalk3.bold("sRGB")})`
  );
  shout();
  const defaultValues = await getCoreDefaults.start({
    perFormatOptions: {},
    useInterlaced: true,
    density: 300
  });
  shout(`

Great! we've got a lot of the important defaults set now.
`);
  shout(
    `- when we convert/optimize images we use the fantastic ${chalk3.bold.blue("Sharp")} library`
  );
  shout(
    `- it is super fast and has really good "defaults" for each output image format`
  );
  shout(
    `- in 99% of cases we recommend you start with these defaults as ${chalk3.italic("your")} starting point`
  );
  shout(
    `- if you agree to this as a starting point, we'll add ${chalk3.italic("explicit")} references to these defaults`
  );
  shout(
    `  in your configuration file so you can more clearly understand the settings and modify it later.`
  );
  shout();
  const ok = (await startWithSharpDefaults()).ok;
  if (ok) {
    defaultValues.perFormatOptions = SHARP_DEFAULTS_FOR_IMAGE_FORMATS;
  }
  shout();
  shout(chalk3.bold(`Source Rules`));
  shout(chalk3.bold(`------------`));
  shout();
  shout(
    `We are now done with default values but we must have at least one SOURCE configuration`
  );
  shout(
    `- a ${chalk3.italic("source configuration")} is responsible for two things:`
  );
  shout();
  shout(
    `  1. it must always specify the ${chalk3.bold("source files")} with a ${chalk3.italic("glob expression")}.`
  );
  shout(
    `  2. it optionaly can ${chalk3.italic(`override`)} any of the defaults which were setup`
  );
  shout();
  const source = await getSourceGlobAndConfirmNoOverrides.start();
  if (source.noOverrides) {
    saveConfig({ defaults: defaultValues, sources: [{ glob: source.glob }] });
  }
  shout();
  shout(chalk3.bold(`\u{1F680} Configured!!!!`));
  shout(chalk3.bold(`-----------------`));
  shout();
  shout(
    `- you can review and/or modify your configuration at ${chalk3.blue(CONFIG_FILE)} whenever you like`
  );
};

// src/cli/optimize_command.ts
import { exit as exit2 } from "process";
var optimize = async (opt) => {
};
var optimize_command = async (opt) => {
  if (!hasConfigFile()) {
    shout(
      `- \u{1FAE8} no configuration file currently exists for ${chalk4.bold("image-opt")}.
`
    );
    let cont = await ask2.confirm(
      "configure",
      "Shall we interactively configure now?"
    )();
    if (cont.configure) {
      await setupConfiguration();
      let opt2 = await ask2.confirm(
        "optimize",
        "Configuration is complete, shall we run optimization now?"
      )();
      if (!opt2.optimize) {
        log();
        exit2();
      }
    } else {
      log();
      exit2();
    }
  }
  await optimize(opt);
};

// src/cli/show_help.ts
import commandLineUsage from "command-line-usage";
import chalk5 from "chalk";
var sections = (cmd2) => [
  {
    header: "Image Opt",
    content: "Prepare your source images for the web."
  },
  {
    header: `Syntax`,
    content: isCommand(cmd2) ? `${chalk5.bold("io")} ${cmd2} ${chalk5.dim(`[ ${chalk5.italic("options")} ]`)}

${command_descriptions[cmd2] || ""}` : `${chalk5.bold("io")} [ ${chalk5.dim(commands_union)} ] ${chalk5.dim(`[ ${chalk5.italic("options")} ]`)}

      Choose a command from those listed above and add ${chalk5.bold("--help")} for
      more info.`
  },
  isCommand(cmd2) ? {} : {
    header: "Commands:",
    content: Object.keys(command_descriptions).map((k) => {
      const desc = command_descriptions[k];
      return `${chalk5.bold(k)}: ${chalk5.dim(desc)}`;
    }).join("\n")
  },
  {
    header: isCommand(cmd2) ? "Options" : "Global Options",
    optionList: isCommand(cmd2) ? [
      ...command_options[cmd2].filter((i) => i.name !== "cmd"),
      ...global_options
    ] : global_options
  }
];
var show_help = (cmd2) => {
  const usage = commandLineUsage(sections(cmd2));
  console.log(usage);
};

// src/io.ts
var [cmd, cli] = create_cli();
if (!cmd) {
  show_help();
  if (cli.help) {
    process.exit(0);
  } else {
    process.exit(1);
  }
} else {
  if (cli.help) {
    show_help(cmd);
    process.exit(0);
  } else {
    if (isCommand(cmd)) {
      const opt = cli;
      setVerbosity(opt.quiet ? "quiet" : opt.verbose ? "verbose" : "normal");
      switch (cmd) {
        case "info":
          await info_command(cli);
          break;
        case "optimize":
          await optimize_command(cli);
          break;
      }
    }
  }
}
//# sourceMappingURL=io.mjs.map