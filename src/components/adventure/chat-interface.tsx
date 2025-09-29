import { useState, useRef, useEffect } from 'react';
import type { Temple } from '@/app/dashboard/adventure/page';
import { aiChatGameMaster } from '@/ai/flows/ai-chat-game-master';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { PuzzleChallenge } from './puzzle-challenge';
import type { Character } from '@/lib/game-data';
import { gameClasses, races } from '@/lib/game-data';

interface ChatInterfaceProps {
  temple: Temple;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatInterface({ temple }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<string | null>(null);
  const [characterDetails, setCharacterDetails] = useState('');

  const scrollAreaRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    const charData = localStorage.getItem('character');
    let details = 'Aventureiro desconhecido';
    if (charData) {
      const parsedChar: Character = JSON.parse(charData);
      const race = races.find(r => r.id === parsedChar.race)?.name || 'Raça desconhecida';
      const gameClass = gameClasses.find(c => c.id === parsedChar.gameClass)?.name || 'Classe desconhecida';
      details = `${parsedChar.name}, o ${race} ${gameClass}, Nível ${parsedChar.level}`;
    }
    setCharacterDetails(details);

    const startAdventure = async () => {
      setIsLoading(true);
      const initialMessage = 'Começar a aventura.';
      const response = await aiChatGameMaster({
        templeType: temple.type,
        playerCharacterDetails: details,
        playerMessage: initialMessage,
      });
      setMessages([{ role: 'assistant', content: response.gameMasterResponse }]);
      setIsLoading(false);
    };
    startAdventure();
  }, [temple]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await aiChatGameMaster({
      templeType: temple.type,
      playerCharacterDetails: characterDetails,
      playerMessage: input,
    });
    
    let aiResponse = response.gameMasterResponse;
    const puzzleMatch = aiResponse.match(/\[PUZZLE:(.+)\]/);
    
    if (puzzleMatch && puzzleMatch[1]) {
        const pokemonId = puzzleMatch[1].trim();
        setCurrentPuzzle(pokemonId);
        aiResponse = aiResponse.replace(/\[PUZZLE:(.+)\]/, `\n*Um desafio foi apresentado! Resolva-o para continuar.*`);
    }

    setMessages([...newMessages, { role: 'assistant', content: aiResponse }]);
    setIsLoading(false);
  };
  
  const handlePuzzleSolved = (reward: string) => {
      setMessages(prev => [...prev, {role: 'assistant', content: `*Desafio resolvido!* Você recebeu: ${reward}.`}]);
      setCurrentPuzzle(null);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-headline font-bold text-primary">{temple.name}</h1>
        <p className="text-muted-foreground">Uma aventura narrada por IA. Suas ações moldam a história.</p>
      </header>
      
      <div className="flex-grow flex flex-col md:flex-row gap-6 overflow-hidden">
        <div className="flex-grow flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="space-y-6">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && <Bot className="size-6 text-primary shrink-0 mt-1" />}
                    <div className={`rounded-lg px-4 py-3 max-w-xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && <User className="size-6 shrink-0 mt-1" />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Bot className="size-6 text-primary shrink-0 mt-1" />
                        <div className="rounded-lg px-4 py-3 bg-secondary flex items-center">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t flex items-start gap-4">
                <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="O que você faz?"
                className="flex-grow resize-none"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                    }
                }}
                disabled={isLoading || !!currentPuzzle}
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim() || !!currentPuzzle}>
                    <Send className="size-4" />
                    <span className="sr-only">Enviar</span>
                </Button>
            </div>
        </div>
        
        {currentPuzzle && (
            <div className="w-full md:w-1/3 lg:w-1/4 animate-fade-in-left">
                <PuzzleChallenge pokemonId={currentPuzzle} onSolved={handlePuzzleSolved} />
            </div>
        )}
      </div>

    </div>
  );
}
