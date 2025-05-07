
import React from 'react';
import { Project } from '@/types';
import WeatherSelector from '@/components/WeatherSelector';
import LocationManagement from '@/components/record-form/LocationManagement';
import CoordinatesSection from '@/components/record-form/CoordinatesSection';

interface LocationSectionProps {
  selectedProject: Project | null;
  form: any;
  showOtherLocationInput: boolean;
  otherLocationValue: string;
  coordinates: {
    easting: string;
    northing: string;
    utmZone: string;
    hemisphere: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  handleWeatherChange: (value: string) => void;
  handleCoordinateChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setShowOtherLocationInput: (show: boolean) => void;
  setOtherLocationValue: (value: string) => void;
  addNewLocation: () => void;
  addWeatherOption: (option: string) => void;
  editWeatherOption: (oldOption: string, newOption: string) => void;
  deleteWeatherOption: (option: string) => void;
  tryGetGeolocation: () => void;
  projectName: string;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  selectedProject,
  form,
  showOtherLocationInput,
  otherLocationValue,
  coordinates,
  handleSelectChange,
  handleWeatherChange,
  handleCoordinateChange,
  setShowOtherLocationInput,
  setOtherLocationValue,
  addNewLocation,
  addWeatherOption,
  editWeatherOption,
  deleteWeatherOption,
  tryGetGeolocation,
  projectName
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LocationManagement 
          selectedProject={selectedProject}
          location={form.location}
          showOtherLocationInput={showOtherLocationInput}
          otherLocationValue={otherLocationValue}
          handleSelectChange={handleSelectChange}
          setShowOtherLocationInput={setShowOtherLocationInput}
          setOtherLocationValue={setOtherLocationValue}
          addNewLocation={addNewLocation}
        />
        
        <div className="space-y-2">
          <WeatherSelector 
            value={form.weather}
            onChange={handleWeatherChange}
            projectName={projectName}
            onAddOption={addWeatherOption}
            onEditOption={editWeatherOption}
            onDeleteOption={deleteWeatherOption}
            showManager={true}
          />
        </div>
      </div>

      {/* Coordenadas */}
      <CoordinatesSection 
        coordinates={coordinates}
        handleCoordinateChange={handleCoordinateChange}
        tryGetGeolocation={tryGetGeolocation}
      />
    </div>
  );
};

export default LocationSection;
