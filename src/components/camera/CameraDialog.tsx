
import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

interface CameraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (file: File) => void;
}

const CameraDialog: React.FC<CameraDialogProps> = ({
  open,
  onOpenChange,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      initializeCamera();
    } else {
      closeCamera();
    }
  }, [open]);

  const initializeCamera = async () => {
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
              
              // Call the parent handler
              onCapture(file);
              
              toast({
                title: "Photo captured",
                description: "Processing the nutrition label...",
              });
              
              // Close dialog
              onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default CameraDialog;
