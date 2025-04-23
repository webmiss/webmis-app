import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Modal from './plugins/modal'

createApp(App).use(store).use(router).use(Modal).mount('#app')
