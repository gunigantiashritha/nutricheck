
import { analyzeForDiabetes } from './diabetesAnalyzer';
import { analyzeForHypertension } from './hypertensionAnalyzer';
import { analyzeForThyroid } from './thyroidAnalyzer';
import { analyzeForAllergies } from './allergyAnalyzer';
import { parseNutritionInfo } from './parser';
import { NutritionData, HealthAnalysis } from './types';

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

export { parseNutritionInfo };
export type { NutritionData, HealthAnalysis, HealthEffects } from './types';
