
import { NutritionData, AllergenInfo } from './types';

// Common allergens
export const commonAllergens = [
  'milk', 'dairy', 'whey', 'casein', 'lactose', 
  'egg', 'eggs',
  'peanut', 'peanuts',
  'tree nut', 'tree nuts', 'almond', 'almonds', 'hazelnut', 'hazelnuts', 'walnut', 'walnuts', 'pecan', 'pecans', 'cashew', 'cashews',
  'soy', 'soya', 'soybean', 'soybeans',
  'wheat', 'gluten',
  'fish', 'shellfish', 'crab', 'lobster', 'shrimp', 'prawn',
  'sesame', 'sesame seeds',
  'mustard',
  'celery',
  'lupine',
  'mollusc', 'mollusk', 'molluscs', 'mollusks'
];

// Parse nutrition info from OCR text
export function parseNutritionInfo(text: string): NutritionData {
  // Initialize nutrition data object
  const nutritionData: NutritionData = {
    allergens: [],
    ingredients: []
  };

  // Clean and normalize text
  const cleanText = text.toLowerCase().replace(/\s+/g, ' ');

  // Extract ingredients
  const ingredientsMatch = cleanText.match(/ingredients:?(.*?)(\.|$)/i);
  if (ingredientsMatch && ingredientsMatch[1]) {
    nutritionData.ingredients = ingredientsMatch[1]
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  // Check for allergens
  commonAllergens.forEach(allergen => {
    const allergenRegex = new RegExp(`\\b${allergen}\\b`, 'i');
    const found = allergenRegex.test(cleanText) || 
                  (nutritionData.ingredients.some(ingredient => 
                    allergenRegex.test(ingredient)
                  ));
    
    nutritionData.allergens.push({
      name: allergen,
      found: found
    });
  });

  // Extract calories
  const caloriesMatch = cleanText.match(/calories[:\s]+(\d+)/i);
  if (caloriesMatch) {
    nutritionData.calories = parseInt(caloriesMatch[1]);
  }

  // Extract carbohydrates
  const carbsMatch = cleanText.match(/total carbohydrates?[:\s]+(\d+)[\s]*(g|mg)/i);
  if (carbsMatch) {
    nutritionData.totalCarbohydrates = {
      name: 'Total Carbohydrates',
      amount: parseInt(carbsMatch[1]),
      unit: carbsMatch[2]
    };
  }

  // Extract sugars
  const sugarsMatch = cleanText.match(/sugars?[:\s]+(\d+)[\s]*(g|mg)/i);
  if (sugarsMatch) {
    nutritionData.sugars = {
      name: 'Sugars',
      amount: parseInt(sugarsMatch[1]),
      unit: sugarsMatch[2]
    };
  }

  // Extract sodium
  const sodiumMatch = cleanText.match(/sodium[:\s]+(\d+)[\s]*(mg|g)/i);
  if (sodiumMatch) {
    nutritionData.sodium = {
      name: 'Sodium',
      amount: parseInt(sodiumMatch[1]),
      unit: sodiumMatch[2]
    };
  }

  // Extract fat
  const fatMatch = cleanText.match(/total fat[:\s]+(\d+)[\s]*(g|mg)/i);
  if (fatMatch) {
    nutritionData.totalFat = {
      name: 'Total Fat',
      amount: parseInt(fatMatch[1]),
      unit: fatMatch[2]
    };
  }

  // Extract saturated fat
  const satFatMatch = cleanText.match(/saturated fat[:\s]+(\d+)[\s]*(g|mg)/i);
  if (satFatMatch) {
    nutritionData.saturatedFat = {
      name: 'Saturated Fat',
      amount: parseInt(satFatMatch[1]),
      unit: satFatMatch[2]
    };
  }

  // Extract cholesterol
  const cholesterolMatch = cleanText.match(/cholesterol[:\s]+(\d+)[\s]*(mg|g)/i);
  if (cholesterolMatch) {
    nutritionData.cholesterol = {
      name: 'Cholesterol',
      amount: parseInt(cholesterolMatch[1]),
      unit: cholesterolMatch[2]
    };
  }

  // Extract protein
  const proteinMatch = cleanText.match(/protein[:\s]+(\d+)[\s]*(g|mg)/i);
  if (proteinMatch) {
    nutritionData.protein = {
      name: 'Protein',
      amount: parseInt(proteinMatch[1]),
      unit: proteinMatch[2]
    };
  }

  return nutritionData;
}
