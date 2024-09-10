<script setup lang="ts">
const p = withDefaults(
  defineProps<{
    src: string;
    dominantColor?: CssColor;
    startWithBlur?: boolean | "true" | "false";
    /**
     * When set to true -- default is false -- then the
     * blurred image will be loaded prior to being in the
     * viewport but further image loading will wait until
     * the element enters the viewport.
     */
    preloadBlur?: boolean | "true" | "false";
    sizes: number[];
    formats: WebImageFormat[];
    loading: "lazy" | "eager";
    upgradeToFullsize: boolean | "true" | "false";
    preloadFullsize: boolean | "true" | "false";
    useP3: boolean | "true" | "false";
    width?: CssSize;
    height?: CssSize;
    aspectRatio?: CssAspectRatio;
    fit?: CssObjectFit;
  }>(),
  {
    startWithBlur: true,
    formats: () => ["jpg","webp","avif"],
    loading: "lazy",
    upgradeToFullsize: false,
    preloadFullsize: false,
    fit: "cover"
  }
);

/** strip a file's file extension, leaving the rest of filepath */
const stripExt = (filename: string) => {
    const parts = filename.split("/");
    parts[parts.length] = parts[parts.length].replace(/.*\.\s+/);
    return parts.join("/");
}

const srcset = (src: string, format: WebImageFormat) => computed(
    () => p.sizes.map(
        s => `${src}.${format} ${s}w`
    ).join(", ")
)


</script>


<!-- START TEMPLATE -->
<template>

<picture class="image-opt">
    <source 
        class="image-format"
        v-for="format in p.formats"
        :key="format"
        :sizes="sizes"
        :srcset="srcset(stripExt(p.src), format)"
        :loading="loading"
        :type="`image/${format}`"
    >
    <img
        class="fallback-image"
        :src="fallback"
        :alt="alt"
    >

</picture>

</template>
<!-- END TEMPLATE -->
