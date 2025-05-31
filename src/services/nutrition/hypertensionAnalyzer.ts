
import { NutritionData, HealthAnalysis, HealthEffects } from './types';

// Health effect definitions for hypertension-related ingredients
export const hypertensionIngredientEffects: Record<string, string> = {
  'salt': 'Increases water retention and blood volume, raising blood pressure',
  'sodium': 'Causes fluid retention, increasing blood volume and pressure',
  'msg': 'May temporarily raise blood pressure in some individuals',
  'monosodium glutamate': 'Can cause temporary blood pressure elevation in sensitive people',
  'baking soda': 'High sodium content that can contribute to elevated blood pressure',
  'sodium bicarbonate': 'Contains sodium which can increase blood pressure',
  'sodium nitrate': 'Used in preserved meats, may contribute to blood pressure issues',
  'sodium benzoate': 'Preservative that adds sodium to the diet',
  'soy sauce': 'Very high sodium content that can significantly impact blood pressure',
  'bouillon': 'Typically high in sodium which can raise blood pressure'
};


export function analyzeForHypertension(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No concerning ingredients found for people with hypertension.';
  let effects: HealthEffects[] = [];

  // Check sodium
  if (data.sodium) {
    if (data.sodium.amount > 400) {
      recommendation = 'avoid';
      reasoning = `High sodium content (${data.sodium.amount}${data.sodium.unit}) may increase blood pressure.`;
      effects.push({
        ingredient: 'Sodium',
        effect: `High amount (${data.sodium.amount}${data.sodium.unit}) can significantly raise blood pressure`
      });
    } else if (data.sodium.amount > 200) {
      recommendation = 'caution';
      reasoning = `Moderate sodium content (${data.sodium.amount}${data.sodium.unit}) - consume in moderation.`;
      effects.push({
        ingredient: 'Sodium',
        effect: `Moderate amount (${data.sodium.amount}${data.sodium.unit}) may temporarily affect blood pressure`
      });
    }
  }

  // Look for ingredients that may affect blood pressure
  const concerningIngredients = Object.keys(hypertensionIngredientEffects);
  
  if (data.ingredients) {
    data.ingredients.forEach(ingredient => {
      for (const problematicIngredient of concerningIngredients) {
        if (ingredient.toLowerCase().includes(problematicIngredient.toLowerCase())) {
          if (recommendation === 'safe') {
            recommendation = 'caution';
          }
          
          effects.push({
            ingredient: ingredient,
            effect: hypertensionIngredientEffects[problematicIngredient]
          });
          
          // Update reasoning if not already mentioned
          if (!reasoning.includes(ingredient)) {
            reasoning += reasoning.endsWith('.') ? ` Contains ${ingredient} which may affect blood pressure.` : `, ${ingredient} which may affect blood pressure.`;
          }
        }
      }
    });
  }

  return {
    condition: 'Hypertension',
    recommendation,
    reasoning,
    effects
  };
}
