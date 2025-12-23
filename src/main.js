import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate" // 1. Import the plugin
import PrimeVue from "primevue/config";
import ConfirmationService from "primevue/confirmationservice";
import ToastService from "primevue/toastservice";
import EcoTheme from "@/assets/styles/ecoTheme.js";

import "@/assets/styles/styles.scss";
import "@/assets/styles/tailwind.css";

const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia);
app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: EcoTheme,
    options: {
      darkModeSelector: ".app-dark",
    },
  },
});

app.use(ToastService);
app.use(ConfirmationService);

app.mount("#app");
