import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, FALLBACK_COMMITMENT } from '../src/lib/prompts.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
