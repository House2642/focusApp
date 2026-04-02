import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CaughtScreen from '../src/components/CaughtScreen';
import CuriousScreen from '../src/components/CuriousScreen';
import ReentryScreen from '../src/components/ReentryScreen';
import useReground from '../src/hooks/useReground';
import { computeStreak, loadSessions } from '../src/lib/storage';
import { colors } from '../src/lib/theme';

export default function HomeScreen() {
  const state = useReground();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadSessions().then(sessions => setStreak(computeStreak(sessions)));
  }, []);

  function handleDone() {
    loadSessions().then(sessions => setStreak(computeStreak(sessions)));
    state.restart();
  }

  return (
    <View style={styles.container}>
      {state.screen === 'caught' && (
        <CaughtScreen
          selectTrigger={state.selectTrigger}
          streak={streak}
        />
      )}
      {state.screen === 'curious' && (
        <CuriousScreen
          messages={state.messages}
          isLoading={state.isLoading}
          error={state.error}
          submitAnswer={state.submitAnswer}
          isDone={state.isDone}
          proceed={state.proceed}
        />
      )}
      {state.screen === 'reentry' && (
        <ReentryScreen
          commitment={state.commitment}
          trigger={state.trigger}
          restart={state.restart}
          onDone={handleDone}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
