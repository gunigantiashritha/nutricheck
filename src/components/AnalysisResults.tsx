
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, XCircle, AlertCircle, Layers } from 'lucide-react';
import { HealthAnalysis } from '@/services/analysisService';
import { Badge } from '@/components/ui/badge';
import AlternativesSuggestion from './AlternativesSuggestion';
import { generateHealthyAlternatives } from '@/services/nutrition/alternativesSuggester';

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

const getBadgeVariant = (recommendation: string) => {
  switch (recommendation) {
    case 'safe':
      return 'default';
    case 'caution':
      return 'secondary';
    case 'avoid':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getPrecautions = (condition: string): string => {
  switch (condition) {
    case 'Diabetes':
      return 'Monitor blood glucose levels closely after consumption. Consider adjusting insulin or medication as needed. Consume in small portions, preferably alongside protein or fiber-rich foods to slow absorption.';
    case 'Hypertension':
      return 'Monitor blood pressure regularly if consuming this product. Consider reducing portion size or limiting frequency. Maintain adequate hydration and consult with healthcare provider about suitable alternatives.';
    case 'Thyroid Issues':
      return 'If taking thyroid medication, consume this product at least 4 hours after medication. Consider spacing out consumption from other meals. Consult with your healthcare provider about potential interactions.';
    case 'Food Allergies':
      return 'Have emergency medication (e.g., epinephrine auto-injector) available if you choose to consume. Avoid completely if you have severe allergies to identified ingredients. Cross-contamination risks remain even with trace amounts.';
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

  // Generate healthy alternatives
  const alternatives = generateHealthyAlternatives(results);

  return (
    <div className="w-full max-w-md mx-auto mt-6 space-y-4">
      <Card className="mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Layers className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium">Analysis Summary</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {results.map((result, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-md border ${
                  result.recommendation === 'safe' ? 'border-green-200 bg-green-50' :
                  result.recommendation === 'caution' ? 'border-amber-200 bg-amber-50' :
                  'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {getRecommendationIcon(result.recommendation)}
                    <span className="ml-2 font-medium">{result.condition}</span>
                  </div>
                  <Badge variant={getBadgeVariant(result.recommendation)}>
                    {getRecommendationTitle(result.recommendation)}
                  </Badge>
                </div>
                
                <Alert className="bg-background/50 mt-2">
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
                
                {(result.recommendation === 'caution' || result.recommendation === 'avoid') && (
                  <Alert className="bg-background/50 mt-3 border-amber-300">
                    <AlertTitle className="flex items-center text-sm font-medium">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span className="ml-2">Precautions:</span>
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {getPrecautions(result.condition)}
                    </AlertDescription>
                  </Alert>
                )}
                
                {result.effects && result.effects.length > 0 && (
                  <div className="mt-3 space-y-3">
                    <h4 className="text-sm font-medium">Ingredient Effects:</h4>
                    {result.effects.map((effect, i) => (
                      <div key={i} className="bg-background/40 p-3 rounded">
                        <h4 className="font-medium text-sm">{effect.ingredient}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{effect.effect}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Add alternatives suggestions */}
      <AlternativesSuggestion alternatives={alternatives} />
    </div>
  );
};

export default AnalysisResults;
