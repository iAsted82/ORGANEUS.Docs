import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  acceptedFormats = '.pdf,.png,.jpg,.jpeg,.txt,.doc,.docx',
  maxFiles = 10,
  maxSize = 10,
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      validateAndAddFiles(selectedFiles);
    }
  };

  const validateAndAddFiles = (newFiles: File[]) => {
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    newFiles.forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        newErrors.push(`${file.name} dépasse la taille maximale de ${maxSize}MB`);
        return;
      }

      // Check file count
      if (files.length + validFiles.length >= maxFiles) {
        newErrors.push(`Nombre maximum de fichiers atteint (${maxFiles})`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesSelected(updatedFiles);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return FileText;
    if (file.type.includes('image')) return Image;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${
          isDragging ? 'text-blue-600' : 'text-gray-400'
        }`} />
        <p className="text-sm font-medium text-gray-900 mb-2">
          Glissez-déposez vos fichiers ici
        </p>
        <p className="text-xs text-gray-500 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sélectionner des fichiers
        </button>
        <div className="mt-4 text-xs text-gray-500">
          <p>Formats acceptés: PDF, Images (PNG, JPG), Documents (TXT, DOC)</p>
          <p>Taille max: {maxSize}MB par fichier • Max {maxFiles} fichiers</p>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mt-4 space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
              <X className="h-4 w-4 mr-2" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">
            Fichiers sélectionnés ({files.length})
          </h4>
          <div className="space-y-2">
            {files.map((file, index) => {
              const Icon = getFileIcon(file);
              
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};