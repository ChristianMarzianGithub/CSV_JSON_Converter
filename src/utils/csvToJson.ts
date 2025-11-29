export interface CsvToJsonOptions {
  delimiter?: string
}

export interface CsvToJsonResult {
  data: Record<string, unknown>[]
  delimiter: string
}

const DELIMITERS = [',', ';', '\t'] as const

type Delimiter = (typeof DELIMITERS)[number]

const detectDelimiter = (input: string): Delimiter => {
  const lines = input.split(/\r?\n/).filter(Boolean)
  const sample = lines.slice(0, 5)

  const scores = DELIMITERS.map((delimiter) => {
    const counts = sample.map((line) => countDelimiter(line, delimiter))
    return counts.reduce((acc, val) => acc + val, 0)
  })

  const bestIndex = scores.indexOf(Math.max(...scores))
  return DELIMITERS[bestIndex]
}

const countDelimiter = (line: string, delimiter: Delimiter): number => {
  let count = 0
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      const nextIsQuote = line[i + 1] === '"'
      if (nextIsQuote) {
        i++
        continue
      }
      inQuotes = !inQuotes
    } else if (!inQuotes && char === delimiter) {
      count++
    }
  }

  return count
}

const parseCsv = (input: string, delimiter: Delimiter): string[][] => {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false
  const pushValue = () => {
    row.push(current)
    current = ''
  }

  let row: string[] = []

  for (let i = 0; i < input.length; i++) {
    const char = input[i]
    const next = input[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i++
        continue
      }
      inQuotes = !inQuotes
      continue
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        i++
      }
      pushValue()
      rows.push(row)
      row = []
      continue
    }

    if (!inQuotes && char === delimiter) {
      pushValue()
      continue
    }

    current += char
  }

  pushValue()
  rows.push(row)

  return rows.filter((r) => !(r.length === 1 && r[0] === ''))
}

const isNumeric = (value: string): boolean => {
  return /^-?\d+(\.\d+)?$/.test(value)
}

const coerceValue = (value: string): unknown => {
  const trimmed = value.trim()
  if (trimmed === '') return ''
  if (trimmed.toLowerCase() === 'null') return null
  if (trimmed.toLowerCase() === 'true') return true
  if (trimmed.toLowerCase() === 'false') return false
  if (isNumeric(trimmed)) return Number(trimmed)
  return trimmed
}

const setNestedValue = (
  target: Record<string, unknown>,
  path: string,
  value: unknown
) => {
  const segments = path.split('.')
  let current: Record<string, unknown> = target

  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      current[segment] = value
      return
    }

    if (!current[segment] || typeof current[segment] !== 'object') {
      current[segment] = {}
    }

    current = current[segment] as Record<string, unknown>
  })
}

export const csvToJson = (
  csvInput: string,
  options: CsvToJsonOptions = {}
): CsvToJsonResult => {
  if (!csvInput.trim()) {
    throw new Error('Please provide CSV input to convert to JSON.')
  }

  const detectedDelimiter = detectDelimiter(csvInput)
  const delimiter: Delimiter = (options.delimiter as Delimiter) ?? detectedDelimiter

  const rows = parseCsv(csvInput, delimiter)
  if (rows.length < 1) {
    throw new Error('CSV input did not contain any rows to parse.')
  }

  const [rawHeaders, ...dataRows] = rows
  const headers = rawHeaders.map((h, index) => (h.trim() ? h.trim() : `column_${index + 1}`))

  const normalizedRows = dataRows.map((row) => {
    const adjustedRow = [...row]

    if (adjustedRow.length < headers.length) {
      while (adjustedRow.length < headers.length) {
        adjustedRow.push('')
      }
    } else if (adjustedRow.length > headers.length) {
      const extraCount = adjustedRow.length - headers.length
      for (let i = 0; i < extraCount; i++) {
        headers.push(`extra_${headers.length + 1}`)
      }
    }

    const record: Record<string, unknown> = {}

    headers.forEach((header, index) => {
      const value = coerceValue(adjustedRow[index] ?? '')
      setNestedValue(record, header, value)
    })

    return record
  })

  return { data: normalizedRows, delimiter }
}
