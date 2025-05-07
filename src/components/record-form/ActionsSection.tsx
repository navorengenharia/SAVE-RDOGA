
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { Project } from '@/types';

interface ActionsSectionProps {
  selectedProject: Project | null;
  form: any;
  otherLocationValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCorrectiveActionChange: (action: string) => void;
  setOtherLocationValue: (value: string) => void;
  addNewCorrectiveAction: (action: string) => void;
}

const ActionsSection: React.FC<ActionsSectionProps> = ({
  selectedProject,
  form,
  otherLocationValue,
  handleChange,
  handleCorrectiveActionChange,
  setOtherLocationValue,
  addNewCorrectiveAction,
}) => {
  // Estado para controlar as datas de correção
  const [correctiveDates, setCorrectiveDates] = useState<string[]>([]);
  const [newDueDate, setNewDueDate] = useState<string>("");
  
  // Efeito para sincronizar as datas com o formulário
  useEffect(() => {
    if (form.correctiveActionDates) {
      setCorrectiveDates(form.correctiveActionDates);
    } else {
      setCorrectiveDates([]);
    }
  }, [form.correctiveActionDates]);
  
  // Função para adicionar uma data limite
  const addDueDate = () => {
    if (newDueDate) {
      const updatedDates = [...correctiveDates, newDueDate];
      
      // Cria um objeto que simula um evento de mudança para o formulário
      const customEvent = {
        target: {
          name: 'correctiveActionDates',
          value: updatedDates
        }
      };
      
      // Converte para o tipo esperado pelo handler usando type assertion
      handleChange(customEvent as unknown as React.ChangeEvent<HTMLInputElement>);
      setNewDueDate("");
    }
  };
  
  // Função para remover uma data limite
  const removeDueDate = (index: number) => {
    const updatedDates = [...correctiveDates];
    updatedDates.splice(index, 1);
    
    // Simula um evento de mudança para atualizar o formulário principal com type assertion
    const customEvent = {
      target: {
        name: 'correctiveActionDates',
        value: updatedDates
      }
    };
    
    handleChange(customEvent as unknown as React.ChangeEvent<HTMLInputElement>);
  };
  
  // Verifica se há não conformidades para habilitar a adição de ações corretivas
  const hasNonCompliances = form.nonCompliances && form.nonCompliances.trim() !== '';

  return (
    <div className="space-y-4">
      {/* Resumo da Atividade */}
      <div className="space-y-2">
        <Label htmlFor="summary">Resumo da Atividade</Label>
        <Textarea
          id="summary"
          name="summary"
          placeholder="Descreva resumidamente as atividades realizadas..."
          value={form.summary}
          onChange={handleChange}
          className="min-h-[100px]"
          required
        />
      </div>
      
      {/* Não Conformidades */}
      <div className="space-y-2">
        <Label htmlFor="nonCompliances">Não Conformidades</Label>
        <Textarea
          id="nonCompliances"
          name="nonCompliances"
          placeholder="Descreva as não conformidades identificadas (se houverem)..."
          value={form.nonCompliances}
          onChange={handleChange}
          className="min-h-[80px]"
        />
      </div>
      
      {/* Datas limite para correção */}
      {hasNonCompliances && (
        <div className="space-y-2 border-l-4 border-amber-500 pl-4 py-2 bg-amber-50">
          <Label>Data Limite para Correção</Label>
          <div className="flex items-end gap-2">
            <div className="flex-grow relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="pl-10"
                min={new Date().toISOString().split('T')[0]}  // Impede datas passadas
              />
            </div>
            <Button 
              type="button" 
              onClick={addDueDate} 
              disabled={!newDueDate}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          
          {correctiveDates.length > 0 ? (
            <div className="space-y-1 mt-2">
              <p className="text-sm font-medium">Datas limite definidas:</p>
              <ul className="space-y-1">
                {correctiveDates.map((date, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-2 rounded border">
                    <span>{new Date(date).toLocaleDateString('pt-BR')}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeDueDate(index)}
                    >
                      &times;
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Adicione pelo menos uma data limite para correção das não conformidades.
            </p>
          )}
        </div>
      )}
      
      {/* Ações Corretivas */}
      <div className="space-y-2">
        <Label>Ações Corretivas</Label>
        <div className={`border rounded-md p-3 max-h-[150px] overflow-y-auto ${!hasNonCompliances ? 'bg-gray-100 opacity-70' : ''}`}>
          <div className="space-y-2">
            {selectedProject && selectedProject.correctiveActions.map((action, index) => (
              <div key={index} className="flex items-center">
                <Checkbox 
                  id={`action-${index}`}
                  checked={form.correctiveActions.includes(action)}
                  onCheckedChange={() => handleCorrectiveActionChange(action)}
                  disabled={!hasNonCompliances}
                />
                <label 
                  htmlFor={`action-${index}`}
                  className={`ml-2 text-sm font-medium leading-none ${!hasNonCompliances ? 'text-gray-400' : ''}`}
                >
                  {action}
                </label>
              </div>
            ))}
            
            {/* Form para adicionar nova ação corretiva */}
            <div className="flex items-center mt-2">
              <Input 
                placeholder="Adicionar ação corretiva" 
                className="h-8 text-sm"
                value={otherLocationValue}
                onChange={(e) => setOtherLocationValue(e.target.value)}
                disabled={!hasNonCompliances}
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="ml-2 h-8 w-8 p-0"
                onClick={() => {
                  if (otherLocationValue.trim() && selectedProject && hasNonCompliances) {
                    addNewCorrectiveAction(otherLocationValue.trim());
                    setOtherLocationValue('');
                  }
                }}
                disabled={!hasNonCompliances}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {!hasNonCompliances && (
          <p className="text-sm text-amber-600">
            É necessário registrar não conformidades para adicionar ações corretivas.
          </p>
        )}
      </div>
      
      {/* Observações */}
      <div className="space-y-2">
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          name="observations"
          placeholder="Observações adicionais..."
          value={form.observations}
          onChange={handleChange}
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default ActionsSection;
