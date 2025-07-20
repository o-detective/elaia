export default async (req, res) => {
  try {
    const body = await req.json(); // Netlify-style parsing
    const messages = body.messages;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not set in environment variables." });
    }

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

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: "Η απάντηση της OpenAI ήταν άδεια." });
    }

    return res.status(200).json({
      choices: [
        {
          message: {
            content: data.choices[0].message.content
          }
        }
      ]
    });

  } catch (error) {
    console.error("Σφάλμα AI function:", error);
    return res.status(500).json({ error: "Σφάλμα OpenAI ή δικτύου." });
  }
};
