import { Plugin, DirectiveBinding, Component, App, Directive } from 'vue'

type ObjectDefault = Record<string, any>

export type TitleFormatter<T = Record<string, any>> = (title: T) => T

export type useFormatterParams<T = any> = (formatter: TitleFormatter<T>) => TitleFormatter<Partial<T>>

/**
 * 默认跟踪数据接口
 */
interface InitTrackData<T = any> {
  title: T
  type?: string
  content?: string
}

export interface TrackData<T = any> extends InitTrackData<T> {
  eventName?: string
  [key: string]: any
}

/**
 * 暴露键配置接口
 */
export type ExposedKeys = Record<string, string[]>
/**
 * Vue DOM-TRACK插件安装选项接口
 */
export interface DOMTrackerOptions<T = ObjectDefault> {
  /**
   * 暴露键配置
   */
  exposedKeys?: ExposedKeys
  /**
   * 默认是否禁用跟踪
   */
  defaultDisabled?: boolean
  /**
   * 默认延迟时间（毫秒）
   */
  delay?: number
  /**
   * 默认格式化函数
   */
  defaultFormatter: TitleFormatter<Partial<T>>
  /**
   * 跟踪处理函数
   */
  onTrack: (data: TrackData<T>) => void
  /**
   * 上下文获取函数
   */
  getContext: () => Partial<T> | ObjectDefault
}

/**
 * 跟踪用户参数接口
 */
export interface TrackUserParams extends TrackData {}

/**
 * 异步跟踪用户参数接口
 */
export interface AsyncTrackUserParams extends TrackData {
  /**
   * 内容选择器或获取函数
   */
  contentSelector?: string | (() => string)
  /**
   * 目标元素引用
   */
  targetRef?: { $el: HTMLElement }
  /**
   * 延迟时间（毫秒）
   */
  delay?: number
}

/**
 * DOM跟踪指令绑定值接口
 */
export interface DomTrackBinding<T = any> extends InitTrackData {
  /**
   * 是否仅在组件卸载前跟踪
   */
  trackOnlyBeforeUnmount?: boolean
  /**
   * 是否禁用跟踪
   */
  disabled?: boolean
  /**
   * 延迟时间（毫秒）
   */
  delay?: number
  /**
   * 自定义跟踪处理函数
   */
  beforeTrack?: (title: {
    el: Element
    binding: DirectiveBinding<DomTrackBinding<T>>
  }) => Promise<{ title: T; content: string }>
}

/**
 * DOM跟踪指令
 */
export interface ExtendElement<T = TrackData> extends Element {
  _formattedParams?: T
  _intId?: number
}

export type domTrackDirective<T = TrackData> = Directive<ExtendElement<T>, DomTrackBinding>

/**
 * TrackWrapper 配置接口
 */
export interface TrackWrapperConfig {
  /**
   * 延迟跟踪时间（毫秒）
   */
  delay?: number
  /**
   * 是否手动触发跟踪
   */
  manual?: boolean
  /**
   * 跟踪类型
   */
  type?: string
  /**
   * 监听的依赖属性
   */
  deps?: string[]
  /**
   * 是否立即跟踪依赖属性
   */
  immediate?: boolean
  /**
   * 是否禁用跟踪
   */
  disabled?: boolean
}
/**
 * TrackWrapper组件属性接口
 */
export interface TrackWrapperProps<T = any> {
  /**
   * 跟踪事件
   */
  trackEvents?: string | string[]
  /**
   * 跟踪参数
   */
  title?: T
  /**
   * 跟踪内容
   */
  content?: string | boolean
  /**
   * 配置对象
   */
  config?: TrackWrapperConfig
  /**
   * 适用于自定义组件 defineExpose 的 html 键名。优先级高于 componentKey
   */
  innerHtmlKeys?: string | string[]
}
/**
 * TrackFormatter 属性接口
 */
export interface TrackFormatterProps<T = any> {
  /**
   * 标题前缀
   */
  prefix?: string
  /**
   * 标题后缀
   */
  suffix?: string
  /**
   * 自定义格式化函数
   */
  formatter?: TitleFormatter<T> | null
}

/**
 * TrackConfigProvider 属性接口
 */
export interface TrackConfigProviderProps {
  /**
   * 异步获取配置的函数
   */
  fetchConfig?: (() => Promise<{ disabled?: boolean }>) | null
  /**
   * 配置对象
   */
  config?: { disabled?: boolean }
}

/**
 * 跟踪管理器接口
 */
export interface TrackManager<T, D = any> {
  // 私有属性
  _disabled: boolean
  _getContext: () => Record<string, unknown>
  _onTrack: (data: T) => void
  _exposedKeys: Record<string, string[]>
  _delay: number
  _defaultFormatter: TitleFormatter<D>

  // 公共访问器
  disabled: boolean
  exposedKeys: Record<string, string[]>
  exposedKeysTypes: string[]
  delay: number
  defaultFormatter: TitleFormatter<D>
  onTrack: (data: T) => void
  getContext: () => Partial<T>
}

/**
 * 跟踪包装器组件
 */
export declare const TrackWrapper: Component<{
  title?: string
  trackEvents?: string | string[]
  config?: TrackWrapperConfig
  innerHtmlKeys?: string | string[]
}>

/**
 * 标题跟踪提供者组件
 */
export declare const TrackFormatter: Component<TrackFormatterProps>

/**
 * 跟踪配置提供者组件
 */
export declare const TrackConfigProvider: Component<TrackConfigProviderProps>

/**
 * 跟踪用户行为
 */
export declare function trackUser(params: TrackUserParams): void

/**
 * 异步跟踪用户行为
 */
export declare function asyncTrackUser(params: AsyncTrackUserParams): void

/**
 * Vue DOM-TRACK插件
 */
declare const DOMTrack: Plugin & {
  install(app: App, options?: DOMTrackerOptions): void
}

export default DOMTrack
