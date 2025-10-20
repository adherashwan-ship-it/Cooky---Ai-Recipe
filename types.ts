export type View = 'recipe' | 'privacy' | 'about' | 'my-recipes' | 'settings';

export type TFunction = (key: string, replacements?: { [key: string]: string | number }) => string;

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
}

export interface Recipe {
  id: string;
  recipeName: string;
  prepTime: string;
  cookTime: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servingSuggestions: string;
  tipsAndVariations?: string;
  nutritionInfo: NutritionInfo;
  imageUrl: string;
  rating: number;
}