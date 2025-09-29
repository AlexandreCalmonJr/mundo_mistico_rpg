
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Mythology } from '@/lib/game-data';

const attributeModifierSchema = z.object({
    attribute: z.string().min(1, "Atributo é obrigatório."),
    modifier: z.coerce.number(),
});

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  image: z.string().min(1, "ID da imagem é obrigatório."),
  mythology: z.string({ required_error: 'Por favor, selecione uma mitologia.' }),
  strengths: z.string().min(1, "Liste pelo menos uma força.").transform(val => val.split(',').map(s => s.trim())),
  weaknesses: z.string().min(1, "Liste pelo menos uma fraqueza.").transform(val => val.split(',').map(s => s.trim())),
  attributeModifiers: z.array(attributeModifierSchema).optional(),
});

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  defaultValues: any;
  mythologies: Mythology[];
}

const ATTRIBUTE_OPTIONS = ["Força", "Agilidade", "Inteligência", "Defesa"];

export function ClassForm({ isOpen, onClose, onSave, defaultValues, mythologies }: ClassFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      image: defaultValues?.image || '',
      mythology: defaultValues?.mythology || '',
      strengths: defaultValues?.strengths?.join(', ') || '',
      weaknesses: defaultValues?.weaknesses?.join(', ') || '',
      attributeModifiers: defaultValues?.attributeModifiers || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributeModifiers",
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar Classe' : 'Adicionar Classe'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Faça alterações na classe existente.' : 'Crie uma nova classe para o jogo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
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
              name="mythology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mitologia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a mitologia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mythologies.map((myth) => (
                        <SelectItem key={myth.id} value={myth.id}>{myth.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="strengths" render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos Fortes (separados por vírgula)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="weaknesses" render={({ field }) => (
              <FormItem>
                <FormLabel>Pontos Fracos (separados por vírgula)</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem>
                <FormLabel>ID da Imagem</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

             <div>
                <FormLabel>Modificadores de Atributo</FormLabel>
                <div className="space-y-2 mt-2">
                {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`attributeModifiers.${index}.attribute`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Atributo" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ATTRIBUTE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`attributeModifiers.${index}.modifier`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input type="number" {...field} className="w-20" /></FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ attribute: '', modifier: 0 })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Modificador
                </Button>
            </div>
            
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

