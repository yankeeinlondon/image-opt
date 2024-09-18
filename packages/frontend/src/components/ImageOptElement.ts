import { defineCustomElement } from "vue";
import ImageOpt from "./ImageOpt.vue";

export const ImageOptElement = defineCustomElement(ImageOpt as any) as any;

customElements.define("image-opt", ImageOptElement);
