import styles from '../styles/CaughtScreen.module.css'

const OPTIONS = [
  { id: 'anxiety',  label: 'Anxiety / FOMO' },
  { id: 'avoiding', label: 'Avoiding something hard' },
  { id: 'bored',    label: 'Just bored' }
]

export default function CaughtScreen({ selectTrigger }) {
  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Hey.</p>
        <h1 className={styles.question}>What's actually going on right now?</h1>
        <div className={styles.options}>
          {OPTIONS.map(opt => (
            <button
              key={opt.id}
              className={styles.option}
              onClick={() => selectTrigger(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
