# Cricket Stats Chatbot - Auto-Response Feature

## Overview
The chatbot now automatically generates intelligent responses about any cricket topic without needing database queries. Powered by Google Gemini, it provides instant answers like ChatGPT.

## Endpoints

### 1. Regular Chat (Instant Response)
**Endpoint:** `POST /api/chat`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**
```javascript
{
  "message": "Who is Virat Kohli?"
}
```

**Response:**
```javascript
{
  "type": "text",
  "message": "🏏 Virat Kohli is an Indian cricketer and former captain of the Indian national team. Known as 'The King of Cricket,' he's one of the most prolific run-scorers in international cricket history, with incredible consistency across all formats. His aggressive batting style and competitive spirit have made him a cricket icon worldwide. 👑",
  "powered_by": "gemini"
}
```

### 2. Streaming Chat (ChatGPT-like word-by-word)
**Endpoint:** `POST /api/chat/stream`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request:**
```javascript
{
  "message": "Tell me about MS Dhoni"
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"text":"🏏"}
data: {"text":" MS"}
data: {"text":" Dhoni"}
data: {"text":" is"}
data: {"text":" a"}
...
data: {"type":"done"}
```

## Example Questions It Handles

✅ "Who is Virat Kohli?"  
✅ "Tell me about Sachin Tendulkar"  
✅ "What are cricket rules?"  
✅ "How many players in a cricket team?"  
✅ "What's the difference between ODI and T20?"  
✅ "Who has the most centuries in cricket?"  
✅ "Explain cricket scoring system"  
✅ "Which countries play cricket?"  
✅ "What's a hat-trick in cricket?"  
✅ "Tell me about famous cricket records"  

## React Component - Regular Chat

```jsx
import { useState, useRef, useEffect } from 'react';

function CricketChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { type: 'assistant', text: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'error', text: 'Error getting response' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h1>🏏 Cricket Stats Assistant</h1>
        <p>Ask anything about cricket!</p>
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-content">
              {msg.type === 'user' && '👤'}
              {msg.type === 'assistant' && '🤖'}
              {msg.type === 'error' && '❌'}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="message assistant"><div className="typing">...</div></div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about cricket... (e.g., Who is Virat Kohli?)"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default CricketChatBot;
```

## React Component - Streaming Chat (ChatGPT-style)

```jsx
import { useState, useRef, useEffect } from 'react';

function StreamingCricketChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      const addMessage = () => {
        setMessages(prev => [...prev, { type: 'assistant', text: assistantMessage }]);
      };

      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'done') {
              addMessage();
            } else if (data.text) {
              assistantMessage += data.text;
              
              if (isFirstChunk) {
                setMessages(prev => [...prev, { type: 'assistant', text: data.text }]);
                isFirstChunk = false;
              } else {
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1].text += data.text;
                  return updated;
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { type: 'error', text: 'Error getting response' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h1>🏏 Cricket Stats Assistant</h1>
        <p>Powered by AI - Instant Answers About Cricket</p>
      </div>

      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-content">
              {msg.type === 'user' && '👤'}
              {msg.type === 'assistant' && '🤖'}
              {msg.type === 'error' && '❌'}
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && <div className="message assistant"><div className="typing">⏳ Typing...</div></div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me about cricket... (e.g., Who is Virat Kohli?)"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default StreamingCricketChatBot;
```

## CSS Styling

```css
.chatbot-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background: #f5f5f5;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header h1 {
  margin: 0;
  font-size: 24px;
  margin-bottom: 5px;
}

.chat-header p {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  display: flex;
  gap: 10px;
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: white;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message.error .message-content {
  background: #ff6b6b;
  color: white;
  border-bottom-left-radius: 4px;
}

.message-content p {
  margin: 0;
  line-height: 1.4;
}

.typing {
  display: inline-block;
  animation: blink 1.4s infinite;
}

@keyframes blink {
  0%, 20%, 50%, 80%, 100% {
    opacity: 1;
  }
  40% {
    opacity: 0.5;
  }
  60% {
    opacity: 0.7;
  }
}

.input-form {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: white;
  border-top: 1px solid #ddd;
}

.input-form input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.input-form input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-form button {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.input-form button:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.input-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

## Testing with cURL

### Regular Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Who is Virat Kohli?"}'
```

### Streaming Chat
```bash
curl -X POST http://localhost:5000/api/chat/stream \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Tell me about cricket scoring"}' \
  --no-buffer
```

## Features

✅ **Auto-generate responses** without database queries  
✅ **ChatGPT-like streaming** with word-by-word display  
✅ **Instant answers** about any cricket topic  
✅ **No data needed** - powered by Gemini AI  
✅ **Smart formatting** with emojis and structure  
✅ **Multiple question types** - players, rules, records, history  
✅ **Authentication** - token-based access  

## How It Works

1. User asks a cricket question
2. Gemini AI generates an intelligent response
3. Response streams back word-by-word (streaming endpoint)
4. Frontend displays text as it arrives (ChatGPT effect)
5. No database queries needed - pure AI knowledge
