import { isPlainObject } from 'lodash-es'
import { DEFAULT_DELAY, initialExposedKeys, normalExposedKeys } from './constants'
import { TrackManager, TrackData } from './types'

const _normalExposedKeys = {
  default: normalExposedKeys,
}

/**
 * 全局跟踪管理器
 */
const trackManager: TrackManager<TrackData> = {
  // 初始化配置
  _disabled: false,
  _exposedKeys: {
    ..._normalExposedKeys,
    ...initialExposedKeys,
  },
  _delay: DEFAULT_DELAY,
  _defaultFormatter: (title) => title,
  _getContext: () => ({}),
  _onTrack: (data: TrackData) => {
    console.log('initial 全局跟踪', data)
  },

  // 禁用状态访问器
  get disabled() {
    return this._disabled
  },
  set disabled(value) {
    this._disabled = value
  },

  /**
   * 执行跟踪操作
   * @param data - 要跟踪的数据
   */
  get onTrack() {
    return (data: TrackData) => {
      // 快速检查禁用状态
      if (this._disabled) {
        return
      }

      try {
        return this._onTrack(data)
      } catch (error) {
        // inject失败，说明不在Vue组件环境中，继续执行默认跟踪
        console.warn('dom-track: onTrack inject config failed, continue with default track', error)
      }
      return this._onTrack(data)
    }
  },

  /**
   * 设置跟踪函数
   * @param fn - 跟踪处理函数
   */
  set onTrack(fn) {
    if (typeof fn === 'function') {
      this._onTrack = fn
      return
    }
    console.warn('dom-track: onTrack expects a function parameter')
  },

  /**
   * 获取即时上下文
   * @returns 上下文对象
   */
  get getContext() {
    return this._getContext
  },
  /**
   * 设置上下文获取函数
   * @param fn - 上下文获取函数
   */
  set getContext(fn) {
    if (typeof fn === 'function') {
      this._getContext = fn
      return
    }
    console.warn('dom-track: getContext expects a function parameter')
  },

  /**
   * 获取暴露键配置的只读副本
   * @returns 暴露键配置对象
   */
  get exposedKeys() {
    return { ...this._exposedKeys }
  },

  /**
   * 设置暴露的键配置
   * @param config - 暴露键配置对象
   */
  set exposedKeys(config) {
    if (!config) return
    if (!isPlainObject(config)) {
      console.warn('dom-track: exposedKeys expects an object parameter')
      return
    }
    // 更新内部私有变量
    this._exposedKeys = {
      ..._normalExposedKeys,
      ...config,
    }
  },
  /**
   * 获取暴露的键类型列表（小写形式）
   * @returns 键类型列表
   */
  get exposedKeysTypes() {
    return Object.keys(this._exposedKeys)
  },

  /**
   * 获取延迟时间
   */
  get delay() {
    return this._delay
  },

  /**
   * 设置延迟时间
   * @param value - 延迟时间（毫秒）
   */
  set delay(value) {
    if (typeof value === 'number' && value >= 0) {
      this._delay = value
      return
    }
    console.warn('dom-track: delay expects a non-negative number parameter')
  },

  /**
   * 获取默认格式化函数
   */
  get defaultFormatter() {
    return this._defaultFormatter
  },

  /**
   * 设置默认格式化函数
   * @param fn - 默认格式化函数
   */
  set defaultFormatter(fn) {
    if (typeof fn === 'function') {
      this._defaultFormatter = fn
      return
    }
    console.warn('dom-track: defaultFormatter expects a function parameter')
  },
}

export default trackManager
