import TrackWrapper from './TrackWrapper.vue'
import TrackFormatter from './TrackFormatter.vue'
import TrackConfigProvider from './TrackConfigProvider.vue'
import { domTrack } from './track-directives'
import trackManager from './track-core'
import { trackUser, asyncTrackUser } from './use-tracker'
import { App, Plugin } from 'vue'
import { DEFAULT_DELAY } from './constants'
import { useFormatter } from './hooks'
import type { DOMTrackerOptions } from './types.ts'

// 导出单个组件、方法
export { TrackWrapper, TrackFormatter, TrackConfigProvider, domTrack, trackUser, asyncTrackUser, useFormatter }

/**
 * Vue DOM-TRACK插件安装配置
 */
const plugin: Plugin = {
  install(app: App, options: DOMTrackerOptions) {
    const {
      exposedKeys,
      defaultDisabled = false,
      delay = DEFAULT_DELAY,
      getContext = () => ({}),
      onTrack = (data) => console.log('initial 全局跟踪', data),
      defaultFormatter = (title) => title,
    } = options

    trackManager.disabled = defaultDisabled
    trackManager.delay = delay
    trackManager.defaultFormatter = defaultFormatter
    if (exposedKeys) {
      trackManager.exposedKeys = exposedKeys
    }

    trackManager.getContext = getContext
    trackManager.onTrack = onTrack

    // 注册全局组件和指令
    app.component('TrackWrapper', TrackWrapper)
    app.component('TrackFormatter', TrackFormatter)
    app.component('TrackConfigProvider', TrackConfigProvider)
    app.directive('dom-track', domTrack)
  },
}

export default plugin
