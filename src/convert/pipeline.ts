import chalk from "chalk";
import { shout } from "src/utils";
import { getConfig } from "src/utils/config";

export const pipeline = (files: string[]) => {
  const config = getConfig();

  if(!config) {
    shout(`- you have run the ${chalk.bold.yellow("Image Opt")} pipeline but don't\n  have a configuration yet. Shall we set this up now?`)
  }
}
