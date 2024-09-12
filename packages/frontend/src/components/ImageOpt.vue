<script setup lang="ts">
import { ref, computed, defineProps } from "vue";
import {
    CssObjectFit,
    CssAspectRatio,
    CssColor,
    CssSizing,
    CssObjectPosition,
} from "inferred-types";
import { useWindowSize, useElementSize } from "@vueuse/core";

const el = ref(null);
const window = useWindowSize();
const container = useElementSize(el);
const vw = computed(() =>
    Math.floor((container.width.value / window.width.value) * 100),
);
const blur = ref(false);
const primary = ref(false);

const blurLoaded = () => {
    console.log("blur loaded");
    blur.value = true;
};
const primaryLoaded = () => {
    console.log("primary loaded");
    primary.value = true;
};

const {
    src,
    formats = ["avif", "webp", "jpg"],
    sizes = [512, 768, 1024, 1200, 1600, 2400],
    fit = "cover",
    position,
    alt = "image",
    loading = "lazy",
    color,
    aspectRatio,
    width,
    height,
    minHeight,
} = defineProps<{
    src: string;
    alt?: string;
    formats?: string[];
    sizes?: number[];
    fit?: CssObjectFit;
    position?: CssObjectPosition;
    aspectRatio?: CssAspectRatio;
    loading?: "eager" | "lazy";
    color?: CssColor;
    height?: CssSizing;
    minHeight?: CssSizing;
    width?: CssSizing;
}>();

const noExt = (img: string) => {
    return img.includes(".") ? img.split(/.*\./).slice(0, -1).join("") : img;
};

const srcset = (format: string) =>
    computed(() => {
        return sizes
            .map((s) => `${noExt(src)}-${s}.${format} ${s}w`)
            .join(", ");
    });
</script>

<template>
    <div class="image-opt" ref="el">
        <div class="color-backing" :class="{ replaced: blur }"></div>
        <img
            class="blurry-leader"
            :class="{ replaced: primary }"
            :src="`${noExt(src)}-blurred.jpg`"
            :alt="alt"
            loading="eager"
            @load="blurLoaded"
        />

        <picture v-if="blur" class="primary-image" :class="{ ready: primary }">
            <source
                v-for="format in formats"
                :key="format"
                :type="`image/${format}`"
                :srcset="`${srcset(format).value}`"
                :sizes="`${vw}vw`"
            />

            <!-- FALLBACK IMAGE -->
            <img
                :src="src"
                :alt="alt"
                :loading="loading"
                @load="primaryLoaded"
            />
        </picture>
    </div>
</template>

<style lang="css" scoped>
@property --image-width {
    syntax: "<size>";
    inherit: true;
    default: v-bind(width);
}
@property --image-height {
    syntax: "<size>";
    inherit: true;
    default: v-bind(height);
}
@property --image-min-height {
    syntax: "<size>";
    inherit: true;
    default: v-bind(minHeight);
}

:root {
    --image-width: v-bind(width);
    --image-height: v-bind(height);
    --aspect-ratio: v-bind(aspectRatio);
}

.image-opt {
    display: block;
    position: relative;
    width: 100%;
    aspect-ratio: var(--aspect-ratio);
}
.color-backing {
    background-color: v-bind(color);
    position: absolute;
    inset: 0 0 0 0;
    width: 100%;
    aspect-ratio: v-bind(aspectRatio);
}
.color-backing.replaced {
    transition: opacity 600ms ease-in;
    opacity: 0;
}
.blurry-leader {
    position: absolute;
    inset: 0 0 0 0;
    width: 100%;
    height: auto;
    aspect-ratio: v-bind(aspectRatio);
    object-fit: v-bind(fit);
    object-position: v-bind(position);
    overflow: hidden;
    z-index: 1;
}
.blurry-leader.replaced {
    transition: opacity 600ms ease-in;
    opacity: 0;
}

.primary-image {
    position: absolute;
    inset: 0 0 0 0;
    width: 100%;
    z-index: 5;
    opacity: 0;
    overflow: hidden;
    aspect-ratio: v-bind(aspectRatio);
    object-fit: v-bind(fit);
    object-position: v-bind(position);
}
.primary-image.ready {
    transition: opacity 600ms ease-in;
    opacity: 1;
}

.primary-image img {
    aspect-ratio: v-bind(aspectRatio);
    object-fit: v-bind(fit);
    object-position: v-bind(position);
}
</style>
