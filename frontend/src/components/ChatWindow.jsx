import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatPlaceholder from "./ChatPlaceholder";

function ChatWindow({ messages, loading, uploadedFile }) {
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check whether the user is close to the bottom
  const checkScrollPosition = () => {
    const container = chatContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setShowScrollButton(distanceFromBottom > 150);
  };

  // Listen for manual scrolling
  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container) return;

    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  // Scroll automatically only if the user is already near the bottom
  useEffect(() => {
    const container = chatContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom <= 150) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  // Manually go to the latest message
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={chatContainerRef}
      className="relative min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.length === 0 && !loading ? (
          <ChatPlaceholder />
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></span>

                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"></span>

                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="sticky bottom-4 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md transition hover:bg-gray-50 hover:text-gray-900"
          aria-label="Scroll to latest message"
          title="Scroll to latest message"
        >
          ↓
        </button>
      )}
    </div>
  );
}

export default ChatWindow;
