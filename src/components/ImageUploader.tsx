
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, Image, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageCapture: (imageFile: File) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageCapture, isProcessing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        onImageCapture(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-4 w-full aspect-video flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden`}
            onClick={triggerFileInput}
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
                <Image className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  Upload a nutrition label image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Click or drag and drop
                </p>
              </>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex space-x-2 w-full">
            <Button
              className="flex-1"
              onClick={triggerFileInput}
              disabled={isProcessing}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={triggerFileInput}
              disabled={isProcessing}
            >
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
