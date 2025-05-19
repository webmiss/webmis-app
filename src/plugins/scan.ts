import { createApp, h } from 'vue';
import Scan from '../components/scan/index.vue';

export default {
  install(app) {
    const showScan = (options) => {
      return new Promise((resolve) => {
        const container = document.createElement('div');
        const instance = createApp({
          render: () => h(Scan, {
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
    app.config.globalProperties.$showScan = showScan;
  }
}; 