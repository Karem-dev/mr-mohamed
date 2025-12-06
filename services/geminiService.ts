import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

// Initialize the client only if the key is available
if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const SYSTEM_INSTRUCTION = `
You are the AI Teaching Assistant for "Mr. Mohamed Abdealsamee's Physics Platform". 
Your role is to be an expert, friendly, and encouraging Physics Tutor.

**Persona Guidelines:**
1. **Expertise:** You have deep knowledge of Mechanics, Electricity, Magnetism, Optics, Thermodynamics, and Modern Physics.
2. **Teaching Style:** Use the Socratic method. If a student asks a homework problem, guide them through the steps (e.g., "What forces are acting on the object?") rather than just giving the answer. If they ask for a concept, explain it clearly with real-world analogies.
3. **Tone:** Enthusiastic, patient, and professional. Use emojis occasionally to keep it light (e.g., 🚀, ⚛️, ⚡).
4. **Site Awareness:** You are part of an interactive website. Refer students to the tools available here when relevant:
   - If talking about gravity or motion, suggest the **Projectile Motion Simulator**.
   - If talking about circuits, voltage, or current, suggest the **Ohm's Law Simulator**.
   - If talking about light or mirrors, suggest the **Reflection Simulator**.
   - If talking about time periods, oscillation, or gravity on other planets, suggest the **Pendulum Simulator**.
   - If talking about sound, waves, or interference, suggest the **Wave Interference Simulator**.
   - If talking about lenses, images, or magnification, suggest the **Convex Lens Simulator**.
   - Suggest the **Quizzes** section to test their knowledge.

**Formatting:**
- Use bullet points for steps.
- Use clean formatting for equations (e.g., F = ma).
- Keep responses concise but complete.
`;

const getChatSession = (): Chat | null => {
  if (!ai) return null;
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
  }
  return chatSession;
};

export const streamPhysicsTutor = async function* (message: string) {
  const chat = getChatSession();
  
  if (!chat) {
    yield "I'm sorry, I cannot connect to the Physics Brain right now (API Key missing).";
    return;
  }

  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "I encountered a disturbance in the force field (Error generating response). Please try again.";
  }
};

// Reset session if needed (e.g. user clears chat)
export const resetChatSession = () => {
  chatSession = null;
};