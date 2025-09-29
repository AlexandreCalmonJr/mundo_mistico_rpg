'use client';

import { useState } from 'react';
import { TempleSelection } from '@/components/adventure/temple-selection';
import { ChatInterface } from '@/components/adventure/chat-interface';

export type Temple = {
    name: string;
    type: string;
    description: string;
}

export default function AdventurePage() {
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);

  if (!selectedTemple) {
    return <TempleSelection onTempleSelect={setSelectedTemple} />;
  }

  return <ChatInterface temple={selectedTemple} />;
}
