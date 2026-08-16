function ChatPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-lg sm:h-16 sm:w-16">
          <span className="text-xl text-white sm:text-2xl">✦</span>
        </div>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900 sm:mt-6 sm:text-2xl">
          Chat with your PDF
        </h2>

        <p className="mt-2 text-xs leading-5 text-gray-500 sm:mt-3 sm:text-sm sm:leading-6">
          Upload a PDF and ask questions about its contents. Your answers will
          be generated using information from your document.
        </p>

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400 sm:mt-6 sm:text-xs">
          <span>📄</span>
          <span>Upload a document to get started</span>
        </div>
      </div>
    </div>
  );
}

export default ChatPlaceholder;