import { isArray, isObject, isString } from "inferred-types";
import { InputFormat } from "./sharp-types";
import { INPUT_FILE_EXT } from "../constants";
import { ImageCache } from "./other-types";
import { command_options } from "src/cli/options";
import { Command } from "src/cli/cli-types";
import { ConfigFile } from "./config";

export const isInputFormat = (filepath: unknown): filepath is InputFormat => {
  return (
    isString(filepath) && INPUT_FILE_EXT.some((ext) => filepath.endsWith(ext))
  );
};

export const isImageCache = (val: unknown): val is ImageCache => {
  return (
    isObject(val) &&
    "lastUpdated" in val &&
    "items" in val &&
    isObject(val.items)
  );
};

/**
 * type guard which checks whether the passed in value is a known command to CLI
 */
export const isCommand = (val: unknown): val is Command => {
  return isString(val) && Object.keys(command_options).includes(val as any);
};

export const isConfigFile = (val: unknown): val is ConfigFile => {
  return (
    isObject(val) &&
    "defaults" in val &&
    "sources" in val &&
    isObject(val.defaults) &&
    isArray(val.sources)
  );
};
