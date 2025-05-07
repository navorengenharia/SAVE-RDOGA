
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

// Componentes refatorados
import DraftNotice from '@/components/record-form/DraftNotice';
import BasicInfoSection from '@/components/record-form/BasicInfoSection';
import LocationSection from '@/components/record-form/LocationSection';
import PeopleSection from '@/components/record-form/PeopleSection';
import ActionsSection from '@/components/record-form/ActionsSection';
import PhotosSection from '@/components/record-form/PhotosSection';

// Hook personalizado para lógica do formulário
import { useRecordForm } from '@/hooks/useRecordForm';

const RecordFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isDuplicate = location.pathname.includes('/duplicate');
  const isEdit = location.pathname.includes('/edit') && !isDuplicate;
  
  const recordForm = useRecordForm({
    id,
    isDuplicate,
    isEdit,
    userId: user?.id || '',
  });
  
  const {
    projects,
    selectedProject,
    plans,
    isLoadingRecord,
    hasDraft,
    isDraftSaved,
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
    form,
    
    // Funções de estado
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
    tryGetGeolocation
  } = recordForm;
  
  if (isLoadingRecord) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-muted-foreground">Carregando registro...</p>
        </div>
      </MainLayout>
    );
  }
  
  const projectName = selectedProject ? selectedProject.name : "";
  
  return (
    <MainLayout>
      <PageHeader 
        title={isEdit ? "Editar Registro de Atividade" : isDuplicate ? "Duplicar Registro de Atividade" : "Novo Registro de Atividade"} 
        description={isEdit ? "Atualize os dados da atividade ambiental realizada" : isDuplicate ? "Crie um novo registro baseado em um existente" : "Preencha os dados da atividade ambiental realizada"}
        actions={
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        }
      />
      
      <DraftNotice 
        hasDraft={hasDraft}
        isDraftSaved={isDraftSaved}
        loadSavedDraft={loadSavedDraft}
        clearSavedDraft={clearSavedDraft}
      />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={(e) => handleSubmit(e, navigate)} className="space-y-6">
            <BasicInfoSection
              projects={projects}
              selectedProject={selectedProject}
              plans={plans}
              form={form}
              showOtherPlanInput={showOtherPlanInput}
              otherPlanValue={otherPlanValue}
              handleProjectChange={handleProjectChange}
              handleSelectChange={handleSelectChange}
              handleChange={handleChange}
              setShowOtherPlanInput={setShowOtherPlanInput}
              setOtherPlanValue={setOtherPlanValue}
              addNewPlan={addNewPlan}
              editingPlan={editingPlan}
              setEditingPlan={setEditingPlan}
              updatePlan={updatePlan}
              deletePlan={deletePlan}
            />
            
            <LocationSection
              selectedProject={selectedProject}
              form={form}
              showOtherLocationInput={showOtherLocationInput}
              otherLocationValue={otherLocationValue}
              coordinates={coordinates}
              handleSelectChange={handleSelectChange}
              handleWeatherChange={handleWeatherChange}
              handleCoordinateChange={handleCoordinateChange}
              setShowOtherLocationInput={setShowOtherLocationInput}
              setOtherLocationValue={setOtherLocationValue}
              addNewLocation={addNewLocation}
              addWeatherOption={addWeatherOption}
              editWeatherOption={editWeatherOption}
              deleteWeatherOption={deleteWeatherOption}
              tryGetGeolocation={tryGetGeolocation}
              projectName={projectName}
            />
            
            <PeopleSection
              selectedProject={selectedProject}
              form={form}
              showOtherResponsibleInput={showOtherResponsibleInput}
              otherResponsibleValue={otherResponsibleValue}
              handleSelectChange={handleSelectChange}
              handleTeamChange={handleTeamChange}
              setShowOtherResponsibleInput={setShowOtherResponsibleInput}
              setOtherResponsibleValue={setOtherResponsibleValue}
              addNewResponsible={addNewResponsible}
              addNewTeam={addNewTeam}
              editingResponsible={editingResponsible}
              editingTeam={editingTeam}
              setEditingResponsible={setEditingResponsible}
              setEditingTeam={setEditingTeam}
              updateResponsible={updateResponsible}
              updateTeam={updateTeam}
              deleteResponsible={deleteResponsible}
              deleteTeam={deleteTeam}
            />
            
            <ActionsSection
              selectedProject={selectedProject}
              form={form}
              otherLocationValue={otherLocationValue}
              handleChange={handleChange}
              handleCorrectiveActionChange={handleCorrectiveActionChange}
              setOtherLocationValue={setOtherLocationValue}
              addNewCorrectiveAction={addNewCorrectiveAction}
            />
            
            <PhotosSection
              previewImages={previewImages}
              handleFileUpload={handleFileUpload}
              removeImage={removeImage}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEdit ? "Atualizar Registro" : "Salvar Registro"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default RecordFormPage;
