import UploadArea from "./UploadArea";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import ChatHeader from "./ChatHeader";
import { useState, useEffect } from "react";

function MainLayout() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("access_token");
          return;
        }

        const data = await response.json();

        setCurrentUser(data);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

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
      const token = localStorage.getItem("access_token")
      
      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
      <Sidebar currentUser = {currentUser}/>

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
