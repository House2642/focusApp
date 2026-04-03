import { useState } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { OPENING_QUESTIONS, FALLBACK_COMMITMENT, buildSystemPrompt, Trigger } from '../lib/prompts';
import { RegroundState, Message } from '../lib/types';

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '',
  dangerouslyAllowBrowser: true,
});

const INITIAL_STATE: RegroundState = {
  screen: 'caught',
  trigger: null,
  messages: [],
  questionIndex: 0,
  commitment: null,
  isDone: false,
  isLoading: false,
  error: null,
};

function extractCommitment(text: string): string | null {
  const match = text.match(/\[COMMITMENT:\s*(.+?)\]/i);
  return match ? match[1].trim() : null;
}

async function askClaude(
  trigger: Trigger,
  messages: Message[],
  questionIndex: number
): Promise<{ message: string; commitment: string | null; isDone: boolean }> {
  const systemPrompt = buildSystemPrompt(trigger, questionIndex);

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 256,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
  });

  const fullText = response.content[0].type === 'text' ? response.content[0].text : '';
  const commitment = extractCommitment(fullText) || (questionIndex >= 2 ? FALLBACK_COMMITMENT : null);
  const message = fullText.replace(/\[COMMITMENT:.*?\]/gi, '').trim();
  const isDone = questionIndex >= 2 || commitment !== null;

  return { message, commitment, isDone };
}

export default function useReground() {
  const [state, setState] = useState<RegroundState>(INITIAL_STATE);

  function selectTrigger(trigger: Trigger) {
    setState({
      ...INITIAL_STATE,
      screen: 'curious',
      trigger,
      messages: [{ role: 'assistant', content: OPENING_QUESTIONS[trigger] }],
      questionIndex: 0,
    });
  }

  async function submitAnswer(text: string) {
    if (!text.trim() || state.isLoading || !state.trigger) return;

    const userMessage: Message = { role: 'user', content: text.trim() };
    const nextMessages = [...state.messages, userMessage];
    const nextIndex = state.questionIndex + 1;

    setState(s => ({ ...s, messages: nextMessages, isLoading: true, error: null }));

    try {
      const data = await askClaude(state.trigger, nextMessages, nextIndex);

      if (data.isDone) {
        setState(s => ({
          ...s,
          screen: 'curious',
          isDone: true,
          messages: [...nextMessages, { role: 'assistant', content: data.message }],
          commitment: data.commitment,
          questionIndex: nextIndex,
          isLoading: false,
        }));
      } else {
        setState(s => ({
          ...s,
          messages: [...nextMessages, { role: 'assistant', content: data.message }],
          questionIndex: nextIndex,
          isLoading: false,
        }));
      }
    } catch {
      setState(s => ({
        ...s,
        isLoading: false,
        error: 'Something went wrong. Take a breath and try again.',
      }));
    }
  }

  function proceed() {
    setState(s => ({ ...s, screen: 'reentry' }));
  }

  function restart() {
    setState(INITIAL_STATE);
  }

  return { ...state, selectTrigger, submitAnswer, proceed, restart };
}
