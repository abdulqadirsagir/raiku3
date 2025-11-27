import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, QuizQuestion } from '../types';
import { QUESTION_COUNT, RAIKU_CONTEXT, FALLBACK_QUESTIONS, SPECIAL_HARD_QUESTIONS } from '../constants';
import { API_KEY } from '../config'; // <-- IMPORT THE KEY HERE

/**
 * Lazily initializes and returns a GoogleGenAI instance.
 * Throws an error if the API key is not available.
 */
const getAiClient = () => {
  if (!API_KEY || API_KEY === "PASTE_YOUR_GEMINI_API_KEY_HERE") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const handleApiError = (error: unknown): string => {
    console.error("Error connecting to Gemini API:", error);
    if (error instanceof Error && error.message === "API_KEY_MISSING") {
        return "Error: API_KEY is not configured. Make sure you have a config.ts file with your key.";
    }
    return "Sorry, there was an error connecting to the AI service. Please try again later.";
};

export const getRaikuAnswer = async (query: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const prompt = `You are an expert on Raiku. Based on the following context, answer the user's query. Your answer must be concise and under 200 characters. If the answer is not in the context, say you cannot find an answer.
    
    Context:
    ${RAIKU_CONTEXT}
    
    User Query: "${query}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    return handleApiError(error);
  }
};

const generateHardQuizWithSpecialQuestions = async (): Promise<QuizQuestion[]> => {
    try {
        const ai = getAiClient();
        const questionsToGenerate = QUESTION_COUNT - SPECIAL_HARD_QUESTIONS.length;
        const prompt = `Generate ${questionsToGenerate} quiz questions about Raiku based on the provided context. The difficulty level must be 'Hard' (a 9 out of 10 on a difficulty scale). These questions should test deep, nuanced understanding of the technical details, tokenomics, and specific mechanics like 'Proof of Inevitability'. The incorrect options should be plausible distractors that test for precise knowledge. For each question, provide a question text, an array of 4 multiple-choice options, and the 0-based index of the correct answer.
        
        Context:
        ${RAIKU_CONTEXT}
        
        Return the result as a JSON array of objects.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } },
                            correctAnswerIndex: { type: Type.INTEGER },
                        },
                        required: ["question", "options", "correctAnswerIndex"],
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const generatedQuestions = JSON.parse(jsonString);

        if (generatedQuestions && generatedQuestions.length === questionsToGenerate) {
            const combined = [...generatedQuestions, ...SPECIAL_HARD_QUESTIONS];
            // Fisher-Yates shuffle
            for (let i = combined.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [combined[i], combined[j]] = [combined[j], combined[i]];
            }
            return combined;
        }
        throw new Error("Malformed response from API");
    } catch (error) {
        console.error("Error generating hard quiz questions:", error);
        // On error, construct a hard quiz from fallbacks and special questions
        const fallbackSubset = FALLBACK_QUESTIONS.slice(0, QUESTION_COUNT - SPECIAL_HARD_QUESTIONS.length);
        const combined = [...fallbackSubset, ...SPECIAL_HARD_QUESTIONS];
        for (let i = combined.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [combined[i], combined[j]] = [combined[j], combined[i]];
        }
        return combined;
    }
};


export const generateQuizQuestions = async (difficulty: Difficulty): Promise<QuizQuestion[]> => {
  try {
     getAiClient(); // Check for API key early
  } catch (error) {
      // If the key is missing, immediately return fallback questions
      // The user will see a proper error when they try to use the search box.
      console.error("API Key is missing, using fallback questions for the quiz.");
      return FALLBACK_QUESTIONS;
  }

  if (difficulty === Difficulty.Hard) {
    return generateHardQuizWithSpecialQuestions();
  }
  
  try {
    const ai = getAiClient();
    const difficultyMap = {
      [Difficulty.Simple]: 'Simple (a 3 out of 10 on a difficulty scale, testing basic facts)',
      [Difficulty.Challenging]: 'Challenging (a 6 out of 10 on a difficulty scale, requiring connecting concepts)',
    };

    const prompt = `Generate ${QUESTION_COUNT} quiz questions about Raiku based on the provided context. The difficulty level should be '${difficultyMap[difficulty as keyof typeof difficultyMap]}'. For each question, provide a question text, an array of 4 multiple-choice options, and the 0-based index of the correct answer.
    
    Context:
    ${RAIKU_CONTEXT}
    
    Return the result as a JSON array of objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
            },
            required: ["question", "options", "correctAnswerIndex"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const questions = JSON.parse(jsonString);
    if (questions && questions.length === QUESTION_COUNT) {
        return questions;
    }
    return FALLBACK_QUESTIONS;
  } catch (error) {
    console.error("Error generating quiz questions from Gemini:", error);
    return FALLBACK_QUESTIONS;
  }
};