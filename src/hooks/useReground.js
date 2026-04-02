import { useState, useEffect, useRef } from 'react'
import { OPENING_QUESTIONS, TRIGGER_MAP } from '../lib/prompts.js'

const INITIAL_STATE = {
  screen: 'caught',
  trigger: null,
  messages: [],
  questionIndex: 0,
  commitment: null,
  isDone: false,
  isLoading: false,
  error: null
}

async function fetchNextQuestion(trigger, messages, questionIndex) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trigger, messages, questionIndex })
  })
  if (!res.ok) throw new Error('API error')
  return res.json()
}

export default function useReground() {
  const [state, setState] = useState(INITIAL_STATE)
  const didRunUrlCheck = useRef(false)

  useEffect(() => {
    if (didRunUrlCheck.current) return
    didRunUrlCheck.current = true

    const params = new URLSearchParams(window.location.search)
    const shortcutTrigger = params.get('trigger')
    if (shortcutTrigger && TRIGGER_MAP[shortcutTrigger]) {
      doSelectTrigger(TRIGGER_MAP[shortcutTrigger])
    }
  }, [])

  function doSelectTrigger(trigger) {
    const openingQuestion = OPENING_QUESTIONS[trigger]
    setState({
      ...INITIAL_STATE,
      screen: 'curious',
      trigger,
      messages: [{ role: 'assistant', content: openingQuestion }],
      questionIndex: 0
    })
  }

  function selectTrigger(trigger) {
    doSelectTrigger(trigger)
  }

  async function submitAnswer(text) {
    if (!text.trim() || state.isLoading) return

    const userMessage = { role: 'user', content: text.trim() }
    const nextMessages = [...state.messages, userMessage]
    const nextIndex = state.questionIndex + 1

    setState(s => ({
      ...s,
      messages: nextMessages,
      isLoading: true,
      error: null
    }))

    try {
      const data = await fetchNextQuestion(state.trigger, nextMessages, nextIndex)

      if (data.isDone) {
        setState(s => ({
          ...s,
          screen: 'curious',
          isDone: true,
          messages: [...nextMessages, { role: 'assistant', content: data.message }],
          commitment: data.commitment,
          questionIndex: nextIndex,
          isLoading: false
        }))
      } else {
        setState(s => ({
          ...s,
          messages: [...nextMessages, { role: 'assistant', content: data.message }],
          questionIndex: nextIndex,
          isLoading: false
        }))
      }
    } catch {
      setState(s => ({
        ...s,
        isLoading: false,
        error: 'Something went wrong. Take a breath and try again.'
      }))
    }
  }

  function proceed() {
    setState(s => ({ ...s, screen: 'reentry' }))
  }

  function restart() {
    setState(INITIAL_STATE)
  }

  return {
    ...state,
    selectTrigger,
    submitAnswer,
    proceed,
    restart
  }
}
