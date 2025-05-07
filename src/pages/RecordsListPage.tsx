
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { getProjects, getRecords } from '@/services/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ActivityRecord, Project, Plan } from '@/types';
import { Eye, Plus, SearchIcon, Star, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RecordsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ActivityRecord[]>([]);
  const [favoriteRecords, setFavoriteRecords] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    projectId: 'all',
    planId: 'all',
    startDate: '',
    endDate: '',
    searchTerm: '',
    period: 'all',
    responsible: '',
    favorite: false
  });
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [responsibles, setResponsibles] = useState<string[]>([]);
  
  useEffect(() => {
    if (user) {
      const userProjects = getProjects(user.id);
      setProjects(userProjects);
      
      const userRecords = getRecords();
      setRecords(userRecords);
      setFilteredRecords(userRecords);
      
      // Extrair todos os responsáveis únicos dos registros
      const allResponsibles = [...new Set(userRecords.map(record => record.responsible))];
      setResponsibles(allResponsibles);
      
      // Carregar favoritos do localStorage
      const savedFavorites = localStorage.getItem('favoriteRecords');
      if (savedFavorites) {
        try {
          setFavoriteRecords(JSON.parse(savedFavorites));
        } catch (e) {
          console.error("Erro ao carregar favoritos:", e);
        }
      }
    }
  }, [user]);
  
  useEffect(() => {
    applyFilters();
  }, [filters, records, favoriteRecords]);
  
  const handleProjectChange = (projectId: string) => {
    // Get plans for selected project
    if (projectId === 'all') {
      setPlans([]);
    } else {
      const project = projects.find(p => p.id === projectId);
      setPlans(project ? project.plans : []);
    }
    
    setFilters(prev => ({
      ...prev,
      projectId,
      planId: 'all', // Reset plan selection when project changes
    }));
  };
  
  const applyFilters = () => {
    let filtered = [...records];
    
    if (filters.projectId && filters.projectId !== 'all') {
      filtered = filtered.filter(record => record.projectId === filters.projectId);
    }
    
    if (filters.planId && filters.planId !== 'all') {
      filtered = filtered.filter(record => record.planId === filters.planId);
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(record => record.date >= filters.startDate);
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(record => record.date <= filters.endDate);
    }
    
    if (filters.period && filters.period !== 'all') {
      filtered = filtered.filter(record => record.period === filters.period);
    }
    
    if (filters.responsible) {
      filtered = filtered.filter(record => 
        record.responsible.toLowerCase().includes(filters.responsible.toLowerCase())
      );
    }
    
    if (filters.favorite) {
      filtered = filtered.filter(record => favoriteRecords.includes(record.id));
    }
    
    if (filters.searchTerm) {
      const terms = filters.searchTerm.toLowerCase().split(' ').filter(term => term.trim() !== '');
      
      if (terms.length > 0) {
        filtered = filtered.filter(record => {
          // Verificar se todos os termos de pesquisa estão em pelo menos um dos campos
          return terms.every(term => 
            record.summary.toLowerCase().includes(term) ||
            record.location.toLowerCase().includes(term) ||
            record.responsible.toLowerCase().includes(term) ||
            record.observations.toLowerCase().includes(term) ||
            record.nonCompliances?.toLowerCase().includes(term) ||
            record.team.some(member => member.toLowerCase().includes(term))
          );
        });
      }
    }
    
    setFilteredRecords(filtered);
  };
  
  const resetFilters = () => {
    setFilters({
      projectId: 'all',
      planId: 'all',
      startDate: '',
      endDate: '',
      searchTerm: '',
      period: 'all',
      responsible: '',
      favorite: false
    });
    setPlans([]);
  };
  
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Projeto não encontrado';
  };
  
  const getPlanName = (projectId: string, planId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 'Plano não encontrado';
    
    const plan = project.plans.find(p => p.id === planId);
    return plan ? plan.name : 'Plano não encontrado';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const toggleFavorite = (recordId: string) => {
    setFavoriteRecords(prev => {
      const newFavorites = prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId];
      
      // Salvar no localStorage
      localStorage.setItem('favoriteRecords', JSON.stringify(newFavorites));
      
      return newFavorites;
    });
  };
  
  const periodTranslation = {
    morning: 'Manhã',
    afternoon: 'Tarde',
    night: 'Noite',
    all: 'Todos'
  };
  
  return (
    <MainLayout>
      <PageHeader 
        title="Registros de Atividades" 
        description="Visualize e gerencie os registros de atividades ambientais"
        actions={
          <Button asChild>
            <Link to="/records/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
            </Link>
          </Button>
        }
      />
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar em registros..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-9"
                />
              </div>
              
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
              
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={resetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
            
            {showFilters && (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Select
                      value={filters.projectId}
                      onValueChange={handleProjectChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os Projetos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Projetos</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Select
                      value={filters.planId}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, planId: value }))}
                      disabled={filters.projectId === 'all'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os Planos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Planos</SelectItem>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="Data inicial"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <Input
                      type="date"
                      placeholder="Data final"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Select
                      value={filters.period}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, period: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os Períodos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Períodos</SelectItem>
                        <SelectItem value="morning">Manhã</SelectItem>
                        <SelectItem value="afternoon">Tarde</SelectItem>
                        <SelectItem value="night">Noite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Select
                      value={filters.responsible || ''}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, responsible: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os Responsáveis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todos os Responsáveis</SelectItem>
                        {responsibles.map((responsible) => (
                          <SelectItem key={responsible} value={responsible}>
                            {responsible}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label htmlFor="favorite-filter" className="text-sm font-medium">
                      Apenas Favoritos
                    </label>
                    <input
                      type="checkbox"
                      id="favorite-filter"
                      checked={filters.favorite}
                      onChange={(e) => setFilters(prev => ({ ...prev, favorite: e.target.checked }))}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Badge variant="outline" className="text-xs">
                    {filteredRecords.length} registro(s) encontrado(s)
                  </Badge>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Projeto</TableHead>
                <TableHead>Programa/Plano</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={favoriteRecords.includes(record.id) ? "text-yellow-500" : "text-gray-300"}
                        onClick={() => toggleFavorite(record.id)}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                    </TableCell>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>{formatTime(record.timestamp)}</TableCell>
                    <TableCell>{periodTranslation[record.period]}</TableCell>
                    <TableCell>{getProjectName(record.projectId)}</TableCell>
                    <TableCell>{getPlanName(record.projectId, record.planId)}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.responsible}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/records/${record.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                    Nenhum registro encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default RecordsListPage;
