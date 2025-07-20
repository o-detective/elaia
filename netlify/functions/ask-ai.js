const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "⚠️ Δεν υπήρξε απάντηση.";

    return {
      statusCode: 200,
      body: JSON.stringify({ choices: [{ message: { content: reply } }] })
    };
  } catch (err) {
    console.error("AI ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI server error" })
    };
  }
};
