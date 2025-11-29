import { csvToJson } from '../utils/csvToJson'
import { jsonToCsv } from '../utils/jsonToCsv'
import type { ConversionMessage, ConversionResponse } from '../types'

self.onmessage = (event: MessageEvent<ConversionMessage>) => {
  const { mode, input } = event.data
  const response: ConversionResponse = {}

  try {
    if (mode === 'json-to-csv') {
      const { csv } = jsonToCsv(input)
      response.result = csv
    } else {
      const { data } = csvToJson(input)
      response.result = JSON.stringify(data, null, 2)
    }
  } catch (error) {
    response.error = error instanceof Error ? error.message : 'Unknown conversion error.'
  }

  self.postMessage(response)
}

export {} // keep file as module
