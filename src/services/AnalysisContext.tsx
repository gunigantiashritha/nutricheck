
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { HealthAnalysis } from '@/services/nutrition/types';

interface ProductAnalysis {
  id: string;
  date: string;
  results: HealthAnalysis[];
  overallRecommendation: 'safe' | 'caution' | 'avoid';
}

interface AnalysisContextType {
  extractedText: string | null;
  setExtractedText: (text: string | null) => void;
  analysisResults: HealthAnalysis[];
  setAnalysisResults: (results: HealthAnalysis[]) => void;
  productHistory: ProductAnalysis[];
  addToProductHistory: (results: HealthAnalysis[]) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<HealthAnalysis[]>([]);
  const [productHistory, setProductHistory] = useState<ProductAnalysis[]>([]);

  const addToProductHistory = (results: HealthAnalysis[]) => {
    if (results.length === 0) return;
    
    // Determine overall recommendation (worst case)
    let overallRecommendation: 'safe' | 'caution' | 'avoid' = 'safe';
    
    if (results.some(r => r.recommendation === 'avoid')) {
      overallRecommendation = 'avoid';
    } else if (results.some(r => r.recommendation === 'caution')) {
      overallRecommendation = 'caution';
    }
    
    const newAnalysis: ProductAnalysis = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      results: [...results],
      overallRecommendation
    };
    
    setProductHistory(prev => [newAnalysis, ...prev].slice(0, 10)); // Keep last 10 items
  };

  return (
    <AnalysisContext.Provider value={{ 
      extractedText, 
      setExtractedText, 
      analysisResults, 
      setAnalysisResults,
      productHistory,
      addToProductHistory
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
