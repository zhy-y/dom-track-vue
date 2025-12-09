import trackManager from './track-core'
import { trackUser } from './use-tracker'
import { getFormatterByComponent } from './utils'
import { TitleFormatter, domTrackDirective } from './types'

export const domTrack: domTrackDirective = {
  mounted(el, binding, vnode) {
    const { disabled, title } = binding.value || {}
    if (disabled) return

    const formatter = getFormatterByComponent(el, vnode) as TitleFormatter<any>
    const formattedParams = formatter(title)

    // 先存储格式化后的params，后续beforeUnmount时使用。避免unmounted时 params 被更新
    el._formattedParams = formattedParams
    el._intId = setTimeout(() => {
      const { content, type = 'html', trackOnlyBeforeUnmount, beforeTrack } = binding.value || {}
      if (typeof beforeTrack === 'function') {
        beforeTrack?.({ el, binding }).then(({ title, content: _content }) => {
          el._formattedParams = title
          // 只在 beforeUnmount 时才触发
          if (trackOnlyBeforeUnmount) return
          trackUser({ title, content: _content || content || '', type })
        })
      } else {
        if (trackOnlyBeforeUnmount) return
        el._formattedParams = formattedParams
        trackUser({
          type,
          title: formattedParams,
          content: content || el?.outerHTML || el?.parentElement?.innerHTML || '',
        })
      }
      delete el._intId
    }, binding.value?.delay || trackManager.delay)
  },
  beforeUnmount(el, binding) {
    const { disabled } = binding.value || {}
    if (!el._intId || disabled) return

    clearTimeout(el._intId)
    delete el._intId

    const { content, type = 'html' } = binding.value || {}
    trackUser({
      type,
      title: el._formattedParams,
      content: content || el?.outerHTML || el?.parentElement?.innerHTML || '',
    })
    delete el._formattedParams
  },
}
