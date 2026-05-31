import { describe, expect, it } from 'vitest'
import { formatDistance, toDatetimeLocal } from './format'

describe('formatDistance', () => {
  it('renders whole numbers without decimals', () => {
    expect(formatDistance(120)).toBe('120 km')
  })

  it('keeps one decimal for fractional distances', () => {
    expect(formatDistance(12.5)).toBe('12.5 km')
  })
})

describe('toDatetimeLocal', () => {
  it('produces a value the datetime-local input accepts', () => {
    const result = toDatetimeLocal('2024-05-20T14:30:00.000Z')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  it('returns an empty string for invalid input', () => {
    expect(toDatetimeLocal('not-a-date')).toBe('')
  })
})
