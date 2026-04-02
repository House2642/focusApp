import { FALLBACK_COMMITMENT } from '../lib/prompts.js'

export default function ReentryScreen({ commitment, restart }) {
  const text = commitment || FALLBACK_COMMITMENT

  function handleCTA() {
    if (typeof window.navigator.standalone !== 'undefined' && window.navigator.standalone) {
      window.location.href = '/'
    } else if (window.history.length > 1) {
      window.history.back()
    } else {
      window.close()
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center px-7" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
      <p className="font-serif text-accent text-sm tracking-widest uppercase mb-4">Your next move</p>
      <p className="font-serif text-text-primary text-[2rem] leading-snug mb-12">{text}</p>
      <button
        onClick={handleCTA}
        className="w-full py-4 bg-accent text-bg font-serif text-lg rounded-2xl mb-4 active:opacity-80 transition-opacity"
      >
        I'll do it.
      </button>
      <button
        onClick={restart}
        className="font-serif text-text-muted text-sm text-center py-2"
      >
        start over
      </button>
    </div>
  )
}
