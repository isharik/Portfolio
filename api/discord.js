const MAX_LENGTHS = { name: 80, email: 160, purpose: 80, message: 1500 }

const clean = (value, length) => String(value || '').trim().slice(0, length).replace(/@/g, '@\u200b')

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, purpose, message } = request.body || {}
  const fields = {
    name: clean(name, MAX_LENGTHS.name),
    email: clean(email, MAX_LENGTHS.email),
    purpose: clean(purpose, MAX_LENGTHS.purpose),
    message: clean(message, MAX_LENGTHS.message),
  }
  if (!fields.name || !fields.email || !fields.message) {
    return response.status(400).json({ error: 'Name, email, and message are required.' })
  }
  if (!process.env.DISCORD_WEBHOOK_URL) {
    return response.status(503).json({ error: 'Discord messaging is not configured yet.' })
  }

  try {
    const discordResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Sharik Portfolio',
        allowed_mentions: { parse: [] },
        embeds: [{
          title: 'New portfolio message',
          color: 7496670,
          fields: [
            { name: 'From', value: fields.name, inline: true },
            { name: 'Email', value: fields.email, inline: true },
            { name: 'About', value: fields.purpose || 'General enquiry', inline: false },
            { name: 'Message', value: fields.message, inline: false },
          ],
          footer: { text: 'portfolio-isharik.vercel.app' },
          timestamp: new Date().toISOString(),
        }],
      }),
    })
    if (!discordResponse.ok) return response.status(502).json({ error: 'Discord did not accept this message.' })
  } catch {
    return response.status(502).json({ error: 'Discord could not be reached. Please try again shortly.' })
  }

  return response.status(200).json({ ok: true })
}
