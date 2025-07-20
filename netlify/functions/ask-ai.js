export default async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Μη έγκυρα δεδομένα." });
  }

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

    const reply = data.choices?.[0]?.message?.content || "Δεν υπήρξε απάντηση.";
    return res.status(200).json({
      choices: [{ message: { content: reply } }]
    });

  } catch (error) {
    return res.status(500).json({ reply: "❌ Παρουσιάστηκε σφάλμα στον server." });
  }
};
