
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

  // Clean and normalize text - remove extra spaces and special characters
  const cleanText = text
    .toLowerCase()
    .replace(/[°©®™]/g, ' ') // Remove special symbols
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/[:\-_]/g, ' ') // Replace separators with spaces
    .trim();

  console.log("Cleaned text for parsing:", cleanText);

  // Extract ingredients with multiple patterns
  const ingredientPatterns = [
    /ingredients\s*[:\.]?\s*([^.]*?)(?:nutrition|allergen|contains|net|weight|$)/i,
    /contains\s*[:\.]?\s*([^.]*?)(?:nutrition|allergen|net|weight|$)/i,
    /made\s+with\s*[:\.]?\s*([^.]*?)(?:nutrition|allergen|net|weight|$)/i
  ];

  let foundIngredients = false;
  for (const pattern of ingredientPatterns) {
    const match = cleanText.match(pattern);
    if (match && match[1] && match[1].length > 5) {
      nutritionData.ingredients = match[1]
        .split(/[,;()&]/)
        .map(item => item.trim())
        .filter(item => item.length > 2 && !item.match(/^\d+$/))
        .slice(0, 15); // Limit to reasonable number
      
      console.log("Found ingredients:", nutritionData.ingredients);
      foundIngredients = true;
      break;
    }
  }

  if (!foundIngredients) {
    // Fallback: look for common food words in the text
    const commonFoodWords = [
      'wheat', 'flour', 'sugar', 'salt', 'oil', 'water', 'milk', 'cream', 'butter',
      'eggs', 'vanilla', 'chocolate', 'cocoa', 'nuts', 'peanuts', 'almonds',
      'rice', 'corn', 'soy', 'tomato', 'onion', 'garlic', 'spices', 'natural flavors',
      'preservatives', 'stabilizers', 'emulsifiers'
    ];
    
    const detectedIngredients = commonFoodWords.filter(word => 
      new RegExp(`\\b${word}\\b`, 'i').test(cleanText)
    );
    
    if (detectedIngredients.length > 0) {
      nutritionData.ingredients = detectedIngredients;
      console.log("Detected ingredients from text:", detectedIngredients);
    }
  }

  // Check for allergens in ingredients and full text
  commonAllergens.forEach(allergen => {
    const allergenRegex = new RegExp(`\\b${allergen}\\b`, 'i');
    const foundInText = allergenRegex.test(cleanText);
    const foundInIngredients = nutritionData.ingredients.some(ingredient => 
      allergenRegex.test(ingredient)
    );
    
    nutritionData.allergens.push({
      name: allergen,
      found: foundInText || foundInIngredients
    });
  });

  // Enhanced nutrition value extraction with multiple patterns
  const extractNutrientValue = (nutrientNames: string[], text: string) => {
    for (const name of nutrientNames) {
      // Pattern 1: "nutrient value unit"
      let pattern = new RegExp(`${name}\\s+(\\d+(?:\\.\\d+)?)\\s*(g|mg|kcal|cal)`, 'i');
      let match = text.match(pattern);
      
      if (!match) {
        // Pattern 2: "nutrient: value unit" or "nutrient value"
        pattern = new RegExp(`${name}\\s*[:\\s]+(\\d+(?:\\.\\d+)?)\\s*(g|mg|kcal|cal)?`, 'i');
        match = text.match(pattern);
      }
      
      if (!match) {
        // Pattern 3: Look for numbers near the nutrient name
        pattern = new RegExp(`${name}[^\\d]*(\\d+(?:\\.\\d+)?)`, 'i');
        match = text.match(pattern);
        if (match) {
          // Default unit based on nutrient type
          const defaultUnit = name.includes('sodium') ? 'mg' : 
                             name.includes('energy') || name.includes('calorie') ? 'kcal' : 'g';
          return {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            amount: parseFloat(match[1]),
            unit: defaultUnit
          };
        }
      }
      
      if (match) {
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          amount: parseFloat(match[1]),
          unit: match[2] || 'g'
        };
      }
    }
    return null;
  };

  // Extract calories
  const caloriesResult = extractNutrientValue(['energy', 'calories?', 'kcal'], cleanText);
  if (caloriesResult) {
    nutritionData.calories = caloriesResult.amount;
  }

  // Extract carbohydrates
  const carbsResult = extractNutrientValue(['total carbohydrate', 'carbohydrate', 'carbs'], cleanText);
  if (carbsResult) {
    nutritionData.totalCarbohydrates = carbsResult;
  }

  // Extract sugars
  const sugarsResult = extractNutrientValue(['total sugars?', 'sugars?'], cleanText);
  if (sugarsResult) {
    nutritionData.sugars = sugarsResult;
  }

  // Extract sodium
  const sodiumResult = extractNutrientValue(['sodium'], cleanText);
  if (sodiumResult) {
    nutritionData.sodium = sodiumResult;
  }

  // Extract fat
  const fatResult = extractNutrientValue(['total fat', 'fat'], cleanText);
  if (fatResult) {
    nutritionData.totalFat = fatResult;
  }

  // Extract saturated fat
  const satFatResult = extractNutrientValue(['saturated fat', 'saturater fat'], cleanText);
  if (satFatResult) {
    nutritionData.saturatedFat = satFatResult;
  }

  // Extract protein
  const proteinResult = extractNutrientValue(['protein'], cleanText);
  if (proteinResult) {
    nutritionData.protein = proteinResult;
  }

  // Extract fiber
  const fiberResult = extractNutrientValue(['dietary fiber', 'fiber', 'fibre'], cleanText);
  if (fiberResult) {
    nutritionData.dietaryFiber = fiberResult;
  }

  console.log("Final parsed nutrition data:", nutritionData);
  return nutritionData;
}
