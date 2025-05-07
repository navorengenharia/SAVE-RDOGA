
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { getAppConfig } from '@/services/mockData';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const appConfig = getAppConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-env-primary/10 to-env-accent/10 p-4">
      <Card className="w-full max-w-md shadow-lg border-env-light">
        <CardHeader className="text-center space-y-2">
          {appConfig.logo ? (
            <div className="flex justify-center">
              <img 
                src={appConfig.logo} 
                alt="RDOGA" 
                className="h-16 rdoga-logo" 
              />
            </div>
          ) : (
            <CardTitle className="text-3xl font-bold text-env-primary">RDOGA</CardTitle>
          )}
          <CardDescription className="text-lg">
            {appConfig.tagline || 'Relatório Diário de Obra da Gestão Ambiental'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-env-primary hover:bg-env-dark"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col text-xs text-muted-foreground">
          <p className="pt-2">Use as seguintes credenciais para teste:</p>
          <p>Admin: admin@example.com / qualquer senha</p>
          <p>Usuário: user@example.com / qualquer senha</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
