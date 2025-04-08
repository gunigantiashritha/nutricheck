
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import AnalysisResults from '@/components/AnalysisResults';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from '@/services/AnalysisContext';

const ResultsPage = () => {
  const { analysisResults } = useAnalysis();
  const navigate = useNavigate();

  const hasResults = analysisResults && analysisResults.length > 0;

  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
          <p className="text-gray-600">
            Check if this food product is suitable for your health needs
          </p>
        </div>
        
        {hasResults ? (
          <div className="w-full max-w-md">
            <AnalysisResults 
              results={analysisResults}
              isLoading={false}
            />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 flex flex-col items-center">
                <FileText className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500">No analysis results yet. Upload an image to get started.</p>
              </CardContent>
            </Card>
            
            <Button 
              onClick={() => navigate('/upload')}
              className="flex items-center mt-6"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload a Nutrition Label
            </Button>
          </div>
        )}
        
        <div className="mt-8">
          <Button 
            variant="outline"
            onClick={() => navigate('/upload')}
          >
            Upload Another Label
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResultsPage;
