import { createApp } from 'vue'
import App from './App.vue'
import DOMTrack from '../src/index'
import '@jd/jdesign-vue/dist/index.css'
import JDesign from '@jd/jdesign-vue'
import { DOMTrackerOptions } from '@/types'

const app = createApp(App)

// 定义配置类型
const trackConfig: DOMTrackerOptions<string> = {
  onTrack: (data) => {
    console.log('111 跟踪数据:', data)
  },
  getContext: () => ({
    timestamp: Date.now(),
    sessionId: 'SESSION-ID',
  }),
  defaultDisabled: false,
  defaultFormatter: (params: string) => `[default]${params}`,
}

// 安装DOM-Track插件
app.use(DOMTrack, trackConfig).use(JDesign)

app.mount('#app')
