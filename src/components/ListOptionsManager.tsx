
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, Pencil, Trash, Check, X } from 'lucide-react';
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

interface ListOptionsManagerProps {
  title?: string;
  projectName?: string;
  options?: string[];
  items?: string[]; // Adicionado para compatibilidade
  currentValue: string;
  onValueChange: (value: string) => void;
  onAdd: () => void;
  onEdit: (index: number, value: string) => void;
  onUpdate?: () => void;
  onDelete: (index: number) => void;
  onCancel?: () => void;
  editingIndex?: number | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Adicionando as props que faltavam para o WeatherSelector
  onAddOption?: (option: string) => void;
  onEditOption?: (oldOption: string, newOption: string) => void;
  onDeleteOption?: (option: string) => void;
}

const ListOptionsManager: React.FC<ListOptionsManagerProps> = ({
  title,
  projectName,
  options,
  items, // Suporte para ambas as propriedades
  currentValue,
  onValueChange,
  onAdd,
  onEdit,
  onUpdate,
  onDelete,
  onCancel,
  editingIndex,
  open,
  onOpenChange,
  // Props adicionais para o WeatherSelector
  onAddOption,
  onEditOption,
  onDeleteOption
}) => {
  const [newOption, setNewOption] = useState('');
  const [editingOption, setEditingOption] = useState<{ index: number; value: string } | null>(null);
  const [deleteOption, setDeleteOption] = useState<string | null>(null);

  // Use options ou items, o que estiver disponível
  const optionsList = options || items || [];

  const handleAddOption = () => {
    if (!currentValue.trim()) return;
    
    // Usar onAddOption se fornecido (para WeatherSelector), caso contrário use onAdd
    if (onAddOption) {
      onAddOption(currentValue);
    } else {
      onAdd();
    }
  };

  const startEditing = (option: string, index: number) => {
    onEdit(index, option);
  };

  const saveEdit = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const cancelEdit = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const confirmDelete = (option: string, index: number) => {
    setDeleteOption(option);
    // Armazene o índice para uso posterior
    setEditingOption({ index, value: option });
  };

  const handleDelete = () => {
    if (deleteOption && editingOption) {
      // Usar onDeleteOption se fornecido (para WeatherSelector), caso contrário use onDelete
      if (onDeleteOption) {
        onDeleteOption(deleteOption);
      } else {
        onDelete(editingOption.index);
      }
      setDeleteOption(null);
      setEditingOption(null);
    }
  };

  // Verifica se estamos usando a interface Sheet ou diretamente no componente
  if (open !== undefined && onOpenChange !== undefined) {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Gerenciar Opções de {title}</SheetTitle>
              {projectName && (
                <SheetDescription>
                  para o projeto {projectName}
                </SheetDescription>
              )}
            </SheetHeader>
            
            <div className="py-6">
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Nova opção..."
                  value={currentValue}
                  onChange={(e) => onValueChange(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddOption}>
                  <PlusIcon className="h-4 w-4 mr-1" /> Incluir
                </Button>
              </div>
              
              <div className="space-y-2">
                {optionsList.map((option, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    {editingIndex === index ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <Input
                          value={currentValue}
                          onChange={(e) => onValueChange(e.target.value)}
                          autoFocus
                        />
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1">{option}</span>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => startEditing(option, index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => confirmDelete(option, index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <SheetFooter>
              <SheetClose asChild>
                <Button type="button">Concluído</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <AlertDialog open={!!deleteOption} onOpenChange={() => setDeleteOption(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir "{deleteOption}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Versão para uso direto dentro de um componente sem o Sheet
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Nova opção..."
          value={currentValue}
          onChange={(e) => onValueChange(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddOption}>
          <PlusIcon className="h-4 w-4 mr-1" /> Incluir
        </Button>
      </div>
      
      <div className="space-y-2">
        {optionsList.map((option, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-2 border rounded-md"
          >
            {editingIndex === index ? (
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  value={currentValue}
                  onChange={(e) => onValueChange(e.target.value)}
                  autoFocus
                />
                <Button size="sm" onClick={saveEdit}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1">{option}</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => startEditing(option, index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => confirmDelete(option, index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteOption} onOpenChange={() => setDeleteOption(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteOption}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListOptionsManager;
