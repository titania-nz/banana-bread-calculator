import React from 'react';
import { Switch } from './ui/switch';
import { UnitSystem } from '../types/recipe';

interface RecipeSectionProps {
  bananaCount: number;
  unitSystem: UnitSystem;
  onUnitSystemChange: (system: UnitSystem) => void;
  scaledRecipe: any;
  getIngredientAmount: (ingredient: string) => string;
}

export const RecipeSection: React.FC<RecipeSectionProps> = ({
  bananaCount,
  unitSystem,
  onUnitSystemChange,
  scaledRecipe,
  getIngredientAmount
}) => {
  // Analytics tracking for unit system changes
  const handleUnitSystemChange = (system: UnitSystem) => {
    onUnitSystemChange(system);
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'unit_system_change', {
        event_category: 'recipe_interaction',
        event_label: system,
        value: bananaCount
      });
    }
  };

  const wetIngredients = [
    { name: 'Mashed bananas', value: getIngredientAmount('banana') },
    { name: 'Sugar', value: getIngredientAmount('sugar') },
    { name: 'Melted butter', value: getIngredientAmount('butter') },
    { name: 'Eggs', value: getIngredientAmount('eggs') },
    { name: 'Vanilla extract', value: getIngredientAmount('vanilla') }
  ];

  const dryIngredients = [
    { name: 'All-purpose flour', value: getIngredientAmount('flour') },
    { name: 'Baking soda', value: getIngredientAmount('bakingSoda') },
    { name: 'Salt', value: getIngredientAmount('salt') },
    { name: 'Cinnamon (optional)', value: getIngredientAmount('cinnamon') }
  ];

  const optionalAddIns = [
    { name: 'Chopped nuts', value: getIngredientAmount('nuts') },
    { name: 'Chocolate chips', value: getIngredientAmount('chocolate') }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-deep-brown">Ingredients</h2>
        <div className="flex items-center gap-0 bg-gray-100 rounded-full p-1">
          <span 
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${unitSystem === 'metric' ? 'bg-yellow-400 text-deep-brown shadow-sm' : 'text-gray-600 hover:text-deep-brown'}`}
            onClick={() => handleUnitSystemChange('metric')}
            role="button"
            tabIndex={0}
            aria-label="Switch to metric measurements"
            aria-pressed={unitSystem === 'metric'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleUnitSystemChange('metric');
              }
            }}
          >
            Metric
          </span>
          <Switch 
            checked={unitSystem === 'metric'} 
            onCheckedChange={(checked) => handleUnitSystemChange(checked ? 'metric' : 'us')}
            aria-label={`Currently showing ${unitSystem} measurements. Toggle to switch between metric and US measurements`}
          />
          <span 
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer select-none ${unitSystem === 'us' ? 'bg-yellow-400 text-deep-brown shadow-sm' : 'text-gray-600 hover:text-deep-brown'}`}
            onClick={() => handleUnitSystemChange('us')}
            role="button"
            tabIndex={0}
            aria-label="Switch to US measurements"
            aria-pressed={unitSystem === 'us'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleUnitSystemChange('us');
              }
            }}
          >
            US
          </span>
        </div>
      </div>

      {/* Wet Ingredients */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
          <h3 className="font-medium text-deep-brown text-sm">Wet Ingredients</h3>
        </div>
        <div className="space-y-2">
          {wetIngredients.map((ingredient, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-0 border-b border-gray-100 last:border-b-0">
              <span className="text-deep-brown text-sm">{ingredient.name}</span>
              <span className="font-medium text-deep-brown tabular-nums text-sm">
                {ingredient.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dry Ingredients */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
          <h3 className="font-medium text-deep-brown text-sm">Dry Ingredients</h3>
        </div>
        <div className="space-y-2">
          {dryIngredients.map((ingredient, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-0 border-b border-gray-100 last:border-b-0">
              <span className="text-deep-brown text-sm">{ingredient.name}</span>
              <span className="font-medium text-deep-brown tabular-nums text-sm">
                {ingredient.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Add-ins */}
      <div>
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-amber-600 rounded-full mr-3"></div>
          <h3 className="font-medium text-deep-brown text-sm">Optional Add-ins</h3>
        </div>
        <div className="space-y-2">
          {optionalAddIns.map((ingredient, index) => (
            <div key={index} className="flex justify-between items-center py-2 px-0 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-500 text-sm">{ingredient.name}</span>
              <span className="font-medium text-gray-500 tabular-nums text-sm">
                {ingredient.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};