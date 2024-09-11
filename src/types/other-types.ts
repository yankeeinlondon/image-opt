import type xxhash from "xxhash-wasm";
export type Hasher = Awaited<ReturnType<typeof xxhash>>["h32"];

export type LogVerbosity = "quiet" | "normal" | "verbose";

export type ImageCache = {
  lastUpdated: number;
  /**
   * Dictionary who's keys are filepaths to source images
   * and the value is a hash of the file's size and atime.
   */
  items: Record<string, number>;
};

export type CacheState = "missing" | "fresh" | "stale";
