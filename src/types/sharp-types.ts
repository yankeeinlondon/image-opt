import { AvifOptions, HeifOptions, JpegOptions, PngOptions, WebpOptions, Metadata } from "sharp";
import { INPUT_FILE_EXT, OUTPUT_FILE_EXT } from "../constants";
import { Narrowable, ObjectKey } from "inferred-types";


export interface SharpConfig {
  jpg?: JpegOptions;
  avif?: AvifOptions;
  webp?: WebpOptions;
  heif?: HeifOptions;
  png?: PngOptions;
}


export type InputFormat = typeof INPUT_FILE_EXT[number];
export type OutputFormat = typeof OUTPUT_FILE_EXT[number];



export type InputFile = `${string}.${InputFormat}`;
export type OutputFile = `${string}.${OutputFormat}`;


export type SharpMetadata =  Metadata & Record<ObjectKey,Narrowable>;


