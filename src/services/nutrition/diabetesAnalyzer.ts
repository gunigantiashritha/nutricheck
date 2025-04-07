
import { NutritionData, HealthAnalysis, HealthEffects } from './types';

// Health effect definitions for diabetes-related ingredients
export const diabetesIngredientEffects: Record<string, string> = {
  'sugar': 'Raises blood glucose levels rapidly, potentially causing blood sugar spikes',
  'corn syrup': 'High glycemic index that raises blood glucose quickly and significantly',
  'high fructose': 'Can increase insulin resistance and may worsen blood glucose control',
  'maltodextrin': 'Has a high glycemic index that can cause rapid blood sugar increases',
  'dextrose': 'Pure glucose that rapidly raises blood sugar levels',
  'honey': 'Natural but still raises blood sugar levels quickly',
  'molasses': 'Contains concentrated sugars that can spike blood glucose',
  'agave': 'High in fructose which may negatively impact insulin sensitivity',
  'white flour': 'Refined carbohydrate that converts quickly to glucose',
  'white bread': 'Has a high glycemic index and can cause blood sugar spikes'
};

export function analyzeForDiabetes(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No concerning ingredients found for people with diabetes.';
  let effects: HealthEffects[] = [];

  // Check sugars
  if (data.sugars && data.sugars.amount > 10) {
    recommendation = 'avoid';
    reasoning = `High sugar content (${data.sugars.amount}${data.sugars.unit}) may cause blood sugar spikes.`;
    effects.push({
      ingredient: 'Sugars',
      effect: `High amount (${data.sugars.amount}${data.sugars.unit}) can cause rapid blood glucose elevation`
    });
  } else if (data.sugars && data.sugars.amount > 5) {
    recommendation = 'caution';
    reasoning = `Moderate sugar content (${data.sugars.amount}${data.sugars.unit}) - consume in moderation.`;
    effects.push({
      ingredient: 'Sugars',
      effect: `Moderate amount (${data.sugars.amount}${data.sugars.unit}) may affect blood glucose levels`
    });
  }

  // Check carbs if sugars aren't explicitly high
  if (data.totalCarbohydrates && data.totalCarbohydrates.amount > 30) {
    if (recommendation === 'safe') {
      recommendation = 'caution';
    }
    
    const carbohydrateWarning = `High carbohydrate content (${data.totalCarbohydrates.amount}${data.totalCarbohydrates.unit}) - monitor blood sugar after consumption.`;
    reasoning = reasoning === 'No concerning ingredients found for people with diabetes.' ? 
      carbohydrateWarning : 
      reasoning + ` Also contains high carbohydrates (${data.totalCarbohydrates.amount}${data.totalCarbohydrates.unit}).`;
    
    effects.push({
      ingredient: 'Carbohydrates',
      effect: `High amount (${data.totalCarbohydrates.amount}${data.totalCarbohydrates.unit}) can gradually raise blood glucose levels`
    });
  }

  // Look for high-glycemic ingredients
  const highGlycemicIngredients = Object.keys(diabetesIngredientEffects);
  
  if (data.ingredients) {
    data.ingredients.forEach(ingredient => {
      for (const problematicIngredient of highGlycemicIngredients) {
        if (ingredient.toLowerCase().includes(problematicIngredient.toLowerCase())) {
          if (recommendation === 'safe') {
            recommendation = 'caution';
          } else if (recommendation === 'caution') {
            recommendation = 'avoid';
          }
          
          effects.push({
            ingredient: ingredient,
            effect: diabetesIngredientEffects[problematicIngredient]
          });
          
          // Update reasoning if not already mentioned
          if (!reasoning.includes(ingredient)) {
            reasoning += reasoning.endsWith('.') ? ` Contains ${ingredient} which can affect blood sugar levels.` : `, ${ingredient} which can affect blood sugar levels.`;
          }
        }
      }
    });
  }

  return {
    condition: 'Diabetes',
    recommendation,
    reasoning,
    effects
  };
}
