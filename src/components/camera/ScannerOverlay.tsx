import React from 'react';
import { ScanLine } from 'lucide-react';

interface ScannerOverlayProps {
  isProcessing: boolean;
}

const ScannerOverlay: React.FC<ScannerOverlayProps> = ({ isProcessing }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Scanner window with transparent center */}
      <div className="relative h-full w-full">
        {/* Semi-transparent overlay with a clear rectangle in the middle */}
        <div className="absolute inset-0 bg-black bg-opacity-60">
          {/* Clear scanning area */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-3/4 h-56 border-2 border-white rounded-md">
            {/* Corner markers */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br"></div>
          </div>
        </div>
        
        {/* Guidelines text */}
        <div className="absolute bottom-20 left-0 right-0 text-center text-white text-sm">
          <p className="mb-1">Position the nutrition label within the frame</p>
          <p>Hold steady for best results</p>
        </div>
        
        {/* Scanning animation */}
        {isProcessing ? (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-3/4 h-56 overflow-hidden flex items-center justify-center">
            <div className="h-1 bg-green-400 w-full animate-scan"></div>
            <div className="absolute text-white text-sm font-medium">
              Analyzing...
            </div>
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-3/4 h-56 overflow-hidden">
            <div className="h-0.5 bg-blue-400 w-full animate-scan"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerOverlay;
