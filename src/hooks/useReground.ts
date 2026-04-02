import { useState } from 'react';
import { OPENING_QUESTIONS, FALLBACK_COMMITMENT, Trigger } from '../lib/prompts';
import { RegroundState, Message } from '../lib/types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

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

async function fetchNextQuestion(
  trigger: Trigger,
  messages: Message[],
  questionIndex: number
): Promise<{ message: string; commitment: string | null; isDone: boolean }> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trigger, messages, questionIndex }),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
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
      const data = await fetchNextQuestion(state.trigger, nextMessages, nextIndex);

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
