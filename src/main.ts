import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Modal from './plugins/modal'
import ActionSheet from './plugins/action-sheet'

createApp(App).use(store).use(router).use(Modal).use(ActionSheet).mount('#app')
