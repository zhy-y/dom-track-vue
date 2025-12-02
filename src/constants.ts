// 默认延迟时间
export const DEFAULT_DELAY = 2000

/**
 * 跟踪标题的provide/inject key
 */
export const TRACK_PARAMS_KEY = 'TRACK_PARAMS_KEY'

// 普通组件暴露的key
export const normalExposedKeys = ['$el', 'outerHTML']

// 初始化组件暴露的key
export const initialExposedKeys: Record<string, string[]> = {
  jdDialog: ['dialogContentRef', '$el', 'outerHTML'],
  jdAlert: ['content'],
  jdButton: ['ref', 'outerHTML'],
}
