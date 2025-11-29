import { describe, expect, it } from 'vitest'
import { csvToJson } from './csvToJson'

describe('csvToJson', () => {
  it('detects delimiters and reconstructs nested objects', () => {
    const input = 'name;address.city;address.zip\nAda;London;10001'
    const { data, delimiter } = csvToJson(input)

    expect(delimiter).toBe(';')
    expect(data).toEqual([{ name: 'Ada', address: { city: 'London', zip: 10001 } }])
  })

  it('parses quoted fields with delimiters and quotes', () => {
    const input = 'note,value\n"Hello, ""world""",42'
    const { data } = csvToJson(input)

    expect(data[0]).toEqual({ note: 'Hello, "world"', value: 42 })
  })

  it('handles inconsistent row lengths and empty fields', () => {
    const input = 'name,age,city\nAda,36\nLinus,\tHelsinki'
    const { data } = csvToJson(input)

    expect(data[0]).toEqual({ name: 'Ada', age: 36, city: '' })
    expect(data[1]).toEqual({ name: 'Linus', age: '', city: 'Helsinki' })
  })
})
