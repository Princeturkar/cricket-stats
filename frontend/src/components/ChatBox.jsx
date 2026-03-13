import { useState, useRef, useEffect } from "react";
import "../styles/Chat.css";

function ChatBox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "👋 Hello! I'm your Cricket Stats Assistant. I can help you find player statistics, match results, team performance, and more. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (presetText) => {
    const userMessage = presetText || inputValue.trim();
    if (!userMessage) return;

    if (!presetText) setInputValue("");

    const userMessageId = Date.now();
    setMessages(prev => [...prev, {
      id: userMessageId,
      type: "user",
      text: userMessage
    }]);

    setLoading(true);

    const botMessageId = Date.now() + 1;
    setMessages(prev => [...prev, {
      id: botMessageId,
      type: "bot",
      text: "",
      loading: true
    }]);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error("Could not connect to AI service");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = "";

      setLoading(false);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === "done") break;
              if (data.type === "error") throw new Error(data.message);
              
              if (data.text) {
                botResponse += data.text;
                setMessages(prev => prev.map(msg => 
                  msg.id === botMessageId ? { ...msg, text: botResponse, loading: false } : msg
                ));
              }
            } catch (e) {
              console.error("Error parsing message chunk", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { 
          ...msg, 
          text: `❌ ${error.message || "Unable to get response. Please try again."}`, 
          isError: true,
          loading: false 
        } : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Show Virat Kohli stats",
    "India vs Pakistan results",
    "List all teams",
    "Top performers",
    "Match statistics"
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🏏 CRICKET AI ASSISTANT</h2>
        <p>Powered by Groq for lightning-fast statistics</p>
      </div>

      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper ${msg.type}`}>
            <div className={`message-bubble ${msg.isError ? 'error' : ''}`}>
              {msg.loading ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && (
        <div className="quick-questions">
          <span className="quick-questions-label">Quick Queries:</span>
          <div className="chips-container">
            {quickQuestions.map((question, idx) => (
              <button
                key={idx}
                className="question-chip"
                onClick={() => sendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="input-area">
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask anything about cricket..."
          disabled={loading}
        />
        <button
          className="send-button"
          onClick={() => sendMessage()}
          disabled={loading || !inputValue.trim()}
        >
          {loading ? "⏳" : "✈️"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
