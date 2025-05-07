import { User, Project, ActivityRecord, Weather, AppConfig, MockDataState } from '../types';

// Initialize local storage with mock data if not present
const initializeLocalStorage = (): MockDataState => {
  // Admin user definition
  const adminUser: User = {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    projectIds: ['project1', 'project2'],
  };

  // Users array
  const users: User[] = [
    adminUser,
    {
      id: 'user1',
      name: 'João Silva',
      email: 'joao@example.com',
      role: 'user',
      projectIds: ['project1'],
    },
    {
      id: 'user2',
      name: 'Maria Oliveira',
      email: 'maria@example.com',
      role: 'user',
      projectIds: ['project2'],
    },
  ];

  // Projects array
  const projects: Project[] = [
    {
      id: 'project1',
      name: 'Construção de Edifício Residencial',
      description: 'Projeto de construção de um edifício residencial de 15 andares.',
      plans: [
        { id: 'plan1', name: 'Plano de Gerenciamento Ambiental', projectId: 'project1' },
        { id: 'plan2', name: 'Plano de Controle de Resíduos', projectId: 'project1' },
      ],
      locations: ['Setor Norte', 'Setor Sul', 'Canteiro de Obras'],
      responsibles: ['João Silva', 'Carlos Pereira'],
      teams: ['Equipe A', 'Equipe B'],
      correctiveActions: ['Revisar procedimentos', 'Treinar equipe'],
      userId: 'admin',
    },
    {
      id: 'project2',
      name: 'Revitalização da Orla Marítima',
      description: 'Projeto de revitalização da orla marítima com foco em sustentabilidade.',
      plans: [
        { id: 'plan3', name: 'Plano de Monitoramento da Qualidade da Água', projectId: 'project2' },
        { id: 'plan4', name: 'Plano de Recuperação de Áreas Degradadas', projectId: 'project2' },
      ],
      locations: ['Praia Central', 'Manguezal', 'Dunas'],
      responsibles: ['Maria Oliveira', 'Ana Souza'],
      teams: ['Equipe C', 'Equipe D'],
      correctiveActions: ['Ajustar cronograma', 'Realocar recursos'],
      userId: 'admin',
    },
  ];

  // Weather options
  const weatherOptions: Weather[] = [
    { id: 'clear', description: 'Céu limpo' },
    { id: 'clouds', description: 'Nublado' },
    { id: 'rain', description: 'Chuvoso' },
    { id: 'storm', description: 'Tempestade' },
    { id: 'snow', description: 'Neve' },
    { id: 'fog', description: 'Neblina' },
  ];

  // Activity records
  const records: ActivityRecord[] = [
    {
      id: 'record1',
      projectId: 'project1',
      planId: 'plan1',
      date: '2023-04-15',
      period: 'morning',
      location: 'Setor Norte',
      weather: 'Céu limpo',
      responsible: 'João Silva',
      team: ['Maria Oliveira', 'Pedro Santos'],
      summary: 'Realizada inspeção de rotina nas estruturas de drenagem.',
      nonCompliances: 'Detectado acúmulo de resíduos nas canaletas de escoamento.',
      correctiveActions: ['Limpeza das canaletas', 'Reforço na sinalização'],
      observations: 'A equipe concluiu o trabalho dentro do prazo previsto.',
      photos: ['/placeholder.svg', '/placeholder.svg'],
      timestamp: '2023-04-15T10:30:00Z',
      coordinates: {
        easting: '123456',
        northing: '7890123',
        utmZone: '23K',
        hemisphere: 'S',
      },
    },
  ];

  // App configuration
  const appConfig: AppConfig = {
    logo: '/placeholder.svg',
    tagline: 'Monitoramento Ambiental',
  };

  return {
    users,
    projects,
    weather: weatherOptions,
    records,
    appConfig,
    currentUser: null,
  };
};

// Get data from localStorage or initialize if not present
const getMockData = (): MockDataState => {
  const storedData = localStorage.getItem('mockData');
  
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Erro ao analisar dados mockados:', e);
      const initialData = initializeLocalStorage();
      localStorage.setItem('mockData', JSON.stringify(initialData));
      return initialData;
    }
  } else {
    const initialData = initializeLocalStorage();
    localStorage.setItem('mockData', JSON.stringify(initialData));
    return initialData;
  }
};

// Save data to localStorage
const saveMockData = (data: MockDataState): void => {
  localStorage.setItem('mockData', JSON.stringify(data));
};

// Authentication functions
export const authenticate = (email: string, password: string): User | null => {
  const mockData = getMockData();
  // For demo purposes, we'll accept any password
  const user = mockData.users.find(user => user.email === email);
  
  if (user) {
    mockData.currentUser = user;
    saveMockData(mockData);
    return user;
  }
  
  return null;
};

export const login = (email: string, password: string): User | null => {
  return authenticate(email, password);
};

export const logout = (): void => {
  const mockData = getMockData();
  mockData.currentUser = null;
  saveMockData(mockData);
};

export const getCurrentUser = (): User | null => {
  const mockData = getMockData();
  return mockData.currentUser || null;
};

