'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { oracleFlow } from '@/ai/flows/oracle-flow';

interface Message {
  sender: string;
  senderType: 'user' | 'player' | 'oracle';
  content: string;
}

const initialMessages: Message[] = [
    { sender: 'GuerreiroValente', senderType: 'player', content: 'Alguém sabe onde encontrar o Elmo do Trovão?' },
    { sender: 'MagaArcana', senderType: 'player', content: 'Ouvi dizer que está em uma tumba perto do Pico Congelado. Mas é guardado por um golem de gelo.' },
    { sender: 'LadinaSombria', senderType: 'player', content: 'Golems de gelo são fracos contra fogo. Um Sacerdote de Rá seria útil.' },
];


export default function GlobalChatPage() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const oracleTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to trigger the oracle
    const triggerOracle = async () => {
        const history = messages.slice(-5).map(m => `${m.sender}: ${m.content}`).join('\n');
        
        try {
            const response = await oracleFlow({ chatHistory: history });
            if (response.oracleResponse) {
                setMessages(prev => [...prev, { sender: 'Oráculo', senderType: 'oracle', content: response.oracleResponse }]);
            }
        } catch (e) {
            console.error("Oracle failed to speak:", e);
        }

        // Reset the timer
        resetOracleTimer();
    };

    // Function to reset the oracle timer
    const resetOracleTimer = () => {
        if (oracleTimerRef.current) {
            clearTimeout(oracleTimerRef.current);
        }
        // Set a random time between 30 and 60 seconds for the next oracle message
        const randomTime = Math.random() * 30000 + 30000;
        oracleTimerRef.current = setTimeout(triggerOracle, randomTime);
    };

    // Start the oracle timer on component mount
    useEffect(() => {
        resetOracleTimer();
        // Clear the timer on component unmount
        return () => {
            if (oracleTimerRef.current) {
                clearTimeout(oracleTimerRef.current);
            }
        };
    }, []);


    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessage: Message = { sender: 'Você', senderType: 'user', content: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate other players responding after a short delay
        setTimeout(() => {
             const responses = [
                "Interessante...",
                "Nunca pensei nisso.",
                "Isso pode mudar tudo.",
                "Cuidado com o que você deseja.",
             ];
             const randomResponse = responses[Math.floor(Math.random() * responses.length)];
             const randomPlayer = ['HeróiAnônimo', 'ExploradorVeloz', 'SábiaDaMontanha'][Math.floor(Math.random() * 3)];
             setMessages(prev => [...prev, { sender: randomPlayer, senderType: 'player', content: randomResponse }]);
             setIsLoading(false);
        }, 2000);
        
        // Every time a user sends a message, there's a chance to reset the oracle timer
        // and make it speak sooner.
        if (Math.random() > 0.5) {
            resetOracleTimer();
        }
    };


    const getIcon = (senderType: Message['senderType']) => {
        switch(senderType) {
            case 'user': return <User className="size-6 text-primary shrink-0 mt-1" />;
            case 'player': return <User className="size-6 text-muted-foreground shrink-0 mt-1" />;
            case 'oracle': return <Sparkles className="size-6 text-amber-400 shrink-0 mt-1" />;
            default: return null;
        }
    }

    const getMessageStyle = (senderType: Message['senderType']) => {
        switch(senderType) {
            case 'user': return 'bg-primary text-primary-foreground';
            case 'player': return 'bg-secondary';
            case 'oracle': return 'bg-amber-950/60 border border-amber-500/50 text-amber-300 italic';
            default: return '';
        }
    }

    return (
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-4rem)]">
            <div className="container mx-auto flex-grow flex flex-col">
                <header className="mb-6">
                    <h1 className="text-3xl font-headline font-bold text-primary">Chat Global</h1>
                    <p className="text-muted-foreground">Converse com outros heróis e ouça os sussurros do Oráculo.</p>
                </header>

                <div className="flex-grow flex flex-col rounded-lg bg-card text-card-foreground border w-full max-w-4xl mx-auto">
                    <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.senderType === 'user' ? 'justify-end' : ''}`}>
                                    {message.senderType !== 'user' && getIcon(message.senderType)}
                                    <div className="flex flex-col">
                                        {message.senderType !== 'user' && <p className="text-xs font-bold mb-1">{message.sender}</p>}
                                        <div className={`rounded-lg px-4 py-3 max-w-xl shadow-md ${getMessageStyle(message.senderType)}`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                    {message.senderType === 'user' && getIcon(message.senderType)}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <User className="size-6 text-muted-foreground shrink-0 mt-1" />
                                    <div className="flex flex-col">
                                        <p className="text-xs font-bold mb-1">Outros Heróis</p>
                                        <div className="rounded-lg px-4 py-3 bg-secondary flex items-center">
                                            <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                className="flex-grow resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isLoading}
                                rows={1}
                            />
                            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                                <Send className="size-4" />
                                <span className="sr-only">Enviar</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
