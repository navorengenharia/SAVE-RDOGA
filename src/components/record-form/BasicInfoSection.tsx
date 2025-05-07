
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project, Plan } from '@/types';
import { Calendar, Clock, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ListOptionsManager from '@/components/ListOptionsManager';

interface BasicInfoSectionProps {
  projects: Project[];
  selectedProject: Project | null;
  plans: Plan[];
  form: any;
  showOtherPlanInput: boolean;
  otherPlanValue: string;
  handleProjectChange: (projectId: string) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setShowOtherPlanInput: (show: boolean) => void;
  setOtherPlanValue: (value: string) => void;
  addNewPlan: () => void;
  editingPlan: { id: string; value: string } | null;
  setEditingPlan: (plan: { id: string; value: string } | null) => void;
  updatePlan: () => void;
  deletePlan: (planId: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  projects,
  selectedProject,
  plans,
  form,
  showOtherPlanInput,
  otherPlanValue,
  handleProjectChange,
  handleSelectChange,
  handleChange,
  setShowOtherPlanInput,
  setOtherPlanValue,
  addNewPlan,
  editingPlan,
  setEditingPlan,
  updatePlan,
  deletePlan,
}) => {
  const [planDialogOpen, setPlanDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Projeto e Plano */}
        <div className="space-y-2">
          <Label htmlFor="projectId">Obra/Projeto</Label>
          {projects.length > 0 ? (
            <Select
              value={form.projectId}
              onValueChange={(value) => handleProjectChange(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o projeto" />
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
            <p className="text-muted-foreground">Nenhum projeto disponível.</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="planId">Programa/Plano Ambiental</Label>
            <Button 
              type="button" 
              size="sm" 
              variant="ghost" 
              className="h-8 px-2 text-xs"
              onClick={() => setPlanDialogOpen(true)}
              disabled={!selectedProject}
            >
              <Settings className="h-3.5 w-3.5 mr-1" /> Gerenciar Opções
            </Button>
          </div>
          
          {plans.length > 0 ? (
            <>
              <Select
                value={form.planId}
                onValueChange={(value) => handleSelectChange("planId", value)}
                required
                disabled={!selectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o programa/plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem 
                      key={plan.id} 
                      value={plan.id}
                    >
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <p className="text-muted-foreground italic">Nenhum programa/plano disponível. Adicione um novo.</p>
          )}
          
          {/* Modal de Gerenciamento de Planos */}
          <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Gerenciar Opções de Programas/Planos</DialogTitle>
                <DialogDescription>
                  Adicione, edite ou remova programas/planos da lista.
                </DialogDescription>
              </DialogHeader>
              
              {selectedProject && (
                <div className="py-4">
                  <Input
                    placeholder="Nome do programa/plano"
                    value={otherPlanValue}
                    onChange={(e) => setOtherPlanValue(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-between">
                    {editingPlan ? (
                      <>
                        <Button 
                          onClick={updatePlan}
                          disabled={!otherPlanValue.trim()}
                        >
                          Atualizar
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            setOtherPlanValue('');
                            setEditingPlan(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={addNewPlan}
                        disabled={!otherPlanValue.trim()}
                      >
                        Adicionar
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium">Planos Existentes</h4>
                    <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
                      {plans.length > 0 ? (
                        <ul className="space-y-2">
                          {plans.map((plan) => (
                            <li key={plan.id} className="flex justify-between items-center border-b pb-1">
                              <span>{plan.name}</span>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setEditingPlan({ id: plan.id, value: plan.name });
                                    setOtherPlanValue(plan.name);
                                  }}
                                >
                                  Editar
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    if (window.confirm(`Tem certeza que deseja excluir "${plan.name}"?`)) {
                                      deletePlan(plan.id);
                                    }
                                  }}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground text-center py-2">Nenhum plano cadastrado</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button onClick={() => setPlanDialogOpen(false)}>Fechar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Data e Período */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="period">Período</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Select
              value={form.period}
              onValueChange={(value) => handleSelectChange("period", value)}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Manhã</SelectItem>
                <SelectItem value="afternoon">Tarde</SelectItem>
                <SelectItem value="night">Noite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
