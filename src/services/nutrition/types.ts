
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
  productName?: string;  // Added for better product identification
  servingSize?: string;  // Added for context
  confidence?: number;   // Added for OCR confidence tracking
}

export interface HealthEffects {
  ingredient: string;
  effect: string;
  severity?: 'low' | 'medium' | 'high';  // Added for more granular information
}

export interface HealthAnalysis {
  condition: string;
  recommendation: 'safe' | 'caution' | 'avoid';
  reasoning: string;
  effects: HealthEffects[];
  criticalNutrients?: {  // Added for highlighting critical nutrients
    name: string;
    amount: number;
    unit: string;
    threshold: number;
    thresholdUnit: string;
  }[];
}
