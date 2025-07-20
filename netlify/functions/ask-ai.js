const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const { messages } = JSON.parse(event.body);

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
    const reply = data.choices?.[0]?.message?.content || "Δεν βρέθηκε απάντηση.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "❌ Παρουσιάστηκε σφάλμα." })
    };
  }
};
