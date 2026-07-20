import { NextResponse } from "next/server";
import { handlePersonaChat } from "../../../../lib/chatHandler";
import { getPersona } from "../../../../lib/personas";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ persona: string }> },
) {
  const { persona: slug } = await params;
  const persona = getPersona(slug);

  if (!persona) {
    return NextResponse.json(
      { error: `Unknown persona "${slug}"` },
      { status: 404 },
    );
  }

  return handlePersonaChat(req, persona);
}
