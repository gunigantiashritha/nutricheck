
interface NutrientInfo {
  name: string;
  amount: number;
  unit: string;
}

interface AllergenInfo {
  name: string;
  found: boolean;
}

export interface NutritionData {
  calories?: number;
  totalFat?: NutrientInfo;
  saturatedFat?: NutrientInfo;
  transFat?: NutrientInfo;
  cholesterol?: NutrientInfo;
  sodium?: NutrientInfo;
  totalCarbohydrates?: NutrientInfo;
  dietaryFiber?: NutrientInfo;
  sugars?: NutrientInfo;
  addedSugars?: NutrientInfo;
  protein?: NutrientInfo;
  potassium?: NutrientInfo;
  calcium?: NutrientInfo;
  iron?: NutrientInfo;
  vitamin?: NutrientInfo;
  allergens: AllergenInfo[];
  ingredients: string[];
}

export interface HealthAnalysis {
  condition: string;
  recommendation: 'safe' | 'caution' | 'avoid';
  reasoning: string;
}

// Common allergens
const commonAllergens = [
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

// Analyze nutrition data for health conditions
export function analyzeForHealthConditions(data: NutritionData): HealthAnalysis[] {
  const results: HealthAnalysis[] = [];

  // Analyze for Diabetes
  results.push(analyzeForDiabetes(data));

  // Analyze for Hypertension
  results.push(analyzeForHypertension(data));

  // Analyze for Thyroid issues
  results.push(analyzeForThyroid(data));

  // Analyze for Food Allergies
  results.push(analyzeForAllergies(data));

  return results;
}

function analyzeForDiabetes(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No concerning ingredients found for people with diabetes.';

  // Check sugars
  if (data.sugars && data.sugars.amount > 10) {
    recommendation = 'avoid';
    reasoning = `High sugar content (${data.sugars.amount}${data.sugars.unit}) may cause blood sugar spikes.`;
  } else if (data.sugars && data.sugars.amount > 5) {
    recommendation = 'caution';
    reasoning = `Moderate sugar content (${data.sugars.amount}${data.sugars.unit}) - consume in moderation.`;
  }

  // Check carbs if sugars aren't explicitly high
  if (recommendation === 'safe' && data.totalCarbohydrates && data.totalCarbohydrates.amount > 30) {
    recommendation = 'caution';
    reasoning = `High carbohydrate content (${data.totalCarbohydrates.amount}${data.totalCarbohydrates.unit}) - monitor blood sugar after consumption.`;
  }

  // Look for high-glycemic ingredients
  const highGlycemicIngredients = ['corn syrup', 'high fructose', 'maltodextrin', 'dextrose'];
  if (data.ingredients) {
    const foundIngredients = data.ingredients.filter(ingredient => 
      highGlycemicIngredients.some(high => ingredient.includes(high))
    );
    
    if (foundIngredients.length > 0) {
      recommendation = recommendation === 'safe' ? 'caution' : 'avoid';
      reasoning += ` Contains high-glycemic ingredients: ${foundIngredients.join(', ')}.`;
    }
  }

  return {
    condition: 'Diabetes',
    recommendation,
    reasoning
  };
}

function analyzeForHypertension(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No concerning ingredients found for people with hypertension.';

  // Check sodium
  if (data.sodium) {
    if (data.sodium.amount > 400) {
      recommendation = 'avoid';
      reasoning = `High sodium content (${data.sodium.amount}${data.sodium.unit}) may increase blood pressure.`;
    } else if (data.sodium.amount > 200) {
      recommendation = 'caution';
      reasoning = `Moderate sodium content (${data.sodium.amount}${data.sodium.unit}) - consume in moderation.`;
    }
  }

  // Look for ingredients that may affect blood pressure
  const concerningIngredients = ['msg', 'monosodium glutamate', 'baking soda', 'sodium bicarbonate', 'sodium nitrate', 'sodium benzoate'];
  if (data.ingredients) {
    const foundIngredients = data.ingredients.filter(ingredient => 
      concerningIngredients.some(item => ingredient.includes(item))
    );
    
    if (foundIngredients.length > 0) {
      recommendation = recommendation === 'safe' ? 'caution' : recommendation;
      reasoning += ` Contains ingredients that may affect blood pressure: ${foundIngredients.join(', ')}.`;
    }
  }

  return {
    condition: 'Hypertension',
    recommendation,
    reasoning
  };
}

function analyzeForThyroid(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No concerning ingredients found for people with thyroid issues.';

  // Look for iodine-rich or goitrogenic ingredients
  const goitrogenicIngredients = [
    'soy', 'soybeans', 'soy protein', 'tofu', 
    'millet', 'raw kale', 'raw spinach', 'raw broccoli', 'raw cabbage', 
    'raw brussels sprouts', 'raw cauliflower'
  ];
  
  const iodineRichIngredients = [
    'seaweed', 'kelp', 'nori', 'dulse',
    'iodized salt'
  ];

  if (data.ingredients) {
    const foundGoitrogens = data.ingredients.filter(ingredient => 
      goitrogenicIngredients.some(item => ingredient.includes(item))
    );
    
    const foundIodine = data.ingredients.filter(ingredient => 
      iodineRichIngredients.some(item => ingredient.includes(item))
    );
    
    if (foundGoitrogens.length > 0) {
      recommendation = 'caution';
      reasoning = `Contains goitrogenic ingredients that may affect thyroid function: ${foundGoitrogens.join(', ')}.`;
    }
    
    if (foundIodine.length > 0) {
      if (recommendation === 'caution') {
        reasoning += ` Also contains iodine-rich ingredients: ${foundIodine.join(', ')}.`;
      } else {
        recommendation = 'caution';
        reasoning = `Contains iodine-rich ingredients that may affect thyroid function: ${foundIodine.join(', ')}.`;
      }
    }
  }

  return {
    condition: 'Thyroid Issues',
    recommendation,
    reasoning
  };
}

function analyzeForAllergies(data: NutritionData): HealthAnalysis {
  let recommendation: 'safe' | 'caution' | 'avoid' = 'safe';
  let reasoning = 'No common allergens detected.';

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
  }
  
  // Check for "may contain" statements in the ingredients
  const mayContainAllergens = data.ingredients.some(ingredient => 
    ingredient.includes('may contain') || 
    ingredient.includes('produced in a facility') || 
    ingredient.includes('processed in a facility')
  );
  
  if (mayContainAllergens) {
    recommendation = recommendation === 'safe' ? 'caution' : recommendation;
    reasoning = reasoning === 'No common allergens detected.' ? 
      'May contain traces of allergens due to processing.' : 
      reasoning + ' Product may also contain traces of other allergens due to processing.';
  }

  return {
    condition: 'Food Allergies',
    recommendation,
    reasoning
  };
}
