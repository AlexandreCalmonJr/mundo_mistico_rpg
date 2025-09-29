import { useState, useRef, useEffect } from 'react';
import type { GameMap } from '@/lib/game-data';
import { aiChatGameMaster } from '@/ai/flows/ai-chat-game-master';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { PuzzleChallenge } from './puzzle-challenge';
import { CombatInterface } from './combat-interface';
import type { Character, Enemy } from '@/lib/game-data';
import { gameClasses, races, enemies } from '@/lib/game-data';

interface ChatInterfaceProps {
  gameMap: GameMap;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type CombatState = {
  active: boolean;
  enemy: Enemy | null;
}

export function ChatInterface({ gameMap }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPuzzle, setCurrentPuzzle] = useState<string | null>(null);
  const [combatState, setCombatState] = useState<CombatState>({ active: false, enemy: null });
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
        mapType: gameMap.type,
        playerCharacterDetails: details,
        playerMessage: initialMessage,
      });
      setMessages([{ role: 'assistant', content: response.gameMasterResponse }]);
      setIsLoading(false);
    };
    startAdventure();
  }, [gameMap]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleResponse = (aiResponse: string) => {
    const puzzleMatch = aiResponse.match(/\[PUZZLE:(.+)\]/);
    if (puzzleMatch && puzzleMatch[1]) {
        const puzzleId = puzzleMatch[1].trim();
        setCurrentPuzzle(puzzleId);
        return aiResponse.replace(/\[PUZZLE:(.+)\]/, `\n*Um desafio foi apresentado! Resolva-o para continuar.*`);
    }

    const combatMatch = aiResponse.match(/\[COMBAT:(.+)\]/);
    if (combatMatch && combatMatch[1]) {
        const enemyId = combatMatch[1].trim();
        const enemy = enemies.find(e => e.id === enemyId);
        if (enemy) {
            setCombatState({ active: true, enemy: {...enemy, currentHp: enemy.maxHp} }); // Start combat with full HP
            return aiResponse.replace(/\[COMBAT:(.+)\]/, `\n*Um ${enemy.name} selvagem aparece e o combate começa!*`);
        }
    }
    return aiResponse;
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await aiChatGameMaster({
      mapType: gameMap.type,
      playerCharacterDetails: characterDetails,
      playerMessage: input,
    });
    
    const processedResponse = handleResponse(response.gameMasterResponse);
    setMessages([...newMessages, { role: 'assistant', content: processedResponse }]);
    setIsLoading(false);
  };
  
  const handlePuzzleSolved = (reward: string) => {
      setMessages(prev => [...prev, {role: 'assistant', content: `*Desafio resolvido!* Você recebeu: ${reward}.`}]);
      setCurrentPuzzle(null);
  }
  
  const handleCombatEnd = (victory: boolean) => {
    const message = victory
      ? `*Vitória!* Você derrotou o inimigo e pode continuar sua jornada.`
      : `*Derrota...* Você foi vencido, mas sua lenda não termina aqui. Você acorda na entrada do templo.`;
    
    setMessages(prev => [...prev, {role: 'assistant', content: message}]);
    setCombatState({ active: false, enemy: null });
  }

  return (
    <main className="h-[calc(100vh-4rem)] flex flex-col">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-headline font-bold text-primary">{gameMap.name}</h1>
        <p className="text-sm text-muted-foreground">Uma aventura narrada por IA. Suas ações moldam a história.</p>
      </header>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden">
        <div className={`flex flex-col rounded-lg bg-card text-card-foreground ${currentPuzzle || combatState.active ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                <div className="space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && <Bot className="size-6 text-primary shrink-0 mt-1" />}
                    <div className={`rounded-lg px-4 py-3 max-w-xl shadow-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && <User className="size-6 shrink-0 mt-1" />}
                    </div>
                ))}
                {isLoading && !combatState.active && (
                    <div className="flex items-start gap-3">
                        <Bot className="size-6 text-primary shrink-0 mt-1" />
                        <div className="rounded-lg px-4 py-3 bg-secondary flex items-center">
                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
                <div className="max-w-4xl mx-auto flex items-start gap-4">
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
                        disabled={isLoading || !!currentPuzzle || combatState.active}
                        rows={1}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim() || !!currentPuzzle || combatState.active}>
                        <Send className="size-4" />
                        <span className="sr-only">Enviar</span>
                    </Button>
                </div>
            </div>
        </div>
        
        {currentPuzzle && (
            <div className="w-full md:col-span-1 animate-fade-in-left border-l bg-background/50">
                <PuzzleChallenge puzzleId={currentPuzzle} onSolved={handlePuzzleSolved} />
            </div>
        )}
        
        {combatState.active && combatState.enemy && (
             <div className="w-full md:col-span-1 animate-fade-in-left border-l bg-background/50">
                <CombatInterface enemy={combatState.enemy} onCombatEnd={handleCombatEnd} />
            </div>
        )}
      </div>

    </main>
  );
}
