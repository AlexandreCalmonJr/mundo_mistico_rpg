
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Sparkles } from 'lucide-react';
import { mythologies } from '@/lib/game-data';
import type { GameClass, Race, GameMap, Character, ClassGroup, Clan, AttributeModifier, Ability, Weapon } from '@/lib/game-data';
import { getCollection, addDocument, updateDocument, deleteDocument } from '@/services/firestore';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from '@/components/admin/data-table';
import { ClassForm } from '@/components/admin/forms/class-form';
import { RaceForm } from '@/components/admin/forms/race-form';
import { MapForm } from '@/components/admin/forms/map-form';
import { ClassGroupForm } from '@/components/admin/forms/class-group-form';
import { ClanForm } from '@/components/admin/forms/clan-form';
import { AbilityForm } from '@/components/admin/forms/ability-form';
import { WeaponForm } from '@/components/admin/forms/weapon-form';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContentGenerator } from '@/components/admin/content-generator';


const initialUsers: any[] = [
    { id: 'user-1', name: 'Admin', email: 'admin@mundomitico.com', role: 'Admin' },
    { id: 'user-2', name: 'Jogador1', email: 'jogador1@email.com', role: 'Player' },
    { id: 'user-3', name: 'Jogador2', email: 'jogador2@email.com', role: 'Player' },
];

type DataType = 'class' | 'race' | 'map' | 'user' | 'class-group' | 'clan' | 'ability' | 'weapon';
type DialogState = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  type: DataType | null;
  data: GameClass | Race | GameMap | ClassGroup | Clan | Ability | Weapon | any | null;
}

const formatModifiers = (modifiers: AttributeModifier[]) => {
    if (!modifiers || modifiers.length === 0) return 'N/A';
    return modifiers.map(m => `${m.attribute}: ${m.modifier > 0 ? '+' : ''}${m.modifier}`).join(', ');
}

