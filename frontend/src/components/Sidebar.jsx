function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Branding */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
            <span className="text-lg font-bold text-white">✦</span>
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              DocuMind
            </h1>

            <p className="text-xs text-gray-500">AI PDF Assistant</p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="px-4">
        <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.98]">
          <span className="text-base leading-none">+</span>

          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History */}
      <div className="mt-8 min-h-0 flex-1 overflow-y-auto px-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Recent Chats
        </p>

        {/* Empty history state */}
        <div className="mt-6 px-2 text-center">
          <div className="text-2xl text-gray-300">💬</div>

          <p className="mt-2 text-xs font-medium text-gray-400">
            No recent chats
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-400">
            Your conversations will appear here.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        <button className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
          <span className="text-base">⚙</span>

          <span>Settings</span>
        </button>

        <button className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
          <span className="text-base">👤</span>

          <span>Login</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;