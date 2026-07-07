import { useState } from "react";
import api from "../services/api";
import type { ChatRequest, ChatResponse } from "../types/chat";

function ChatPage() {
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
    <main className="chat-container">
      <div className="chat-card">
        <h1 className="chat-title">Career Chat</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1" style={{ gap: 'var(--space-lg)' }}>
          <div className="form-group">
            <label className="form-label">Ask for career advice</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Ask anything about your career, jobs, or professional growth..."
              className="form-input"
              style={{ resize: 'vertical', minHeight: '120px' }}
            />
          </div>

          <button type="submit" disabled={loading || !message.trim()} className="btn btn-primary">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message" style={{ marginTop: 'var(--space-lg)' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <section className="chat-response" style={{ marginTop: 'var(--space-xl)' }}>
          <strong style={{ color: 'var(--primary-700)' }}>Response:</strong>
          <p style={{ marginTop: 'var(--space-sm)', color: 'var(--text-primary)' }}>{response}</p>
        </section>
      )}
    </main>
  );
}

export default ChatPage;