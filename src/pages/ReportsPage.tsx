
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProject, getRecord } from '@/services/mockData';
import { ActivityRecord, Project, Plan } from '@/types';
import ReportPDFExport from '@/components/ReportPDFExport';
import { ArrowLeft } from 'lucide-react';

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId');
  const recordId = searchParams.get('recordId');
  
  const [project, setProject] = useState<Project | null>(null);
  const [record, setRecord] = useState<ActivityRecord | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  
  useEffect(() => {
    if (projectId) {
      const foundProject = getProject(projectId);
      setProject(foundProject);
    }
    
    if (recordId) {
      const foundRecord = getRecord(recordId);
      setRecord(foundRecord);
      
      if (foundRecord && projectId) {
        const foundProject = getProject(projectId);
        if (foundProject) {
          const foundPlan = foundProject.plans.find(p => p.id === foundRecord.planId);
          setPlan(foundPlan || null);
        }
      }
    }
  }, [projectId, recordId]);
  
  // Componente para visualização do relatório
  const ReportView = () => {
    if (!record || !project) return null;
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };
    
    const periodTranslation = {
      morning: 'Manhã',
      afternoon: 'Tarde',
      night: 'Noite',
    };
    
    return (
      <div className="space-y-6 print:space-y-8" id="report-content">
        <div className="text-center mb-8 print:mb-12">
          <h1 className="text-2xl font-bold print:text-4xl">Relatório de Atividade Ambiental</h1>
          <p className="text-muted-foreground print:text-xl">{project.name}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2 print:text-2xl">Informações Gerais</h2>
            <div className="space-y-2">
              <div>
                <strong>Projeto:</strong> {project.name}
              </div>
              <div>
                <strong>Programa/Plano:</strong> {plan?.name || 'Não especificado'}
              </div>
              <div>
                <strong>Data:</strong> {formatDate(record.date)}
              </div>
              <div>
                <strong>Período:</strong> {periodTranslation[record.period]}
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-2 print:text-2xl">Localização</h2>
            <div className="space-y-2">
              <div>
                <strong>Local:</strong> {record.location}
              </div>
              <div>
                <strong>Clima:</strong> {record.weather}
              </div>
              {record.coordinates && (
                <div>
                  <strong>Coordenadas UTM:</strong> {record.coordinates.easting}E / {record.coordinates.northing}N (Zona {record.coordinates.utmZone}, Hemisfério {record.coordinates.hemisphere})
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2 print:text-2xl">Equipe</h2>
          <div className="space-y-2">
            <div>
              <strong>Responsável:</strong> {record.responsible}
            </div>
            {record.team.length > 0 && (
              <div>
                <strong>Equipe:</strong> {record.team.join(', ')}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2 print:text-2xl">Resumo da Atividade</h2>
          <p className="whitespace-pre-line">{record.summary}</p>
        </div>
        
        {record.nonCompliances && (
          <div>
            <h2 className="text-lg font-semibold mb-2 print:text-2xl">Não Conformidades</h2>
            <p className="whitespace-pre-line">{record.nonCompliances}</p>
            
            {record.correctiveActionDates && record.correctiveActionDates.length > 0 && (
              <div>
                {record.correctiveActionDates.map((date, index) => (
                  <div key={index} className="mt-2">
                    <strong>Data limite para correção:</strong> {formatDate(date)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {record.correctiveActions.length > 0 && record.nonCompliances && (
          <div>
            <h2 className="text-lg font-semibold mb-2 print:text-2xl">Ações Corretivas</h2>
            <ul className="list-disc pl-5">
              {record.correctiveActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}
        
        {record.observations && (
          <div>
            <h2 className="text-lg font-semibold mb-2 print:text-2xl">Observações</h2>
            <p className="whitespace-pre-line">{record.observations}</p>
          </div>
        )}
        
        {record.photos.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2 print:text-2xl">Fotos</h2>
            <div className="grid grid-cols-2 gap-4">
              {record.photos.map((photo, index) => (
                <div key={index} className="border rounded overflow-hidden">
                  <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <MainLayout>
      <PageHeader 
        title="Relatório de Atividade" 
        description="Visualização detalhada para impressão ou exportação"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            {record && project && plan && (
              <ReportPDFExport record={record} project={project} plan={plan} />
            )}
          </div>
        }
      />
      
      <Card className="print:shadow-none print:border-none">
        <CardContent className="pt-6">
          {record && project ? (
            <ReportView />
          ) : (
            <div className="flex justify-center items-center h-[50vh]">
              <p className="text-muted-foreground">
                Selecione um registro para visualizar seu relatório
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ReportsPage;
