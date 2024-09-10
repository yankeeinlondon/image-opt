import { LogVerbosity } from "../types/other-types";

let verbosity: LogVerbosity = "normal";

export const setVerbosity = (v: LogVerbosity) => {
  verbosity = v;
};

export const log = (...things: unknown[]) => {
  if (verbosity !== "quiet") {
    console.log(...things);
  }
};
/**
 * always log, even when user has specified `--quiet` flag
 */
export const shout = (...things: unknown[]) => {
  console.log(...things);
};

/**
 * log _only_ when verbosity is set to high
 */
export const whisper = (...things: unknown[]) => {
  if (verbosity === "verbose") {
    console.log(...things);
  }
};
