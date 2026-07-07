import { useState } from "react";
import api from "../services/api";
import type { ChatRequest, ChatResponse } from "../types/chat";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    const payload: ChatRequest = {
      message: message.trim(),
      session_id: "default",
    };

    try {
      const result = await api.post<ChatResponse>("/chat/ask-career", payload);
      setResponse(result.data.response);
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 20, padding: 24 }}>
        <h1 style={{ color: "#1d4ed8" }}>Career Chat</h1>

        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="Ask career advice..."
            style={{ width: "100%", marginBottom: 12 }}
          />

          <button type="submit" disabled={loading || !message.trim()}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 16 }}>
          Error: {error}
        </div>
      )}

      {response && (
        <section style={{ marginTop: 24, padding: 16, background: "#f4f4f4" }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </section>
      )}
    </main>
  );
}

export default App;