// Project functions
export const getProjects = (userId?: string): Project[] => {
  const mockData = getMockData();
  
  if (userId) {
    return mockData.projects.filter(project => project.userId === userId);
  }
  
  return mockData.projects;
};

export const getProject = (projectId: string): Project | null => {
  const mockData = getMockData();
  return mockData.projects.find(project => project.id === projectId) || null;
};

export const createProject = (newProject: Omit<Project, 'id'>): Project => {
  const mockData = getMockData();
  
  const project: Project = {
    id: `project${Date.now()}`,
    ...newProject,
  };
  
  mockData.projects.push(project);
  saveMockData(mockData);
  
  return project;
};

export const updateProject = (project: Project): Project => {
  const mockData = getMockData();
  
  const index = mockData.projects.findIndex(p => p.id === project.id);
  if (index === -1) {
    throw new Error(`Projeto com ID ${project.id} não encontrado`);
  }
  
  mockData.projects[index] = project;
  saveMockData(mockData);
  
  return project;
};

export const deleteProject = (projectId: string): boolean => {
  const mockData = getMockData();
  
  const initialLength = mockData.projects.length;
  mockData.projects = mockData.projects.filter(project => project.id !== projectId);
  
  if (mockData.projects.length === initialLength) {
    return false;
  }
  
  // Also delete all records associated with the project
  mockData.records = mockData.records.filter(record => record.projectId !== projectId);
  
  saveMockData(mockData);
  return true;
};

// Record functions
export const getRecords = (projectId?: string): ActivityRecord[] => {
  const mockData = getMockData();
  
  if (projectId) {
    return mockData.records.filter(record => record.projectId === projectId);
  }
  
  return mockData.records;
};

export const getRecord = (recordId: string): ActivityRecord | null => {
  const mockData = getMockData();
  return mockData.records.find(record => record.id === recordId) || null;
};

export const createRecord = (recordData: Omit<ActivityRecord, 'id' | 'timestamp'>): ActivityRecord => {
  const mockData = getMockData();
  
  const newRecord: ActivityRecord = {
    ...recordData,
    id: `record${Date.now()}`,
    timestamp: new Date().toISOString()
  };
  
  mockData.records.push(newRecord);
  saveMockData(mockData);
  
  return newRecord;
};

export const updateRecord = (record: ActivityRecord): ActivityRecord => {
  const mockData = getMockData();
  
  const index = mockData.records.findIndex(r => r.id === record.id);
  if (index === -1) {
    throw new Error(`Registro com ID ${record.id} não encontrado`);
  }
  
  mockData.records[index] = record;
  saveMockData(mockData);
  
  return record;
};

export const deleteRecord = (recordId: string): boolean => {
  const mockData = getMockData();
  
  const initialLength = mockData.records.length;
  mockData.records = mockData.records.filter(record => record.id !== recordId);
  
  if (mockData.records.length === initialLength) {
    return false;
  }
  
  saveMockData(mockData);
  return true;
};

// Weather functions
export const getWeatherOptions = (): Weather[] => {
  const mockData = getMockData();
  return mockData.weather;
};

export const getWeather = (weatherId: string): Weather | null => {
  const mockData = getMockData();
  return mockData.weather.find(w => w.id === weatherId) || null;
};

// App config functions
export const getAppConfig = (): AppConfig => {
  const mockData = getMockData();
  return mockData.appConfig;
};

export const updateAppConfig = (config: AppConfig): AppConfig => {
  const mockData = getMockData();
  mockData.appConfig = config;
  saveMockData(mockData);
  return config;
};

// Export/Import functions for project data
export const exportProjectData = (projectId: string): string => {
  const mockData = getMockData();
  const records = mockData.records.filter(record => record.projectId === projectId);
  
  if (records.length === 0) {
    return "No records found for this project";
  }
  
  // Create CSV header
  const headers = Object.keys(records[0]).join(',');
  
  // Create CSV rows
  const rows = records.map(record => {
    return Object.values(record).map(value => {
      // Handle arrays and objects
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Handle strings with commas
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value}"`;
      }
      return value;
    }).join(',');
  }).join('\n');
  
  return `${headers}\n${rows}`;
};

export const importProjectData = (projectId: string, csvData: string): { imported: number, duplicates: number } => {
  const mockData = getMockData();
  
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  let imported = 0;
  let duplicates = 0;
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
    const record: any = {};
    
    headers.forEach((header, index) => {
      let value = values[index] || '';
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      
      // Parse JSON for objects and arrays
      try {
        if (value.startsWith('[') || value.startsWith('{')) {
          record[header] = JSON.parse(value);
        } else {
          record[header] = value;
        }
      } catch (e) {
        record[header] = value;
      }
    });
    
    // Set the project ID to the current project
    record.projectId = projectId;
    
    // Check if record with same ID already exists
    const exists = mockData.records.some(r => r.id === record.id);
    
    if (!exists) {
      mockData.records.push(record as ActivityRecord);
      imported++;
    } else {
      duplicates++;
    }
  }
  
  saveMockData(mockData);
  
  return { imported, duplicates };
};
