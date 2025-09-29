
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import type { GameClass } from '@/lib/game-data';

const WEAPON_TYPES = ['Espada', 'Machado', 'Arco', 'Cajado', 'Adaga', 'Lança'];
const RARITIES = ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'];

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  type: z.enum(WEAPON_TYPES as [string, ...string[]]),
  damage: z.coerce.number().min(0, 'O dano deve ser 0 ou mais.'),
  rarity: z.enum(RARITIES as [string, ...string[]]),
  classRequirement: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'Você deve selecionar pelo menos uma classe.',
  }),
});


interface WeaponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: z.infer<typeof formSchema>) => void;
  defaultValues: any;
  gameClasses: GameClass[];
}

export function WeaponForm({ isOpen, onClose, onSave, defaultValues, gameClasses }: WeaponFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      type: defaultValues?.type || 'Espada',
      damage: defaultValues?.damage || 10,
      rarity: defaultValues?.rarity || 'Comum',
      classRequirement: defaultValues?.classRequirement || [],
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar Arma' : 'Adicionar Arma'}</DialogTitle>
          <DialogDescription>
            {defaultValues ? 'Faça alterações na arma.' : 'Crie uma nova arma para o jogo.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Arma</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {WEAPON_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="damage" render={({ field }) => (
              <FormItem><FormLabel>Dano</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="rarity" render={({ field }) => (
              <FormItem>
                <FormLabel>Raridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione a raridade" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {RARITIES.map((rarity) => (<SelectItem key={rarity} value={rarity}>{rarity}</SelectItem>))}
                  </SelectContent>
                </Select><FormMessage />
              </FormItem>
            )} />
             <FormField
                control={form.control}
                name="classRequirement"
                render={() => (
                    <FormItem>
                    <div className="mb-4">
                        <FormLabel className="text-base">Classes Permitidas</FormLabel>
                        <FormDescription>
                        Selecione as classes que podem equipar esta arma.
                        </FormDescription>
                    </div>
                    <div className="space-y-2">
                    {gameClasses.map((item) => (
                        <FormField
                        key={item.id}
                        control={form.control}
                        name="classRequirement"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== item.id
                                            )
                                        )
                                    }}
                                />
                                </FormControl>
                                <FormLabel className="font-normal">
                                {item.name}
                                </FormLabel>
                            </FormItem>
                            )
                        }}
                        />
                    ))}
                    </div>
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
