
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProjects, getRecords } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { PlusIcon, ClipboardListIcon, FolderIcon, FileTextIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Project, ActivityRecord } from '@/types';

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentRecords, setRecentRecords] = useState<ActivityRecord[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRecords: 0,
    recordsToday: 0
  });

  useEffect(() => {
    if (user) {
      const userProjects = getProjects(user.id);
      setProjects(userProjects);
      
      const allRecords = getRecords();
      setRecentRecords(allRecords.slice(0, 5));
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const recordsToday = allRecords.filter(record => record.date === today);
      
      setStats({
        totalProjects: userProjects.length,
        totalRecords: allRecords.length,
        recordsToday: recordsToday.length
      });
    }
  }, [user]);

  return (
    <MainLayout>
      <PageHeader 
        title="Painel de Controle" 
        description="Visão geral de atividades ambientais"
        actions={
          <Button asChild>
            <Link to="/records/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Registro
            </Link>
          </Button>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <FolderIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <ClipboardListIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registros Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.recordsToday}</div>
              <FileTextIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Projetos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.plans.length} planos</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link to={`/records?projectId=${project.id}`}>Ver</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhum projeto encontrado</p>
              )}
              
              {projects.length > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-center">
                    <Button variant="ghost" asChild>
                      <Link to="/projects">Ver todos os projetos</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Registros Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => {
                  const project = projects.find(p => p.id === record.projectId);
                  const plan = project?.plans.find(p => p.id === record.planId);
                  
                  return (
                    <div key={record.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project?.name || 'Projeto'}</p>
                        <p className="text-sm text-muted-foreground">
                          {plan?.name || 'Plano'} - {record.date}
                        </p>
                      </div>
                      <Button variant="outline" asChild>
                        <Link to={`/records/${record.id}`}>Ver</Link>
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground">Nenhum registro encontrado</p>
              )}
              
              {recentRecords.length > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-center">
                    <Button variant="ghost" asChild>
                      <Link to="/records">Ver todos os registros</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
