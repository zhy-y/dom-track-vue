import { createApp } from 'vue'
import App from './App.vue'
import DOMTrack from '../src/index.ts'
import '@jd/jdesign-vue/dist/index.css'
import JDesign from '@jd/jdesign-vue'

const app = createApp(App)

// 安装DOM-Track插件
app
  .use(DOMTrack, {
    onTrack: (data) => {
      console.log('111 跟踪数据:', data)
    },
    getContext: () => ({
      timestamp: Date.now(),
      sessionId: 'SESSION-ID',
    }),
    defaultDisabled: false,
    defaultFormatter: (params) => `[default]${params}`,
  })
  .use(JDesign)

app.mount('#app')
