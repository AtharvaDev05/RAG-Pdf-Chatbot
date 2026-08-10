import UploadArea from "./UploadArea";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import { useState } from "react";

function MainLayout() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSend = async (question) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "user",
        content: question,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("AI usage limit reached. Please try again later.");
        }

        if (response.status === 503) {
          throw new Error(
            "The AI service is temporarily unavailable. Please try again in a moment.",
          );
        }

        if (response.status === 400) {
          throw new Error(
            "Please make sure a valid PDF is uploaded before asking a question.",
          );
        }

        throw new Error("Something went wrong while getting the answer.");
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      console.error("Query error:", error);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `⚠️ ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ChatHeader uploadedFile={uploadedFile} />

        <UploadArea onUploadSuccess={setUploadedFile} />

        <ChatWindow messages={messages} loading={loading} />

        <ChatInput
          onSend={handleSend}
          loading={loading}
          uploadedFile={uploadedFile}
        />
      </div>
    </main>
  );
}

export default MainLayout;
