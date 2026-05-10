import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompts';

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithDeepSeek(
  messages: ChatMessage[],
  options?: { maxTokens?: number }
): Promise<{ content: string; provider: string; responseTime: number }> {
  const start = Date.now();
  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.3,
      max_tokens: options?.maxTokens ?? 800,
      frequency_penalty: 0.3,
      presence_penalty: 0.2,
    });
    return {
      content: response.choices[0]?.message?.content || 'Sorry, no response generated.',
      provider: 'deepseek',
      responseTime: Date.now() - start,
    };
  } catch (error: any) {
    console.error('[DeepSeek Error]', error.message);
    throw new Error('DeepSeek API failed: ' + error.message);
  }
}
