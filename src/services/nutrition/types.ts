
export interface NutrientInfo {
  name: string;
  amount: number;
  unit: string;
}

export interface AllergenInfo {
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
