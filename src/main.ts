import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
/* 公共组件 */
import Scan from './plugins/scan'
import Modal from './plugins/modal'
import Picker from './plugins/picker'
import ActionSheet from './plugins/action-sheet'
import PreviewImage from './plugins/preview-image'

createApp(App).use(store).use(router).use(Scan).use(Modal).use(Picker).use(ActionSheet).use(PreviewImage).mount('#app')
