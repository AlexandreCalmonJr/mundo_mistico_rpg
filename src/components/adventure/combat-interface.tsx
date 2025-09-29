'use client';

import { useState, useEffect } from 'react';
import type { Enemy, Character, Attribute, Ability } from '@/lib/game-data';
import { aiCombatManager } from '@/ai/flows/ai-combat-manager';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Swords, Shield, Heart, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CombatInterfaceProps {
  enemy: Enemy;
  onCombatEnd: (victory: boolean) => void;
}

type CombatLog = {
  turn: number;
  message: string;
};

export function CombatInterface({ enemy, onCombatEnd }: CombatInterfaceProps) {
  const { toast } = useToast();
  const [player, setPlayer] = useState<Character | null>(null);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(enemy);
  const [combatLog, setCombatLog] = useState<CombatLog[]>([]);
  const [turn, setTurn] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const charData = localStorage.getItem('character');
    if (charData) {
      setPlayer(JSON.parse(charData));
    }
  }, []);

  const savePlayerState = (updatedPlayer: Character) => {
    setPlayer(updatedPlayer);
    localStorage.setItem('character', JSON.stringify(updatedPlayer));
  };
  
  const addLog = (message: string) => {
    setCombatLog(prev => [...prev, { turn, message }]);
  };

  const processTurn = async (playerAction: string) => {
    if (!player || !isPlayerTurn || isLoading) return;

    setIsLoading(true);
    addLog(`Sua ação: ${playerAction}`);

    try {
        const playerDetails = `HP: ${player.currentHp}/${player.maxHp}, Atributos: ${player.attributes.map(a => `${a.name}: ${a.value}`).join(', ')}`;
        const enemyDetails = `HP: ${currentEnemy.currentHp}/${currentEnemy.maxHp}, Atributos: Ataque: ${currentEnemy.attack}, Defesa: ${currentEnemy.defense}`;

        const result = await aiCombatManager({
            playerCharacterDetails: playerDetails,
            enemyDetails: enemyDetails,
            playerAction: playerAction,
        });

        const newEnemyHp = Math.max(0, currentEnemy.currentHp - result.enemyDamage);
        const newPlayerHp = Math.max(0, player.currentHp - result.playerDamage);

        setCurrentEnemy(e => ({ ...e, currentHp: newEnemyHp }));
        const updatedPlayer = { ...player, currentHp: newPlayerHp };
        savePlayerState(updatedPlayer);

        addLog(`IA: ${result.turnResultNarrative}`);

        if (newEnemyHp <= 0) {
            addLog(`Você derrotou ${currentEnemy.name}!`);
            toast({ title: "Vitória!", description: `Você ganhou 50 XP!` });
            
            // Grant XP - this is a simplified version
            const xpGained = 50;
            const finalPlayerState = {...updatedPlayer, xp: updatedPlayer.xp + xpGained};
            savePlayerState(finalPlayerState);

            setTimeout(() => onCombatEnd(true), 2000);
        } else if (newPlayerHp <= 0) {
            addLog(`Você foi derrotado por ${currentEnemy.name}...`);
            toast({ title: "Derrota...", variant: 'destructive' });
            
            // Restore some HP
            savePlayerState({...updatedPlayer, currentHp: Math.floor(updatedPlayer.maxHp / 4)});

            setTimeout(() => onCombatEnd(false), 2000);
        }

    } catch (e) {
        console.error("Combat AI failed:", e);
        toast({ title: "Erro do Mestre de Jogo", description: "A IA de combate encontrou um erro.", variant: 'destructive' });
        addLog("O inimigo parece confuso por um momento...");
    } finally {
        setTurn(t => t + 1);
        setIsLoading(false);
    }
  };


  if (!player) {
    return <Card className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></Card>;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-destructive"><Swords /> Combate!</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6 p-4">
        {/* Enemy Status */}
        <div className="text-center">
            <h3 className="font-bold text-lg">{currentEnemy.name}</h3>
            <div className="flex items-center gap-2 justify-center">
                 <Heart className="size-4 text-red-500" />
                 <span>{currentEnemy.currentHp} / {currentEnemy.maxHp}</span>
            </div>
            <Progress value={(currentEnemy.currentHp / currentEnemy.maxHp) * 100} className="h-2 mt-1" />
        </div>

         {/* Combat Log */}
        <ScrollArea className="h-48 w-full bg-black/20 rounded-lg p-3">
             <div className="space-y-2 text-sm">
                {combatLog.map((log, i) => (
                    <p key={i}><span className="font-bold text-muted-foreground mr-2">T{log.turn}:</span> {log.message}</p>
                ))}
                {isLoading && <Loader2 className="animate-spin text-primary mt-2" />}
            </div>
        </ScrollArea>

        {/* Player Status */}
        <div className="text-center">
            <h3 className="font-bold text-lg">{player.name}</h3>
            <div className="flex items-center gap-2 justify-center">
                 <Heart className="size-4 text-red-500" />
                 <span>{player.currentHp} / {player.maxHp}</span>
            </div>
            <Progress value={(player.currentHp / player.maxHp) * 100} className="h-2 mt-1" />
        </div>

      </CardContent>
      <CardFooter className="flex flex-col gap-2">
         <p className="text-xs text-muted-foreground mb-2">O que você faz?</p>
         <div className="grid grid-cols-2 gap-2 w-full">
            <Button onClick={() => processTurn('Ataque básico com a arma.')} disabled={isLoading || player.currentHp <= 0}>
                <Swords className="mr-2" /> Atacar
            </Button>
            <Button disabled>
                 <Sparkles className="mr-2" /> Habilidades
            </Button>
            <Button variant="outline" disabled>
                 <Shield className="mr-2" /> Defender
            </Button>
            <Button variant="destructive" onClick={() => onCombatEnd(false)} disabled={isLoading}>
                Fugir
            </Button>
         </div>
      </CardFooter>
    </Card>
  );
}
