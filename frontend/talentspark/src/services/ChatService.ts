import api from "./api";
import type { ChatResponse } from "../types/chat";

export async function sendChatMessage(payload: { message: string; session_id: string }): Promise<{ reply: string }> {
    const response = await api.post<ChatResponse>("/chat/ask-career", payload);
    return { reply: response.data.reply ?? response.data.response };
}

export async function askChat(message: string): Promise<string> {
    const response = await api.post<ChatResponse>("/chat/ask", { message });
    return response.data.response;
}

export async function askCareerChat(message: string, session_id: string): Promise<string> {
    const response = await api.post<ChatResponse>("/chat/ask-career", { message, session_id });
    return response.data.response;
}