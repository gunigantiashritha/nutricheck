
import { HealthAnalysis, NutritionData } from './types';

export interface AlternativeProduct {
  name: string;
  reason: string;
  category: string;
  benefits: string[];
  productType: string;
}

export function generateHealthyAlternatives(results: HealthAnalysis[], nutritionData?: NutritionData): AlternativeProduct[] {
  const alternatives: AlternativeProduct[] = [];
  
  // Check if product has high sugar content
  const hasSugar = nutritionData?.sugars && nutritionData.sugars.amount > 10;
  const hasHighSodium = nutritionData?.sodium && nutritionData.sodium.amount > 400;
  
  // Determine product type from ingredients or context
  const ingredients = nutritionData?.ingredients || [];
  const ingredientText = ingredients.join(' ').toLowerCase();
  
  // Suggest specific product alternatives based on detected issues
  results.forEach(result => {
    if (result.recommendation === 'avoid' || result.recommendation === 'caution') {
      
      // Sugar-related issues
      if (result.reasoning.includes('sugar') || result.reasoning.includes('carbohydrate')) {
        if (ingredientText.includes('biscuit') || ingredientText.includes('cookie')) {
          alternatives.push({
            name: 'Sugar-free digestive biscuits',
            reason: 'Contains no added sugars, suitable for diabetic diet',
            category: 'Biscuits & Cookies',
            benefits: ['Zero added sugar', 'High fiber content', 'Diabetes-friendly'],
            productType: 'biscuit'
          });
        } else if (ingredientText.includes('chocolate') || ingredientText.includes('candy')) {
          alternatives.push({
            name: 'Dark chocolate (85% cacao or higher)',
            reason: 'Lower sugar content and rich in antioxidants',
            category: 'Confectionery',
            benefits: ['Lower sugar', 'Rich in antioxidants', 'Heart-healthy'],
            productType: 'chocolate'
          });
        } else if (ingredientText.includes('cereal') || ingredientText.includes('breakfast')) {
          alternatives.push({
            name: 'Steel-cut oats or quinoa flakes',
            reason: 'Whole grains with no added sugars',
            category: 'Breakfast Cereals',
            benefits: ['No added sugar', 'High protein', 'Sustained energy'],
            productType: 'cereal'
          });
        } else {
          alternatives.push({
            name: 'Stevia-sweetened version of similar products',
            reason: 'Natural sweetener that doesn\'t affect blood sugar',
            category: 'Sugar Alternatives',
            benefits: ['Natural sweetening', 'Zero calories', 'Blood sugar friendly'],
            productType: 'sweetener'
          });
        }
      }
      
      // Sodium-related issues
      if (result.reasoning.includes('sodium') || result.reasoning.includes('salt')) {
        if (ingredientText.includes('chips') || ingredientText.includes('crisp')) {
          alternatives.push({
            name: 'Baked vegetable chips (unsalted)',
            reason: 'Lower sodium content with natural vegetable flavors',
            category: 'Snacks',
            benefits: ['No added salt', 'Baked not fried', 'Natural flavors'],
            productType: 'chips'
          });
        } else if (ingredientText.includes('soup') || ingredientText.includes('broth')) {
          alternatives.push({
            name: 'Low-sodium organic vegetable broth',
            reason: 'Reduced sodium with herbs for flavor',
            category: 'Soups & Broths',
            benefits: ['50% less sodium', 'Organic ingredients', 'Heart-healthy'],
            productType: 'soup'
          });
        } else {
          alternatives.push({
            name: 'Herb-seasoned version without added salt',
            reason: 'Natural herbs provide flavor without sodium',
            category: 'Low-Sodium Options',
            benefits: ['No added salt', 'Natural herbs', 'Blood pressure friendly'],
            productType: 'seasoned'
          });
        }
      }
    }
  });
  
  // Remove duplicates and limit results
  const uniqueAlternatives = alternatives.filter((alternative, index, self) => 
    index === self.findIndex(a => a.name === alternative.name)
  );
  
  return uniqueAlternatives.slice(0, 3); // Limit to 3 specific alternatives
}
