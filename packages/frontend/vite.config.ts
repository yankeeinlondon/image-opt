import path from "node:path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import VueMacros from "unplugin-vue-macros/vite";
import VueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },

  plugins: [
    VueMacros({
      plugins: {
        vue: Vue({
          include: [/\.vue$/],
        }),
      },
    }),
    VueDevTools(),
  ],

  build: {
    lib: {
      entry: {
        ImgOpt: path.resolve(__dirname, "src/components/ImageOpt.vue"),
        ImgElement: path.resolve(
          __dirname,
          "src/components/ImageOptElement.ts",
        ),
      },
      formats: ["es"],
      name: "ImageOpt",
      fileName: (format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },

  test: {
    include: ["test/**/*.test.ts"],
    environment: "jsdom",
  },

  server: {},
});
