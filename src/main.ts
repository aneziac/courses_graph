import { createApp } from 'vue/dist/vue.esm-bundler';;
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const routes = [
    { path: '/', component: App }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

const app = createApp({})

app.use(router)

app.mount('#app');
