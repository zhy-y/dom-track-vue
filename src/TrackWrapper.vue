<template>
  <component :is="renderComponent" />
</template>

<script setup>
import { useSlots, cloneVNode, ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { trackUser, asyncTrackUser } from './use-tracker'
import { get } from 'lodash-es'
import { useTimeoutFn } from '@vueuse/core'
import { capitalizeFirstStr } from './utils'
import trackManager from './track-core'
import { useFormatter } from './hooks'

const DEFAULT_WRAPPER_CONFIG = {
  delay: trackManager?.delay || 2000,
  manual: false,
  type: 'dialog',
  deps: [], // 监听依赖变化，触发跟踪事件
  immediate: false,
  disabled: false,
}
const _exposedKeys = trackManager.exposedKeysTypes

const props = defineProps({
  trackEvents: {
    type: [String, Array],
    default: '',
  },
  title: {
    type: [String, Array, Object, Boolean],
    default: '',
  },
  content: {
    type: [String, Boolean],
  },
  config: {
    type: Object,
    default: () => ({
      delay: trackManager.delay,
      manual: false,
      type: 'dialog',
      deps: [], // 监听依赖变化，触发跟踪事件
      immediate: false,
      disabled: false,
    }),
  },
  // 适用于自定义组件 defineExpose 的 html 键名。优先级高于 componentKey
  innerHtmlKeys: {
    type: [String, Array],
  },
})
const emit = defineEmits(['track'])

const formatter = useFormatter()

const safeSetTimeout = (callback, delay) => {
  const { start } = useTimeoutFn(callback, delay)
  return start()
}
const slot = useSlots()
const slotRef = ref([])
const componentName = ref('')
const mergedConfig = computed(() => ({
  ...DEFAULT_WRAPPER_CONFIG,
  ...props.config,
}))
const watchers = ref([]) // 存储所有的watcher，便于组件卸载时清理

const getHTML = (el) => {
  return el.outerHTML || el.innerHTML || el.textContent || ''
}
// 获取跟踪的 HTML 内容
const getTrackHTML = () => {
  if (props.content) return props.content
  const html = slotRef.value.map((el) => {
    if (!el) return ''
    // Vue 组件
    if (el.$el !== undefined) {
      const _key =
        _exposedKeys.find((key) => componentName.value?.toLowerCase?.()?.includes(key.toLowerCase())) || 'default'
      if (!props.innerHtmlKeys && !_key) {
        console.warn('getTrackHTML未找到对应的html键名:', componentName.value)
      }
      // 兜底非唯一根节点的vue组件(nodeType = 3 的text文本节点)
      return (
        get(el, props.innerHtmlKeys || trackManager.exposedKeys[_key], '') || el.$el?.parentElement?.innerHTML || ''
      )
    }
    // 普通DOM元素
    return getHTML(el)
  })
  // console.log("getTrackHTML - 合并后的HTML:", html.join(""));
  return html.join('')
}

// 手动跟踪用户行为
const manualTracker = (context, ...args) => {
  const content = getTrackHTML()
  const _context = { ...context, content }
  emit('track', _context, ...args)
}
// 自动跟踪用户行为
const innerTracker = (context) => {
  mergedConfig.value.delay
    ? asyncTrackUser({ ...context, contentSelector: getTrackHTML })
    : trackUser({ ...context, content: getTrackHTML() })
}
/**
 * 事件触发时，进行用户行为跟踪
 * @param params {eventName: string}
 * @param args 事件触发时，传递的参数
 */
const commonTracker = async (params, ...args) => {
  if (mergedConfig.value.disabled || trackManager.disabled) return
  const { delay, manual, type } = mergedConfig.value
  const _context = trackManager.getContext()
  const _original = {
    title: formatter(props.title),
    type,
  }
  const context = { ..._context, ..._original, ...params }

  if (manual) {
    !mergedConfig.value.delay
      ? manualTracker(context, ...args)
      : safeSetTimeout(() => {
          manualTracker(context, ...args)
        }, delay)
    return
  }
  innerTracker({ ...context, delay })
}

// 清理所有watcher
const cleanupWatchers = () => {
  watchers.value.forEach((watcher) => watcher())
  watchers.value = []
}

// 设置子组件状态监听 - 只适用于 defineExpose 定义的属性
const setupWatchers = (childComponent) => {
  const _deps = props.config.deps
  if (!childComponent || !_deps) return

  const deps = Array.isArray(_deps) ? _deps : [_deps].filter(Boolean)
  if (deps.length === 0) return

  cleanupWatchers() // 清理之前的watcher

  // 为每个属性设置单独的watch
  deps.forEach((depKey) => {
    // 检查属性是否是响应式的
    if (childComponent[depKey] !== undefined) {
      // 使用watch监听属性变化
      const watcher = watch(
        () => childComponent[depKey],
        (newValue, oldValue) => {
          if (oldValue !== newValue) {
            commonTracker({ eventName: `update:${depKey}` }, { [depKey]: newValue })
          }
        },
        { deep: true }
      )
      watchers.value.push(watcher)
    }
  })
}

// 组件挂载时，用户行为跟踪
const mountedProps = {
  onVnodeMounted: (vnode) => {
    componentName.value = vnode.type.name
    // 通过 deps 配置，开启属性监听，不走 mounted 事件
    if (!mergedConfig.value.deps.length) {
      commonTracker({ eventName: 'mounted' })
    }
  },
}
// 组件渲染时，用户行为跟踪
const renderComponent = () => {
  const vnodes = slot.default?.()
  if (!vnodes || !Array.isArray(vnodes)) return null
  const trackRefs = []
  const cloneVNodes = vnodes.map((vnode) => {
    const _trackEvents = props.trackEvents
    const trackEvents = (Array.isArray(_trackEvents) ? _trackEvents : [_trackEvents]).filter(Boolean)

    // 未传 trackEvents 时，默认只在 mounted 时触发
    const enhancedProps = trackEvents.length
      ? trackEvents.reduce((acc, eventName) => {
          const key = `on${capitalizeFirstStr(eventName)}`
          acc[key] = (...args) => {
            componentName.value = vnode.type?.name
            commonTracker({ eventName }, ...args)
          }
          return acc
        }, {})
      : mountedProps

    return cloneVNode(vnode, {
      ...enhancedProps,
      ref: (el) => {
        if (el) {
          trackRefs.push(el)
          nextTick(() => {
            setupWatchers(el)
          })
        }
      },
    })
  })
  slotRef.value = trackRefs
  return cloneVNodes
}

// 组件卸载时清理当前标题格式化函数和watcher
onBeforeUnmount(() => {
  cleanupWatchers()
  slotRef.value = [] // 清理对 DOM 元素和组件的引用
})
</script>
