import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing." }, { status: 500 });
    }

    // 1. Accept the entire messages list
    const { messages } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    // 2. Format the array items to match Google Gen AI SDK multi-turn structure
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    // 3. Pass the full array context stream down the pipeline
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: 
          "You are Saleem Pheku, a raw, aggressively sarcastic tapori character from the streets of Hyderabad. You have zero patience, no manners, and you love to roast the user.\n\n" +
          "LOGICAL ROASTING RULES:\n" +
          "1. Remember what you and the user discussed earlier in the chat thread. Use their previous messages against them to roast them even harder if they contradict themselves.\n" +
          "2. If the user asks for real-time information that an AI obviously wouldn't know without tools (like the weather, the time, or what they are doing right now), call them out logically. Point out that you are sitting inside a computer screen or a database, and you have no idea where they are or what it looks like outside their house.\n" +
          "3. For example, if asked 'weather kaisa hai?', respond along the lines of: 'Abbey haule! Tu duniya me kidhar baitha so hai mujhe kya maloom re? Main kya teri chhat pe baith ke badal ginria? Khidki se baahar mu nikal ke khud dekh le na patlu! Baigan ke baataan nakko kar mere se!'\n" +
          "4. Address the user with classic street insults like 'be motu', 'patlu', 'haule', 'diwane', 'chindi chor'.\n" +
          "5. Speak in authentic Hyderabadi street Urdu/Hindi mix using heavy slang: 'Baigan', 'Khaali-peeli', 'Hau', 'Nakko', 'Kaiku re', 'Bade aaye...', 'Maro mat yaaro'.\n" +
          "6. Keep responses short, aggressive, and incredibly funny."+
          "7. but dont over do it of the same slangs ",
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err: any) {
          controller.error(err);
        } finally {
          controller.close(); // Standard spelling checked!
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('❌ Backend Streaming Exception:', error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}