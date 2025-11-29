export interface JsonToCsvOptions {
  delimiter?: string
}

export type JsonInput = Record<string, unknown> | Record<string, unknown>[]

export interface JsonToCsvResult {
  headers: string[]
  csv: string
  delimiter: string
}

const DEFAULT_DELIMITER = ','

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const flattenObject = (
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> => {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key

    if (Array.isArray(value)) {
      result[path] = JSON.stringify(value)
    } else if (isPlainObject(value)) {
      Object.assign(result, flattenObject(value, path))
    } else if (value === null || value === undefined) {
      result[path] = ''
    } else {
      result[path] = String(value)
    }
  }

  return result
}

const escapeValue = (value: string, delimiter: string): string => {
  const needsEscaping =
    value.includes(delimiter) || /["\n\r]/.test(value) || /^\s|\s$/.test(value)

  if (!needsEscaping) {
    return value
  }

  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}

export const jsonToCsv = (
  jsonInput: string,
  options: JsonToCsvOptions = {}
): JsonToCsvResult => {
  const delimiter = options.delimiter ?? DEFAULT_DELIMITER

  if (!jsonInput.trim()) {
    throw new Error('Please provide JSON input to convert to CSV.')
  }

  let parsed: JsonInput
  try {
    parsed = JSON.parse(jsonInput)
  } catch (error) {
    throw new Error('Invalid JSON provided. Please check your syntax.')
  }

  const records = Array.isArray(parsed) ? parsed : [parsed]

  if (!records.length) {
    throw new Error('JSON must contain at least one object to convert.')
  }

  const flattenedRows = records.map((item, index) => {
    if (!isPlainObject(item)) {
      throw new Error(`Item at index ${index} is not an object and cannot be converted.`)
    }

    return flattenObject(item)
  })

  const headers: string[] = []
  const headerSet = new Set<string>()

  for (const row of flattenedRows) {
    for (const key of Object.keys(row)) {
      if (!headerSet.has(key)) {
        headerSet.add(key)
        headers.push(key)
      }
    }
  }

  const csvRows = [headers.join(delimiter)]

  for (const row of flattenedRows) {
    const values = headers.map((header) => {
      const rawValue = row[header] ?? ''
      return escapeValue(rawValue, delimiter)
    })

    csvRows.push(values.join(delimiter))
  }

  return { headers, csv: csvRows.join('\n'), delimiter }
}
