
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HealthAnalysis } from '@/services/nutrition/types';

interface AnalysisContextType {
  extractedText: string | null;
  setExtractedText: (text: string | null) => void;
  analysisResults: HealthAnalysis[];
  setAnalysisResults: (results: HealthAnalysis[]) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<HealthAnalysis[]>([]);

  return (
    <AnalysisContext.Provider value={{ 
      extractedText, 
      setExtractedText, 
      analysisResults, 
      setAnalysisResults 
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
