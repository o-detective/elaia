export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages;

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages
      })
    });

    const data = await response.json();
    return {
  statusCode: 200,
  body: JSON.stringify({
    reply: data.choices?.[0]?.message?.content || "⚠️ Δεν υπήρξε απάντηση."
  })
};
  } catch (error) {
    console.error("AI error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Κάτι πήγε στραβά στον server." })
    };
  }
}
