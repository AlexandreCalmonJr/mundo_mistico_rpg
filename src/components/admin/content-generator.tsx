
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Copy, Upload } from 'lucide-react';
import { generateGameContent } from '@/ai/flows/generate-game-content';
import { addDocument } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const CONTENT_TYPES = [
  { value: 'Classe', label: 'Classe' },
  { value: 'Raça', label: 'Raça' },
  { value: 'Habilidade', label: 'Habilidade' },
  { value: 'Arma', label: 'Arma' },
  { value: 'Mapa', label: 'Mapa' },
  { value: 'Grupo de Classe', label: 'Grupo de Classe' },
  { value: 'Temporada', label: 'Temporada (Beta)' },
];

export function ContentGenerator() {
  const { toast } = useToast();
  const [contentType, setContentType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    if (!contentType || !prompt) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, selecione o tipo de conteúdo e preencha o prompt.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setGeneratedContent('');
    try {
      const result = await generateGameContent({ contentType, prompt });
      setGeneratedContent(result.generatedJson);
    } catch (error) {
      console.error('Failed to generate content:', error);
      toast({
        title: 'Erro ao gerar conteúdo',
        description: 'A IA não conseguiu processar sua solicitação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({ title: 'Conteúdo copiado para a área de transferência!' });
  };
  
  const handleImport = async () => {
    setIsImporting(true);
    try {
      const parsedData = JSON.parse(generatedContent);

      // Handle multi-document import for "Temporada"
      if (contentType === 'Temporada' && Array.isArray(parsedData)) {
         for (const item of parsedData) {
            if (item.collection && item.data) {
                await addDocument(item.collection, item.data);
            }
         }
         toast({
            title: 'Temporada importada com sucesso!',
            description: `Conteúdo da temporada adicionado ao banco de dados. A página será recarregada.`,
         });

      } else { // Handle single document import
        let collectionName = '';
        switch (contentType) {
            case 'Classe': collectionName = 'classes'; break;
            case 'Raça': collectionName = 'races'; break;
            case 'Habilidade': collectionName = 'abilities'; break;
            case 'Arma': collectionName = 'weapons'; break;
            case 'Mapa': collectionName = 'gameMaps'; break;
            case 'Grupo de Classe': collectionName = 'classGroups'; break;
            default:
            throw new Error('Tipo de conteúdo inválido para importação individual.');
        }
        await addDocument(collectionName, parsedData);
        toast({
            title: 'Conteúdo importado com sucesso!',
            description: `Novo(a) ${contentType} adicionado(a) ao banco de dados. A página será recarregada.`,
        });
      }
      
      setGeneratedContent('');
      // Reload the page to reflect the changes in the data table
      window.location.reload();

    } catch (error) {
      console.error('Failed to import content:', error);
      toast({
        title: 'Erro ao importar',
        description: 'Não foi possível salvar o conteúdo no banco de dados. Verifique o formato do JSON.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select onValueChange={setContentType} value={contentType}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conteúdo" />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="sm:col-span-2">
            <Textarea
                placeholder="Ex: Crie uma classe de guerreiro do deserto, ágil e que usa duas espadas."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-full"
            />
        </div>
      </div>
      
      <Button onClick={handleGenerate} disabled={isLoading || isImporting} className="w-full">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Gerar
      </Button>

      {generatedContent && (
        <div className="space-y-2">
            <h3 className="font-semibold">Conteúdo Gerado:</h3>
            <Card className="relative bg-black/80">
                <CardContent className="p-4">
                    <pre className="text-sm text-primary-foreground whitespace-pre-wrap overflow-x-auto">
                    <code>{generatedContent}</code>
                    </pre>
                </CardContent>
            </Card>
            <div className="flex gap-2">
                 <Button variant="outline" className="w-full" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar JSON
                </Button>
                <Button className="w-full" onClick={handleImport} disabled={isImporting}>
                    {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                    Importar para o Banco de Dados
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
