import { inject, provide } from 'vue'
import { TRACK_PARAMS_KEY } from './constants'
import trackManager from './track-core'

/**
 * 提供跟踪标题格式化函数
 * @param formatter - 标题格式化函数
 */
export const provideTitleTrace = (formatter = trackManager.defaultFormatter) => {
  provide(TRACK_PARAMS_KEY, formatter)
}

/**
 * 注入跟踪标题格式化函数
 * @param defaultFormatter - 默认格式化函数
 * @returns 标题格式化函数
 */
export const injectTitleTrace = (defaultFormatter = trackManager.defaultFormatter) => {
  return inject(TRACK_PARAMS_KEY, defaultFormatter)
}
