import { useState } from "react";
import ReactMarkdown from "react-markdown";

function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[90%] sm:max-w-[85%]">
        {/* Message label */}
        <div
          className={`mb-1.5 flex items-center gap-2 text-[11px] font-medium sm:text-xs ${
            isUser ? "justify-end text-gray-500" : "justify-start text-gray-500"
          }`}
        >
          {!isUser && <span>✦</span>}

          <span>{isUser ? "You" : "Assistant"}</span>
        </div>

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-3.5 py-2.5 shadow-sm sm:px-4 sm:py-3 ${
            isUser
              ? "rounded-tr-md bg-gray-900 text-white"
              : "rounded-tl-md border border-gray-200 bg-white text-gray-900"
          }`}
        >
          <div
            className={`prose prose-xs max-w-none sm:prose-sm ${
              isUser ? "prose-invert" : ""
            }`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Collapsible Sources */}
          {message.role === "assistant" && message.sources?.length > 0 && (
            <div className="mt-3 border-t border-gray-200 pt-2.5 sm:mt-4 sm:pt-3">
              <button
                onClick={() => setShowSources((prev) => !prev)}
                className="flex w-full cursor-pointer items-center justify-between text-left text-[11px] font-semibold text-gray-500 transition hover:text-gray-800 sm:text-xs"
              >
                <span>Sources ({message.sources.length})</span>

                <span className="text-xs sm:text-sm">
                  {showSources ? "⌃" : "⌄"}
                </span>
              </button>

              {showSources && (
                <ul className="mt-2 space-y-1.5">
                  {message.sources.map((source, index) => (
                    <li
                      key={index}
                      className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] leading-5 text-gray-500 sm:px-3 sm:py-2 sm:text-xs"
                    >
                      {source}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
