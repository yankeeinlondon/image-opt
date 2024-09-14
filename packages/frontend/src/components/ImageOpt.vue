<script setup lang="ts">
import { ref, computed, defineProps, useAttrs, useSlots } from "vue";
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

type OverlayPosition = "left" | "right" | "top" | "bottom";

const slots = useSlots();

const hasSlotContent = computed(() => typeof slots.default === "function" && slots.default().length>0 ? true : false) 

const {
    // @ts-ignore
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
    overlayPosition = "bottom",
    overlayBgColor = "transparent",
    overlayBgOpacity = "0.9",
    overlayBlur = "55px",
    debug = false
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
    overlayPosition?: OverlayPosition;
    overlayBgColor?: CssColor;
    overlayBgOpacity?: number | `${number}`;
    overlayBlur?: CssSizing;
    debug?: boolean;
}>(); 

const blurLoaded = () => {
    if (debug) {
        console.log(`blurred image loaded: "${src}"`);
    }
    emit("blurred", src);
    blur.value = true;
};
const primaryLoaded = () => {
    if (debug) {
        console.log(`primary image loaded: "${src as string}"`);
    }
    emit("primary", src);
    primary.value = true;
};

const noExt = (img: string) => {
    return img.includes(".") ? img.split(/.*\./).slice(0, -1).join("") : img;
};


const srcset = (format: string) =>
    computed(() => {
        return sizes
            .map((s) => `${noExt(src)}-${s}.${format} ${s}w`)
            .join(", ");
    });

/**
 * emits events for different stages of image load
 */
const emit = defineEmits(['blurred','primary','full']);

const a = ref(useAttrs());
const borderRadius = computed(() => {
    const rounded = Object.keys(a.value).filter(i => i.startsWith("rounded"));
    
    return rounded.includes("rounded-full")
        ? "9999px"
        : rounded.includes("rounded-3xl")
          ? "24px"
          : rounded.includes("rounded-2xl")
            ? "16px"
            : rounded.includes("rounded-xl")
              ? "12px"
              : rounded.includes("rounded-lg")
                ? "8px"
                : rounded.includes("rounded-md")
                  ? "6px"
                  : rounded.includes("rounded-sm")
                    ? "2px"
                    : rounded.includes("rounded") && typeof rounded.find(i => i == "rounded") === "number"
                          ? `${rounded.find(i => i == "rounded")}px`
                          : rounded.includes("rounded") ? "4px"
                      : "0px";
});

if(height === undefined && aspectRatio === undefined) {
    console.warn(`The image "${src}" is being displayed with ImageOpt component but does not express either a height or an aspect ratio! This will lead to decreased rendering performance and/or unexpected results.`)
}
if(height !== undefined && aspectRatio !== undefined) {
    console.warn(`The image "${src}" is being displayed with ImageOpt component but it has BOTH the height and aspect-ratio set! Use one or the other but not both.`)
}
</script>

<template>
    <div class="image-opt" ref="el" :data-border="borderRadius">
        <div class="wrapper">
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
            <div v-if="hasSlotContent" class="overlay" :class="overlayPosition">
                <div class="overlay-content" :class="overlayPosition">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>

.image-opt .wrapper {
    display: grid;
    position: relative;
    width: 100%;
    width: v-bind(width);
    height: v-bind(height);
    min-height: v-bind(minHeight);
    padding: 0;
    margin: 0;
    aspect-ratio: v-bind(aspectRatio);
    border-radius: v-bind("borderRadius");
    overflow: hidden;
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
    height: v-bind(height);
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
    z-index: 5;
    opacity: 0;
}
.primary-image.ready {
    transition: opacity 600ms ease-in;
    opacity: 1;
}

.primary-image img {
    width: 100%;
    height: v-bind(height);
    aspect-ratio: v-bind(aspectRatio);

    object-fit: v-bind(fit);
    object-position: v-bind(position);
}

.overlay {
    display: grid;
    position: absolute;
    z-index: 6;
    padding: 1rem;
}

.overlay::after {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: v-bind("overlayBgOpacity");
    background-color: v-bind("overlayBgColor");
    content: "";
    backdrop-filter: blur(v-bind("overlayBlur"));
    z-index: -1;
}

.overlay.bottom {
    bottom: 0;
    width: 100%;
}
.overlay.top {
    top: 0;
    width: 100%;
}
.overlay.left {
    left: 0;
    height: 100%;
}
.overlay.right {
    right: 0;
    height: 100%;
}
</style>
