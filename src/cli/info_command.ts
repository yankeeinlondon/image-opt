import { log } from "src/utils";
import { AsOption } from "./cli-types";

export const info_command = async (opt: AsOption<"info">) => {
  log("info");
};
