// Export types and functions from the refactored nutrition module
export type { NutritionData, HealthAnalysis, HealthEffects } from './nutrition/types';
export { parseNutritionInfo, analyzeForHealthConditions } from './nutrition/index';

// Export alternatives functionality
export type { AlternativeProduct } from './nutrition/alternativesSuggester';
export { generateHealthyAlternatives } from './nutrition/alternativesSuggester';
