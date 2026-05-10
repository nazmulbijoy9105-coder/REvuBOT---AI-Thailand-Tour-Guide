import { chatWithDeepSeek } from './deepseek';
import { chatWithGrok } from './grok';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function routeChat(
  messages: ChatMessage[]
): Promise<{ content: string; provider: string; responseTime: number }> {
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

  const complexKeywords = [
    'full itinerary', 'multi-city', '2 weeks', '3 weeks',
    'plan my entire', 'comprehensive guide', 'family trip',
    'honeymoon', 'group of', 'accessible travel',
  ];

  const isComplex = complexKeywords.some(kw => lastMessage.includes(kw));

  try {
    if (isComplex) {
      try {
        return await chatWithGrok(messages, { maxTokens: 1500 });
      } catch {
        console.log('[Router] Grok failed, falling back to DeepSeek');
        return await chatWithDeepSeek(messages, { maxTokens: 1500 });
      }
    }
    return await chatWithDeepSeek(messages);
  } catch (error) {
    try {
      return await chatWithGrok(messages);
    } catch {
      return {
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        provider: 'error',
        responseTime: 0,
      };
    }
  }
}
