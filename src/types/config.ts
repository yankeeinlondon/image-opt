import { Stats } from "fs";
import { MetaPolicy } from "./meta";
import { OutputFormat, PerFormatOptions } from "./sharp-types";

/**
 * A source image configuration.
 *
 * - only required property is a `glob` pattern to identify source files
 * - _optionally_ you can override any of the default values in the configuration
 */
export type SourceConfig = {
  /** glob pattern to identify which source images to use */
  glob: string;
  formats?: OutputFormat[] | undefined;
  perFormatOptions?: PerFormatOptions | undefined;
  useP3?: boolean;
  sizes?: number[] | undefined;
  metaPolicy?: MetaPolicy | undefined;
  /**
   * - the amount to blur the initial "blurred" image.
   * - the value can between between 0.3 and 1000.
   *
   * The default value is `5`
   */
  blurAmount?: number;

  /**
   * The _size_ (in width-based pixels) of the _blurred_ image.
   *
   * - the default is `128` pixels.
   */
  blurSize?: number;

  outputDirectory?: string;
};

/**
 * **ConfigFile**
 *
 * The structure of the configuration file for `image-opt`.
 *
 * - Consists of two parts:
 *
 *     1. **Defaults** - the default optimization parameters
 *     2. **Source Configs** - one or more source configs to identify the
 * source images which need optimization
 */
export type ConfigFile = {
  defaults: {
    /**
     * the _default_ image formats to optimize to
     */
    formats: OutputFormat[];

    perFormatOptions: PerFormatOptions;
    /**
     * the _default_ sizes for a source image to be optimized for
     *
     * **Note:** the _size_ is a measurement of the image _width_ in pixels
     */
    sizes: number[];

    /**
     * the _default_ policy for bringing metadata into the optimized images
     *
     * @default remove
     */
    metaPolicy: MetaPolicy;

    /**
     * - the amount to blur the initial "blurred" image.
     * - the value can between between 0.3 and 1000.
     *
     * @default 5
     */
    blurAmount?: number;

    /**
     * The _size_ (in width-based pixels) of the _blurred_ image.
     *
     * @default 128
     */
    blurSize?: number;

    /**
     * the _default_ stance on whether **P3** colorspaced images should be produced
     * alongside **sRGB** image.
     *
     * @default false
     */
    useP3: boolean;

    /**
     * the _default_ stance on whether optimized images should be saved in "interlaced"
     * format or not.
     *
     * **Note:** generally interlaced images present to the user in a way which feels more
     * performant (aka, slowly increasing resolution versus top-to-bottom).
     *
     * @default true
     */
    useInterlaced: boolean;

    /**
     * The _default_ DPI density which the image expresses.
     *
     * **Note:** this has nothing to do with **PPI** which is what most people think about
     * on the web but still provides useful metadata to some printing processes.
     *
     * @default 300
     */
    density: number;

    /**
     * the _default_ output directory to save optimized images to
     */
    outputDirectory: string;
  };

  /**
   * Sources are glob patterns which will identify source images
   * which you want to optimize.
   */
  sources: SourceConfig[];
};

export type ConfigFor = {
  /**
   * the glob pattern used by source rule to identify source images
   */
  glob: string;
  /** the image formats to convert to */
  formats: ConfigFile["defaults"]["formats"];
  /** the image sizes to convert to */
  sizes: ConfigFile["defaults"]["sizes"];
  /** whether additional images targetting P3 colorspace should be created */
  useP3: ConfigFile["defaults"]["useP3"];
  /** the base _output directory_ to put optimized images */
  outputDirectory: ConfigFile["defaults"]["outputDirectory"];

  /** the pixel width of the blurred image */
  blurSize: number;
  /** the blur amount (between 0.3 and 1000) */
  blurAmount: number;

  /**
   * the metadata policy for optimized image
   */
  metaPolicy: MetaPolicy;
  /**
   * the _per-image-format_ settings for the conversion
   */
  perFormatOptions: PerFormatOptions;

  /**
   * a function which will provide file based characterisics for a source image
   * which was identified by the source rule being conveyed.
   */
  sourceFile: (file: string) => {
    /** the image filename without path or extension */
    baseFile: string;
    /**
     * the directory offset coming from the source image which should be
     * applied to the destination as an offset to the base output directory
     */
    dirOffset: string;
    /**
     * the file stats of the source image
     */
    sourceStats: Stats;
  };
};
