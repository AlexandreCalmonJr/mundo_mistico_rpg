
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { gameClasses as initialClasses, races as initialRaces, temples as initialTemples } from '@/lib/game-data';
import type { GameClass, Race, Temple } from '@/lib/game-data';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from '@/components/admin/data-table';
import { ClassForm } from '@/components/admin/forms/class-form';
import { RaceForm } from '@/components/admin/forms/race-form';
import { TempleForm } from '@/components/admin/forms/temple-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


type DataType = 'class' | 'race' | 'temple';
type DialogState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  type: DataType | null;
  data: GameClass | Race | Temple | null;
}

export default function AdminPage() {
  const [gameClasses, setGameClasses] = useState<GameClass[]>(initialClasses);
  const [races, setRaces] = useState<Race[]>(initialRaces);
  const [temples, setTemples] = useState<Temple[]>(initialTemples);
  
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, mode: 'add', type: null, data: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, type: DataType | null, id: string | null }>({ isOpen: false, type: null, id: null });


  const handleOpenDialog = (mode: 'add' | 'edit', type: DataType, data: GameClass | Race | Temple | null = null) => {
    setDialogState({ isOpen: true, mode, type, data });
  };
  
  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, mode: 'add', type: null, data: null });
  };
  
  const handleDelete = (type: DataType, id: string) => {
    setDeleteConfirm({ isOpen: true, type: type, id: id });
  };

  const confirmDelete = () => {
    if (!deleteConfirm.type || !deleteConfirm.id) return;
    
    switch (deleteConfirm.type) {
      case 'class':
        setGameClasses(prev => prev.filter(item => item.id !== deleteConfirm.id));
        break;
      case 'race':
        setRaces(prev => prev.filter(item => item.id !== deleteConfirm.id));
        break;
      case 'temple':
        setTemples(prev => prev.filter(item => item.type !== deleteConfirm.id));
        break;
    }
    setDeleteConfirm({ isOpen: false, type: null, id: null });
  };


  const handleSave = (type: DataType, data: any) => {
    const id = data.id || data.type;
    switch (type) {
      case 'class':
        if (dialogState.mode === 'add') {
          setGameClasses(prev => [...prev, { ...data, id: `class-${Date.now()}` }]);
        } else {
          setGameClasses(prev => prev.map(item => item.id === id ? data : item));
        }
        break;
      case 'race':
        if (dialogState.mode === 'add') {
          setRaces(prev => [...prev, { ...data, id: `race-${Date.now()}` }]);
        } else {
          setRaces(prev => prev.map(item => item.id === id ? data : item));
        }
        break;
      case 'temple':
         if (dialogState.mode === 'add') {
          setTemples(prev => [...prev, data]);
        } else {
          setTemples(prev => prev.map(item => item.type === id ? data : item));
        }
        break;
    }
    handleCloseDialog();
  };

  const getForm = () => {
    if (!dialogState.isOpen) return null;
    
    const props = {
      isOpen: dialogState.isOpen,
      onClose: handleCloseDialog,
      onSave: (data: any) => handleSave(dialogState.type!, data),
      defaultValues: dialogState.mode === 'edit' ? dialogState.data : null,
    };

    switch (dialogState.type) {
      case 'class': return <ClassForm {...props} />;
      case 'race': return <RaceForm {...props} />;
      case 'temple': return <TempleForm {...props} />;
      default: return null;
    }
  }

  const columns = (type: DataType) => [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'description', header: 'Descrição' },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', type, row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(type, row.original.id || row.original.type)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-accent mb-2">Painel de Administração</h1>
        <p className="text-muted-foreground mb-8">Gerencie o conteúdo e as configurações do Mundo Mítico.</p>

        <Tabs defaultValue="classes">
          <TabsList className="mb-4">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="races">Raças</TabsTrigger>
            <TabsTrigger value="temples">Templos</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'class')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Classe
              </Button>
            </div>
            <DataTable columns={columns('class')} data={gameClasses} />
          </TabsContent>

          <TabsContent value="races">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'race')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Raça
              </Button>
            </div>
            <DataTable columns={columns('race')} data={races} />
          </TabsContent>

          <TabsContent value="temples">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'temple')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Templo
              </Button>
            </div>
            <DataTable columns={columns('temple')} data={temples} />
          </TabsContent>
        </Tabs>
      </div>

      {getForm()}

      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteConfirm({isOpen: false, type: null, id: null})}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </main>
  );
}
