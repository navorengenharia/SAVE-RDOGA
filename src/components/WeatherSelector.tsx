
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Cog } from 'lucide-react';
import ListOptionsManager from './ListOptionsManager';
import { Weather } from '@/types';
import { useWeatherOptions } from '@/hooks/useWeatherOptions';

interface WeatherSelectorProps {
  value: string;
  onChange: (value: string) => void;
  projectName?: string;
  onAddOption?: (option: string) => void;
  onEditOption?: (oldOption: string, newOption: string) => void;
  onDeleteOption?: (option: string) => void;
  showManager?: boolean;
}

// Memoização do componente para evitar renderizações desnecessárias
const WeatherSelector = React.memo<WeatherSelectorProps>(({ 
  value, 
  onChange, 
  projectName = "",
  onAddOption,
  onEditOption,
  onDeleteOption,
  showManager = false
}) => {
  // Utilizando o hook personalizado para separar a lógica
  const {
    weatherOptions,
    isManagerOpen,
    setIsManagerOpen,
    newOption,
    setNewOption,
    editIndex,
    handleAddOption,
    handleEditOption,
    handleUpdateOption,
    handleDeleteOption,
    resetForm
  } = useWeatherOptions({ onAddOption, onEditOption, onDeleteOption });

  // Componente renderizado somente quando necessário
  const renderManager = () => {
    if (!showManager || !onAddOption || !onEditOption || !onDeleteOption) return null;
    
    return (
      <ListOptionsManager
        title="Clima"
        projectName={projectName}
        options={weatherOptions.map(o => o.description)}
        onAddOption={onAddOption}
        onEditOption={onEditOption}
        onDeleteOption={onDeleteOption}
        open={isManagerOpen}
        onOpenChange={setIsManagerOpen}
        currentValue={newOption}
        onValueChange={setNewOption}
        onAdd={handleAddOption}
        onEdit={handleEditOption}
        onUpdate={handleUpdateOption}
        onDelete={handleDeleteOption}
        onCancel={resetForm}
        editingIndex={editIndex}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Clima</label>
        {showManager && onAddOption && onEditOption && onDeleteOption && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => setIsManagerOpen(true)}
          >
            <Cog className="h-3.5 w-3.5 mr-1" /> Gerenciar Opções
          </Button>
        )}
      </div>
      
      <div className="flex-1">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o clima" />
          </SelectTrigger>
          <SelectContent>
            {weatherOptions.map((option) => (
              <SelectItem key={option.id} value={option.description}>
                {option.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {renderManager()}
    </div>
  );
});

// Definindo displayName para melhor depuração
WeatherSelector.displayName = 'WeatherSelector';

export default WeatherSelector;
