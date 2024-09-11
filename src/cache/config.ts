import { existsSync, readFileSync, writeFileSync } from "fs";
import { CONFIG_FILE } from "src/constants";
import { ConfigFile, isConfigFile } from "src/types";
import { log } from "src/utils";

let config: ConfigFile | null = null;

/**
 * Test whether a configuration file is found
 */
export const hasConfigFile = (): boolean => {
  return existsSync(CONFIG_FILE);
};

/**
 * Gets the configuration file if possible and throwzs an error otherwise;
 * if the operation is successful it not only returns the configuration but
 * sets the managed `config` so that other operations will be able to use it.
 */
export const getConfigFile = (): ConfigFile => {
  if (hasConfigFile()) {
    const data = readFileSync(CONFIG_FILE, "utf8");
    try {
      const c = JSON.parse(data);
      if (isConfigFile(c)) {
        config = c;
        return c;
      } else {
        throw new Error(
          `The configuration file at "${CONFIG_FILE}" appears to be damaged and can not be used.`,
        );
      }
    } catch (e) {
      throw new Error(
        `The configuration file at "${CONFIG_FILE}" was not able to parsed and therefore can not be used!`,
      );
    }
  } else {
    throw new Error(
      `Call to getConfigFile() when no configuration file exists!`,
    );
  }
};

/**
 * saves the configuration to file and ensures the locally managed in-memory
 * version is up-to-date.
 */
export const saveConfig = (cfg: ConfigFile) => {
  writeFileSync(CONFIG_FILE, JSON.stringify(cfg), "utf8");
  config = cfg;
};
