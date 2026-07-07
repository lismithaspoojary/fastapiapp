export type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface ChatResponse {
  response: string;
  reply?: string;
}