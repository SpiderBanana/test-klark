import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateDescription = async (title) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant qui génère des descriptions courtes et pertinentes pour des tâches. Réponds en français et limite ta réponse à 2-3 phrases maximum."
        },
        {
          role: "user",
          content: `Génère une description pour cette tâche: "${title}"`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    return null;
  }
};
