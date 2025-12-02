import { useFormatterParams } from './types'
import { injectTitleTrace, provideTitleTrace } from './common'

/**
 * 跟踪格式化器钩子
 * @param formatter - 格式化函数
 * @param deps - 依赖项数组
 * @returns 格式化器对象
 */
export const useFormatter = <T = any>(formatter?: useFormatterParams<T>) => {
  // 注入父级提供的格式化函数
  const prevFormatter = injectTitleTrace()

  // 创建新的格式化函数
  const createFormatter = () => {
    if (formatter && typeof formatter === 'function') {
      return formatter(prevFormatter)
    }
    if (typeof formatter !== 'undefined') {
      console.warn('formatter must be a function')
    }
    return undefined
  }

  const nextFormatter = createFormatter()
  nextFormatter && provideTitleTrace(nextFormatter)

  return nextFormatter || prevFormatter
}
