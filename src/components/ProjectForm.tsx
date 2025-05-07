
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProject } from '@/services/mockData';
import { toast } from "sonner";
import { Project } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

// Schema para validação do formulário
const projectSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: ProjectFormValues) => {
    if (!user) {
      toast.error("Você precisa estar logado para criar um projeto");
      return;
    }
    
    // Criar o objeto do projeto com valores padrão para os campos obrigatórios
    const newProject: Omit<Project, 'id'> = {
      name: values.name,
      description: values.description || '',
      plans: [],
      locations: [],
      responsibles: [],
      teams: [],
      correctiveActions: [],
      userId: user.id, // Adicionado o userId obrigatório
    };

    try {
      createProject(newProject);
      toast.success(`Projeto ${values.name} criado com sucesso!`);
      onSuccess();
    } catch (error) {
      toast.error("Erro ao criar projeto");
      console.error(error);
    }
  };

  return (
    <>
      <DialogHeader className="mb-4">
        <DialogTitle className="text-xl">Novo Projeto</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para criar um novo projeto.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Projeto</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do projeto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o projeto" 
                    className="resize-none min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Projeto
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ProjectForm;
