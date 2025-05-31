

import React from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';

interface ImagePreviewProps {
  preview: string | null;
  isProcessing: boolean;
  onClick: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ preview, isProcessing, onClick }) => {
  return (
    <div
      className="border-2 border-dashed rounded-lg p-4 w-full aspect-video flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      {preview ? (
        <div className="relative w-full h-full">
          <img
            src={preview}
            alt="Nutrition label preview"
            className="object-contain w-full h-full"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <>
          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Upload a nutrition label image
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click or drag and drop
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePreview;
