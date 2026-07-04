import { useState } from "react";
import api from "./Services/api";
import type { ChatRequest, ChatResponse } from "./types/chat";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    const payload: ChatRequest = {
      message,
      session_id: "default",
    };

    try {
      const result = await api.post<ChatResponse>("/chat/ask-career", payload);
      setResponse(result.data.response);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Career Chat</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Ask career advice..."
          style={{ width: "100%", marginBottom: 12 }}
        />

        <button type="submit" disabled={loading || !message}>
          {loading ? "Sending..." : "Send"}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: 20, padding: 16, background: "#f3f3f3" }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}

export default App;