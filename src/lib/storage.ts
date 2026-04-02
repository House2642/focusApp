import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trigger } from './prompts';

export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  trigger: Trigger;
  commitment: string;
  completed: boolean;
  minutesSaved: number;
}

const SESSIONS_KEY = '@reground:sessions';
const MINUTES_PER_SESSION = 15;

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export async function loadSessions(): Promise<Session[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveSession(session: Omit<Session, 'id' | 'date' | 'minutesSaved'>): Promise<void> {
  const sessions = await loadSessions();
  const newSession: Session = {
    ...session,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: todayStr(),
    minutesSaved: MINUTES_PER_SESSION,
  };
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify([...sessions, newSession]));
}

export function computeStreak(sessions: Session[]): number {
  const completedDays = new Set(
    sessions.filter(s => s.completed).map(s => s.date)
  );

  if (completedDays.size === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (completedDays.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function computeStats(sessions: Session[]) {
  const completed = sessions.filter(s => s.completed);
  const totalMinutes = completed.reduce((sum, s) => sum + s.minutesSaved, 0);

  const triggerCounts: Record<Trigger, number> = { anxiety: 0, avoiding: 0, bored: 0 };
  completed.forEach(s => { triggerCounts[s.trigger]++; });

  // Sessions this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekStr = weekAgo.toISOString().split('T')[0];
  const thisWeek = completed.filter(s => s.date >= weekStr).length;

  // Last 7 days bar data
  const weekDays: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    weekDays.push({
      date: dateStr,
      count: completed.filter(s => s.date === dateStr).length,
    });
  }

  return {
    totalSessions: completed.length,
    totalMinutes,
    thisWeek,
    triggerCounts,
    streak: computeStreak(sessions),
    weekDays,
  };
}
