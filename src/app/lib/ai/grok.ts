import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompts';

const grok = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.GROK_API_KEY,
});

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatWithGrok(
  messages: ChatMessage[],
  options?: { maxTokens?: number }
): Promise<{ content: string; provider: string; responseTime: number }> {
  const start = Date.now();
  try {
    const response = await grok.chat.completions.create({
      model: 'grok-3-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      temperature: 0.3,
      max_tokens: options?.maxTokens ?? 1200,
    });
    return {
      content: response.choices[0]?.message?.content || 'Sorry, no response generated.',
      provider: 'grok',
      responseTime: Date.now() - start,
    };
  } catch (error: any) {
    console.error('[Grok Error]', error.message);
    throw new Error('Grok API failed: ' + error.message);
  }
}
