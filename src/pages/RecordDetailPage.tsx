
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getRecord, getProject, deleteRecord } from '@/services/mockData';
import { ActivityRecord, Project, Plan } from '@/types';
import { 
  ArrowLeft, Calendar, MapPin, Cloud, User, 
  Users, FileText, Edit, Trash2, Copy 
} from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const RecordDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [record, setRecord] = useState<ActivityRecord | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundRecord = getRecord(id);
      setRecord(foundRecord);
      
      if (foundRecord) {
        const foundProject = getProject(foundRecord.projectId);
        setProject(foundProject);
        
        if (foundProject) {
          const foundPlan = foundProject.plans.find(p => p.id === foundRecord.planId);
          setPlan(foundPlan || null);
        }
      }
    }
  }, [id]);
  
  if (!record || !project) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-muted-foreground">Registro não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  const handleGenerateReport = () => {
    // Redirecionar para a página de relatórios com o projeto e registro pré-selecionados
    navigate(`/reports?projectId=${record.projectId}&recordId=${record.id}`);
  };
  
  const handleEditRecord = () => {
    navigate(`/records/edit/${record.id}`);
  };
  
  const handleDuplicateRecord = () => {
    navigate(`/records/duplicate/${record.id}`);
  };
  
  const handleDeleteRecord = () => {
    if (id) {
      try {
        const success = deleteRecord(id);
        if (success) {
          toast({
            title: "Registro excluído",
            description: "O registro foi excluído com sucesso",
          });
          navigate('/records');
        } else {
          toast({
            title: "Erro ao excluir",
            description: "Não foi possível excluir o registro",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Ocorreu um erro ao excluir o registro",
          variant: "destructive"
        });
      }
    }
  };
  
  const periodTranslation = {
    morning: 'Manhã',
    afternoon: 'Tarde',
    night: 'Noite',
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatTimestamp = (timestampString: string) => {
    const timestamp = new Date(timestampString);
    return timestamp.toLocaleString('pt-BR');
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Detalhes do Registro" 
        description={`Registro de atividade em ${project.name}`}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleEditRecord}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" onClick={handleDuplicateRecord}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </Button>
              <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir registro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. O registro será permanentemente excluído.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRecord}>
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleGenerateReport}>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </div>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Data e Hora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{formatDate(record.date)}</p>
            <p className="text-sm text-muted-foreground">
              Período: {periodTranslation[record.period]}
            </p>
            <p className="text-sm text-muted-foreground">
              Registro em: {formatTimestamp(record.timestamp)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Localização e Clima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{record.location}</p>
            <p className="text-sm text-muted-foreground flex items-center">
              <Cloud className="h-3 w-3 mr-1" />
              {record.weather}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{record.responsible}</p>
            {record.team.length > 0 && (
              <div className="mt-1">
                <p className="text-xs text-muted-foreground flex items-center mb-1">
                  <Users className="h-3 w-3 mr-1" />
                  Equipe:
                </p>
                <div className="flex flex-wrap gap-1">
                  {record.team.map((member) => (
                    <Badge key={member} variant="outline">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Programa/Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Projeto</h3>
                <p>{project.name}</p>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Programa/Plano</h3>
                <p>{plan?.name || 'Plano não encontrado'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Resumo das Atividades</h3>
                <p className="whitespace-pre-line">{record.summary}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold">Não Conformidades</h3>
                {record.nonCompliances ? (
                  <p className="whitespace-pre-line">{record.nonCompliances}</p>
                ) : (
                  <p className="text-muted-foreground italic">Nenhuma não conformidade registrada</p>
                )}
              </div>
              
              {record.correctiveActions.length > 0 && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold">Ações Corretivas</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {record.correctiveActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {record.observations && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold">Observações</h3>
                    <p className="whitespace-pre-line">{record.observations}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fotos</CardTitle>
          </CardHeader>
          <CardContent>
            {record.photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {record.photos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic text-center py-8">
                Nenhuma foto registrada para esta atividade
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RecordDetailPage;
