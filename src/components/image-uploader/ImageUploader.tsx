

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, ScanLine } from 'lucide-react';
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
  const [isCameraSupported, setIsCameraSupported] = useState(true);
  const { toast } = useToast();

  // When component mounts, check if browser supports camera
  useEffect(() => {
    const checkCameraSupport = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false);
        console.log("Camera not supported by this browser");
      } else {
        try {
          // Just test if camera access is generally available
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          // Stop the stream immediately after testing
          stream.getTracks().forEach(track => track.stop());
          setIsCameraSupported(true);
        } catch (err) {
          console.log("Camera permission denied or error:", err);
          setIsCameraSupported(false);
        }
      }
    };

    checkCameraSupport();
  }, []);

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

  const openCamera = () => {
    // Request camera access
    if (isCameraSupported) {
      setIsCameraOpen(true);
    } else {
      toast({
        title: "Camera Access Error",
        description: "Unable to access your device camera. Please use image upload instead.",
        variant: "destructive"
      });
    }
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
              capture="environment"
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
                variant="default"
                className="flex-1"
                onClick={openCamera}
                disabled={isProcessing || !isCameraSupported}
              >
                <Camera className="mr-2 h-4 w-4" />
                Scan Label
              </Button>
            </div>
            
            {!isCameraSupported && (
              <p className="text-xs text-amber-600 mt-2">
                Camera access not available on this device or browser. Please use the Upload option.
              </p>
            )}
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
