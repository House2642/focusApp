import { Trigger } from './prompts';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RegroundState {
  screen: 'caught' | 'curious' | 'reentry';
  trigger: Trigger | null;
  messages: Message[];
  questionIndex: number;
  commitment: string | null;
  isDone: boolean;
  isLoading: boolean;
  error: string | null;
}
