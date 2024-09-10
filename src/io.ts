import { isCommand } from "src/types";

import { setVerbosity } from "src/utils";
import {
  AsOption,
  create_cli,
  info_command,
  optimize_command,
  show_help,
} from "./cli";

const [cmd, cli] = create_cli();

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
      const opt = cli as AsOption<null>;
      setVerbosity(opt.quiet ? "quiet" : opt.verbose ? "verbose" : "normal");
      switch (cmd) {
        case "info":
          await info_command(cli as AsOption<"info">);
          break;
        case "optimize":
          await optimize_command(cli as AsOption<"optimize">);
          break;
      }
    }
  }
}
