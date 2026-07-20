"use client";

import ChatUI from "@/components/ChatUI";
import { personas } from "@/lib/personas";

const persona = personas.mah;

export default function Chat() {
  return (
    <ChatUI
      apiEndpoint={`/api/chat/${persona.slug}`}
      characterName={persona.name}
      avatarSrc={persona.avatarSrc}
      emptyStateText={persona.emptyStateText}
      placeholderText={persona.placeholderText}
      typingText={persona.typingText}
    />
  );
}
