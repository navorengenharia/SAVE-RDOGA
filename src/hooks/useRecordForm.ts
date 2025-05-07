import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Project, Plan, Weather } from '@/types';
import { getProjects, getProject, createRecord, updateProject, getRecord, updateRecord, getWeatherOptions } from '@/services/mockData';

interface UseRecordFormProps {
  id?: string;
  isDuplicate?: boolean;
  isEdit?: boolean;
  userId: string;
}

export const useRecordForm = ({ id, isDuplicate = false, isEdit = false, userId }: UseRecordFormProps) => {
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingRecord, setIsLoadingRecord] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [geoDialogOpen, setGeoDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  
  // Estado para gerenciar os campos com outras opções
  const [showOtherPlanInput, setShowOtherPlanInput] = useState(false);
  const [otherPlanValue, setOtherPlanValue] = useState('');
  
  const [showOtherLocationInput, setShowOtherLocationInput] = useState(false);
  const [otherLocationValue, setOtherLocationValue] = useState('');
  
  const [showOtherResponsibleInput, setShowOtherResponsibleInput] = useState(false);
  const [otherResponsibleValue, setOtherResponsibleValue] = useState('');
  
  // Estados para edição de opções
  const [editingPlan, setEditingPlan] = useState<{id: string, value: string} | null>(null);
  const [editingLocation, setEditingLocation] = useState<{value: string, index: number} | null>(null);
  const [editingResponsible, setEditingResponsible] = useState<{value: string, index: number} | null>(null);
  const [editingTeam, setEditingTeam] = useState<{value: string, index: number} | null>(null);
  
  // Adicionado para coordenadas geográficas
  const [coordinates, setCoordinates] = useState({
    easting: '',
    northing: '',
    utmZone: '',
    hemisphere: 'N'
  });
  
  // Estado para visualização de imagens
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [form, setForm] = useState({
    projectId: '',
    planId: '',
    date: new Date().toISOString().split('T')[0],
    period: 'morning' as 'morning' | 'afternoon' | 'night',
    location: '',
    weather: '',
    responsible: '',
    team: [] as string[],
    summary: '',
    nonCompliances: '',
    correctiveActions: [] as string[],
    observations: '',
    photos: [] as string[]
  });
  
  const [weatherOptions, setWeatherOptions] = useState<Weather[]>([]);
  
  useEffect(() => {
    // Verificar se há um rascunho no localStorage
    const savedDraft = localStorage.getItem('recordFormDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        // Se estamos em modo de criação e não de edição/duplicação, oferecer restaurar o rascunho
        if (!id && parsedDraft) {
          setHasDraft(true);
        }
      } catch (e) {
        console.error("Erro ao analisar rascunho salvo:", e);
        // Limpar o rascunho inválido
        localStorage.removeItem('recordFormDraft');
      }
    }
    
    const userProjects = getProjects(userId);
    setProjects(userProjects);
    
    // Se estamos editando ou duplicando um registro existente
    if (id) {
      setIsLoadingRecord(true);
      const existingRecord = getRecord(id);
      
      if (existingRecord) {
        // Para duplicação, não mantemos o ID original
        if (isDuplicate) {
          const { id: _id, timestamp, ...rest } = existingRecord;
          setForm({
            ...rest,
            date: new Date().toISOString().split('T')[0]
          });
        } else {
          setForm(existingRecord);
        }
        
        handleProjectChange(existingRecord.projectId);
        
        // Se o registro contém coordenadas, carregue-as
        if (existingRecord.coordinates) {
          setCoordinates(existingRecord.coordinates);
        }
        
        // Se tem fotos, carregue-as para prévia
        if (existingRecord.photos && existingRecord.photos.length > 0) {
          setPreviewImages(existingRecord.photos);
        }
      }
      setIsLoadingRecord(false);
    } else if (userProjects.length > 0) {
      handleProjectChange(userProjects[0].id);
    }
    
    // Tentar obter geolocalização se for um novo registro
    if (!id || isDuplicate) {
      tryGetGeolocation();
    }
    
    // Carregar as opções do clima
    const options = getWeatherOptions();
    setWeatherOptions(options);
  }, [id, isDuplicate, isEdit, userId]);
  
  // Salvar rascunho a cada 30 segundos
  useEffect(() => {
    if (!isEdit && !id) {  // Não salvar rascunho para edições ou duplicações
      const interval = setInterval(() => {
        saveFormDraft();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [form, isEdit, id]);
  
  const saveFormDraft = () => {
    // Não salvamos rascunhos para edição de registros existentes
    if (isEdit) return;
    
    try {
      localStorage.setItem('recordFormDraft', JSON.stringify(form));
      setIsDraftSaved(true);
      setTimeout(() => setIsDraftSaved(false), 3000);
    } catch (e) {
      console.error("Erro ao salvar rascunho:", e);
    }
  };
  
  const loadSavedDraft = () => {
    const savedDraft = localStorage.getItem('recordFormDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setForm(parsedDraft);
        
        // Selecionar o projeto correspondente
        if (parsedDraft.projectId) {
          handleProjectChange(parsedDraft.projectId);
        }
        
        // Carregar coordenadas se existirem
        if (parsedDraft.coordinates) {
          setCoordinates(parsedDraft.coordinates);
        }
        
        // Carregar fotos se existirem
        if (parsedDraft.photos && parsedDraft.photos.length > 0) {
          setPreviewImages(parsedDraft.photos);
        }
        
        setHasDraft(false);
        
        toast({
          title: "Rascunho restaurado",
          description: "O formulário foi preenchido com o último rascunho salvo"
        });
      } catch (e) {
        console.error("Erro ao carregar rascunho:", e);
        localStorage.removeItem('recordFormDraft');
        toast({
          title: "Erro ao restaurar rascunho",
          description: "Não foi possível restaurar o rascunho salvo",
          variant: "destructive"
        });
      }
    }
  };
  
  const clearSavedDraft = () => {
    localStorage.removeItem('recordFormDraft');
    setHasDraft(false);
    
    toast({
      title: "Rascunho removido",
      description: "O rascunho salvo foi removido"
    });
  };
  
  const tryGetGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Converter coordenadas de lat/long para UTM WGS84
          // Aqui estamos apenas simulando, em um app real faria a conversão real
          setCoordinates({
            easting: Math.round(position.coords.longitude * 100).toString(),
            northing: Math.round(position.coords.latitude * 100).toString(),
            utmZone: '23K', // Simulando uma zona UTM
            hemisphere: position.coords.latitude >= 0 ? 'N' : 'S'
          });
          
          toast({
            title: "Localização obtida",
            description: "Suas coordenadas atuais foram preenchidas automaticamente"
          });
        },
        (error) => {
          console.log("Erro ao obter localização:", error);
        }
      );
    }
  };
  
  const handleProjectChange = (projectId: string) => {
    const project = getProject(projectId);
    if (project) {
      setSelectedProject(project);
      setPlans(project.plans);
      
      // Ensure we have defaults for all fields but never empty strings for select values
      const defaultPlanId = project.plans.length > 0 ? project.plans[0].id : '';
      const defaultLocation = project.locations.length > 0 ? project.locations[0] : '';
      const defaultResponsible = project.responsibles.length > 0 ? project.responsibles[0] : '';
      
      setForm(prev => ({
        ...prev,
        projectId: project.id,
        planId: prev.planId || defaultPlanId,
        location: prev.location || defaultLocation,
        responsible: prev.responsible || defaultResponsible,
        team: prev.team.length > 0 ? prev.team : (project.teams.length > 0 ? [project.teams[0]] : []),
        correctiveActions: prev.correctiveActions || []
      }));
    }
  };
  
  // Funções para adicionar novas opções
  const addNewPlan = () => {
    if (!selectedProject || !otherPlanValue.trim()) return;
    
    const newPlan: Plan = {
      id: `plan${Date.now()}`,
      name: otherPlanValue.trim(),
      projectId: selectedProject.id
    };
    
    // Atualiza o projeto com o novo plano
    const updatedProject = { 
      ...selectedProject, 
      plans: [...selectedProject.plans, newPlan] 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    setPlans(updatedProject.plans);
    
    // Seleciona o novo plano
    setForm(prev => ({ ...prev, planId: newPlan.id }));
    setShowOtherPlanInput(false);
    setOtherPlanValue('');
    
    toast({
      title: "Plano adicionado",
      description: `O plano "${newPlan.name}" foi adicionado com sucesso.`
    });
  };
  
  const addNewLocation = () => {
    if (!selectedProject || !otherLocationValue.trim()) return;
    
    const newLocation = otherLocationValue.trim();
    
    // Atualiza o projeto com a nova localização
    const updatedProject = { 
      ...selectedProject, 
      locations: [...selectedProject.locations, newLocation] 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Seleciona a nova localização
    setForm(prev => ({ ...prev, location: newLocation }));
    setShowOtherLocationInput(false);
    setOtherLocationValue('');
    
    toast({
      title: "Localização adicionada",
      description: `A localização "${newLocation}" foi adicionada com sucesso.`
    });
  };
  
  const addNewResponsible = () => {
    if (!selectedProject || !otherResponsibleValue.trim()) return;
    
    const newResponsible = otherResponsibleValue.trim();
    
    // Atualiza o projeto com o novo responsável
    const updatedProject = { 
      ...selectedProject, 
      responsibles: [...selectedProject.responsibles, newResponsible] 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Seleciona o novo responsável
    setForm(prev => ({ ...prev, responsible: newResponsible }));
    setShowOtherResponsibleInput(false);
    setOtherResponsibleValue('');
    
    toast({
      title: "Responsável adicionado",
      description: `O responsável "${newResponsible}" foi adicionado com sucesso.`
    });
  };
  
  const addNewTeam = (teamName: string) => {
    if (!selectedProject || !teamName.trim()) return;
    
    const newTeam = teamName.trim();
    
    // Atualiza o projeto com a nova equipe
    const updatedProject = { 
      ...selectedProject, 
      teams: [...selectedProject.teams, newTeam] 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    toast({
      title: "Equipe adicionada",
      description: `A equipe "${newTeam}" foi adicionada com sucesso.`
    });
  };
  
  const addNewCorrectiveAction = (action: string) => {
    if (!selectedProject || !action.trim()) return;
    
    // Atualiza o projeto com a nova ação corretiva
    const updatedProject = {
      ...selectedProject,
      correctiveActions: [...selectedProject.correctiveActions, action.trim()]
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    toast({
      title: "Ação corretiva adicionada",
      description: `A ação corretiva foi adicionada com sucesso`
    });
  };
  
  // Funções para editar opções existentes
  const updatePlan = () => {
    if (!selectedProject || !editingPlan) return;
    
    const updatedPlans = selectedProject.plans.map(plan => 
      plan.id === editingPlan.id ? { ...plan, name: editingPlan.value } : plan
    );
    
    const updatedProject = { 
      ...selectedProject, 
      plans: updatedPlans 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    setPlans(updatedPlans);
    setEditingPlan(null);
    
    toast({
      title: "Plano atualizado",
      description: "O plano foi atualizado com sucesso."
    });
  };
  
  const updateLocation = () => {
    if (!selectedProject || editingLocation === null) return;
    
    const updatedLocations = [...selectedProject.locations];
    updatedLocations[editingLocation.index] = editingLocation.value;
    
    const updatedProject = { 
      ...selectedProject, 
      locations: updatedLocations 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Se a localização atual foi a editada, atualize também no formulário
    if (form.location === selectedProject.locations[editingLocation.index]) {
      setForm(prev => ({ ...prev, location: editingLocation.value }));
    }
    
    setEditingLocation(null);
    
    toast({
      title: "Localização atualizada",
      description: "A localização foi atualizada com sucesso."
    });
  };
  
  const updateResponsible = () => {
    if (!selectedProject || editingResponsible === null) return;
    
    const updatedResponsibles = [...selectedProject.responsibles];
    updatedResponsibles[editingResponsible.index] = editingResponsible.value;
    
    const updatedProject = { 
      ...selectedProject, 
      responsibles: updatedResponsibles 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Se o responsável atual foi o editado, atualize também no formulário
    if (form.responsible === selectedProject.responsibles[editingResponsible.index]) {
      setForm(prev => ({ ...prev, responsible: editingResponsible.value }));
    }
    
    setEditingResponsible(null);
    
    toast({
      title: "Responsável atualizado",
      description: "O responsável foi atualizado com sucesso."
    });
  };
  
  const updateTeam = () => {
    if (!selectedProject || editingTeam === null) return;
    
    const updatedTeams = [...selectedProject.teams];
    updatedTeams[editingTeam.index] = editingTeam.value;
    
    const updatedProject = { 
      ...selectedProject, 
      teams: updatedTeams 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Atualiza também as equipes selecionadas no formulário se necessário
    if (form.team.includes(selectedProject.teams[editingTeam.index])) {
      setForm(prev => ({ 
        ...prev, 
        team: prev.team.map(t => 
          t === selectedProject.teams[editingTeam.index] ? editingTeam.value : t
        )
      }));
    }
    
    setEditingTeam(null);
    
    toast({
      title: "Equipe atualizada",
      description: "A equipe foi atualizada com sucesso"
    });
  };
  
  // Funções para excluir opções
  const deletePlan = (planId: string) => {
    if (!selectedProject) return;
    
    const updatedPlans = selectedProject.plans.filter(plan => plan.id !== planId);
    
    const updatedProject = { 
      ...selectedProject, 
      plans: updatedPlans 
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    setPlans(updatedPlans);
    
    // Se o plano excluído era o selecionado, selecione outro se disponível
    if (form.planId === planId) {
      setForm(prev => ({ 
        ...prev, 
        planId: updatedPlans.length > 0 ? updatedPlans[0].id : ''
      }));
    }
    
    toast({
      title: "Plano removido",
      description: "O plano foi removido com sucesso."
    });
  };
  
  const deleteLocation = (index: number) => {
    if (!selectedProject) return;
    
    const locationToDelete = selectedProject.locations[index];
    const updatedLocations = selectedProject.locations.filter((_, i) => i !== index);
    
    const updatedProject = { 
      ...selectedProject, 
      locations: updatedLocations
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Se a localização excluída era a selecionada, selecione outra se disponível
    if (form.location === locationToDelete) {
      setForm(prev => ({ 
        ...prev, 
        location: updatedLocations.length > 0 ? updatedLocations[0] : ''
      }));
    }
    
    toast({
      title: "Localização removida",
      description: "A localização foi removida com sucesso"
    });
  };
  
  const deleteResponsible = (index: number) => {
    if (!selectedProject) return;
    
    const responsibleToDelete = selectedProject.responsibles[index];
    const updatedResponsibles = selectedProject.responsibles.filter((_, i) => i !== index);
    
    const updatedProject = { 
      ...selectedProject, 
      responsibles: updatedResponsibles
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Se o responsável excluído era o selecionado, selecione outro se disponível
    if (form.responsible === responsibleToDelete) {
      setForm(prev => ({ 
        ...prev, 
        responsible: updatedResponsibles.length > 0 ? updatedResponsibles[0] : ''
      }));
    }
    
    toast({
      title: "Responsável removido",
      description: "O responsável foi removido com sucesso"
    });
  };
  
  const deleteTeam = (index: number) => {
    if (!selectedProject) return;
    
    const teamToDelete = selectedProject.teams[index];
    const updatedTeams = selectedProject.teams.filter((_, i) => i !== index);
    
    const updatedProject = { 
      ...selectedProject, 
      teams: updatedTeams
    };
    
    updateProject(updatedProject);
    setSelectedProject(updatedProject);
    
    // Remove a equipe da seleção atual se estiver selecionada
    if (form.team.includes(teamToDelete)) {
      setForm(prev => ({ 
        ...prev, 
        team: prev.team.filter(t => t !== teamToDelete)
      }));
    }
    
    toast({
      title: "Equipe removida",
      description: "A equipe foi removida com sucesso"
    });
  };
  
  const addWeatherOption = (option: string) => {
    // Em um app real, isso interagiria com o backend
    // Aqui simulamos atualizando o estado local
    const newWeatherOption: Weather = {
      id: `weather-${Date.now()}`,
      description: option
    };
    
    setWeatherOptions(prev => [...prev, newWeatherOption]);
    
    toast({
      title: "Clima adicionado",
      description: `A opção de clima "${option}" foi adicionada com sucesso`
    });
  };
  
  const editWeatherOption = (oldOption: string, newOption: string) => {
    // Simulação da edição
    setWeatherOptions(prev => 
      prev.map(weather => 
        weather.description === oldOption 
          ? { ...weather, description: newOption } 
          : weather
      )
    );
    
    // Se o clima atual é o que está sendo editado, atualize no formulário também
    if (form.weather === oldOption) {
      setForm(prev => ({ ...prev, weather: newOption }));
    }
    
    toast({
      title: "Clima atualizado",
      description: `A opção de clima foi atualizada com sucesso`
    });
  };
  
  const deleteWeatherOption = (option: string) => {
    // Simulação da exclusão
    setWeatherOptions(prev => prev.filter(weather => weather.description !== option));
    
    // Se o clima atual é o que está sendo excluído, limpe no formulário
    if (form.weather === option) {
      setForm(prev => ({ ...prev, weather: '' }));
    }
    
    toast({
      title: "Clima removido",
      description: `A opção de clima foi removida com sucesso`
    });
  };
  
  const handleTeamChange = (team: string) => {
    setForm(prev => {
      const newTeam = prev.team.includes(team)
        ? prev.team.filter(t => t !== team)
        : [...prev.team, team];
      return { ...prev, team: newTeam };
    });
  };
  
  const handleCorrectiveActionChange = (action: string) => {
    setForm(prev => {
      const newActions = prev.correctiveActions.includes(action)
        ? prev.correctiveActions.filter(a => a !== action)
        : [...prev.correctiveActions, action];
      return { ...prev, correctiveActions: newActions };
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // Criar URLs de prévia para as imagens
      const previewURLs = newFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...previewURLs]);
      
      // Atualizar o formulário com as "novas" URLs de fotos
      // Em um app real, essas URLs seriam as URLs dos arquivos após upload
      setForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...previewURLs]
      }));
    }
    
    // Resetar o input para permitir selecionar os mesmos arquivos novamente
    e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent, navigate: (path: string) => void) => {
    e.preventDefault();
    
    try {
      // Adicionar coordenadas ao registro
      const recordData = {
        ...form,
        coordinates,
        timestamp: new Date().toISOString()
      };
      
      // Se estivermos editando um registro existente
      if (isEdit && id) {
        updateRecord({
          ...recordData,
          id
        });
        
        toast({
          title: "Registro atualizado",
          description: "O registro de atividade foi atualizado com sucesso"
        });
        
        navigate(`/records/${id}`);
      } else {
        // Criação de novo registro
        const newRecord = createRecord(recordData);
        
        toast({
          title: "Registro salvo com sucesso",
          description: "O registro de atividade foi criado"
        });
        
        // Limpar o rascunho quando um registro é criado com sucesso
        if (!isEdit && !isDuplicate) {
          localStorage.removeItem('recordFormDraft');
        }
        
        // Ask if user wants to create another record
        const wantNewRecord = window.confirm("Deseja realizar um novo registro?");
        
        if (wantNewRecord) {
          // Reset some fields but keep project and context
          setForm(prev => ({
            ...prev,
            summary: '',
            nonCompliances: '',
            correctiveActions: [],
            observations: '',
            photos: []
          }));
          setPreviewImages([]);
          setImageFiles([]);
        } else {
          navigate(`/records/${newRecord.id}`);
        }
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar registro",
        description: "Ocorreu um erro ao salvar o registro de atividade",
        variant: "destructive"
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    // Verifica se é a opção "Outros..."
    if (value === "outros") {
      if (name === "planId") {
        setShowOtherPlanInput(true);
      } else if (name === "location") {
        setShowOtherLocationInput(true);
      } else if (name === "responsible") {
        setShowOtherResponsibleInput(true);
      }
      return;
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleWeatherChange = (value: string) => {
    setForm(prev => ({ ...prev, weather: value }));
  };
  
  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCoordinates(prev => ({ ...prev, [name]: value }));
  };

  return {
    // Estados
    projects,
    selectedProject,
    plans,
    isLoadingRecord,
    mapDialogOpen,
    geoDialogOpen,
    uploadDialogOpen,
    isDraftSaved,
    hasDraft,
    showOtherPlanInput,
    otherPlanValue,
    showOtherLocationInput,
    otherLocationValue,
    showOtherResponsibleInput,
    otherResponsibleValue,
    editingPlan,
    editingLocation,
    editingResponsible,
    editingTeam,
    coordinates,
    previewImages,
    imageFiles,
    form,
    weatherOptions,
    
    // Funções de estado
    setMapDialogOpen,
    setGeoDialogOpen,
    setUploadDialogOpen,
    setShowOtherPlanInput,
    setOtherPlanValue,
    setShowOtherLocationInput,
    setOtherLocationValue,
    setShowOtherResponsibleInput,
    setOtherResponsibleValue,
    setEditingPlan,
    setEditingLocation,
    setEditingResponsible,
    setEditingTeam,
    
    // Handlers
    handleProjectChange,
    addNewPlan,
    addNewLocation,
    addNewResponsible,
    addNewTeam,
    addNewCorrectiveAction,
    updatePlan,
    updateLocation,
    updateResponsible,
    updateTeam,
    deletePlan,
    deleteLocation,
    deleteResponsible,
    deleteTeam,
    addWeatherOption,
    editWeatherOption,
    deleteWeatherOption,
    handleTeamChange,
    handleCorrectiveActionChange,
    handleFileUpload,
    removeImage,
    handleSubmit,
    handleChange,
    handleSelectChange,
    handleWeatherChange,
    handleCoordinateChange,
    loadSavedDraft,
    clearSavedDraft,
    saveFormDraft,
    tryGetGeolocation
  };
};
