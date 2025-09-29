
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

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

const formSchema = z.object({
  id: z.string().min(2, 'O ID deve ter pelo menos 2 caracteres.'),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
});

interface MythologyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  defaultValues: any;
}

export function MythologyForm({ isOpen, onClose, onSave, defaultValues }: MythologyFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultValues?.id || '',
      name: defaultValues?.name || '',
    },
  });

  useEffect(() => {
    form.reset(defaultValues || { id: '', name: '' });
  }, [defaultValues, form, isOpen]);


  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar Mitologia' : 'Adicionar Mitologia'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Faça alterações na mitologia existente.' : 'Crie uma nova mitologia para o jogo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="id" render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl><Input {...field} disabled={!!defaultValues} placeholder="ex: Norse, Greek" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl><Input {...field} placeholder="ex: Nórdica, Grega" /></FormControl>
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

