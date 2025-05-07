
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteProject, getProjects, getRecords } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types';
import { ClipboardListIcon, FolderIcon, Trash, PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ProjectForm from '@/components/ProjectForm';

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsStats, setProjectsStats] = useState<Record<string, number>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);
  
  const loadProjects = () => {
    if (!user) return;
    
    const userProjects = getProjects(user.id);
    setProjects(userProjects);
    
    // Get stats for each project
    const records = getRecords();
    const stats: Record<string, number> = {};
    
    userProjects.forEach(project => {
      stats[project.id] = records.filter(record => record.projectId === project.id).length;
    });
    
    setProjectsStats(stats);
  };
  
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      const success = deleteProject(projectToDelete.id);
      
      if (success) {
        toast.success(`Projeto ${projectToDelete.name} excluído com sucesso`);
        loadProjects(); // Recarregar a lista de projetos
      } else {
        toast.error("Erro ao excluir projeto");
      }
      
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleProjectCreated = () => {
    setNewProjectDialogOpen(false);
    loadProjects(); // Recarregar a lista de projetos após criar um novo
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Projetos" 
        description="Visualize todos os projetos disponíveis"
        actions={
          <div className="flex items-center space-x-2">
            <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ProjectForm 
                  onSuccess={handleProjectCreated}
                  onCancel={() => setNewProjectDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={() => navigate('/records/new')}>
              Novo Registro
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="rdoga-card-hover flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge variant="outline" className="bg-muted/50">
                  {project.plans.length} Planos
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {project.description && (
                <p className="text-muted-foreground mb-4">{project.description}</p>
              )}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center">
                  <ClipboardListIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{projectsStats[project.id] || 0} Registros</span>
                </div>
                <div className="flex items-center">
                  <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{project.locations.length} Locais</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2 justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/records', { state: { projectId: project.id } })}
                className="w-full sm:w-auto"
              >
                Ver Registros
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="default"
                  onClick={() => navigate('/records/new', { state: { projectId: project.id } })}
                  className="flex-1"
                >
                  Registrar Atividade
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteClick(project)}
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full flex justify-center p-12">
            <p className="text-muted-foreground text-center">
              Nenhum projeto encontrado. Clique em "Novo Projeto" para criar seu primeiro projeto.
            </p>
          </div>
        )}
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir projeto</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o projeto "{projectToDelete?.name}"?
              <br />
              <br />
              <span className="font-semibold text-destructive">
                Esta ação não pode ser desfeita e todos os registros associados a este projeto serão excluídos.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ProjectsPage;
