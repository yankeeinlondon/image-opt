import { existsSync,  readFileSync,  statSync } from "fs";
import { CacheState, Hasher, ImageCache } from "../types/other-types";
import { CACHE_FILE } from "../constants";
import xxhash from "xxhash-wasm";
import { isImageCache } from "../types/type-guards";



let hasher: Hasher | null = null;
let cache: ImageCache | null = null;

const initializeHasher = async() => {
  const api = await xxhash();
  hasher = api.h32 as Hasher;
}

const hash = (content: string, seed?: number) => {
  if(hasher) {
    return hasher(content, seed);
  } else {
    throw new Error(`call to hash() made prior to initializing the hasher!`)
  }
}

/**
 * returns a reference to the cache as well as ensuring the
 * local variable is updated (when cache was non-present in memory
 * perviously)
 */
const getCache = (): ImageCache => {
  if (cache) {
    return cache;
  } else {
    if(existsSync(CACHE_FILE)) {
      const data = readFileSync(CACHE_FILE, "utf-8");
      try {
        const json = JSON.parse(data);
        if(isImageCache(json)) {
          cache = json;
          return json;
        } else {
          throw new Error(`the image cache appears to be malformed; try removing it and run again.`)
        }

      } catch(e) {
        throw new Error(`problem serializing the cache file; try removing it and run again.`)
      }
    } else {
      cache = {
        lastUpdated: Date.now(),
        items: {} // empty cache
      };
      return cache;
    }
  }
}

export const lookupHashInCache = (filepath: string): number | null => {
  const cache = getCache();

  if (filepath in cache.items) {
    return cache.items[filepath];
  } else {
    return null;
  }
}


/**
 * Checks for the "cache state" of a given filepath:
 * 
 * - `fresh`, `stale`, `missing`
 */

export const getCacheState = (filepath: string): CacheState => {
  if(existsSync(filepath)) {
    const cacheEntry = lookupHashInCache(filepath);
    if(cacheEntry) {
      const s = statSync(filepath);
  
      const hashContent = [
        String(s.size),
        String(s.blksize),
        String(s.atime)
      ].join("-");

      const current = hash(hashContent);
      if( current === cacheEntry ) {
        return "fresh";
      } 

      return "stale";
    }
    
    return "missing"

  } else {
    throw new Error(`source file ${filepath} does not exist!`)
  }
}
