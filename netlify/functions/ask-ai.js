export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages;

    const groqKey = process.env.GROQ_API_KEY;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Groq error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Σφάλμα σύνδεσης με Groq API." })
    };
  }
}
