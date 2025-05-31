
import { NutritionData, HealthAnalysis, HealthEffects } from './types';

export function analyzeForAllergies(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No common allergens detected.';
  let effects: HealthEffects[] = [];

  // Check for known allergens
  const foundAllergens = data.allergens.filter(allergen => allergen.found);
  
  if (foundAllergens.length > 0) {
    recommendation = 'avoid';
    const allergenNames = foundAllergens.map(a => a.name).filter((value, index, self) => {
      // Remove duplicates (e.g. 'peanut' and 'peanuts')
      return self.indexOf(value) === index || 
             !self.some((v, i) => i < index && v.includes(value) || value.includes(v));
    });
    
    reasoning = `Contains common allergens: ${allergenNames.join(', ')}.`;
    
    allergenNames.forEach(allergen => {
      effects.push({
        ingredient: allergen,
        effect: `Can trigger allergic reactions ranging from mild symptoms to severe anaphylaxis in people with ${allergen} allergies`
      });
    });
  }
  
  // Check for "may contain" statements in the ingredients
  const mayContainAllergens = data.ingredients.some(ingredient => 
    ingredient.includes('may contain') || 
    ingredient.includes('produced in a facility') || 
    ingredient.includes('processed in a facility')
  );
  
  if (mayContainAllergens) {
    if (recommendation === 'safe') {
      recommendation = 'caution';
    }
    reasoning = reasoning === 'No common allergens detected.' ? 
      'May contain traces of allergens due to processing.' : 
      reasoning + ' Product may also contain traces of other allergens due to processing.';
    
    effects.push({
      ingredient: 'Processing facility',
      effect: 'Cross-contamination risk may expose product to trace amounts of various allergens'
    });
  }

  return {
    condition: 'Food Allergies',
    recommendation,
    reasoning,
    effects
  };
}

