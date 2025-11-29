export type ConversionMode = 'json-to-csv' | 'csv-to-json'

export interface ConversionMessage {
  mode: ConversionMode
  input: string
}

export interface ConversionResponse {
  result?: string
  error?: string
}
