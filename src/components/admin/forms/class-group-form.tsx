
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GameClass } from '@/lib/game-data';

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  baseClassId: z.string({ required_error: 'Por favor, selecione uma classe base.' }),
  levelRequirement: z.coerce.number().min(1, 'O nível deve ser pelo menos 1.'),
});

interface ClassGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  defaultValues: any;
  gameClasses: GameClass[];
}

export function ClassGroupForm({ isOpen, onClose, onSave, defaultValues, gameClasses }: ClassGroupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || '',
      baseClassId: defaultValues?.baseClassId || '',
      levelRequirement: defaultValues?.levelRequirement || 1,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar Grupo de Classe' : 'Adicionar Grupo de Classe'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Faça alterações no grupo de classe.' : 'Crie uma nova evolução de classe.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Grupo</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField
              control={form.control}
              name="baseClassId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classe Base</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma classe base" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gameClasses.map((gClass) => (
                        <SelectItem key={gClass.id} value={gClass.id}>{gClass.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField control={form.control} name="levelRequirement" render={({ field }) => (
              <FormItem>
                <FormLabel>Nível Mínimo</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
