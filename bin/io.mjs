// src/types/type-guards.ts
import { isObject, isString } from "inferred-types";

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
var info_command = async (opt) => {
  log("info");
};

// src/cli/optimize_command.ts
var optimize_command = async (opt) => {
  log("optimize");
};

// src/cli/show_help.ts
import commandLineUsage from "command-line-usage";
import chalk2 from "chalk";
var sections = (cmd2) => [
  {
    header: "Image Opt",
    content: "Prepare your source images for the web."
  },
  {
    header: `Syntax`,
    content: isCommand(cmd2) ? `${chalk2.bold("io")} ${cmd2} ${chalk2.dim(`[ ${chalk2.italic("options")} ]`)}

${command_descriptions[cmd2] || ""}` : `${chalk2.bold("io")} [ ${chalk2.dim(commands_union)} ] ${chalk2.dim(`[ ${chalk2.italic("options")} ]`)}

      Choose a command from those listed above and add ${chalk2.bold("--help")} for
      more info.`
  },
  isCommand(cmd2) ? {} : {
    header: "Commands:",
    content: Object.keys(command_descriptions).map((k) => {
      const desc = command_descriptions[k];
      return `${chalk2.bold(k)}: ${chalk2.dim(desc)}`;
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