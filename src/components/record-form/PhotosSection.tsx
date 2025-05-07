
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Image, Trash2 } from 'lucide-react';

interface PhotosSectionProps {
  previewImages: string[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ 
  previewImages, 
  handleFileUpload, 
  removeImage 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Fotos</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <Image className="h-4 w-4 mr-2" />
          Adicionar Fotos
        </Button>
        <input
          type="file"
          id="photo-upload"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      
      {previewImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewImages.map((img, index) => (
            <div key={index} className="relative group aspect-square bg-muted rounded-md overflow-hidden">
              <img
                src={img}
                alt={`Prévia ${index}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[120px] bg-muted/20 border border-dashed rounded-md">
          <p className="text-muted-foreground text-sm">Nenhuma foto selecionada</p>
        </div>
      )}
    </div>
  );
};

export default PhotosSection;
