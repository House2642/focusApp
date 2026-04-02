import { useState, useEffect, useRef } from 'react'
import styles from '../styles/CuriousScreen.module.css'

export default function CuriousScreen({ messages, questionIndex, isLoading, error, submitAnswer, isDone, proceed }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    const behavior = mountedRef.current ? 'smooth' : 'instant'
    mountedRef.current = true
    bottomRef.current?.scrollIntoView({ behavior })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
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
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === 'assistant' ? styles.assistantMsg : styles.userMsg}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className={styles.thinking}>
            <span /><span /><span />
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div ref={bottomRef} />
      </div>

      {isDone ? (
        <button className={styles.ctaBar} onClick={proceed}>
          What else could I be doing with my time?
        </button>
      ) : (
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className={styles.input}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Just say what's true…"
            rows={1}
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
      )}
    </div>
  )
}
