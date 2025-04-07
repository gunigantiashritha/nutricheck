
import { NutritionData, HealthAnalysis, HealthEffects } from './types';

// Health effect definitions for thyroid-affecting ingredients
export const thyroidIngredientEffects: Record<string, string> = {
  'soy': 'Contains isoflavones that may interfere with thyroid hormone production',
  'soybeans': 'Can inhibit thyroid hormone synthesis in some individuals',
  'soy protein': 'May interfere with thyroid medication absorption',
  'tofu': 'Contains compounds that can affect thyroid function',
  'millet': 'Contains goitrogens that may interfere with iodine uptake',
  'raw kale': 'Contains goitrogens that can affect thyroid function if consumed in large amounts',
  'raw spinach': 'Contains goitrogens that may impact thyroid hormone production',
  'raw broccoli': 'Contains goitrogens that can interfere with thyroid function',
  'raw cabbage': 'Contains substances that may inhibit thyroid hormone production',
  'raw cauliflower': 'Contains goitrogens that may inhibit thyroid function',
  'seaweed': 'High iodine content which may disrupt thyroid function if consumed excessively',
  'kelp': 'Very high in iodine which can worsen certain thyroid conditions',
  'iodized salt': 'High iodine content may affect thyroid function in sensitive individuals'
};

export function analyzeForThyroid(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No concerning ingredients found for people with thyroid issues.';
  let effects: HealthEffects[] = [];

  // Look for thyroid-affecting ingredients
  const thyroidAffectingIngredients = Object.keys(thyroidIngredientEffects);
  
  if (data.ingredients) {
    data.ingredients.forEach(ingredient => {
      for (const problematicIngredient of thyroidAffectingIngredients) {
        if (ingredient.toLowerCase().includes(problematicIngredient.toLowerCase())) {
          recommendation = 'caution';
          
          effects.push({
            ingredient: ingredient,
            effect: thyroidIngredientEffects[problematicIngredient]
          });
          
          // Update reasoning if not already mentioned
          if (!reasoning.includes(ingredient)) {
            reasoning = reasoning === 'No concerning ingredients found for people with thyroid issues.' ? 
              `Contains ${ingredient} which may affect thyroid function.` : 
              reasoning + ` Also contains ${ingredient} which may affect thyroid function.`;
          }
        }
      }
    });
  }

  return {
    condition: 'Thyroid Issues',
    recommendation,
    reasoning,
    effects
  };
}
