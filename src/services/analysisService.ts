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

export interface HealthEffects {
  ingredient: string;
  effect: string;
}

export interface HealthAnalysis {
  condition: string;
  recommendation: 'safe' | 'caution' | 'avoid';
  reasoning: string;
  effects: HealthEffects[];
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

// Health effect definitions for ingredients
const diabetesIngredientEffects: Record<string, string> = {
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

const hypertensionIngredientEffects: Record<string, string> = {
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

const thyroidIngredientEffects: Record<string, string> = {
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

function analyzeForDiabetes(data: NutritionData): HealthAnalysis {
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
    // Use explicit equality check against string literal
    if (recommendation === 'safe') {
      recommendation = 'caution';
    }
    
    // Use proper string comparison
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
          // Use explicit equality check against string literal 
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

function analyzeForHypertension(data: NutritionData): HealthAnalysis {
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
          recommendation = recommendation === 'safe' ? 'caution' : recommendation;
          
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

function analyzeForThyroid(data: NutritionData): HealthAnalysis {
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

function analyzeForAllergies(data: NutritionData): HealthAnalysis {
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
    recommendation = recommendation === 'safe' ? 'caution' : recommendation;
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
