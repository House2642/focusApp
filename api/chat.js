import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const FALLBACK_COMMITMENT = "Take one breath and name what you're actually feeling."

function buildSystemPrompt(trigger, questionIndex) {
  const triggerContext = {
    anxiety:  'The user is experiencing anxiety or FOMO — they feel caught in a loop of worry or comparison.',
    avoiding: 'The user is avoiding something difficult — there is likely fear, overwhelm, or perfectionism underneath.',
    bored:    'The user is bored and probably procrastinating — they are waiting for motivation that will not come on its own.',
  }[trigger]

  const isLastQuestion = questionIndex >= 2

  return `You are a calm, warm presence helping someone briefly reconnect with what's real. They opened this app mid-scroll or mid-avoidance spiral.

Context: ${triggerContext}

Rules:
- Ask ONE follow-up question per response. Never two.
- Max 2 sentences total. Be direct and warm.
- Surface the feeling underneath — do not solve it, do not give advice.
- Sound like a thoughtful friend, not a therapist or a productivity bot.
- Never use bullet points, numbered lists, or headers.
- Keep it conversational and human. Short sentences work best.
${isLastQuestion ? `
- This is your final response. After your question or reflection, end with exactly this format on a new line:
  [COMMITMENT: <one micro-action, specific and doable in 30 seconds, e.g. "Write one bad sentence" or "Say the fear out loud">]
- The commitment should be tiny and concrete. Not motivational fluff.` : ''}`.trim()
}

function extractCommitment(text) {
  const match = text.match(/\[COMMITMENT:\s*(.+?)\]/i)
  return match ? match[1].trim() : null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { trigger, messages, questionIndex } = req.body

  if (!trigger || !messages || typeof questionIndex !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const systemPrompt = buildSystemPrompt(trigger, questionIndex)

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 180,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })

    const fullText = response.content[0].text
    const commitment = extractCommitment(fullText) || (questionIndex >= 2 ? FALLBACK_COMMITMENT : null)
    const message = fullText.replace(/\[COMMITMENT:.*?\]/gi, '').trim()
    const isDone = questionIndex >= 2 || commitment !== null

    res.status(200).json({ message, commitment, isDone })
  } catch (err) {
    console.error('Claude API error:', err.message)
    res.status(500).json({ error: 'Claude unavailable' })
  }
}
