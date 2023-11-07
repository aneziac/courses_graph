// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - can't figure out typeerror, come back to this later
import { createApp } from 'vue/dist/vue.esm-bundler';
import { router } from './router'
import { Quasar } from 'quasar';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp({});

app.use(router);
app.use(Quasar, {
    plugins: {},
});

app.mount('#app');
