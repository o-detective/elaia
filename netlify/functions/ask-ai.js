export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages;

    const apiKey = process.env.OPENAI_API_KEY;

    console.log("👉 Ερώτηση που λάβαμε:", JSON.stringify(messages));
    console.log("👉 Έχουμε API Key;", !!apiKey);

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

    console.log("✅ Απάντηση από OpenAI:", JSON.stringify(data));

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("❌ AI error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Κάτι πήγε στραβά στον server." })
    };
  }
}
