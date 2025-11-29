import { useEffect, useMemo, useState } from 'react'
import { ModeSelector } from './components/ModeSelector'
import { TextPanel } from './components/TextPanel'
import { ErrorBanner } from './components/ErrorBanner'
import { ThemeToggle } from './components/ThemeToggle'
import { useConverterWorker } from './hooks/useConverterWorker'
import type { ConversionMode } from './types'

const sampleJson = `[
  {"name": "Ada", "city": "London", "address": {"street": "42 Binary Rd", "zip": 10001}},
  {"name": "Linus", "city": "Helsinki", "languages": ["C", "Perl"], "active": true}
]`

const sampleCsv = `name,company,address.city,address.zip
"Ada",Acme,"London",10001
"Linus",Open Source,"Helsinki",00200`

const downloadText = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const placeholders: Record<ConversionMode, string> = {
  'json-to-csv': 'Paste JSON here. Arrays of objects are preferred, single objects will be wrapped automatically.',
  'csv-to-json': 'Paste CSV here. Delimiter will be detected automatically (comma, semicolon, or tab).',
}

function App() {
  const [mode, setMode] = useState<ConversionMode>('json-to-csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  const { convert, isWorking } = useConverterWorker()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const handleConvert = async () => {
    setError('')
    try {
      const result = await convert(mode, input)
      setOutput(result)
    } catch (conversionError) {
      setOutput('')
      setError(conversionError instanceof Error ? conversionError.message : 'Conversion failed.')
    }
  }

  const handleDownload = () => {
    if (!output) return
    const isJson = mode === 'csv-to-json'
    const filename = isJson ? 'output.json' : 'output.csv'
    const type = isJson ? 'application/json' : 'text/csv'
    downloadText(output, filename, type)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const handleLoadSample = () => {
    setInput(mode === 'json-to-csv' ? sampleJson : sampleCsv)
    setOutput('')
    setError('')
  }

  const outputLabel = useMemo(() => (mode === 'json-to-csv' ? 'CSV Output' : 'JSON Output'), [mode])

  return (
    <div className="min-h-screen bg-gray-50 pb-12 text-gray-900 transition dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-blue-600 dark:text-blue-300">Utilities</p>
            <h1 className="text-3xl font-bold">CSV ↔ JSON Converter</h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
              Convert between CSV and JSON safely. Nested objects are flattened with dot notation, arrays are stringified, and CSV
              delimiters are detected automatically.
            </p>
          </div>
          <ThemeToggle isDark={theme === 'dark'} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        </header>

        <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-800/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Mode</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Choose a direction and then paste your data.</p>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-300"
            >
              Load example input
            </button>
          </div>
          <ModeSelector mode={mode} onChange={(value) => setMode(value)} />
        </section>

        {error && <ErrorBanner message={error} onDismiss={() => setError('')} />}

        <section className="grid gap-4 lg:grid-cols-2">
          <TextPanel
            label={mode === 'json-to-csv' ? 'JSON Input' : 'CSV Input'}
            value={input}
            onChange={setInput}
            placeholder={placeholders[mode]}
            actions={
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-300"
              >
                Paste sample
              </button>
            }
          />
          <TextPanel label={outputLabel} value={output} readOnly placeholder="Run a conversion to see output here." />
        </section>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Outputs update only after you press Convert. Edge cases like nested keys, empty fields, and inconsistent row lengths are
            handled automatically.
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-500"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!output}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition enabled:hover:border-blue-500 enabled:hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-100 dark:enabled:hover:border-blue-400"
            >
              Download Output
            </button>
            <button
              type="button"
              onClick={handleConvert}
              disabled={isWorking}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
            >
              {isWorking ? 'Converting…' : 'Convert'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
