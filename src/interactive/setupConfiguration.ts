import { shout } from "src/utils";
import {
  getCoreDefaults,
  getSourceGlobAndConfirmNoOverrides,
  startWithSharpDefaults,
} from "./questions";
import chalk from "chalk";
import { ConfigFile } from "src/types";
import { CONFIG_FILE, SHARP_DEFAULTS_FOR_IMAGE_FORMATS } from "src/constants";
import { saveConfig } from "src/cache/config";

export const setupConfiguration = async () => {
  shout(chalk.bold`\nInteractive Configuration Setup`);
  shout(chalk.bold`-------------------------------\n`);
  shout(`First step is to setup your "defaults" for:`);
  shout(`  - image ${chalk.italic("formats")}.`);
  shout(`  - image ${chalk.italic("sizes")}.`);
  shout(`  - image ${chalk.italic("meta data")}.`);
  shout(
    `  - image ${chalk.italic("conversion to")} ${chalk.bold("P3")} (in addition to ${chalk.bold("sRGB")})`,
  );
  shout();
  const defaultValues: ConfigFile["defaults"] = await getCoreDefaults.start({
    perFormatOptions: {},
    useInterlaced: true,
    density: 300,
  });

  shout(`\n\nGreat! we've got a lot of the important defaults set now.\n`);
  shout(
    `- when we convert/optimize images we use the fantastic ${chalk.bold.blue("Sharp")} library`,
  );
  shout(
    `- it is super fast and has really good "defaults" for each output image format`,
  );
  shout(
    `- in 99% of cases we recommend you start with these defaults as ${chalk.italic("your")} starting point`,
  );
  shout(
    `- if you agree to this as a starting point, we'll add ${chalk.italic("explicit")} references to these defaults`,
  );
  shout(
    `  in your configuration file so you can more clearly understand the settings and modify it later.`,
  );
  shout();

  const ok = (await startWithSharpDefaults()).ok;

  if (ok) {
    defaultValues.perFormatOptions = SHARP_DEFAULTS_FOR_IMAGE_FORMATS;
  }

  shout();
  shout(chalk.bold(`Source Rules`));
  shout(chalk.bold(`------------`));
  shout();
  shout(
    `We are now done with default values but we must have at least one SOURCE configuration`,
  );
  shout(
    `- a ${chalk.italic("source configuration")} is responsible for two things:`,
  );
  shout();
  shout(
    `  1. it must always specify the ${chalk.bold("source files")} with a ${chalk.italic("glob expression")}.`,
  );
  shout(
    `  2. it optionaly can ${chalk.italic(`override`)} any of the defaults which were setup`,
  );
  shout();

  const source = await getSourceGlobAndConfirmNoOverrides.start();

  if (source.noOverrides) {
    saveConfig({ defaults: defaultValues, sources: [{ glob: source.glob }] });
  }

  shout();
  shout(chalk.bold(`🚀 Configured!!!!`));
  shout(chalk.bold(`-----------------`));
  shout();
  shout(
    `- you can review and/or modify your configuration at ${chalk.blue(CONFIG_FILE)} whenever you like`,
  );
};
