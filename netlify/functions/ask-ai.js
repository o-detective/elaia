export async function handler(event, context) {
  try {
    const body = JSON.parse(event.body);
    const messages = body.messages;

    const groqKey = process.env.GROQ_API_KEY;

    // Ανίχνευση γλώσσας από το πρώτο μήνυμα χρήστη
    const userFirstMessage = messages.find(m => m.role === "user")?.content || "";
    let languageHint = "Greek"; // προεπιλογή
    if (/[\u0400-\u04FF]/.test(userFirstMessage)) {
      languageHint = "Russian";
    } else if (/[a-zA-Z]/.test(userFirstMessage)) {
      languageHint = "English";
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(userFirstMessage)) {
      languageHint = "French";
    } else if (/[áéíóúñ¿¡]/i.test(userFirstMessage)) {
      languageHint = "Spanish";
    }

    // Προσθήκη system prompt για καθοδήγηση γλώσσας
    messages.unshift({
      role: "system",
      content: `You are Elaia, an elegant and professional assistant helping people organize events in Greece. Always respond in the language the user uses. The detected language is: ${languageHint}.`
    });

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
