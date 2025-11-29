import { ReactNode } from 'react'

interface TextPanelProps {
  label: string
  value: string
  onChange?: (value: string) => void
  readOnly?: boolean
  placeholder?: string
  actions?: ReactNode
}

export const TextPanel = ({ label, value, onChange, readOnly, placeholder, actions }: TextPanelProps) => {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800/70">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 text-sm font-semibold dark:border-gray-700">
        <span>{label}</span>
        {actions}
      </div>
      <textarea
        className="h-72 flex-1 resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}