export default function AdminPage() {
  const { toast } = useToast();
  const [gameClasses, setGameClasses] = useState<GameClass[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [gameMaps, setGameMaps] = useState<GameMap[]>([]);
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
  const [clans, setClans] = useState<Clan[]>([]);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, mode: 'add', type: null, data: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, type: DataType | null, id: string | null }>({ isOpen: false, type: null, id: null });

  useEffect(() => {
    async function fetchGameData() {
      try {
        setLoading(true);
        const [
            classesFromDb, 
            racesFromDb,
            mapsFromDb,
            groupsFromDb, 
            abilitiesFromDb, 
            weaponsFromDb, 
            clansFromDb
        ] = await Promise.all([
          getCollection<GameClass>('classes'),
          getCollection<Race>('races'),
          getCollection<GameMap>('gameMaps'),
          getCollection<ClassGroup>('classGroups'),
          getCollection<Ability>('abilities'),
          getCollection<Weapon>('weapons'),
          getCollection<Clan>('clans'),
        ]);
        setGameClasses(classesFromDb);
        setRaces(racesFromDb);
        setGameMaps(mapsFromDb);
        setClassGroups(groupsFromDb);
        setAbilities(abilitiesFromDb);
        setWeapons(weaponsFromDb);
        setClans(clansFromDb);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível buscar os dados do jogo do banco de dados.",
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchGameData();
  }, [toast]);


  const handleOpenDialog = (mode: 'add' | 'edit', type: DataType, data: GameClass | Race | GameMap | ClassGroup | Clan | Ability | Weapon | null = null) => {
    setDialogState({ isOpen: true, mode, type, data });
  };
  
  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, mode: 'add', type: null, data: null });
  };
  
  const handleDelete = (type: DataType, id: string) => {
    setDeleteConfirm({ isOpen: true, type: type, id: id });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.type || !deleteConfirm.id) return;
    
    try {
      let collectionName: string = '';
      switch (deleteConfirm.type) {
        case 'class': collectionName = 'classes'; break;
        case 'race': collectionName = 'races'; break;
        case 'map': collectionName = 'gameMaps'; break;
        case 'class-group': collectionName = 'classGroups'; break;
        case 'ability': collectionName = 'abilities'; break;
        case 'weapon': collectionName = 'weapons'; break;
        case 'clan': collectionName = 'clans'; break;
        case 'user':
          setUsers(prev => prev.filter(item => item.id !== deleteConfirm.id));
           toast({ title: "Usuário excluído com sucesso!" });
          setDeleteConfirm({ isOpen: false, type: null, id: null });
          return;
        default:
          toast({title: "Tipo inválido", description: "O tipo de dado para exclusão é inválido.", variant: 'destructive'});
          return;
      }

      await deleteDocument(collectionName, deleteConfirm.id);
      
      switch (deleteConfirm.type) {
         case 'class': setGameClasses(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
         case 'race': setRaces(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
         case 'map': setGameMaps(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
         case 'class-group': setClassGroups(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
         case 'ability': setAbilities(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
         case 'weapon': setWeapons(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
         case 'clan': setClans(prev => prev.filter(item => item.id !== deleteConfirm.id)); break;
      }
      toast({ title: "Item excluído com sucesso!" });
    } catch (error) {
       console.error("Failed to delete item:", error);
       toast({ title: "Erro ao excluir", description: "Não foi possível excluir o item.", variant: 'destructive' });
    }
    setDeleteConfirm({ isOpen: false, type: null, id: null });
  };


  const handleSave = async (type: DataType, data: any) => {
    const isEditing = dialogState.mode === 'edit' && data.id;

    try {
        let collectionName: string = '';
        let setData: React.Dispatch<React.SetStateAction<any[]>>;
        let successMsg = '';

        switch (type) {
            case 'class':
                collectionName = 'classes'; setData = setGameClasses; successMsg = 'Classe'; break;
            case 'race':
                collectionName = 'races'; setData = setRaces; successMsg = 'Raça'; break;
            case 'map':
                collectionName = 'gameMaps'; setData = setGameMaps; successMsg = 'Mapa'; break;
            case 'class-group':
                collectionName = 'classGroups'; setData = setClassGroups; successMsg = 'Grupo de Classe'; break;
            case 'ability':
                collectionName = 'abilities'; setData = setAbilities; successMsg = 'Habilidade'; break;
            case 'weapon':
                collectionName = 'weapons'; setData = setWeapons; successMsg = 'Arma'; break;
            case 'clan':
                collectionName = 'clans'; setData = setClans; successMsg = 'Clã'; break;
            case 'user':
                if (!isEditing) {
                    setUsers(prev => [...prev, { ...data, id: `user-${Date.now()}` }]);
                } else {
                    setUsers(prev => prev.map(item => item.id === data.id ? data : item));
                }
                toast({ title: "Usuário salvo com sucesso!" });
                handleCloseDialog();
                return;
            default:
                toast({title: "Tipo inválido", description: "O tipo de dado para salvar é inválido.", variant: 'destructive'});
                return;
        }
        
        const { id, ...dataToSave } = data;

        if (isEditing) {
            await updateDocument(collectionName, id, dataToSave);
            setData(prev => prev.map(item => item.id === id ? data : item));
            toast({ title: `${successMsg} atualizado(a) com sucesso!` });
        } else {
            const newId = await addDocument(collectionName, dataToSave);
            setData(prev => [...prev, { ...data, id: newId }]);
            toast({ title: `${successMsg} adicionado(a) com sucesso!` });
        }

    } catch(error) {
       console.error("Failed to save item:", error);
       toast({ title: "Erro ao salvar", description: "Não foi possível salvar o item.", variant: 'destructive' });
    }
    handleCloseDialog();
  };

  const getForm = () => {
    if (!dialogState.isOpen) return null;
    
    const props = {
      isOpen: dialogState.isOpen,
      onClose: handleCloseDialog,
      onSave: (data: any) => handleSave(dialogState.type!, data),
      defaultValues: dialogState.data,
    };

    switch (dialogState.type) {
      case 'class': return <ClassForm {...props} />;
      case 'race': return <RaceForm {...props} />;
      case 'map': return <MapForm {...props} />;
      case 'class-group': return <ClassGroupForm {...props} gameClasses={gameClasses} />;
      case 'clan': return <ClanForm {...props} />;
      case 'ability': return <AbilityForm {...props} gameClasses={gameClasses}/>;
      case 'weapon': return <WeaponForm {...props} gameClasses={gameClasses}/>;
      // case 'user': return <UserForm {...props} />;
      default: return null;
    }
  }
  
  const classColumns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'mythology', header: 'Mitologia', cell: ({row}: any) => mythologies.find(m => m.id === row.original.mythology)?.name || 'N/A' },
    { accessorKey: 'description', header: 'Descrição' },
    { accessorKey: 'attributeModifiers', header: 'Modificadores', cell: ({row}: any) => (
        <div className="flex flex-wrap gap-1">
            {row.original.attributeModifiers.map((mod: AttributeModifier) => (
                <Badge key={mod.attribute} variant="secondary">{mod.attribute}: {mod.modifier > 0 ? `+${mod.modifier}` : mod.modifier}</Badge>
            ))}
        </div>
    ) },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'class', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('class', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  const raceColumns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'mythology', header: 'Mitologia', cell: ({row}: any) => mythologies.find(m => m.id === row.original.mythology)?.name || 'N/A' },
    { accessorKey: 'description', header: 'Descrição' },
    { accessorKey: 'attributeModifiers', header: 'Modificadores', cell: ({row}: any) => (
        <div className="flex flex-wrap gap-1">
            {row.original.attributeModifiers.map((mod: AttributeModifier) => (
                <Badge key={mod.attribute} variant="secondary">{mod.attribute}: {mod.modifier > 0 ? `+${mod.modifier}` : mod.modifier}</Badge>
            ))}
        </div>
    ) },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'race', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('race', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const mapColumns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'description', header: 'Descrição' },
    { accessorKey: 'type', header: 'Tipo' },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'map', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('map', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const userColumns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Função' },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
           <Button variant="outline" size="sm" disabled>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('user', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const classGroupColumns = [
    { accessorKey: 'name', header: 'Nome do Grupo' },
    { accessorKey: 'baseClassId', header: 'Classe Base', cell: ({row}: any) => gameClasses.find(c => c.id === row.original.baseClassId)?.name || 'N/A' },
    { accessorKey: 'levelRequirement', header: 'Nível Mínimo' },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'class-group', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('class-group', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const clanColumns = [
    { accessorKey: 'name', header: 'Nome do Clã' },
    { accessorKey: 'description', header: 'Descrição' },
    { accessorKey: 'members', header: 'Membros', cell: ({row}: any) => row.original.members.length },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'clan', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('clan', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  const abilityColumns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'description', header: 'Descrição' },
    { accessorKey: 'type', header: 'Tipo' },
    { accessorKey: 'cost', header: 'Custo' },
    { accessorKey: 'levelRequirement', header: 'Nível Mín.' },
    { accessorKey: 'classId', header: 'Classe', cell: ({row}: any) => gameClasses.find(c => c.id === row.original.classId)?.name || 'Qualquer' },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'ability', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('ability', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const weaponColumns = [
    { accessorKey: 'name', header: 'Nome' },
    { accessorKey: 'type', header: 'Tipo' },
    { accessorKey: 'damage', header: 'Dano' },
    { accessorKey: 'rarity', header: 'Raridade' },
    { accessorKey: 'classRequirement', header: 'Classes', cell: ({row}: any) => (
        <div className="flex flex-wrap gap-1">
            {row.original.classRequirement.map((classId: string) => (
                <Badge key={classId} variant="secondary">{gameClasses.find(c => c.id === classId)?.name || classId}</Badge>
            ))}
        </div>
    ) },
    {
      id: 'actions',
      cell: ({ row }: { row: { original: any } }) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('edit', 'weapon', row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDelete('weapon', row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];


  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-6">
            <div>
                 <h1 className="text-3xl font-headline font-bold text-accent mb-2">Painel de Administração</h1>
                 <p className="text-muted-foreground">Gerencie o conteúdo e as configurações do Mundo Mítico.</p>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Gerar Conteúdo com IA
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Gerador de Conteúdo com IA</DialogTitle>
                        <DialogDescription>
                            Selecione o tipo de conteúdo e descreva o que você quer criar. A IA gerará uma estrutura JSON para você.
                        </DialogDescription>
                    </DialogHeader>
                    <ContentGenerator />
                </DialogContent>
            </Dialog>
        </div>


        <Tabs defaultValue="classes">
          <TabsList className="mb-4">
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="races">Raças</TabsTrigger>
            <TabsTrigger value="abilities">Habilidades</TabsTrigger>
            <TabsTrigger value="weapons">Armas</TabsTrigger>
            <TabsTrigger value="maps">Mapas</TabsTrigger>
            <TabsTrigger value="class-groups">Grupos de Classes</TabsTrigger>
            <TabsTrigger value="clans">Clãs</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'class')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Classe
              </Button>
            </div>
            <DataTable columns={classColumns} data={gameClasses} />
          </TabsContent>

          <TabsContent value="races">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'race')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Raça
              </Button>
            </div>
            <DataTable columns={raceColumns} data={races} />
          </TabsContent>

           <TabsContent value="abilities">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'ability')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Habilidade
              </Button>
            </div>
            <DataTable columns={abilityColumns} data={abilities} />
          </TabsContent>
          
          <TabsContent value="weapons">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'weapon')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Arma
              </Button>
            </div>
            <DataTable columns={weaponColumns} data={weapons} />
          </TabsContent>

          <TabsContent value="maps">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'map')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Mapa
              </Button>
            </div>
            <DataTable columns={mapColumns} data={gameMaps} />
          </TabsContent>

           <TabsContent value="class-groups">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'class-group')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Grupo
              </Button>
            </div>
            <DataTable columns={classGroupColumns} data={classGroups} />
          </TabsContent>

          <TabsContent value="clans">
            <div className="flex justify-end mb-4">
              <Button onClick={() => handleOpenDialog('add', 'clan')}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Clã
              </Button>
            </div>
            <DataTable columns={clanColumns} data={clans} />
          </TabsContent>

          <TabsContent value="users">
            <div className="flex justify-end mb-4">
               <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Usuário
              </Button>
            </div>
            <DataTable columns={userColumns} data={users} />
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
