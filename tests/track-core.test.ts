import { describe, it, expect, vi, beforeEach } from 'vitest'
import trackManager from '../src/track-core'
import { TrackData } from '../src/types'

describe('trackManager', () => {
  beforeEach(() => {
    // 重置trackManager状态
    trackManager.disabled = false
    trackManager._onTrack = (data: TrackData) => data
    trackManager.getContext = () => ({})
    trackManager.exposedKeys = {}
    trackManager.delay = 300
  })

  describe('disabled property', () => {
    it('should get and set disabled state correctly', () => {
      expect(trackManager.disabled).toBe(false)
      trackManager.disabled = true
      expect(trackManager.disabled).toBe(true)
      trackManager.disabled = false
      expect(trackManager.disabled).toBe(false)
    })

    it('should prevent tracking when disabled is true', () => {
      const mockOnTrack = vi.fn()
      trackManager._onTrack = mockOnTrack
      trackManager.disabled = true

      trackManager.onTrack({ title: 'test', type: 'test', test: 'data' })
      expect(mockOnTrack).not.toHaveBeenCalled()
    })
  })

  describe('onTrack property', () => {
    it('should set and execute onTrack function correctly', () => {
      const mockOnTrack = vi.fn()
      trackManager._onTrack = mockOnTrack

      trackManager.onTrack({ title: 'test', type: 'test', test: 'data' })
      expect(mockOnTrack).toHaveBeenCalledWith({ title: 'test', type: 'test', test: 'data' })
    })
  })

  describe('context property', () => {
    it('should get and set context function correctly', () => {
      const mockContext = { userId: 'test123' }
      trackManager.getContext = () => mockContext

      expect(trackManager.getContext()).toEqual(mockContext)
    })
  })

  describe('exposedKeys property', () => {
    it('should get and set exposedKeys correctly', () => {
      const mockExposedKeys = { test: ['key1', 'key2'] }
      trackManager.exposedKeys = mockExposedKeys

      const result = trackManager.exposedKeys
      // 验证返回的对象包含我们设置的键，而不是完全相等
      expect(result.test).toEqual(['key1', 'key2'])
    })
  })

  describe('delay property', () => {
    it('should get and set delay correctly', () => {
      expect(trackManager.delay).toBe(300)
      trackManager.delay = 500
      expect(trackManager.delay).toBe(500)
    })
  })
})
