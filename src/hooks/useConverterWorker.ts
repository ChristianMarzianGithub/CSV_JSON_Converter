import { useEffect, useRef, useState } from 'react'
import type { ConversionMessage, ConversionMode } from '../types'
import type { ConversionResponse } from '../types'

export const useConverterWorker = () => {
  const workerRef = useRef<Worker | null>(null)
  const [isWorking, setIsWorking] = useState(false)

  useEffect(() => {
    const worker = new Worker(new URL('../workers/conversionWorker.ts', import.meta.url), {
      type: 'module',
    })
    workerRef.current = worker

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const convert = (mode: ConversionMode, input: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const worker = workerRef.current
      if (!worker) {
        reject(new Error('Conversion worker is not available.'))
        return
      }

      setIsWorking(true)

      const handleMessage = (event: MessageEvent<ConversionResponse>) => {
        const { result, error } = event.data
        worker.removeEventListener('message', handleMessage)
        setIsWorking(false)

        if (error) {
          reject(new Error(error))
        } else if (result !== undefined) {
          resolve(result)
        } else {
          reject(new Error('Unknown conversion response.'))
        }
      }

      worker.addEventListener('message', handleMessage)
      const payload: ConversionMessage = { mode, input }
      worker.postMessage(payload)
    })
  }

  return { convert, isWorking }
}
