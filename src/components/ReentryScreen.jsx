import styles from '../styles/ReentryScreen.module.css'
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
    <div className={styles.screen}>
      <div className={styles.inner}>
        <p className={styles.label}>Your next move</p>
        <p className={styles.commitment}>{text}</p>
        <button className={styles.cta} onClick={handleCTA}>
          I'll do it.
        </button>
        <button className={styles.restart} onClick={restart}>
          start over
        </button>
      </div>
    </div>
  )
}
