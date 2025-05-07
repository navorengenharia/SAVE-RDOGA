
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UTMCoordinates } from '@/types';

interface CoordinatesSectionProps {
  coordinates: UTMCoordinates;
  handleCoordinateChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  tryGetGeolocation: () => void;
}

const CoordinatesSection: React.FC<CoordinatesSectionProps> = ({
  coordinates,
  handleCoordinateChange,
  tryGetGeolocation
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Coordenadas UTM</Label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={tryGetGeolocation}
          className="h-8"
        >
          <MapPin className="h-3.5 w-3.5 mr-1" /> Obter Localização
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <Label htmlFor="easting" className="text-xs">Leste (E)</Label>
          <Input
            id="easting"
            name="easting"
            placeholder="Leste"
            value={coordinates.easting}
            onChange={handleCoordinateChange}
          />
        </div>
        <div>
          <Label htmlFor="northing" className="text-xs">Norte (N)</Label>
          <Input
            id="northing"
            name="northing"
            placeholder="Norte"
            value={coordinates.northing}
            onChange={handleCoordinateChange}
          />
        </div>
        <div>
          <Label htmlFor="utmZone" className="text-xs">Zona UTM</Label>
          <Input
            id="utmZone"
            name="utmZone"
            placeholder="ex: 23K"
            value={coordinates.utmZone}
            onChange={handleCoordinateChange}
          />
        </div>
        <div>
          <Label htmlFor="hemisphere" className="text-xs">Hemisfério</Label>
          <Select
            value={coordinates.hemisphere}
            onValueChange={(value) => handleCoordinateChange({ target: { name: 'hemisphere', value } } as React.ChangeEvent<HTMLSelectElement>)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Hemisfério" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="N">Norte (N)</SelectItem>
              <SelectItem value="S">Sul (S)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CoordinatesSection;
