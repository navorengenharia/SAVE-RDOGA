
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Project } from '@/types';
import { Plus, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ListOptionsManager from '@/components/ListOptionsManager';

interface PeopleSectionProps {
  selectedProject: Project | null;
  form: any;
  showOtherResponsibleInput: boolean;
  otherResponsibleValue: string;
  handleSelectChange: (name: string, value: string) => void;
  handleTeamChange: (team: string) => void;
  setShowOtherResponsibleInput: (show: boolean) => void;
  setOtherResponsibleValue: (value: string) => void;
  addNewResponsible: () => void;
  addNewTeam: (teamName: string) => void;
  editingResponsible: {value: string, index: number} | null;
  editingTeam: {value: string, index: number} | null;
  setEditingResponsible: (resp: {value: string, index: number} | null) => void;
  setEditingTeam: (team: {value: string, index: number} | null) => void;
  updateResponsible: () => void;
  updateTeam: () => void;
  deleteResponsible: (index: number) => void;
  deleteTeam: (index: number) => void;
}

const PeopleSection: React.FC<PeopleSectionProps> = ({
  selectedProject,
  form,
  showOtherResponsibleInput,
  otherResponsibleValue,
  handleSelectChange,
  handleTeamChange,
  setShowOtherResponsibleInput,
  setOtherResponsibleValue,
  addNewResponsible,
  addNewTeam,
  editingResponsible,
  editingTeam,
  setEditingResponsible,
  setEditingTeam,
  updateResponsible,
  updateTeam,
  deleteResponsible,
  deleteTeam,
}) => {
  // Estado para controlar os modais de gerenciamento
  const [responsibleDialogOpen, setResponsibleDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="responsible">Responsável</Label>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2 text-xs"
            onClick={() => setResponsibleDialogOpen(true)}
          >
            <Settings className="h-3.5 w-3.5 mr-1" /> Gerenciar Opções
          </Button>
        </div>
        
        {selectedProject && selectedProject.responsibles.length > 0 ? (
          <>
            <Select
              value={form.responsible}
              onValueChange={(value) => handleSelectChange("responsible", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                {selectedProject?.responsibles.map((responsible, index) => (
                  <SelectItem 
                    key={index} 
                    value={responsible}
                  >
                    {responsible}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        ) : (
          <p className="text-muted-foreground italic">Nenhum responsável disponível. Adicione um novo.</p>
        )}
        
        {/* Modal de Gerenciamento de Responsáveis */}
        <Dialog open={responsibleDialogOpen} onOpenChange={setResponsibleDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gerenciar Opções de Responsáveis</DialogTitle>
              <DialogDescription>
                Adicione, edite ou remova responsáveis da lista.
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <ListOptionsManager
                items={selectedProject.responsibles}
                currentValue={otherResponsibleValue}
                onValueChange={setOtherResponsibleValue}
                onAdd={() => {
                  addNewResponsible();
                  setOtherResponsibleValue("");
                }}
                onEdit={(index, value) => {
                  setEditingResponsible({ index, value });
                  setOtherResponsibleValue(value);
                }}
                onUpdate={() => {
                  updateResponsible();
                  setOtherResponsibleValue("");
                  setEditingResponsible(null);
                }}
                onDelete={deleteResponsible}
                onCancel={() => {
                  setOtherResponsibleValue("");
                  setEditingResponsible(null);
                }}
                editingIndex={editingResponsible?.index}
              />
            )}
            
            <DialogFooter>
              <Button onClick={() => setResponsibleDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Equipe</Label>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            className="h-8 px-2 text-xs"
            onClick={() => setTeamDialogOpen(true)}
          >
            <Settings className="h-3.5 w-3.5 mr-1" /> Gerenciar Opções
          </Button>
        </div>
        
        <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
          <div className="space-y-2">
            {selectedProject && selectedProject.teams.map((team, index) => (
              <div key={index} className="flex items-center">
                <Checkbox 
                  id={`team-${index}`}
                  checked={form.team.includes(team)}
                  onCheckedChange={() => handleTeamChange(team)}
                />
                <label 
                  htmlFor={`team-${index}`}
                  className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {team}
                </label>
              </div>
            ))}
            
            {selectedProject && selectedProject.teams.length === 0 && (
              <p className="text-muted-foreground italic">Nenhuma equipe disponível. Adicione uma nova.</p>
            )}
          </div>
        </div>
        
        {/* Modal de Gerenciamento de Equipes */}
        <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gerenciar Opções de Equipes</DialogTitle>
              <DialogDescription>
                Adicione, edite ou remova equipes da lista.
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <ListOptionsManager
                items={selectedProject.teams}
                currentValue={otherResponsibleValue}
                onValueChange={setOtherResponsibleValue}
                onAdd={() => {
                  addNewTeam(otherResponsibleValue);
                  setOtherResponsibleValue("");
                }}
                onEdit={(index, value) => {
                  setEditingTeam({ index, value });
                  setOtherResponsibleValue(value);
                }}
                onUpdate={() => {
                  updateTeam();
                  setOtherResponsibleValue("");
                  setEditingTeam(null);
                }}
                onDelete={deleteTeam}
                onCancel={() => {
                  setOtherResponsibleValue("");
                  setEditingTeam(null);
                }}
                editingIndex={editingTeam?.index}
              />
            )}
            
            <DialogFooter>
              <Button onClick={() => setTeamDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PeopleSection;
