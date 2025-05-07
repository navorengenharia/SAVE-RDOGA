
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { Project } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import ListOptionsManager from '@/components/ListOptionsManager';

interface LocationManagementProps {
  selectedProject: Project | null;
  location: string;
  showOtherLocationInput: boolean;
  otherLocationValue: string;
  handleSelectChange: (name: string, value: string) => void;
  setShowOtherLocationInput: (show: boolean) => void;
  setOtherLocationValue: (value: string) => void;
  addNewLocation: () => void;
}

const LocationManagement: React.FC<LocationManagementProps> = ({
  selectedProject,
  location,
  showOtherLocationInput,
  otherLocationValue,
  handleSelectChange,
  setShowOtherLocationInput,
  setOtherLocationValue,
  addNewLocation
}) => {
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="location">Localização</Label>
        <Button 
          type="button" 
          size="sm" 
          variant="ghost" 
          className="h-8 px-2 text-xs"
          onClick={() => setLocationDialogOpen(true)}
          disabled={!selectedProject}
        >
          <Settings className="h-3.5 w-3.5 mr-1" /> Gerenciar Opções
        </Button>
      </div>
      
      {selectedProject && selectedProject.locations.length > 0 ? (
        <Select
          value={location}
          onValueChange={(value) => handleSelectChange("location", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a localização" />
          </SelectTrigger>
          <SelectContent>
            {selectedProject.locations.map((location, index) => (
              <SelectItem 
                key={index} 
                value={location}
              >
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-muted-foreground italic">Nenhuma localização disponível. Adicione uma nova.</p>
      )}
      
      {/* Modal de Gerenciamento de Localizações */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Opções de Localização</DialogTitle>
            <DialogDescription>
              Adicione, edite ou remova localizações da lista.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <ListOptionsManager
              options={selectedProject.locations}
              currentValue={otherLocationValue}
              onValueChange={setOtherLocationValue}
              onAdd={addNewLocation}
              onEdit={(index, value) => {
                // Este é apenas o começo da edição, a implementação completa seria no componente pai
                setOtherLocationValue(value);
              }}
              onDelete={(index) => {
                if (window.confirm(`Tem certeza que deseja excluir esta localização?`)) {
                  const newLocations = [...selectedProject.locations];
                  newLocations.splice(index, 1);
                  selectedProject.locations = newLocations;
                }
              }}
            />
          )}
          
          <DialogFooter>
            <Button onClick={() => setLocationDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationManagement;
