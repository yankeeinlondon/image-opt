import { getSourceOutputs, log, removePath, shout } from "src/utils";
import { AsOption } from "./cli-types";
import chalk from "chalk";
import { CONFIG_FILE } from "src/constants";
import { exit } from "process";
import { getConfigFile, hasConfigFile } from "src/cache";
import { sourceImages } from "src/utils/sourceImages";
import { isDefined } from "inferred-types";

export const info_command = async (_opt: AsOption<"info">) => {
  log("info");

  if (!hasConfigFile()) {
    shout("- 🙀 no configuration file found; this repo is not initialized.");
    shout(
      `- run ${chalk.blue("io optimize")} for an interactive configuration`,
    );
    shout(
      `- alternatively you can add a config file manually at ${chalk.blue(`./${CONFIG_FILE}`)}`,
    );
    shout();
    exit();
  }

  shout();
  shout(chalk.bold(`Image Optimization: INFO`));
  shout(chalk.bold(`------------------------`));
  const config = getConfigFile();
  const sources = config.sources.map((s) => ({
    ...s,
    sourceImages: sourceImages(s.glob),
  }));
  const sourceImageCount = sources.reduce(
    (total, i) => i.sourceImages.length + total,
    0,
  );

  shout(
    `- you have ${chalk.bold.yellow(config.sources.length)} source(${chalk.italic.dim("s")}) configured`,
  );
  shout(
    `- in aggregate these source(${chalk.italic.dim("s")}) identify ${chalk.bold.yellow(sourceImageCount)} source images`,
  );
  shout();
  for (const source of sources) {
    for (const img of source.sourceImages) {
      let formats = (source.formats || config.defaults.formats)
        .map((i) => chalk.dim(i))
        .join(", ");
      let sizes = (source.sizes || config.defaults.sizes)
        .map((i) => chalk.dim(i))
        .join(", ");
      let p3 = (isDefined(source.useP3) ? source.useP3 : config.defaults.useP3)
        ? `, P3 included`
        : "";
      let outputs = getSourceOutputs(img, source);
      let existingOutputCount = outputs.filter((f) => f.exists);
      let fresh = existingOutputCount.filter((f) => f.fresh);

      shout(
        chalk.bold(`- ${removePath(img)}: `) + `[${formats}] x [${sizes}]${p3}`,
      );

      shout(
        `    - produces ${chalk.bold.yellow(outputs.length)} optimized image variants`,
      );
      if (existingOutputCount.length === 0) {
        shout(`    - 😬 none of the optimized images exist currently`);
      } else if (fresh.length === 0) {
        shout(
          `   - ${chalk.yellow(existingOutputCount.length)} already exist but NONE appear to be fresh 💩`,
        );
      } else if (fresh.length === outputs.length) {
        shout(
          `    - 🎉 all optimized images have been created and appear fresh`,
        );
      } else {
        shout(
          `    - ${chalk.green.bold(fresh.length)} optimized images appear to be fresh`,
        );
        shout(
          `    - ${chalk.yellow(existingOutputCount.length - fresh.length)} appear to be stale and will need to be redone`,
        );
        shout(
          `    - ${chalk.red(outputs.length - existingOutputCount.length)} optimized files do not yet exist`,
        );
      }
    }
  }
};
