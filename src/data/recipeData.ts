import { RecipeData } from '../types/recipe';

export const recipeData: RecipeData[] = [
  { bananas: 1, mashedBananas: 120, flour: 60, sugar: 50, butterOil: 28, eggs: 0.5, bakingSoda: 1.5, salt: 0.75, vanillaExtract: 1.25 },
  { bananas: 2, mashedBananas: 240, flour: 120, sugar: 100, butterOil: 56, eggs: 1.0, bakingSoda: 3.0, salt: 1.5, vanillaExtract: 2.5 },
  { bananas: 3, mashedBananas: 360, flour: 180, sugar: 150, butterOil: 84, eggs: 1.5, bakingSoda: 4.5, salt: 2.25, vanillaExtract: 3.75 },
  { bananas: 4, mashedBananas: 480, flour: 240, sugar: 200, butterOil: 112, eggs: 2.0, bakingSoda: 6.0, salt: 3.0, vanillaExtract: 5.0 },
  { bananas: 5, mashedBananas: 600, flour: 300, sugar: 250, butterOil: 140, eggs: 2.5, bakingSoda: 7.5, salt: 3.75, vanillaExtract: 6.25 },
  { bananas: 6, mashedBananas: 720, flour: 360, sugar: 300, butterOil: 168, eggs: 3.0, bakingSoda: 9.0, salt: 4.5, vanillaExtract: 7.5 },
  { bananas: 7, mashedBananas: 840, flour: 420, sugar: 350, butterOil: 196, eggs: 3.5, bakingSoda: 10.5, salt: 5.25, vanillaExtract: 8.75 },
  { bananas: 8, mashedBananas: 960, flour: 480, sugar: 400, butterOil: 224, eggs: 4.0, bakingSoda: 12.0, salt: 6.0, vanillaExtract: 10.0 },
  { bananas: 9, mashedBananas: 1080, flour: 540, sugar: 450, butterOil: 252, eggs: 4.5, bakingSoda: 13.5, salt: 6.75, vanillaExtract: 11.25 },
  { bananas: 10, mashedBananas: 1200, flour: 600, sugar: 500, butterOil: 280, eggs: 5.0, bakingSoda: 15.0, salt: 7.5, vanillaExtract: 12.5 }
];

export const getRecipeForBananas = (bananaCount: number): RecipeData | null => {
  return recipeData.find(recipe => recipe.bananas === bananaCount) || null;
};

export const calculateCustomRecipe = (bananaCount: number): RecipeData => {
  const baseRecipe = recipeData[0]; // 1 banana recipe
  return {
    bananas: bananaCount,
    mashedBananas: baseRecipe.mashedBananas * bananaCount,
    flour: baseRecipe.flour * bananaCount,
    sugar: baseRecipe.sugar * bananaCount,
    butterOil: baseRecipe.butterOil * bananaCount,
    eggs: baseRecipe.eggs * bananaCount,
    bakingSoda: baseRecipe.bakingSoda * bananaCount,
    salt: baseRecipe.salt * bananaCount,
    vanillaExtract: baseRecipe.vanillaExtract * bananaCount
  };
};