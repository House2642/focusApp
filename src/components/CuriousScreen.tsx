import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Message } from '../lib/types';
import { colors } from '../lib/theme';

interface Props {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  submitAnswer: (text: string) => void;
  isDone: boolean;
  proceed: () => void;
}

export default function CuriousScreen({ messages, isLoading, error, submitAnswer, isDone, proceed }: Props) {
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isLoading]);

  function handleSubmit() {
    if (!text.trim() || isLoading) return;
    submitAnswer(text.trim());
    setText('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={msg.role === 'assistant' ? styles.assistantRow : styles.userRow}
          >
            <Text style={msg.role === 'assistant' ? styles.assistantText : styles.userText}>
              {msg.content}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={styles.assistantRow}>
            <ActivityIndicator color={colors.accent} size="small" />
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      {isDone ? (
        <TouchableOpacity
          onPress={proceed}
          style={[styles.proceedButton, { paddingBottom: insets.bottom + 20 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.proceedText}>What else could I be doing?</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12 }]}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Just say what's true…"
            placeholderTextColor={colors.textMuted}
            multiline
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!text.trim() || isLoading}
            style={[styles.sendButton, (!text.trim() || isLoading) && styles.sendButtonDisabled]}
            activeOpacity={0.8}
          >
            <Text style={styles.sendArrow}>↑</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 20,
  },
  assistantRow: {
    maxWidth: '90%',
    alignSelf: 'flex-start',
  },
  userRow: {
    maxWidth: '82%',
    alignSelf: 'flex-end',
  },
  assistantText: {
    color: colors.textPrimary,
    fontSize: 20,
    lineHeight: 30,
  },
  userText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    maxHeight: 100,
    paddingVertical: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.3,
  },
  sendArrow: {
    color: colors.bg,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  proceedButton: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    paddingTop: 20,
  },
  proceedText: {
    color: colors.bg,
    fontSize: 16,
  },
});
