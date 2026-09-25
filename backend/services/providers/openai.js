import OpenAI from 'openai';

const getClient = () => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error('AI_API_KEY is not configured in .env file'), { status: 400 });
  }
  return new OpenAI({ apiKey });
};

export default {
  async plan(prompt, input) {
    const openai = getClient();
    const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

    const systemMessage = `You are an expert AI sports tournament planner. 
Your job is to generate a comprehensive, structured JSON schedule and rules for a sports tournament.
Respond ONLY with a valid JSON object matching this schema:
{
  "tournamentName": "string",
  "format": "string",
  "summary": "string",
  "rules": ["string"],
  "matches": [
    {
      "round": "string",
      "team1": "string",
      "team2": "string",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "venue": "string",
      "ground": "string"
    }
  ],
  "recommendations": ["string"]
}`;

    const completion = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response received from OpenAI API');
    return JSON.parse(content);
  },

  async chat(message, context = []) {
    const openai = getClient();
    const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

    const systemPrompt = context.length > 0
      ? `You are an AI Sports Tournament Assistant. Use the following document rules to answer the user accurately:\n\n${context.join('\n\n')}`
      : `You are an AI Sports Tournament Assistant. Provide helpful, accurate advice on sports tournament rules, structures, formats, and scheduling.`;

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || 'No response generated.';
  }
};
