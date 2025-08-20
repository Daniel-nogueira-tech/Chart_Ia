import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    if (result.response && typeof result.response.text === "function") {
      const textResponse = await result.response.text();
      return textResponse;
    } else {
      console.error("Formato de resposta inesperado:", result);
      return "Erro ao obter resposta do modelo.";
    }
  } catch (error) {
    console.error("Erro ao chamar API Gemini:", error);
    return "Erro ao processar a resposta.";
  }
}

export default run;
