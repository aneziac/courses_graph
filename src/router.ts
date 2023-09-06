import Home from './views/Home.vue';
import Dashboard from './views/Dashboard.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: Home },
    { path: '/:searchItem', component: Dashboard },
    { path: '/:searchItem/:major', component: Dashboard }
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
