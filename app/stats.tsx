import { useRouter } from 'expo-router';
import StatsScreen from '../src/components/StatsScreen';

export default function StatsRoute() {
  const router = useRouter();
  return <StatsScreen onBack={() => router.back()} />;
}
