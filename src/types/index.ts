
// Adicione ou modifique as declarações de tipos aqui conforme necessário
// Isso é um exemplo que você deve adaptar conforme sua aplicação existente

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  projectIds: string[]; // Adicionado para resolver os erros de type
}

export interface UTMCoordinates {
  easting: string;
  northing: string;
  utmZone: string;
  hemisphere: string;
}

export interface ActivityRecord {
  id: string;
  projectId: string;
  planId: string;
  date: string;
  period: 'morning' | 'afternoon' | 'night';
  location: string;
  weather: string;
  responsible: string;
  team: string[];
  summary: string;
  nonCompliances: string;
  correctiveActions: string[];
  correctiveActionDates?: string[]; // Adicionado para resolver o erro
  observations: string;
  photos: string[];
  timestamp: string; // Data e hora de criação do registro
  coordinates?: UTMCoordinates; // Coordenadas UTM (opcional)
}

export interface Plan {
  id: string;
  name: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  plans: Plan[];
  locations: string[];
  responsibles: string[];
  teams: string[];
  correctiveActions: string[];
  userId: string;
}

// Tipo para opções de clima
export interface Weather {
  id: string;
  description: string;
}

// Tipo para configuração da aplicação
export interface AppConfig {
  logo: string;
  tagline: string;
}

// Tipo para o estado dos dados mockados
export interface MockDataState {
  users: User[];
  projects: Project[];
  weather: Weather[];
  records: ActivityRecord[];
  appConfig: AppConfig;
  currentUser: User | null;
}
