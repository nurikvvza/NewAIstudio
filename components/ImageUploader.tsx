import React, { useCallback, useState } from 'react';
import { fileToGenerativePart } from '../services/geminiService';

interface ImageUploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    try {
      const result = await fileToGenerativePart(file);
      onImageSelected(result.inlineData.data, result.inlineData.mimeType);
    } catch (e) {
      console.error("Error processing file", e);
      alert("Failed to read file.");
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`
        w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center
        transition-colors duration-200 cursor-pointer
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-gray-600 hover:border-blue-400 bg-gray-800/50 hover:bg-gray-800'
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-lg font-medium text-gray-200">Drop an image here</span>
        <span className="text-sm text-gray-500 mt-2">or click to browse</span>
      </label>
    </div>
  );
};