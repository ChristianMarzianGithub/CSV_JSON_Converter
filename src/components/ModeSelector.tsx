import type { ConversionMode } from '../types'

interface ModeSelectorProps {
  mode: ConversionMode
  onChange: (mode: ConversionMode) => void
}

const options: { label: string; value: ConversionMode; description: string }[] = [
  { label: 'JSON → CSV', value: 'json-to-csv', description: 'Flatten objects, handle arrays, and escape values.' },
  { label: 'CSV → JSON', value: 'csv-to-json', description: 'Auto-detect delimiter and rebuild nested keys.' },
]

export const ModeSelector = ({ mode, onChange }: ModeSelectorProps) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isActive = option.value === mode
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              isActive
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100'
                : 'border-gray-200 bg-white hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{option.label}</span>
              {isActive && <span className="text-xs font-medium text-blue-600 dark:text-blue-200">Active</span>}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
          </button>
        )
      })}
    </div>
  )
}
