
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Heart, CheckCircle } from 'lucide-react';
import { AlternativeProduct } from '@/services/nutrition/alternativesSuggester';

interface AlternativesSuggestionProps {
  alternatives: AlternativeProduct[];
}

const AlternativesSuggestion: React.FC<AlternativesSuggestionProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
          Healthier Alternatives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alternatives.map((alternative, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border border-green-200 bg-green-50"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                <h4 className="font-medium text-green-800">{alternative.name}</h4>
              </div>
              <Badge variant="secondary" className="text-xs">
                {alternative.category}
              </Badge>
            </div>
            
            <p className="text-sm text-green-700 mb-3">
              {alternative.reason}
            </p>
            
            <div className="space-y-1">
              <h5 className="text-xs font-medium text-green-800 mb-1">Benefits:</h5>
              {alternative.benefits.map((benefit, benefitIndex) => (
                <div key={benefitIndex} className="flex items-center text-xs text-green-700">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-1" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-xs text-muted-foreground mt-3 p-2 bg-blue-50 rounded">
          💡 <strong>Tip:</strong> Always consult with your healthcare provider before making significant dietary changes, especially if you have medical conditions.
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativesSuggestion;
