import { createApp } from "vue";
import App from "./App.vue";
import "./scss/main.scss";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persistedstate"

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App).use(pinia).mount("#app");

