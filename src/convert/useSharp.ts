import { join } from "node:path";
import sharp, { OutputOptions } from "sharp";
import { SharpMetadata, PerFormatOptions } from "../types/sharp-types";
import { omit } from "inferred-types";

export function useSimd() {
  sharp.simd(true);
}

function outFilename(
  dir: string,
  name: string,
  width: number,
  format: SharpImageFormat,
) {
  return join(dir, `${name}-${width}.${format}`);
}

/**
 * Do image transforms with the [Sharp](https://sharp.pixelplumbing.com/) library.
 */
export function useSharp<T extends PerFormatOptions>(options: T) {
  const o: PerFormatOptions = {
    simd: true,
    jpg: {
      quality: 60,
      mozjpeg: true,
      progressive: true,
    },
    avif: {
      quality: 30,
    },
    webp: {
      quality: 40,
    },
    heif: {
      quality: 60,
    },
    ...options,
  };

  if (o.simd) {
    const result = sharp.simd();
    if (!result) {
      console.log(
        `- Sharp attempted to establish use of simd acceleration but hardware platform did not allow it.`,
      );
    }
  }

  const api = {
    /**
     * Convert any support image format to any format in a different size. Aspect ratio is maintained.
     */
    resizeImage: async (
      image: string,
      outDir: string,
      width: number,
      format: SharpImageFormat,
      options: OutputOptions = {},
    ): Promise<IImageCacheRef> => {
      const name = getFileComponents(image).fileWithoutExt;
      const out = outFilename(outDir, name, width, format);

      return sharp(image)
        .toFormat(format, options)
        .resize(width)
        .toFile(out)
        .then((info) => {
          const now = Date.now();
          return {
            file: out,
            created: now,
            modified: now,
            size: info.size,
            width: info.width,
            height: info.height,
            isSourceImage: false,
            from: image,
            metaDetailLevel: "basic",
            sharpMeta: info as unknown as ISharpMetadata,
            meta: undefined,
          } as IImageCacheRef;
        })
        .catch((error) => {
          throw new ImageError(
            `Problem writing file ${out}! ${error.message}`,
            "io/saving-image",
          );
        });
    },
    /**
     * Returns the primary metadata which Sharp exposes
     * (minus the bulky and encoded) buffers.
     */
    getMetadata: async (source: string): Promise<ISharpMetadata> => {
      return sharp(source)
        .metadata()
        .then((meta) => {
          /** strip out the buffer data */
          return omit(meta as SharpMetadata, "exif", "iptc", "icc", "xmp");
        });
    },
    /**
     * Converts an image to all standard "web formats" (aka, jpg, webp, and avif) of a
     * specified size (or multiple sizes).
     */
    resizeToWebFormats: async (
      source: string,
      outDir: string,
      width: number | number[],
      options: OutputOptions & { includePNG?: boolean } = {},
    ): Promise<IImageCacheRef[]> => {
      if (!Array.isArray(width)) {
        width = [width];
      }

      const promises: Promise<any>[] = [];

      for (const w of width) {
        promises.push(
          api.resizeImage(source, outDir, w, "jpg", { ...o.jpg, ...options }),
          api.resizeImage(source, outDir, w, "avif", { ...o.avif, ...options }),
          api.resizeImage(source, outDir, w, "webp", { ...o.webp, ...options }),
        );
        if (options.includePNG) {
          promises.push(
            api.resizeImage(source, outDir, w, "png", { ...o.png, ...options }),
          );
        }
      }

      return Promise.all(promises);
    },
    /**
     * Provides a blurred JPG version of an image in a highly reduced size so that
     * it may be used in as an initial version of an image prior to loading full
     * image.
     *
     * Note: blurred images always have metadata removed from original image
     */
    blurredPreImage: async (
      /** the source image */
      source: string,
      outDir: string,
      size: number = 32,
    ) => {
      const s = getFileComponents(source);
      const baseName = `${s.fileWithoutExt}-blurred.jpg`;
      const blurFilename = join(outDir, baseName);
      await sharp(source)
        .toFormat("jpg", { mozjpeg: true, progressive: true })
        .blur(true)
        .resize({ width: size })
        .toFile(blurFilename);

      return baseName;
    },
  };

  return api;
}
