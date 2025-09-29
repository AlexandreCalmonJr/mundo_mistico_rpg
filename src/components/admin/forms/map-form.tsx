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
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  type: z.string().min(1, 'O tipo é obrigatório.'),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
});

interface MapFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  defaultValues: any;
}

export function MapForm({ isOpen, onClose, onSave, defaultValues }: MapFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultValues?.type || '',
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar Mapa' : 'Adicionar Mapa'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Faça alterações no mapa existente.' : 'Crie um novo mapa para o jogo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo (ID único, ex: aztec_temple)</FormLabel>
                <FormControl><Input {...field} disabled={!!defaultValues} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
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
