import commandLineUsage from "command-line-usage";
import { Command } from "./cli-types";
import { isCommand } from "src/types";
import chalk from "chalk";
import {
  command_descriptions,
  command_options,
  commands_union,
  global_options,
} from "./options";

export const sections = (cmd?: string) => [
  {
    header: "Image Opt",
    content: "Prepare your source images for the web.",
  },
  {
    header: `Syntax`,
    content: isCommand(cmd)
      ? `${chalk.bold("io")} ${cmd} ${chalk.dim(`[ ${chalk.italic("options")} ]`)}\n\n${command_descriptions[cmd] || ""}`
      : `${chalk.bold("io")} [ ${chalk.dim(commands_union)} ] ${chalk.dim(`[ ${chalk.italic("options")} ]`)}

      Choose a command from those listed above and add ${chalk.bold("--help")} for
      more info.`,
  },
  isCommand(cmd)
    ? {}
    : {
        header: "Commands:",
        content: Object.keys(command_descriptions)
          .map((k) => {
            const desc = command_descriptions[
              k as keyof typeof command_descriptions
            ] as string;
            return `${chalk.bold(k)}: ${chalk.dim(desc)}`;
          })
          .join("\n"),
      },
  {
    header: isCommand(cmd) ? "Options" : "Global Options",
    optionList: isCommand(cmd)
      ? [
          ...command_options[cmd].filter((i) => i.name !== "cmd"),
          ...global_options,
        ]
      : global_options,
  },
];

export const show_help = (cmd?: Command | undefined) => {
  const usage = commandLineUsage(sections(cmd));
  console.log(usage);
};
