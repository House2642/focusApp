const OPTIONS = [
  { id: 'anxiety',  label: 'Anxiety / FOMO' },
  { id: 'avoiding', label: 'Avoiding something hard' },
  { id: 'bored',    label: 'Just bored' },
]

export default function CaughtScreen({ selectTrigger }) {
  return (
    <div className="flex flex-col flex-1 justify-center px-7" style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}>
      <p className="font-serif text-accent text-sm tracking-widest uppercase mb-3">Hey.</p>
      <h1 className="font-serif text-text-primary text-[2rem] leading-snug mb-10">
        What's actually going on right now?
      </h1>
      <div className="flex flex-col gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.id}
            onClick={() => selectTrigger(opt.id)}
            className="w-full text-left px-5 py-4 rounded-2xl bg-bg-elevated text-text-primary font-serif text-lg active:bg-bg-elevated-2 transition-colors"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
