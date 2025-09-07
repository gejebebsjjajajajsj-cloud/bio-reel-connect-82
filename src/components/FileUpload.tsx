import React from 'react';
import { Upload, X, FileImage, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: string;
  currentFile?: string;
  label: string;
  type: 'image' | 'video';
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept,
  currentFile,
  label,
  type
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    // Create empty file event to clear
    const event = { target: { files: [] } } as any;
    onFileSelect(null as any);
  };

  const Icon = type === 'image' ? FileImage : Video;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>
      
      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-gray-800/30">
        {currentFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Icon className="w-6 h-6 text-primary" />
              <span className="text-sm text-white">Arquivo carregado</span>
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                className="flex items-center space-x-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
                <span>Remover</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Icon className="w-12 h-12 text-gray-400 mx-auto" />
            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center space-x-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Upload className="w-4 h-4" />
                  <span>Selecionar arquivo</span>
                </Button>
              </label>
            </div>
            <p className="text-xs text-gray-400">
              {type === 'image' ? 'PNG, JPG até 5MB' : 'MP4 até 50MB'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;