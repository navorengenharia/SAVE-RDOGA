
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FolderIcon, ClipboardListIcon, FileTextIcon, SettingsIcon, ChartBarIcon, LogOutIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const navItems: NavItem[] = [
    { title: 'Painel', path: '/dashboard', icon: ChartBarIcon },
    { title: 'Projetos', path: '/projects', icon: FolderIcon },
    { title: 'Registros', path: '/records', icon: ClipboardListIcon },
    { title: 'Relatórios', path: '/reports', icon: FileTextIcon },
    { title: 'Configurações', path: '/settings', icon: SettingsIcon, adminOnly: true },
  ];
  
  // Filter out admin-only items for non-admin users
  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-sidebar text-sidebar-foreground">
          <SidebarContent className="pt-6">
            <div className="px-3 pb-4 text-center">
              <h1 className="font-heading font-bold text-xl text-sidebar-foreground">RDOGA</h1>
              <p className="text-xs text-sidebar-foreground/70">Gestão Ambiental</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNavItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path}
                          className={`${location.pathname === item.path ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto w-full">
            <SidebarTrigger className="hidden md:block mb-4 text-muted-foreground" />
            <main>{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
