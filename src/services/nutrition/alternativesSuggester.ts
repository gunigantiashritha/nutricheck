
import { HealthAnalysis } from './types';

export interface AlternativeProduct {
  name: string;
  reason: string;
  category: string;
  benefits: string[];
}

export function generateHealthyAlternatives(results: HealthAnalysis[]): AlternativeProduct[] {
  const alternatives: AlternativeProduct[] = [];
  
  results.forEach(result => {
    if (result.recommendation === 'avoid' || result.recommendation === 'caution') {
      switch (result.condition) {
        case 'Diabetes':
          if (result.reasoning.includes('sugar') || result.reasoning.includes('carbohydrate')) {
            alternatives.push({
              name: 'Sugar-free or stevia-sweetened alternatives',
              reason: 'Lower glycemic index, won\'t spike blood sugar',
              category: 'Sweeteners',
              benefits: ['No blood sugar spikes', 'Maintains stable glucose levels', 'Suitable for diabetic diet']
            });
            alternatives.push({
              name: 'Whole grain or high-fiber versions',
              reason: 'Fiber slows sugar absorption',
              category: 'Grains & Cereals',
              benefits: ['Slower glucose release', 'Higher fiber content', 'Better blood sugar control']
            });
          }
          break;
          
        case 'Hypertension':
          if (result.reasoning.includes('sodium') || result.reasoning.includes('salt')) {
            alternatives.push({
              name: 'Low-sodium or no-salt-added versions',
              reason: 'Reduces sodium intake to help manage blood pressure',
              category: 'Low-Sodium Foods',
              benefits: ['Reduced blood pressure risk', 'Heart-healthy', 'Lower fluid retention']
            });
            alternatives.push({
              name: 'Fresh herbs and spices for flavor',
              reason: 'Natural flavor enhancement without sodium',
              category: 'Seasonings',
              benefits: ['No added sodium', 'Antioxidant properties', 'Natural flavor enhancement']
            });
          }
          break;
          
        case 'Thyroid Issues':
          if (result.reasoning.includes('soy') || result.reasoning.includes('goitrogen')) {
            alternatives.push({
              name: 'Iodine-rich seafood and seaweed (in moderation)',
              reason: 'Supports thyroid function when consumed appropriately',
              category: 'Seafood',
              benefits: ['Natural iodine source', 'Supports thyroid health', 'High-quality protein']
            });
            alternatives.push({
              name: 'Selenium-rich foods like Brazil nuts',
              reason: 'Selenium supports thyroid hormone production',
              category: 'Nuts & Seeds',
              benefits: ['Supports thyroid function', 'Antioxidant properties', 'Healthy fats']
            });
          }
          break;
          
        case 'Food Allergies':
          if (result.reasoning.includes('allergen')) {
            alternatives.push({
              name: 'Certified allergen-free alternatives',
              reason: 'Manufactured in allergen-free facilities',
              category: 'Allergen-Free Products',
              benefits: ['No cross-contamination risk', 'Safe for allergic individuals', 'Peace of mind']
            });
            alternatives.push({
              name: 'Naturally allergen-free whole foods',
              reason: 'Simple, unprocessed foods reduce allergy risk',
              category: 'Whole Foods',
              benefits: ['Minimal processing', 'Known ingredients', 'Lower allergy risk']
            });
          }
          break;
      }
    }
  });
  
  // Remove duplicates based on name
  const uniqueAlternatives = alternatives.filter((alternative, index, self) => 
    index === self.findIndex(a => a.name === alternative.name)
  );
  
  return uniqueAlternatives.slice(0, 4); // Limit to 4 alternatives
}
