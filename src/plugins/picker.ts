import { createApp, h } from 'vue';
import Picker from '../components/picker/index.vue';

export default {
  install(app) {
    const showPicker = (options) => {
      return new Promise((resolve) => {
        const container = document.createElement('div');
        const instance = createApp({
          render: () => h(Picker, {
            ...options,
            visible: true,
            'onUpdate:visible': (val) => {
              if (!val) setTimeout(() => {
                instance.unmount();
                container.remove();
              }, 300);
            },
            onConfirm: (value) => resolve({ confirm: true, content: value }),
            onCancel: () => resolve({ confirm: false })
          })
        });
        instance.mount(container);
        document.body.appendChild(container);
      });
    };
    app.config.globalProperties.$showPicker = showPicker;
  }
}; 