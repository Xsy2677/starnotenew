import { API_BASE_URL } from './constants';

interface ChatResponse {
  response: string;
  session_id: string;
}

export async function sendChatMessage(
  userId: string,
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      message,
      session_id: sessionId,
    }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}

export async function extractEmotion(text: string): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/emotion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Emotion extraction failed');
  const data = await res.json();
  return data.emotions;
}

export async function getEmotionSummary(conversationHistory: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation: conversationHistory }),
  });
  if (!res.ok) throw new Error('Summary request failed');
  return res.json();
}