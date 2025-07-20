export interface RecipeData {
  bananas: number;
  mashedBananas: number;
  flour: number;
  sugar: number;
  butterOil: number;
  eggs: number;
  bakingSoda: number;
  salt: number;
  vanillaExtract: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  key: keyof RecipeData;
  category: 'wet' | 'dry' | 'optional';
}

export type UnitSystem = 'metric' | 'us';