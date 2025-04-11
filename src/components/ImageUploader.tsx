
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImageUploaderProps {
  onImageCapture: (imageFile: File) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageCapture, isProcessing }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
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
  
  const openCamera = async () => {
    try {
      // Reset error state
      setCameraError(null);
      
      // Request camera with environment facing mode first (rear camera)
      // If that fails, fall back to any available camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        setCameraStream(stream);
      } catch (err) {
        console.log('Failed to access rear camera, trying any camera:', err);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        setCameraStream(stream);
      }
      
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Failed to play video:', err);
              toast({
                title: 'Camera Error',
                description: 'Could not start video stream. Please check permissions.',
                variant: 'destructive',
              });
            });
          }
        };
        
        if (cameraStream) {
          videoRef.current.srcObject = cameraStream;
        }
      }
      
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Could not access camera');
      toast({
        title: 'Camera Error',
        description: 'Could not access your device camera. Please check permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };
  
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              // Create a File from the blob
              const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
              
              // Set preview and call the parent handler
              const imageUrl = URL.createObjectURL(blob);
              setPreview(imageUrl);
              onImageCapture(file);
              
              toast({
                title: "Photo captured",
                description: "Processing the nutrition label...",
              });
              
              // Close camera
              closeCamera();
            } else {
              toast({
                title: "Capture failed",
                description: "Failed to create image from camera. Please try again.",
                variant: "destructive",
              });
            }
          }, 'image/jpeg', 0.9);
        } catch (err) {
          console.error('Error capturing photo:', err);
          toast({
            title: "Capture failed",
            description: "Failed to capture photo. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <>
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
                onClick={openCamera}
                disabled={isProcessing}
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && closeCamera()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a photo</DialogTitle>
            <DialogDescription>
              Position the nutrition label in the center of the frame
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative overflow-hidden rounded-md">
            {cameraError ? (
              <div className="bg-red-50 p-4 rounded-md text-center">
                <p className="text-red-700 font-medium">Camera access error</p>
                <p className="text-red-600 text-sm mt-1">
                  {cameraError}. Please check your camera permissions.
                </p>
              </div>
            ) : (
              <video
                ref={videoRef}
                className="w-full h-auto"
                autoPlay
                playsInline
                muted
              />
            )}
            
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute top-2 right-2 rounded-full bg-background/80"
              onClick={closeCamera}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={capturePhoto}
              className="w-full sm:w-auto"
              disabled={!!cameraError}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUploader;
