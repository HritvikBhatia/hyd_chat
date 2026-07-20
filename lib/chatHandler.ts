// lib/chatHandler.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { Persona } from './personas';

export async function handlePersonaChat(req: Request, persona: Persona) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key missing." }, { status: 500 });
    }

    const { messages } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const responseStream = await ai.models.generateContentStream({
      model: persona.model,
      contents: formattedContents,
      config: { systemInstruction: persona.systemInstruction },
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
          }
        } catch (err: any) {
          controller.error(err);
        } finally {
          controller.close();
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
    console.error('Backend Streaming Exception:', error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}