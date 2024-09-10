import chalk from "chalk";
import { Option } from "./cli-types";

/** all commands receive their respective command as first param */
const CMD = { name: "cmd", type: String, defaultOption: true, multiple: false };

export const command_options = {
  info: [
    CMD,
    {
      name: "filter",
      type: String,
      alias: "f",
      multiple: true,
      typeLabel: chalk.underline("substr[]"),
      description: `only report on symbols which match filter string`,
    },
    {
      name: "clear",
      defaultValue: false,
      type: Boolean,
      description: `clear the cache and rebuild fully`,
    },
  ],
  optimize: [CMD],
} as const satisfies Record<string, Option[]>;

export const commands_union = Object.keys(command_options).join(
  `${chalk.gray(" | ")}`,
);

/**
 * options which are available to all commands
 */
export const global_options = [
  {
    name: "quiet",
    alias: "q",
    defaultValue: false,
    type: Boolean,
    description: `quiet stdout output to a minimum`,
  },
  {
    name: "verbose",
    type: Boolean,
    alias: "v",
    defaultValue: false,
    description: `more verbose output when analyzing`,
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    defaultValue: false,
    description: `this help menu`,
  },
] as const satisfies Option[];

/**
 * options which are available only when _no_ command is expressed
 */
export const only_global_options = [];

export const command_descriptions = {
  info: `provides an overview of the various source patterns defined, how many source images there are, current state of cache, etc.`,
  optimize: `runs the optimization over all images, leveraging the cache to avoid unnecessary work unless instructed to otherwise`,
} as const satisfies Record<keyof typeof command_options, string>;
