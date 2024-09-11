import {
  configFor,
  getSourceOutputs,
  getSourceRules,
  log,
  shout,
  sourceImages,
} from "src/utils";
import {
  blurredImage,
  convertSizeAndFormat,
  fallbackImage,
} from "src/optimize";

import { AsOption } from "./cli-types";
import { hasConfigFile } from "src/cache";
import chalk from "chalk";
import { ask } from "@yankeeinlondon/ask";
import { setupConfiguration } from "src/interactive/setupConfiguration";
import { exit } from "process";

const optimize = async (opt: AsOption<"optimize">) => {
  const sourceRules = getSourceRules();
  const convert: Promise<any>[] = [];
  for (const source of sourceRules) {
    const config = configFor(source);
    const images = sourceImages(source.glob);

    for (const image of images) {
      const sinks = getSourceOutputs(image, source);

      for (const s of sinks) {
        if (s.fresh) {
          process.stdout.write(chalk.green("."));
        } else {
          process.stdout.write(chalk.yellow("."));
          switch (s.kind) {
            case "blurred":
              convert.push(blurredImage(s.source, s.sink, config));
              break;
            case "fallback":
              convert.push(fallbackImage(s.source, s.sink, config));
              break;
            default:
              convert.push(convertSizeAndFormat(s.source, s.sink, config));
          }
        }
      }
    }
  }

  await Promise.all(convert);
  log("done");
};

export const optimize_command = async (opt: AsOption<"optimize">) => {
  if (!hasConfigFile()) {
    shout(
      `- 🫨 no configuration file currently exists for ${chalk.bold("image-opt")}.\n`,
    );
    let cont = await ask.confirm(
      "configure",
      "Shall we interactively configure now?",
    )();
    if (cont.configure) {
      await setupConfiguration();
      let opt = await ask.confirm(
        "optimize",
        "Configuration is complete, shall we run optimization now?",
      )();

      if (!opt.optimize) {
        log();
        exit();
      }
    } else {
      log();
      exit();
    }
  }

  await optimize(opt);
};
