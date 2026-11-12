export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.length > 6000) {
    return res.status(400).json({ error: "Bad request" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (response.status === 429) {
      return res.status(429).json({ code: "rate_limited" });
    }
    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic error:", response.status, err);
      return res.status(502).json({ error: "Upstream error" });
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text ?? "";

    // Extract the JSON object from the response
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(502).json({ code: "invalid_json" });
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return res.status(502).json({ code: "invalid_json" });
    }

    return res.status(200).json(parsed);
  } catch (e) {
    console.error("Handler error:", e);
    return res.status(500).json({ error: "Internal error" });
  }
}
