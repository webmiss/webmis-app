import { createApp, h } from 'vue';
import PreviewImage from '../components/image/preview.vue';

export default {
  install(app) {
    const previewImage = (options) => {
      return new Promise((resolve) => {
        const container = document.createElement('div');
        const instance = createApp({
          render: () => h(PreviewImage, {
            ...options,
            visible: true,
            'onUpdate:visible': (val: boolean) => {
              if (!val) setTimeout(() => {
                instance.unmount();
                container.remove();
              }, 400);
            },
            onClose: () => resolve({ close: true }),
          })
        });
        instance.mount(container);
        document.body.appendChild(container);
      });
    };
    app.config.globalProperties.$previewImage = previewImage;
  }
}; 