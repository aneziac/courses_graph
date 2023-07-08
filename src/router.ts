import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    { path: '/', component: Home },
    { path: '/:searchItem', component: Dashboard }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
