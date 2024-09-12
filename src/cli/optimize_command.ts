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
import { isThenable } from "inferred-types";

import { AsOption } from "./cli-types";
import { hasConfigFile } from "src/cache";
import chalk from "chalk";
import { ask } from "@yankeeinlondon/ask";
import { setupConfiguration } from "src/interactive/setupConfiguration";
import { exit } from "process";
import sharp from "sharp";
import { originalSize } from "src/optimize/originalSize";
import { createReadStream } from "fs";

const dot = <T>(thingy: T) => {
  if (isThenable(thingy)) {
    thingy.then(() => {
      process.stdout.write(chalk.yellowBright("."));
    });
  }

  return thingy;
};

const optimize = async (_opt: AsOption<"optimize">) => {
  const sourceRules = getSourceRules();

  for (const source of sourceRules) {
    const config = configFor(source);
    const images = sourceImages(source.glob);

    for (const image of images) {
      // SOURCE IMAGE STAGE
      const conversions: Promise<any>[] = [];
      let stream = sharp({ failOn: "none" });
      stream.setMaxListeners(75);
      if (config.metaPolicy === "keep") {
        stream = stream.keepMetadata();
      }
      const sinks = getSourceOutputs(image, source);
      // Create Pipeline

      for (const s of sinks) {
        if (s.fresh) {
          process.stdout.write(chalk.green("."));
        } else {
          switch (s.kind) {
            case "blurred":
              conversions.push(
                dot(blurredImage(stream.clone(), s.sink, config)),
              );
              break;
            case "fallback":
              conversions.push(
                dot(fallbackImage(stream.clone(), s.sink, config)),
              );
              break;
            case "original":
              conversions.push(
                dot(originalSize(stream.clone(), s.sink, config)),
              );
              break;
            default:
              conversions.push(
                dot(
                  convertSizeAndFormat(stream.clone(), s.sink, s.kind, config),
                ),
              );
          }
        }
      }
      createReadStream(image).pipe(stream);
      await Promise.all(conversions).catch((err) => {
        shout(
          `- ${chalk.red.bold("ERROR:")} problems optimizing variants of "${image}"! ${err}`,
        );

        exit(1);
      });
    }
  }

  shout();
  shout(`- 🎉 all optimized images created!`);
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
