import { TRACK_PARAMS_KEY } from './constants'
import trackManager from './track-core'
import { TitleFormatter } from './types'

// 事件名称首字母大写
export function capitalizeFirstStr(str: string): string {
  if (!str) return ''
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Vue组件实例类型（简化版，支持Vue 2.x和3.x）
 */
interface VueComponentInstance {
  provides?: Record<string, any>
  _provided?: Record<string, any>
  parent?: VueComponentInstance | null
  $parent?: VueComponentInstance | null
}

/**
 * 获取组件实例 - 支持Vue 2.x和3.x
 * @param element - DOM元素
 * @returns 组件实例或null
 */
const getComponentInstance = (element: Element | HTMLElement): VueComponentInstance | null => {
  return (
    (element as any).__vueParentComponent || // Vue 3.x
    (element as any).__vue__ || // Vue 2.x
    ((element as any)._vnode && (element as any)._vnode.component) || // 其他可能
    null
  )
}

/**
 * 从组件实例获取格式化函数的方法 - 支持Vue 2.x和3.x
 * @param component - Vue组件实例
 * @returns 格式化函数或null
 */
const getFormatterFromComponent = (component: VueComponentInstance): TitleFormatter<unknown> | null => {
  let currentComponent: VueComponentInstance | null | undefined = component
  while (currentComponent) {
    const provides = currentComponent.provides || currentComponent._provided
    if (provides && provides[TRACK_PARAMS_KEY]) {
      const formatter = provides[TRACK_PARAMS_KEY]
      // 确保返回的是函数
      if (typeof formatter === 'function') {
        return formatter as TitleFormatter<unknown>
      }
      // 处理computed值
      if (formatter && typeof formatter.value === 'function') {
        return formatter.value as TitleFormatter<unknown>
      }
    }
    currentComponent = currentComponent.parent || currentComponent.$parent
  }
  return null
}

/**
 * 获取当前组件实例的格式化函数
 * @param el - DOM元素
 * @returns 格式化函数
 */
export function getFormatterByComponent(el: Element | HTMLElement): TitleFormatter<unknown> {
  try {
    // 向上遍历DOM树，查找组件实例和格式化函数
    let currentEl: Element | HTMLElement = el
    while (currentEl && currentEl !== document.body) {
      const component = getComponentInstance(currentEl)
      if (component) {
        const formatter = getFormatterFromComponent(component)
        if (formatter) {
          return formatter
        }
      }
      // 如果没有找到有效组件或格式化函数，继续向上遍历
      if (!currentEl.parentElement) break
      currentEl = currentEl.parentElement
    }
    // 回退到默认格式化函数
    return trackManager.defaultFormatter
  } catch (error) {
    console.warn('getFormatterByComponent: 获取组件实例失败', error)
    return trackManager.defaultFormatter
  }
}
