import { createApp } from 'vue/dist/vue.esm-bundler';
import { router } from './router'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const app = createApp({})

app.use(router)

app.mount('#app');
