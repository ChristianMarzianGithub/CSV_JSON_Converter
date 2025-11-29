interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => (
  <div className="flex items-start justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-700/60 dark:bg-red-900/40 dark:text-red-100">
    <div className="flex items-center gap-2">
      <span aria-hidden className="text-lg">⚠️</span>
      <p className="font-medium">{message}</p>
    </div>
    <button
      type="button"
      onClick={onDismiss}
      className="text-red-700 underline transition hover:text-red-900 dark:text-red-200 dark:hover:text-white"
    >
      Dismiss
    </button>
  </div>
)
