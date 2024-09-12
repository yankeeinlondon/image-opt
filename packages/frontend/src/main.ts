import { createApp } from "vue";
// import the root component App from a single-file component.
import App from "./App.vue";

export const app = createApp(App);

app.mount("#app");
