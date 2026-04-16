import { GoogleGenAI, Type } from "@google/genai";
import { PatientInfo, TriageResult, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getChatResponse(
  messages: ChatMessage[],
  patientInfo: PatientInfo,
  language: string
): Promise<string> {
  const systemInstruction = `
    You are a compassionate medical assistant for rural healthcare. 
    Your goal is to talk to the patient and gather detailed information about their symptoms.
    
    PATIENT INFO:
    - Age: ${patientInfo.age}
    - Gender: ${patientInfo.gender}
    - Vitals: ${JSON.stringify(patientInfo.vitals)}
    
    GUIDELINES:
    1. Speak in ${language}.
    2. Be empathetic and use simple, non-medical language.
    3. Ask one question at a time.
    4. Focus on gathering: onset, duration, severity, location, and associated symptoms.
    5. If the user mentions something serious (chest pain, severe bleeding), advise them to seek immediate help while continuing the triage if possible.
    6. Keep the conversation focused on health.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction,
    }
  });

  return response.text || "I'm sorry, I couldn't process that. Can you tell me more about how you feel?";
}

export async function performTriage(
  symptoms: string,
  patientInfo: PatientInfo,
  language: string
): Promise<TriageResult> {
  const prompt = `
    You are a highly accurate medical triage agent designed for rural healthcare settings.
    Your goal is to analyze symptoms and provide a safe, conservative triage recommendation.
    
    PATIENT DATA:
    - Symptoms: ${symptoms}
    - Age: ${patientInfo.age}
    - Gender: ${patientInfo.gender}
    - Temperature: ${patientInfo.vitals.temperature || 'Not provided'}
    - Blood Pressure: ${patientInfo.vitals.bloodPressure || 'Not provided'}
    - Heart Rate: ${patientInfo.vitals.heartRate || 'Not provided'}
    
    INSTRUCTIONS:
    1. Identify the most likely conditions (up to 3) based on the symptoms.
    2. Assign a triage level:
       - 'Emergency': Life-threatening (e.g., chest pain, severe bleeding, unconsciousness).
       - 'Hospital': Serious but not immediate (e.g., high fever with rash, suspected fracture).
       - 'Clinic': Needs professional evaluation (e.g., persistent cough, minor infection).
       - 'Self-care': Minor issues (e.g., common cold, mild muscle strain).
    3. Provide clear, actionable first-aid steps in the patient's language (${language}).
    4. Provide a clear recommendation and facility type in ${language}.
    5. Be concise and use simple language suitable for rural patients.
    6. ALWAYS prioritize safety. If in doubt, err on the side of a higher triage level.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          level: {
            type: Type.STRING,
            enum: ["Self-care", "Clinic", "Hospital", "Emergency"],
            description: "The triage level based on severity."
          },
          conditions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["name", "confidence", "description"]
            }
          },
          firstAid: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of immediate first-aid steps in the patient's language."
          },
          recommendation: {
            type: Type.STRING,
            description: "A clear recommendation on what to do next in the patient's language."
          },
          facilityType: {
            type: Type.STRING,
            description: "The type of facility the patient should visit (e.g., Primary Health Center, District Hospital, Emergency Room)."
          }
        },
        required: ["level", "conditions", "firstAid", "recommendation", "facilityType"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as TriageResult;
  } catch (error) {
    console.error("Failed to parse triage result:", error);
    throw new Error("Failed to analyze symptoms. Please try again.");
  }
}
