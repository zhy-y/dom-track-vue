import trackManager from './track-core'
import { TrackUserParams, AsyncTrackUserParams } from './types'

/**
 * 直接跟踪用户行为
 */
export const trackUser = (params: TrackUserParams): void => {
  if (trackManager.disabled) return
  trackManager.onTrack({ ...trackManager.getContext(), ...params })
}

/**
 * 异步跟踪用户行为
 */
export function asyncTrackUser({
  title,
  content,
  contentSelector,
  targetRef,
  delay = trackManager.delay,
  type = 'html',
  ...args
}: AsyncTrackUserParams): void {
  if (trackManager.disabled) return
  const context = trackManager.getContext()
  setTimeout(() => {
    let innerContent: string
    if (typeof contentSelector === 'function') {
      innerContent = contentSelector()
    } else {
      innerContent =
        content || targetRef?.$el?.innerHTML || document.querySelector(contentSelector || '')?.innerHTML || ''
    }
    trackManager.onTrack({
      ...context,
      type,
      title,
      content: innerContent,
      ...args,
    })
  }, delay)
}
