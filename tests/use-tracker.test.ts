import { describe, it, expect, vi, beforeEach } from 'vitest'
import { trackUser, asyncTrackUser } from '../src/use-tracker'
import trackManager from '../src/track-core'

describe('tracker functions', () => {
  beforeEach(() => {
    trackManager.disabled = false
    trackManager.delay = 10
    // Mock the internal _onTrack property instead of the getter
    trackManager._onTrack = vi.fn()
    trackManager.getContext = () => ({ appId: 'test-app' })
  })

  describe('trackUser', () => {
    it('should call trackManager.onTrack with merged context and title', () => {
      const title = { page: 'home' }
      trackUser({ title, type: 'click' })

      expect(trackManager._onTrack).toHaveBeenCalledWith({
        appId: 'test-app',
        title,
        type: 'click',
      })
    })

    it('should include content when provided', () => {
      trackUser({
        title: { id: 'test' },
        type: 'view',
        content: 'Test content',
      })

      expect(trackManager._onTrack).toHaveBeenCalledWith({
        appId: 'test-app',
        title: { id: 'test' },
        type: 'view',
        content: 'Test content',
      })
    })
  })

  describe('asyncTrackUser', () => {
    it('should not track when trackManager is disabled', async () => {
      trackManager.disabled = true

      asyncTrackUser({
        title: { id: 'test' },
        type: 'click',
      })

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(trackManager._onTrack).not.toHaveBeenCalled()
    })

    it('should track after delay with correct params', async () => {
      vi.useFakeTimers()

      asyncTrackUser({
        title: { id: 'delayed' },
        type: 'hover',
        content: 'Delayed content',
      })

      vi.advanceTimersByTime(10)

      expect(trackManager._onTrack).toHaveBeenCalledWith({
        appId: 'test-app',
        type: 'hover',
        title: { id: 'delayed' },
        content: 'Delayed content',
      })

      vi.useRealTimers()
    })
  })
})
