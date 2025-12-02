import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { useFormatter } from '../src/hooks'
import { injectTitleTrace, provideTitleTrace } from '../src/common'

// Mock the common module
vi.mock('../src/common', () => ({
  injectTitleTrace: vi.fn(),
  provideTitleTrace: vi.fn(),
}))

describe('useFormatter hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return nextFormatter when formatter is provided', () => {
    const mockprevFormatter = vi.fn((title: any) => ({
      prefix: 'old',
      ...title,
    }))
    ;(injectTitleTrace as Mock).mockReturnValue(mockprevFormatter)

    const mockFormatter = (prevFormatter: any) => {
      return (title: any) => ({ ...prevFormatter(title), suffix: 'new' })
    }

    const result = useFormatter(mockFormatter)

    expect(typeof result).toBe('function')
    expect(provideTitleTrace).toHaveBeenCalled()
  })

  it('should handle empty formatter gracefully and return prevFormatter', () => {
    const mockprevFormatter = vi.fn((title: any) => ({
      prefix: 'old',
      ...title,
    }))
    ;(injectTitleTrace as Mock).mockReturnValue(mockprevFormatter)

    const result = useFormatter(undefined as any)

    expect(result).toBe(mockprevFormatter)
    expect(provideTitleTrace).not.toHaveBeenCalled()
  })

  it('should warn when formatter is not a function and return prevFormatter', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation()
    const mockprevFormatter = vi.fn((title: any) => ({
      prefix: 'old',
      ...title,
    }))
    ;(injectTitleTrace as Mock).mockReturnValue(mockprevFormatter)

    const result = useFormatter('not a function' as any)

    expect(consoleWarnSpy).toHaveBeenCalledWith('formatter must be a function')
    expect(result).toBe(mockprevFormatter)
    expect(provideTitleTrace).not.toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should correctly compose formatter functions', () => {
    const mockprevFormatter = vi.fn((title: any) => ({
      base: 'value',
      ...title,
    }))
    ;(injectTitleTrace as Mock).mockReturnValue(mockprevFormatter)

    const mockFormatter = (prevFormatter: any) => {
      return (title: any) => ({ ...prevFormatter(title), extended: 'data' })
    }

    const nextFormatter = useFormatter(mockFormatter)
    const result = nextFormatter({ test: 'title' })

    expect(mockprevFormatter).toHaveBeenCalledWith({ test: 'title' })
    expect(result).toEqual({
      base: 'value',
      test: 'title',
      extended: 'data',
    })
  })

  it('should call provideTitleTrace with nextFormatter when it exists', () => {
    ;(injectTitleTrace as Mock).mockReturnValue(() => ({}))
    const mockFormatter = () => (title: any) => title

    useFormatter(mockFormatter)

    expect(provideTitleTrace).toHaveBeenCalledTimes(1)
    const providedFormatter = (provideTitleTrace as Mock).mock.calls[0][0]
    expect(typeof providedFormatter).toBe('function')
  })

  it('should handle null formatter value and return prevFormatter', () => {
    const mockprevFormatter = vi.fn((title: any) => ({
      prefix: 'old',
      ...title,
    }))
    ;(injectTitleTrace as vi.Mock).mockReturnValue(mockprevFormatter)

    const result = useFormatter(null as any)

    expect(result).toBe(mockprevFormatter)
    expect(provideTitleTrace).not.toHaveBeenCalled()
  })
})
