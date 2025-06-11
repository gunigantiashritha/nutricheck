
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Activity, Droplet, Utensils, AlertTriangle } from 'lucide-react';
import { HealthAnalysis, NutritionData } from '@/services/analysisService';

interface LifestyleSuggestionsProps {
  results: HealthAnalysis[];
  nutritionData?: NutritionData;
}

const getPhysicalActivitySuggestions = (results: HealthAnalysis[], nutritionData?: NutritionData) => {
  const hasHighSugar = nutritionData?.sugars && nutritionData.sugars.amount > 10;
  const hasHighSodium = nutritionData?.sodium && nutritionData.sodium.amount > 400;
  const hasCautionItems = results.some(r => r.recommendation === 'caution');
  
  if (hasHighSugar) {
    return "Consider a gentle 10-15 minute walk after consuming this to help your body process the sugars more effectively.";
  }
  
  if (hasHighSodium) {
    return "Light movement like stretching or a short walk can help your circulation after consuming higher sodium foods.";
  }
  
  if (hasCautionItems) {
    return "Some light physical activity like walking or gentle stretching can be beneficial after consuming this product.";
  }
  
  return "You're good to go! This product shouldn't require any special activity considerations.";
};

const getDietaryPauseSuggestions = (results: HealthAnalysis[], nutritionData?: NutritionData) => {
  const suggestions = [];
  
  const hasHighSugar = nutritionData?.sugars && nutritionData.sugars.amount > 10;
  const hasHighSodium = nutritionData?.sodium && nutritionData.sodium.amount > 400;
  const hasHighFat = nutritionData?.totalFat && nutritionData.totalFat.amount > 15;
  
  if (hasHighSugar) {
    suggestions.push("Avoid additional sugary snacks or drinks for the next 2-3 hours");
  }
  
  if (hasHighSodium) {
    suggestions.push("Skip salty foods for your next meal to balance your sodium intake");
  }
  
  if (hasHighFat) {
    suggestions.push("Consider lighter, less fatty options for your next meal");
  }
  
  if (suggestions.length === 0) {
    return "No specific dietary restrictions needed - you can continue with your regular eating pattern.";
  }
  
  return suggestions.join(". ");
};

const getHydrationAdvice = (results: HealthAnalysis[], nutritionData?: NutritionData) => {
  const hasHighSodium = nutritionData?.sodium && nutritionData.sodium.amount > 400;
  const hasHighSugar = nutritionData?.sugars && nutritionData.sugars.amount > 10;
  
  if (hasHighSodium) {
    return "Drink an extra glass of water to help balance the sodium content and support healthy blood pressure.";
  }
  
  if (hasHighSugar) {
    return "Stay well-hydrated with water to help your body process the sugars effectively.";
  }
  
  return "Continue with your regular hydration routine - this product doesn't require extra water intake.";
};

const getComplementaryFoodSuggestions = (results: HealthAnalysis[], nutritionData?: NutritionData) => {
  const hasHighSugar = nutritionData?.sugars && nutritionData.sugars.amount > 10;
  const hasHighSodium = nutritionData?.sodium && nutritionData.sodium.amount > 400;
  const lowFiber = !nutritionData?.dietaryFiber || nutritionData.dietaryFiber.amount < 3;
  
  if (hasHighSugar && lowFiber) {
    return "For your next meal, consider adding fiber-rich foods like vegetables, fruits, or whole grains to help stabilize blood sugar.";
  }
  
  if (hasHighSodium) {
    return "Balance this with potassium-rich foods like bananas, leafy greens, or yogurt in your next meal.";
  }
  
  if (lowFiber) {
    return "Add some fiber to your next meal with vegetables, fruits, or whole grains for better digestion.";
  }
  
  return "This product fits well into a balanced diet - continue with your regular meal planning.";
};

const getAllergenWarnings = (results: HealthAnalysis[], nutritionData?: NutritionData) => {
  const allergenResult = results.find(r => r.condition === 'Food Allergies');
  const warnings = [];
  
  if (allergenResult && allergenResult.recommendation === 'avoid') {
    warnings.push("⚠️ This product contains allergens that may trigger reactions");
  }
  
  if (allergenResult && allergenResult.recommendation === 'caution') {
    warnings.push("⚠️ Potential cross-contamination risk - be mindful if you have severe allergies");
  }
  
  // Check for common additives
  if (nutritionData?.ingredients.some(ingredient => 
    ingredient.toLowerCase().includes('artificial') || 
    ingredient.toLowerCase().includes('preservative') ||
    ingredient.toLowerCase().includes('color')
  )) {
    warnings.push("Contains artificial additives - consider this if you're sensitive to food chemicals");
  }
  
  return warnings;
};

const LifestyleSuggestions: React.FC<LifestyleSuggestionsProps> = ({ results, nutritionData }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const physicalActivity = getPhysicalActivitySuggestions(results, nutritionData);
  const dietaryPause = getDietaryPauseSuggestions(results, nutritionData);
  const hydration = getHydrationAdvice(results, nutritionData);
  const complementaryFood = getComplementaryFoodSuggestions(results, nutritionData);
  const allergenWarnings = getAllergenWarnings(results, nutritionData);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Utensils className="h-5 w-5 text-blue-600 mr-2" />
          Lifestyle Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Physical Activity */}
        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center mb-2">
            <Activity className="h-4 w-4 text-green-600 mr-2" />
            <h4 className="font-medium text-green-800">Physical Activity</h4>
          </div>
          <p className="text-sm text-green-700">{physicalActivity}</p>
        </div>

        {/* Dietary Pauses */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center mb-2">
            <Utensils className="h-4 w-4 text-amber-600 mr-2" />
            <h4 className="font-medium text-amber-800">Next Meal Planning</h4>
          </div>
          <p className="text-sm text-amber-700">{dietaryPause}</p>
        </div>

        {/* Hydration */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center mb-2">
            <Droplet className="h-4 w-4 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-800">Hydration</h4>
          </div>
          <p className="text-sm text-blue-700">{hydration}</p>
        </div>

        {/* Complementary Foods */}
        <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
          <div className="flex items-center mb-2">
            <Utensils className="h-4 w-4 text-purple-600 mr-2" />
            <h4 className="font-medium text-purple-800">Complementary Foods</h4>
          </div>
          <p className="text-sm text-purple-700">{complementaryFood}</p>
        </div>

        {/* Allergen/Additive Warnings */}
        {allergenWarnings.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Important Notices</AlertTitle>
            <AlertDescription className="text-red-700">
              {allergenWarnings.map((warning, index) => (
                <div key={index} className="mb-1 last:mb-0">{warning}</div>
              ))}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground mt-3 p-2 bg-gray-50 rounded">
          💡 <strong>Remember:</strong> These are general suggestions based on nutritional content. Always consult healthcare professionals for personalized dietary advice.
        </div>
      </CardContent>
    </Card>
  );
};

export default LifestyleSuggestions;
