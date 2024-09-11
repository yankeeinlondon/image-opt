import {
  AvifOptions,
  HeifOptions,
  JpegOptions,
  PngOptions,
  WebpOptions,
  Metadata,
  JxlOptions,
  GifOptions,
  TiffOptions,
} from "sharp";
import { INPUT_FILE_EXT, OUTPUT_FILE_EXT } from "../constants";
import { Narrowable, ObjectKey } from "inferred-types";

/**
 * Options on a _per_-format basis.
 */
export interface PerFormatOptions {
  jpg?: JpegOptions;
  avif?: AvifOptions;
  webp?: WebpOptions;
  heif?: HeifOptions;
  png?: PngOptions;
  jxl?: JxlOptions;
  gif?: GifOptions;
  tiff?: TiffOptions;
}

export type InputFormat = (typeof INPUT_FILE_EXT)[number];
export type OutputFormat = (typeof OUTPUT_FILE_EXT)[number];

export type InputFile = `${string}.${InputFormat}`;
export type OutputFile = `${string}.${OutputFormat}`;

export type SharpMetadata = Metadata & Record<ObjectKey, Narrowable>;
