
import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, FlipHorizontal, ZoomIn, ZoomOut } from 'lucide-react';
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
import ScannerOverlay from './ScannerOverlay';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<'environment' | 'user'>('environment');
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (!hasRequestedPermission) {
        // First time opening the camera - show permission toast
        toast({
          title: "Camera Access",
          description: "Please allow camera access to scan nutrition labels.",
        });
        setHasRequestedPermission(true);
      }
      initializeCamera();
    } else {
      closeCamera();
      setIsProcessing(false);
    }
  }, [open, currentCamera, hasRequestedPermission]);

  const initializeCamera = async () => {
    try {
      // Reset error state
      setCameraError(null);
      
      // Request camera with specified facing mode
      try {
        // Fixed: Remove the 'advanced' constraint with zoom as it's not supported in this format
        const constraints = { 
          video: { 
            facingMode: currentCamera
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setCameraStream(stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded');
            videoRef.current?.play().catch(err => {
              console.error('Failed to play video:', err);
              toast({
                title: 'Camera Error',
                description: 'Could not start video stream. Please check permissions.',
                variant: 'destructive',
              });
            });
          };
        }
      } catch (err) {
        console.log(`Failed to access ${currentCamera} camera, trying any camera:`, err);
        
        // If specific camera fails, try any available camera
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraStream(stream);
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(console.error);
            };
          }
        } catch (fallbackErr) {
          throw fallbackErr; // Re-throw to be caught by outer catch
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Could not access camera');
      toast({
        title: 'Camera Access Denied',
        description: 'Please allow camera access in your browser settings to scan nutrition labels.',
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

  const toggleCamera = () => {
    setCurrentCamera(prev => prev === 'environment' ? 'user' : 'environment');
  };
  
  const adjustZoom = (increase: boolean) => {
    // Update the zoom level state
    setZoomLevel(prevZoom => {
      const newZoom = increase ? prevZoom + 0.1 : prevZoom - 0.1;
      return Math.max(1, Math.min(newZoom, 2.5)); // Limit zoom between 1x and 2.5x
    });
    
    // Try to apply zoom if supported by the browser/device
    // Note: Most browsers don't support zoom through constraints API,
    // so this is more of a "best effort" approach
    if (cameraStream) {
      const videoTrack = cameraStream.getVideoTracks()[0];
      try {
        // TypeScript-safe approach to check capabilities
        const capabilities = videoTrack.getCapabilities?.();
        if (capabilities && 'zoom' in capabilities) {
          const constraints = { advanced: [{ zoom: zoomLevel }] as any[] };
          videoTrack.applyConstraints(constraints).catch(e => 
            console.log("Zoom not supported on this device:", e)
          );
        }
      } catch (e) {
        console.log("Zoom adjustment not supported");
      }
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Start processing indicator
      setIsProcessing(true);
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      try {
        // Draw current video frame to canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to blob
          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
          });
          
          if (blob) {
            // Create a File from the blob
            const file = new File([blob], "nutrition-label.jpg", { type: "image/jpeg" });
            
            toast({
              title: "Photo captured",
              description: "Processing the nutrition label...",
            });
            
            // Close dialog with a short delay to show the processing animation
            setTimeout(() => {
              setIsProcessing(false);
              onOpenChange(false);
              
              // Call the parent handler
              onCapture(file);
            }, 800);
          } else {
            setIsProcessing(false);
            toast({
              title: "Capture failed",
              description: "Failed to create image from camera. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (err) {
        console.error('Error capturing photo:', err);
        setIsProcessing(false);
        toast({
          title: "Capture failed",
          description: "Failed to capture photo. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isProcessing || !newOpen) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogHeader className="p-4">
          <DialogTitle>Scan Nutrition Label</DialogTitle>
          <DialogDescription>
            Align the label within the frame for best results
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative overflow-hidden bg-black aspect-[3/4] w-full">
          {cameraError ? (
            <div className="absolute inset-0 bg-red-50 p-4 flex items-center justify-center">
              <p className="text-red-700 font-medium text-center">
                Camera access error: {cameraError}
                <br />
                <span className="text-sm mt-1 block">
                  Please check your camera permissions in your browser settings.
                </span>
              </p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <ScannerOverlay isProcessing={isProcessing} />
            </>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full bg-background/80 z-10"
            onClick={() => !isProcessing && onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
        
        <DialogFooter className="p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCamera}
              disabled={!!cameraError || isProcessing}
              className="rounded-full"
            >
              <FlipHorizontal className="h-4 w-4" />
              <span className="sr-only">Switch camera</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustZoom(true)}
              disabled={!!cameraError || isProcessing}
              className="rounded-full"
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoom in</span>
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustZoom(false)}
              disabled={!!cameraError || isProcessing || zoomLevel <= 1}
              className="rounded-full"
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Zoom out</span>
            </Button>
          </div>
          
          <Button 
            onClick={capturePhoto}
            disabled={!!cameraError || isProcessing}
            className={`rounded-full w-16 h-16 p-0 ${isProcessing ? 'animate-pulse' : ''}`}
          >
            <span className="sr-only">Capture</span>
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                {isProcessing ? (
                  <span className="w-10 h-10 rounded-full bg-white animate-pulse"></span>
                ) : (
                  <span className="w-10 h-10 rounded-full bg-white"></span>
                )}
              </span>
            </span>
          </Button>
          
          <div className="w-24 flex justify-end">
            {zoomLevel > 1 && <span className="text-xs text-white bg-black/50 px-2 py-1 rounded-full">{zoomLevel.toFixed(1)}x</span>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDialog;
