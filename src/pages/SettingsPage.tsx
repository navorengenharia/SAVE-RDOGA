
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { getAppConfig, updateAppConfig, getProjects, exportProjectData, importProjectData } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { Project, AppConfig } from '@/types';
import { AlertCircle, Download, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  // Update the state to match the AppConfig type with optional logo
  const [appConfig, setAppConfig] = useState<AppConfig>({
    logo: '',
    tagline: '',
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  
  useEffect(() => {
    const config = getAppConfig();
    setAppConfig(config);
    
    const projectsList = getProjects();
    setProjects(projectsList);
    
    if (projectsList.length > 0) {
      setSelectedProjectId(projectsList[0].id);
    }
  }, []);
  
  const handleSaveConfig = () => {
    updateAppConfig(appConfig);
    toast({
      title: "Configurações salvas",
      description: "As configurações do aplicativo foram atualizadas com sucesso",
    });
  };
  
  const handleExportData = () => {
    if (!selectedProjectId) {
      toast({
        title: "Erro ao exportar",
        description: "Selecione um projeto para exportar",
        variant: "destructive",
      });
      return;
    }
    
    const csvData = exportProjectData(selectedProjectId);
    const project = projects.find(p => p.id === selectedProjectId);
    const filename = `Backup_RDOGA_${project?.name.replace(/\s+/g, '')}_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Create download link
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Exportação concluída",
      description: `Os dados do projeto foram exportados para ${filename}`,
    });
  };
  
  const handleImportData = () => {
    if (!selectedProjectId || !importFile) {
      toast({
        title: "Erro ao importar",
        description: "Selecione um projeto e um arquivo para importar",
        variant: "destructive",
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      try {
        const result = importProjectData(selectedProjectId, csvData);
        toast({
          title: "Importação concluída",
          description: `Foram importados ${result.imported} registros. ${result.duplicates} registros duplicados foram ignorados.`,
        });
        setImportFile(null);
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Ocorreu um erro ao importar os dados. Verifique o formato do arquivo.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(importFile);
  };
  
  if (!isAdmin) {
    toast({
      title: "Acesso restrito",
      description: "Você não tem permissão para acessar esta página",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <MainLayout>
      <PageHeader 
        title="Configurações" 
        description="Gerencie as configurações do sistema"
      />
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="backup">Backup e Restauração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Aplicação</CardTitle>
              <CardDescription>
                Personalize o RDOGA de acordo com sua organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo">URL da Logomarca</Label>
                <Input 
                  id="logo" 
                  placeholder="https://exemplo.com/logo.png" 
                  value={appConfig.logo || ''}
                  onChange={(e) => setAppConfig({ ...appConfig, logo: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Insira a URL de uma imagem para usar como logomarca da aplicação
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Frase de Apresentação</Label>
                <Textarea 
                  id="tagline" 
                  placeholder="Relatório Diário de Obra da Gestão Ambiental" 
                  value={appConfig.tagline || ''}
                  onChange={(e) => setAppConfig({ ...appConfig, tagline: e.target.value })}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Esta frase será exibida na tela de login e em outros lugares da aplicação
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveConfig}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup e Restauração de Dados</CardTitle>
              <CardDescription>
                Exporte e importe dados de projetos para backup ou migração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  O processo de backup e restauração opera apenas nos registros de atividades.
                  Configurações de projetos, usuários e outros dados não são incluídos.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selecione o Projeto</h3>
                {projects.length > 0 ? (
                  <Select
                    value={selectedProjectId}
                    onValueChange={setSelectedProjectId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um projeto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhum projeto disponível para backup.
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Exportar Dados (Backup)</h3>
                  <p className="text-sm text-muted-foreground">
                    Exporte os registros de atividades do projeto selecionado para um arquivo CSV.
                  </p>
                  <Button 
                    onClick={handleExportData}
                    disabled={!selectedProjectId}
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Backup CSV
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Importar Dados (Restauração)</h3>
                  <p className="text-sm text-muted-foreground">
                    Importe registros de atividades para o projeto selecionado. Registros duplicados serão ignorados.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="importFile">Arquivo CSV</Label>
                    <Input 
                      id="importFile" 
                      type="file" 
                      accept=".csv" 
                      onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)}
                    />
                  </div>
                  <Button 
                    onClick={handleImportData}
                    disabled={!selectedProjectId || !importFile}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Importar Dados
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default SettingsPage;
