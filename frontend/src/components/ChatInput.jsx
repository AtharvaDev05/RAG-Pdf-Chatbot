import { useState } from "react";

function ChatInput({ onSend, loading, uploadedFile }) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim() || loading) return;

    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    // Enter sends the message
    // Shift + Enter creates a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {!uploadedFile ? (
          /* No PDF uploaded */
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span className="text-base">🔒</span>

              <span>Upload a PDF to start chatting.</span>
            </div>
          </div>
        ) : (
          /* PDF uploaded */
          <>
            <div className="rounded-2xl border border-gray-300 bg-gray-50 p-2 shadow-sm transition focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-md">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask something about your PDF..."
                  disabled={loading}
                  rows={1}
                  className="max-h-32 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-gray-900 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Send message"
                  title="Send message"
                >
                  {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white"></span>
                  ) : (
                    <span className="text-lg leading-none">➤</span>
                  )}
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-xs text-gray-400">
              AI-generated answers · Always verify important information
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatInput;