export default async (req, res) => {
  const body = await req.json(); // <--- σημαντικό για Netlify

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
    return res.status(200).json(data); // <--- Στέλνουμε ΟΛΟ το response στο frontend
  } catch (error) {
    return res.status(500).json({ error: "Σφάλμα OpenAI ή σύνδεσης." });
  }
};
