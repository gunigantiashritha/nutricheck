import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, AlertTriangle, XCircle, ChevronDown, ChevronUp, AlertCircle, Info, Layers } from 'lucide-react';
import { HealthAnalysis } from '@/services/analysisService';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [openCards, setOpenCards] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("summary");

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
  
  const safeCounts = results.filter(r => r.recommendation === 'safe').length;
  const cautionCounts = results.filter(r => r.recommendation === 'caution').length;
  const avoidCounts = results.filter(r => r.recommendation === 'avoid').length;

  return (
    <div className="w-full max-w-md mx-auto mt-6 space-y-4">
      <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="summary">Summary View</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-0">
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Layers className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-medium">Analysis Summary</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>{safeCounts}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span>{cautionCounts}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span>{avoidCounts}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                {results.map((result, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded-md flex justify-between items-center border ${
                      result.recommendation === 'safe' ? 'border-green-200 bg-green-50' :
                      result.recommendation === 'caution' ? 'border-amber-200 bg-amber-50' :
                      'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center">
                      {getRecommendationIcon(result.recommendation)}
                      <span className="ml-2">{result.condition}</span>
                    </div>
                    <Badge variant={getBadgeVariant(result.recommendation)}>
                      {getRecommendationTitle(result.recommendation)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed" className="mt-0 space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
