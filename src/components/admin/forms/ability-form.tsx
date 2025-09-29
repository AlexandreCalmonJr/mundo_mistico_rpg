
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GameClass } from '@/lib/game-data';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateGameContent } from '@/ai/flows/generate-game-content';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  type: z.enum(['Ataque', 'Defesa', 'Suporte', 'Utilidade']),
  cost: z.coerce.number().min(0, 'O custo deve ser 0 ou mais.'),
  levelRequirement: z.coerce.number().min(1, 'O nível deve ser pelo menos 1.'),
  classId: z.string().optional(),
});

interface AbilityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  defaultValues: any;
  gameClasses: GameClass[];
}

const ABILITY_TYPES = ['Ataque', 'Defesa', 'Suporte', 'Utilidade'];

export function AbilityForm({ isOpen, onClose, onSave, defaultValues, gameClasses }: AbilityFormProps) {
  const { toast } = useToast();
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
        name: '',
        description: '',
        type: 'Ataque',
        cost: 0,
        levelRequirement: 1,
        classId: 'any'
    },
  });

   useEffect(() => {
    form.reset(defaultValues || {
        name: '',
        description: '',
        type: 'Ataque',
        cost: 0,
        levelRequirement: 1,
        classId: 'any'
    });
  }, [defaultValues, form]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // If classId is 'any', save it as an empty string or undefined in the database
    const dataToSave = {
      ...values,
      classId: values.classId === 'any' ? undefined : values.classId,
    };
    onSave(dataToSave);
  };
  
  const handleGenerateWithAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
        const result = await generateGameContent({
            contentType: 'Habilidade',
            prompt: aiPrompt,
        });
        const abilityData = JSON.parse(result.generatedJson);

        // Populate form with AI generated data
        // IMPORTANT: Reset the ID to undefined to ensure this is treated as a new document
        form.reset({
            ...abilityData,
            id: undefined, 
        });
        
        toast({ title: "Habilidade gerada com sucesso!", description: "Revise os campos e salve." });
        setShowAIGenerator(false);
        setAiPrompt('');

    } catch (error) {
        console.error('Failed to generate ability:', error);
        toast({ title: 'Erro ao gerar com IA', variant: 'destructive' });
    } finally {
        setIsGenerating(false);
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>{defaultValues ? 'Editar Habilidade' : 'Adicionar Habilidade'}</DialogTitle>
              <DialogDescription>
                {defaultValues ? 'Faça alterações na habilidade.' : 'Crie uma nova habilidade para uma classe.'}
              </DialogDescription>
            </div>
             <Button variant="outline" size="sm" onClick={() => setShowAIGenerator(!showAIGenerator)}>
                <Sparkles className="mr-2 h-4 w-4" /> Gerar com IA
            </Button>
          </div>
        </DialogHeader>

        {showAIGenerator && (
            <div className="space-y-2 p-4 border bg-secondary/50 rounded-md">
                <Label htmlFor="ai-prompt">Prompt da IA para Habilidade</Label>
                <Textarea 
                    id="ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ex: Habilidade de cura em área para Sacerdote, nível 15"
                />
                <Button onClick={handleGenerateWithAI} disabled={isGenerating} className="w-full">
                    {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Gerar e Preencher
                </Button>
            </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Habilidade</FormLabel>
                   <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ABILITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="cost" render={({ field }) => (
              <FormItem>
                <FormLabel>Custo (Mana, Energia, etc.)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="levelRequirement" render={({ field }) => (
              <FormItem>
                <FormLabel>Nível Mínimo</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'any'}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Selecione a classe" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="any">Qualquer Classe</SelectItem>
                      {gameClasses.map((gClass) => (
                        <SelectItem key={gClass.id} value={gClass.id}>{gClass.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
