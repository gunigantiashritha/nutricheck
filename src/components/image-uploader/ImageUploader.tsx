
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CameraDialog from '@/components/camera/CameraDialog';
import ImagePreview from '@/components/image-uploader/ImagePreview';

interface ImageUploaderProps {
  onImageCapture: (imageFile: File) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageCapture, isProcessing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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

  const handleCapturedImage = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    onImageCapture(file);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <ImagePreview 
              preview={preview} 
              isProcessing={isProcessing}
              onClick={triggerFileInput} 
            />

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
                onClick={() => setIsCameraOpen(true)}
                disabled={isProcessing}
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CameraDialog 
        open={isCameraOpen}
        onOpenChange={setIsCameraOpen}
        onCapture={handleCapturedImage}
      />
    </>
  );
};

export default ImageUploader;
