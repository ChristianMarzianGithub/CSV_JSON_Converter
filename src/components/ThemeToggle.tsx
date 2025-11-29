interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:border-blue-400 dark:border-gray-700 dark:bg-gray-800"
  >
    <span className="text-lg" aria-hidden>
      {isDark ? '🌙' : '☀️'}
    </span>
    <span>{isDark ? 'Dark' : 'Light'} mode</span>
  </button>
)
