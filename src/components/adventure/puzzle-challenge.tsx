import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2, Brain, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface PuzzleChallengeProps {
  puzzleId: string;
  onSolved: (reward: string) => void;
}

type Puzzle = {
    id: string;
    type: 'lógica' | 'matemática' | 'charada';
    question: string;
    answer: string;
    reward: string;
    imageUrl?: string;
    imageAlt?: string;
};

const puzzles: Puzzle[] = [
    {
        id: 'logic_1',
        type: 'lógica',
        question: 'Um pai tem 5 filhos. Quatro se chamam Trovão, Trovão, Trovão, e Trovão. Qual é o nome do quinto filho?',
        answer: 'Qual',
        reward: 'Amuleto da Perspicácia',
    },
    {
        id: 'math_1',
        type: 'matemática',
        question: 'Qual é o próximo número na sequência: 1, 1, 2, 3, 5, 8, __?',
        answer: '13',
        reward: 'Poção de Inteligência',
    },
    {
        id: 'riddle_1',
        type: 'charada',
        question: 'O que tem um olho mas não pode ver?',
        answer: 'Agulha',
        reward: 'Pergaminho da Visão Verdadeira',
    }
];

export function PuzzleChallenge({ puzzleId, onSolved }: PuzzleChallengeProps) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{type: 'error' | 'success', message: string} | null>(null);

  useEffect(() => {
    const currentPuzzle = puzzles.find(p => p.id === puzzleId) || null;
    setPuzzle(currentPuzzle);
    setAnswer('');
    setFeedback(null);
  }, [puzzleId]);

  const checkAnswer = () => {
    if (puzzle && answer.toLowerCase().trim() === puzzle.answer.toLowerCase().trim()) {
        setFeedback({type: 'success', message: 'Correto! O caminho se abre.'});
        setTimeout(() => {
            onSolved(puzzle.reward);
        }, 1500);
    } else {
        setFeedback({type: 'error', message: 'Incorreto. Tente novamente.'});
        setAnswer('');
    }
  };
  
  if (!puzzle) {
    return (
        <Card className="h-full flex flex-col items-center justify-center text-center p-4">
            <AlertTriangle className="size-8 text-destructive mb-2" />
            <p className="font-semibold">Erro no Enigma</p>
            <p className="text-sm text-muted-foreground">O enigma solicitado não foi encontrado.</p>
        </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Brain className="text-primary"/> Enigma Ancestral</CardTitle>
        <CardDescription>Um desafio bloqueia seu caminho. Resolva-o para prosseguir.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center text-center">
        <div className="bg-secondary p-4 rounded-lg w-full mb-6 text-center">
          <p className="text-sm font-semibold capitalize mb-1">({puzzle.type})</p>
          <p className="text-base">{puzzle.question}</p>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
              type="text" 
              placeholder="Sua resposta"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!feedback && feedback.type === 'success'}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    checkAnswer();
                  }
              }}
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
