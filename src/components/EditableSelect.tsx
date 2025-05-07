
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, PencilIcon, Trash2Icon, CheckIcon, XIcon } from 'lucide-react';
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

interface EditableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onAddOption?: (option: string) => void;
  onEditOption?: (oldValue: string, newValue: string) => void;
  onDeleteOption?: (option: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  onAddOption,
  onEditOption,
  onDeleteOption,
  placeholder = "Selecione uma opção",
  disabled = false
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [editedOption, setEditedOption] = useState('');
  const [currentOption, setCurrentOption] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState('');

  const handleAdd = () => {
    if (!newOption.trim() || !onAddOption) return;
    onAddOption(newOption.trim());
    setNewOption('');
    setIsAdding(false);
  };

  const handleStartEdit = (option: string) => {
    setCurrentOption(option);
    setEditedOption(option);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editedOption.trim() || !onEditOption || currentOption === editedOption) {
      setIsEditing(false);
      return;
    }
    
    onEditOption(currentOption, editedOption.trim());
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    if (onDeleteOption && optionToDelete) {
      onDeleteOption(optionToDelete);
      setDeleteDialogOpen(false);
      setOptionToDelete('');
    }
  };

  const handleStartDelete = (option: string) => {
    setOptionToDelete(option);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {(onEditOption || onDeleteOption) && (
                      <div className="flex gap-1 ml-2">
                        {onEditOption && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStartEdit(option);
                            }}
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Button>
                        )}
                        {onDeleteOption && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-6 w-6 p-0" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStartDelete(option);
                            }}
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {onAddOption && !isAdding && (
          <Button 
            type="button" 
            variant="outline" 
            className="px-2"
            onClick={() => setIsAdding(true)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 items-center">
          <Input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            placeholder={`Novo ${label.toLowerCase()}`}
            className="flex-1"
            autoFocus
          />
          <Button type="button" size="sm" onClick={handleAdd}>
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setIsAdding(false)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="flex gap-2 items-center">
          <Input
            value={editedOption}
            onChange={(e) => setEditedOption(e.target.value)}
            placeholder={`Editar ${label.toLowerCase()}`}
            className="flex-1"
            autoFocus
          />
          <Button type="button" size="sm" onClick={handleSaveEdit}>
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{optionToDelete}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditableSelect;
