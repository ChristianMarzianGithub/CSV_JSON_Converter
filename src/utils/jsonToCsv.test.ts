import { describe, expect, it } from 'vitest'
import { jsonToCsv } from './jsonToCsv'

describe('jsonToCsv', () => {
  it('wraps a single object into an array', () => {
    const input = '{"name":"Ada","age":36}'
    const { csv } = jsonToCsv(input)
    expect(csv.trim()).toBe('name,age\nAda,36')
  })

  it('unions headers across objects and flattens nested data', () => {
    const input = `[
      {"name":"Ada","address":{"city":"London"}},
      {"name":"Linus","languages":["C","Perl"],"active":true}
    ]`

    const { csv } = jsonToCsv(input)
    const lines = csv.split(/\r?\n/)
    expect(lines[0].split(',')).toEqual(['name', 'address.city', 'languages', 'active'])
    expect(lines[1]).toBe('Ada,London,,')
    expect(lines[2]).toBe('Linus,,"[""C"",""Perl""]",true')
  })

  it('escapes commas, quotes, and newlines properly', () => {
    const input = `[{"note":"Hello, \"World\"!\nNext"}]`
    const { csv } = jsonToCsv(input)
    expect(csv.trim()).toBe('note\n"Hello, ""World""!\nNext"')
  })
})
