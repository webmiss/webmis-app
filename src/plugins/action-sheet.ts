import { createApp, h } from 'vue';
import Sheet from '../components/action-sheet/index.vue';

export default {
  install(app) {
    const actionSheet = (options) => {
      return new Promise((resolve) => {
        const container = document.createElement('div');
        const instance = createApp({
          render: () => h(Sheet, {
            ...options,
            visible: true,
            'onUpdate:visible': (val) => {
              if (!val) setTimeout(() => {
                instance.unmount();
                container.remove();
              }, 300);
            },
            onConfirm: (value) => resolve({ confirm: true, content: value }),
            onCancel: () => resolve({ confirm: false }),
            onClose: (value) => resolve({ close: true, content: value }),
          })
        });
        instance.mount(container);
        document.body.appendChild(container);
      });
    };
    app.config.globalProperties.$actionSheet = actionSheet;
  }
}; 