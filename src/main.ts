// @ts-ignore - can't figure out typeerror, come back to this later
import { createApp } from 'vue/dist/vue.esm-bundler';
import { router } from './router'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

const app = createApp({});

app.use(router);

app.mount('#app');
