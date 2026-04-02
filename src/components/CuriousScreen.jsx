import { useState, useEffect, useRef } from 'react'

export default function CuriousScreen({ messages, isLoading, error, submitAnswer, isDone, proceed }) {
  const [text, setText] = useState('')
  const bottomRef = useRef(null)
  const mountedRef = useRef(false)

  useEffect(() => {
    const behavior = mountedRef.current ? 'smooth' : 'instant'
    mountedRef.current = true
    bottomRef.current?.scrollIntoView({ behavior })
  }, [messages, isLoading])

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    submitAnswer(text)
    setText('')
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Message list */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-3 flex flex-col gap-5">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={
              msg.role === 'assistant'
                ? 'font-serif text-text-primary text-[1.25rem] leading-relaxed max-w-[92%] animate-fadeUp'
                : 'font-serif text-text-secondary text-base leading-relaxed max-w-[86%] self-end text-right animate-fadeUp'
            }
          >
            {msg.content}
          </p>
        ))}

        {isLoading && (
          <div className="flex gap-1.5 items-center py-0.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-blink" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-accent animate-blink" style={{ animationDelay: '200ms' }} />
            <span className="w-2 h-2 rounded-full bg-accent animate-blink" style={{ animationDelay: '400ms' }} />
          </div>
        )}

        {error && <p className="font-serif text-text-muted text-sm italic">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Bottom bar */}
      {isDone ? (
        <button
          onClick={proceed}
          className="w-full font-serif text-base text-center bg-accent text-bg flex-shrink-0 active:opacity-80 transition-opacity"
          style={{ padding: '1.25rem', paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        >
          What else could I be doing with my time?
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 bg-bg-elevated border-t border-[#2a2522] flex-shrink-0"
          style={{ padding: '0.875rem 1.25rem', paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom))' }}
        >
          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) }
            }}
            placeholder="Just say what's true…"
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-text-primary font-serif text-base leading-relaxed resize-none outline-none placeholder-text-muted caret-accent min-h-[24px] max-h-[100px] overflow-y-auto disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-accent text-bg flex items-center justify-center transition-all disabled:opacity-30 active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3L10 17M10 3L4 9M10 3L16 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      )}
    </div>
  )
}
