import { defineCustomElement } from "vue";
import ImageOpt from "./ImageOpt.vue";

export const ImageOptElement = defineCustomElement(ImageOpt);

customElements.define("image-opt", ImageOptElement);
