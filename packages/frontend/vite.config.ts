import path from "node:path";
import { defineConfig, Plugin } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueDevTools from "vite-plugin-vue-devtools";
import dts from "vite-plugin-dts";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },

  plugins: [
    cssInjectedByJsPlugin() as unknown as Plugin,
    Vue({
      include: [/\.vue$/],
    }),
    VueDevTools(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
    }),
  ],

  build: {
    lib: {
      entry: {
        ImageOpt: path.resolve(__dirname, "src/components/ImageOpt.vue"),
        ImageVapor: path.resolve(__dirname, "src/components/ImageVapor.vue"),
        ImageElement: path.resolve(
          __dirname,
          "src/components/ImageOptElement.ts",
        ),
      },
      formats: ["es"],
      name: "ImageOpt",
      fileName: (format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core", "inferred-types", "@vue-vapor/vue"],
      output: {
        globals: {
          vue: "Vue",
          "@vue-vapor/vue": "VueVapor",
          "@vueuse/core": "VueUse",
          "inferred-types": "InferredTypes",
        },
      },
    },
    cssCodeSplit: false,
  },

  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
  },

  server: {},
});
