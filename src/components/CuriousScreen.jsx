import { useState, useEffect, useRef } from 'react'
import styles from '../styles/CuriousScreen.module.css'

export default function CuriousScreen({ messages, questionIndex, isLoading, error, submitAnswer }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant')

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus()
    }
  }, [isLoading, questionIndex])

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    submitAnswer(text)
    setText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={styles.screen}>
      <div className={styles.questionArea}>
        {lastAssistantMessage && (
          <p className={styles.question} key={questionIndex}>
            {lastAssistantMessage.content}
          </p>
        )}
        {isLoading && (
          <div className={styles.thinking}>
            <span /><span /><span />
          </div>
        )}
        {error && (
          <p className={styles.error}>{error}</p>
        )}
      </div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          className={styles.input}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Just say what's true…"
          rows={3}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!text.trim() || isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3L10 17M10 3L4 9M10 3L16 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  )
}
