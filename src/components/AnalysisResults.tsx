
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { HealthAnalysis } from '@/services/analysisService';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [openCards, setOpenCards] = useState<number[]>([]);

  const toggleCard = (index: number) => {
    setOpenCards(prevOpenCards => {
      if (prevOpenCards.includes(index)) {
        return prevOpenCards.filter(i => i !== index);
      } else {
        return [...prevOpenCards, index];
      }
    });
  };

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
        <Collapsible 
          key={index}
          open={openCards.includes(index)}
          onOpenChange={() => toggleCard(index)}
        >
          <Card 
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
              <Alert className="bg-background/50">
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
              
              {result.effects && result.effects.length > 0 && (
                <CollapsibleTrigger className="w-full mt-3 flex items-center justify-between p-2 bg-background/70 rounded text-sm font-medium hover:bg-background/90 transition-colors">
                  <span>How ingredients affect {result.condition.toLowerCase()}</span>
                  {openCards.includes(index) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </CollapsibleTrigger>
              )}
              
              <CollapsibleContent>
                {result.effects && result.effects.length > 0 ? (
                  <div className="mt-3 space-y-3">
                    {result.effects.map((effect, i) => (
                      <div key={i} className="bg-background/40 p-3 rounded">
                        <h4 className="font-medium text-sm">{effect.ingredient}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{effect.effect}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3 text-sm text-center text-muted-foreground p-3">
                    No specific ingredient effects to display.
                  </div>
                )}
              </CollapsibleContent>
            </CardContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  );
};

export default AnalysisResults;
