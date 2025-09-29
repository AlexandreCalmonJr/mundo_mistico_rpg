import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Brain, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface PuzzleChallengeProps {
  pokemonId: string;
  onSolved: (reward: string) => void;
}

type PokemonData = {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
};

export function PuzzleChallenge({ pokemonId, onSolved }: PuzzleChallengeProps) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{type: 'error' | 'success', message: string} | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError(null);
      setFeedback(null);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId.toLowerCase()}`);
        if (!response.ok) {
          throw new Error('Criatura mítica não encontrada.');
        }
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar o desafio.');
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [pokemonId]);
  
  const getStat = (name: string) => pokemon?.stats.find(s => s.stat.name === name)?.base_stat ?? 0;
  
  const puzzle = {
      question: `Para decifrar o glifo, some a 'velocidade' base desta criatura com seu 'ataque' base. Qual é o resultado?`,
      calculateAnswer: () => (pokemon ? getStat('speed') + getStat('attack') : 0).toString(),
      reward: 'Poção de Agilidade'
  };

  const checkAnswer = () => {
    if (answer === puzzle.calculateAnswer()) {
        setFeedback({type: 'success', message: 'Correto! O caminho se abre.'});
        setTimeout(() => {
            onSolved(puzzle.reward);
        }, 1500);
    } else {
        setFeedback({type: 'error', message: 'Incorreto. Tente novamente.'});
        setAnswer('');
    }
  };

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
        <Card className="h-full flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="size-8 text-destructive mb-2" />
            <p className="font-semibold">Erro no Desafio</p>
            <p className="text-sm text-muted-foreground">{error}</p>
        </Card>
    );
  }

  if (pokemon) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Brain className="text-primary"/> Enigma Ancestral</CardTitle>
          <CardDescription>Uma entidade mítica bloqueia seu caminho.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center text-center">
          <Image src={pokemon.sprites.front_default} alt={pokemon.name} width={96} height={96} className="mb-4 bg-primary/10 rounded-full" />
          <p className="font-semibold capitalize text-lg">{pokemon.name}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Tipo: {pokemon.types.map(t => t.type.name).join(', ')}
          </p>

          <div className="bg-secondary p-3 rounded-lg w-full mb-4">
            <p className="text-sm">{puzzle.question}</p>
          </div>

          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input 
                type="text" 
                placeholder="Sua resposta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!!feedback && feedback.type === 'success'}
            />
            <Button 
                onClick={checkAnswer}
                disabled={!answer || (!!feedback && feedback.type === 'success')}
            >
                <Lightbulb className="size-4" />
            </Button>
          </div>
          {feedback && (
              <div className={`mt-3 text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {feedback.type === 'success' ? <CheckCircle className="size-4" /> : <AlertTriangle className="size-4" />}
                  {feedback.message}
              </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
