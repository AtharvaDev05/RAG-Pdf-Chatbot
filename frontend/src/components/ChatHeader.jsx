function ChatHeader({ uploadedFile }) {
  return (
    <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        {/* Header information */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
              Document Chat
            </h2>

            {uploadedFile && (
              <span className="hidden text-xs text-gray-400 sm:inline">•</span>
            )}

            {uploadedFile && (
              <p className="hidden max-w-48 truncate text-xs text-gray-500 sm:block">
                {uploadedFile.name}
              </p>
            )}
          </div>

          <p className="text-[11px] text-gray-500 sm:text-xs">
            Ask questions about your uploaded PDF
          </p>
        </div>

        {/* Status */}
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              uploadedFile ? "bg-green-500" : "bg-gray-300"
            }`}
          ></span>

          <span
            className={`text-xs font-medium ${
              uploadedFile ? "text-green-600" : "text-gray-400"
            }`}
          >
            {uploadedFile ? "Ready" : "No document"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;