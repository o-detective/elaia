export default async (req, res) => {
  const body = await req.json();
  const messages = body.messages;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await aiResponse.json();
    const result = data.choices?.[0]?.message?.content || "⚠️ Δεν υπήρξε απάντηση.";
    return res.status(200).json({ reply: result });

  } catch (error) {
    return res.status(500).json({ reply: "❌ Παρουσιάστηκε σφάλμα." });
  }
};
