
import { useState, useEffect } from 'react';
import { getWeatherOptions } from '@/services/mockData';
import { Weather } from '@/types';

interface UseWeatherOptionsProps {
  onAddOption?: (option: string) => void;
  onEditOption?: (oldOption: string, newOption: string) => void;
  onDeleteOption?: (option: string) => void;
}

export function useWeatherOptions({ 
  onAddOption, 
  onEditOption, 
  onDeleteOption 
}: UseWeatherOptionsProps = {}) {
  const [weatherOptions, setWeatherOptions] = useState<Weather[]>([]);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  
  useEffect(() => {
    // Carrega opções de clima quando o componente é montado
    const loadWeatherOptions = () => {
      const options = getWeatherOptions();
      setWeatherOptions(options);
    };
    
    loadWeatherOptions();
  }, []);

  // Funções manipuladoras
  const handleAddOption = () => {
    if (onAddOption && newOption.trim()) {
      onAddOption(newOption);
      setNewOption('');
    }
  };

  const handleEditOption = (index: number, value: string) => {
    setEditIndex(index);
    setNewOption(weatherOptions[index]?.description || '');
  };

  const handleUpdateOption = () => {
    if (onEditOption && editIndex !== null) {
      const oldOption = weatherOptions[editIndex]?.description || '';
      onEditOption(oldOption, newOption);
      resetForm();
    }
  };

  const handleDeleteOption = (index: number) => {
    if (onDeleteOption && index >= 0 && index < weatherOptions.length) {
      onDeleteOption(weatherOptions[index].description);
    }
  };

  const resetForm = () => {
    setEditIndex(null);
    setNewOption('');
  };

  return {
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
  };
}
