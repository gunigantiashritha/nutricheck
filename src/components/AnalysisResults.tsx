
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, XCircle } from 'lucide-react';
import { HealthAnalysis } from '@/services/analysisService';

interface AnalysisResultsProps {
  results: HealthAnalysis[];
  isLoading: boolean;
}

const getRecommendationIcon = (recommendation: string) => {
  switch (recommendation) {
    case 'safe':
      return <Check className="h-5 w-5 text-safe" />;
    case 'caution':
      return <AlertTriangle className="h-5 w-5 text-caution" />;
    case 'avoid':
      return <XCircle className="h-5 w-5 text-avoid" />;
    default:
      return null;
  }
};

const getRecommendationClass = (recommendation: string) => {
  switch (recommendation) {
    case 'safe':
      return 'result-card-safe';
    case 'caution':
      return 'result-card-caution';
    case 'avoid':
      return 'result-card-avoid';
    default:
      return '';
  }
};

const getRecommendationTitle = (recommendation: string) => {
  switch (recommendation) {
    case 'safe':
      return 'Safe to consume';
    case 'caution':
      return 'Consume with caution';
    case 'avoid':
      return 'Avoid consumption';
    default:
      return '';
  }
};

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto mt-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full animate-pulse-slow">
            <CardHeader>
              <CardTitle className="h-6 bg-gray-200 rounded"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 space-y-4">
      {results.map((result, index) => (
        <Card 
          key={index}
          className={`w-full ${getRecommendationClass(result.recommendation)}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{result.condition}</span>
              <span className="text-sm font-normal flex items-center">
                {getRecommendationIcon(result.recommendation)}
                <span className="ml-1">{getRecommendationTitle(result.recommendation)}</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="outline" className="bg-background/50">
              <AlertTitle className="flex items-center text-sm font-medium">
                {getRecommendationIcon(result.recommendation)}
                <span className="ml-2">
                  {result.recommendation === 'safe' ? 'Analysis Result:' : 'Warning:'}
                </span>
              </AlertTitle>
              <AlertDescription className="text-sm">
                {result.reasoning}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalysisResults;
