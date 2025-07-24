import React, { useState, useCallback } from 'react';
import { BananaSizeGuide } from './components/BananaSizeGuide';

export default function App() {
  const [bananaCount, setBananaCount] = useState(3);
  const [gramAmount, setGramAmount] = useState(360);
  const [isMetric, setIsMetric] = useState(true);
  const [inputError, setInputError] = useState('');
  const [isEditingCount, setIsEditingCount] = useState(false);
  const [tempCountValue, setTempCountValue] = useState('');
  const [customMixins, setCustomMixins] = useState<Array<{ id: string; name: string; baseAmount: number; unit: string }>>([]);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newCustomMixin, setNewCustomMixin] = useState({ name: '', baseAmount: 0, unit: 'g' });
  const [isBananaSizeGuideOpen, setIsBananaSizeGuideOpen] = useState(false);

  // Enhanced fraction conversion for cooking measurements
  const toFraction = useCallback((decimal: number): string => {
    if (decimal === 0) return '0';
    
    const fractions = [
      { decimal: 0.125, fraction: '1/8' },
      { decimal: 0.25, fraction: '1/4' },
      { decimal: 0.3333, fraction: '1/3' },
      { decimal: 0.375, fraction: '3/8' },
      { decimal: 0.5, fraction: '1/2' },
      { decimal: 0.625, fraction: '5/8' },
      { decimal: 0.6667, fraction: '2/3' },
      { decimal: 0.75, fraction: '3/4' },
      { decimal: 0.875, fraction: '7/8' }
    ];

    const wholeNumber = Math.floor(decimal);
    const remainder = decimal - wholeNumber;
    
    if (remainder < 0.01) {
      return wholeNumber.toString();
    }
    
    let closestFraction = null;
    let closestDiff = Infinity;
    
    for (const frac of fractions) {
      const diff = Math.abs(remainder - frac.decimal);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestFraction = frac.fraction;
      }
    }
    
    if (closestDiff < 0.03) {
      if (wholeNumber > 0) {
        return `${wholeNumber} ${closestFraction}`;
      }
      return closestFraction || '';
    }
    
    return decimal.toFixed(1);
  }, []);

  // Recipe calculations
  const perBananaFormula = {
    banana: 120, flour: 60, sugar: 50, butter: 28, bakingSoda: 1.5, salt: 0.75, vanilla: 1.25, cinnamon: 0.5,
    nuts: 17.5, chocolate: 17.5
  };

  const usConversions = {
    banana: 0.5, flour: 0.5, sugar: 0.25, butter: 2, bakingSoda: 0.25, salt: 0.125, vanilla: 0.25, cinnamon: 0.125,
    nuts: 2, chocolate: 2
  };

  const scaledRecipe = {
    banana: { metric: perBananaFormula.banana * bananaCount, us: usConversions.banana * bananaCount },
    flour: { metric: perBananaFormula.flour * bananaCount, us: usConversions.flour * bananaCount },
    sugar: { metric: perBananaFormula.sugar * bananaCount, us: usConversions.sugar * bananaCount },
    butter: { metric: perBananaFormula.butter * bananaCount, us: usConversions.butter * bananaCount },
    eggs: bananaCount * 0.5,
    bakingSoda: { metric: perBananaFormula.bakingSoda * bananaCount, us: usConversions.bakingSoda * bananaCount },
    salt: { metric: perBananaFormula.salt * bananaCount, us: usConversions.salt * bananaCount },
    vanilla: { metric: perBananaFormula.vanilla * bananaCount, us: usConversions.vanilla * bananaCount },
    cinnamon: { metric: perBananaFormula.cinnamon * bananaCount, us: usConversions.cinnamon * bananaCount },
    nuts: { metric: perBananaFormula.nuts * bananaCount, us: usConversions.nuts * bananaCount },
    chocolate: { metric: perBananaFormula.chocolate * bananaCount, us: usConversions.chocolate * bananaCount }
  };

  const getBananaStatus = () => {
    if (bananaCount === 69) return { message: "Nice.", emoji: "😎" };
    if (bananaCount === 1) return { message: "Lonely banana", emoji: "🍌" };
    if (bananaCount <= 3) return { message: "Perfect portion", emoji: "✨" };
    if (bananaCount <= 6) return { message: "Family loaf", emoji: "🏠" };
    if (bananaCount <= 12) return { message: "Baker mode", emoji: "👩‍🍳" };
    if (bananaCount <= 30) return { message: "Banana empire", emoji: "👑" };
    return { message: "Banana legend", emoji: "🦸‍♀️" };
  };

  const getBakingInfo = () => {
    const batterWeight = Math.round(bananaCount * 260);
    let panInfo, temp = isMetric ? "175°C" : "350°F", time;
    
    if (bananaCount <= 2) {
      panInfo = isMetric ? "Mini loaf (15cm)" : "Mini loaf (6in)";
      time = "35-40 min";
    } else if (bananaCount <= 4) {
      panInfo = isMetric ? "Standard loaf (21×11cm)" : "Standard loaf (8×4in)";
      time = "45-55 min";
    } else if (bananaCount <= 6) {
      panInfo = isMetric ? "Large loaf (23×13cm)" : "Large loaf (9×5in)";
      time = "55-65 min";
    } else {
      const loaves = Math.ceil(bananaCount / 5);
      panInfo = `${loaves} large loaves`;
      time = "55-65 min each";
    }
    
    return { 
      panSize: panInfo, 
      batterWeight: isMetric ? `${batterWeight}g` : `${Math.round(batterWeight / 454)} lbs`, 
      temp, 
      time
    };
  };

  const getIngredientAmount = (ingredient: string) => {
    const amounts: { [key: string]: string } = {
      banana: isMetric ? `${Math.round(scaledRecipe.banana.metric)}g` : `${toFraction(scaledRecipe.banana.us)} cups`,
      flour: isMetric ? `${Math.round(scaledRecipe.flour.metric)}g` : `${toFraction(scaledRecipe.flour.us)} cups`,
      sugar: isMetric ? `${Math.round(scaledRecipe.sugar.metric)}g` : `${toFraction(scaledRecipe.sugar.us)} cups`,
      butter: isMetric ? `${Math.round(scaledRecipe.butter.metric)}g` : `${toFraction(scaledRecipe.butter.us)} tbsp`,
      eggs: scaledRecipe.eggs % 1 === 0 ? `${scaledRecipe.eggs} ${scaledRecipe.eggs === 1 ? 'egg' : 'eggs'}` : `${toFraction(scaledRecipe.eggs)} eggs`,
      vanilla: isMetric ? `${scaledRecipe.vanilla.metric.toFixed(1)} mL` : `${toFraction(scaledRecipe.vanilla.us)} tsp`,
      bakingSoda: isMetric ? `${scaledRecipe.bakingSoda.metric.toFixed(1)}g` : `${toFraction(scaledRecipe.bakingSoda.us)} tsp`,
      salt: isMetric ? `${scaledRecipe.salt.metric.toFixed(1)}g` : `${toFraction(scaledRecipe.salt.us)} tsp`,
      cinnamon: isMetric ? `${scaledRecipe.cinnamon.metric.toFixed(1)}g` : `${toFraction(scaledRecipe.cinnamon.us)} tsp`,
      nuts: isMetric ? `${Math.round(scaledRecipe.nuts.metric)}g` : `${toFraction(scaledRecipe.nuts.us)} tbsp`,
      chocolate: isMetric ? `${Math.round(scaledRecipe.chocolate.metric)}g` : `${toFraction(scaledRecipe.chocolate.us)} tbsp`
    };
    return amounts[ingredient] || '';
  };

  const handleBananaCountChange = (value: number) => {
    const numValue = Math.max(1, Math.min(100, value));
    setBananaCount(numValue);
    setGramAmount(numValue * 120);
    setInputError('');
  };

  const handleGramChange = (value: string) => {
    if (value === '') {
      setGramAmount(0);
      setInputError('');
      return;
    }
    
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setInputError('Please enter a valid number');
      return;
    }
    
    if (numValue < 360) {
      setInputError('Minimum 360g (3 bananas) required');
    } else if (numValue > 12000) {
      setInputError('Maximum 12000g (100 bananas) supported');
    } else {
      setInputError('');
      setBananaCount(Math.round(numValue / 120));
    }
    
    setGramAmount(numValue);
  };

  const handleCountClick = () => {
    setIsEditingCount(true);
    setTempCountValue(bananaCount.toString());
  };

  const handleCountInputChange = (value: string) => {
    setTempCountValue(value);
  };

  const handleCountInputBlur = () => {
    const numValue = parseInt(tempCountValue);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      handleBananaCountChange(numValue);
    }
    setIsEditingCount(false);
  };

  const handleCountInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCountInputBlur();
    } else if (e.key === 'Escape') {
      setIsEditingCount(false);
    }
  };
  const status = getBananaStatus();
  const bakingInfo = getBakingInfo();

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
    { name: 'Chocolate chips', value: getIngredientAmount('chocolate') },
    ...customMixins.filter(mixin => mixin.name && mixin.baseAmount > 0).map(mixin => ({
      name: mixin.name,
      value: isMetric 
        ? `${Math.round(mixin.baseAmount * bananaCount)}${mixin.unit}`
        : `${toFraction(mixin.baseAmount * bananaCount / (mixin.unit === 'g' ? 14.3 : mixin.unit === 'ml' ? 4.93 : 1))} ${mixin.unit === 'g' ? 'tbsp' : mixin.unit === 'ml' ? 'tsp' : mixin.unit}`,
      isCustom: true,
      id: mixin.id
    }))
  ];

  const handleNewCustomMixinChange = (field: string, value: string | number) => {
    setNewCustomMixin(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCustomMixin = () => {
    if (newCustomMixin.name && newCustomMixin.baseAmount > 0) {
      const newMixin = {
        ...newCustomMixin,
        id: Date.now().toString()
      };
      setCustomMixins(prev => [...prev, newMixin]);
      setNewCustomMixin({ name: '', baseAmount: 0, unit: 'g' });
      setShowAddCustom(false);
    }
  };

  const removeCustomMixin = (id: string) => {
    setCustomMixins(prev => prev.filter(mixin => mixin.id !== id));
  };

  const toggleAddCustom = () => {
    setShowAddCustom(!showAddCustom);
    if (!showAddCustom) {
      setNewCustomMixin({ name: '', baseAmount: 0, unit: 'g' });
    }
  };
  const methodSteps = [
    `Preheat oven to ${bakingInfo.temp}`,
    'Mash bananas, mix with wet ingredients',
    'Combine dry ingredients separately',
    'Mix wet and dry until just combined',
    `Pour into greased pan, bake ${bakingInfo.time}`,
    'Cool before removing from pan'
  ];

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>Banana Bread Calculator</h1>
          <p>Turn your overripe banana horde into something delicious.</p>
        </div>
      </header>

      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="status-badge">
            <span>{status.emoji}</span> {status.message}
          </div>

          <div className="counter-section">
            <button
              className="counter-btn"
              onClick={() => handleBananaCountChange(bananaCount - 1)}
              disabled={bananaCount <= 1}
            >
              −
            </button>
            
            <div className="counter-display">
              {isEditingCount ? (
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempCountValue}
                  onChange={(e) => handleCountInputChange(e.target.value)}
                  onBlur={handleCountInputBlur}
                  onKeyDown={handleCountInputKeyDown}
                  autoFocus
                  style={{
                    fontSize: '96px',
                    fontWeight: '700',
                    color: '#6F4E37',
                    lineHeight: '1',
                    background: '#FFFFFF',
                    border: '2px solid #6F4E37',
                    borderRadius: '8px',
                    textAlign: 'center',
                    width: '200px',
                    padding: '8px',
                    outline: 'none'
                  }}
                />
              ) : (
                <div 
                  className="counter-number"
                  onClick={handleCountClick}
                  style={{
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s ease',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.border = '2px solid #6F4E37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.border = '2px solid transparent';
                  }}
                  title="Click to edit quantity"
                >
                  {bananaCount}
                </div>
              )}
              <div className="counter-label">
                banana{bananaCount !== 1 ? 's' : ''} • {Math.round(bananaCount * 120)}g
              </div>
            </div>
            
            <button
              className="counter-btn"
              onClick={() => handleBananaCountChange(bananaCount + 1)}
              disabled={bananaCount >= 100}
            >
              +
            </button>
          </div>

          <div className="weight-input-section">
            <div className="weight-input-group">
              <label>Total weight:</label>
              <input
                type="number"
                min="360"
                max="12000"
                step="10"
                value={gramAmount || ''}
                onChange={(e) => handleGramChange(e.target.value)}
                className="weight-input"
              />
              <span className="weight-unit">g</span>
            </div>
            <button
              type="button"
              onClick={() => setIsBananaSizeGuideOpen(true)}
              className="help-link-btn"
              title="How big is your bananas?"
            >
              🔍 Banana sizes
            </button>
          </div>

          {inputError && (
            <div className="error-message">
              {inputError}
            </div>
          )}
        </section>


        {/* Main Content */}
        <div className="main-content">
          {/* Recipe Card */}
          <div className="recipe-card">
            <div className="recipe-header">
              <h2 className="recipe-title">Your Recipe</h2>
              <div className="unit-toggle">
                <button
                  className={`unit-btn ${isMetric ? 'active' : ''}`}
                  onClick={() => setIsMetric(true)}
                >
                  Metric
                </button>
                <button
                  className={`unit-btn ${!isMetric ? 'active' : ''}`}
                  onClick={() => setIsMetric(false)}
                >
                  US
                </button>
              </div>
            </div>

            {/* Wet Ingredients */}
            <div className="ingredient-section">
              <div className="section-header">
                <div className="section-dot wet"></div>
                <h3 className="section-title">Wet Ingredients</h3>
              </div>
              <ul className="ingredient-list">
                {wetIngredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-amount">{ingredient.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dry Ingredients */}
            <div className="ingredient-section">
              <div className="section-header">
                <div className="section-dot dry"></div>
                <h3 className="section-title">Dry Ingredients</h3>
              </div>
              <ul className="ingredient-list">
                {dryIngredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-amount">{ingredient.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Optional Add-ins */}
            <div className="ingredient-section">
              <div className="section-header">
                <div className="section-dot optional"></div>
                <h3 className="section-title">Optional Add-ins</h3>
              </div>
              <ul className="ingredient-list">
                {optionalAddIns.map((ingredient, index) => (
                  <li key={ingredient.id || index} className="ingredient-item optional">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="ingredient-amount">{ingredient.value}</span>
                      {ingredient.isCustom && (
                        <button
                          onClick={() => removeCustomMixin(ingredient.id)}
                          className="custom-mixin-remove-btn"
                          title="Remove custom ingredient"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </li>
                ))}
                
                {/* Custom Mixin Input */}
                {showAddCustom ? (
                  <li className="ingredient-item optional">
                    <div className="custom-mixin-form">
                      <li className="ingredient-item optional add-custom-item">
                        <span className="ingredient-name">
                          <input
                            type="text"
                            placeholder="Custom ingredient"
                            value={newCustomMixin.name}
                            onChange={(e) => handleNewCustomMixinChange('name', e.target.value)}
                            className="custom-mixin-name-input"
                          />
                        </span>
                        <span className="ingredient-amount">
                          <div className="custom-mixin-amount-group">
                            <input
                              type="number"
                              placeholder="Amount"
                              value={newCustomMixin.baseAmount || ''}
                              onChange={(e) => handleNewCustomMixinChange('baseAmount', parseFloat(e.target.value) || 0)}
                              className="custom-mixin-amount-input"
                              min="0"
                              step="0.1"
                            />
                            <select
                              value={newCustomMixin.unit}
                              onChange={(e) => handleNewCustomMixinChange('unit', e.target.value)}
                              className="custom-mixin-unit-select"
                            >
                              <option value="g">g</option>
                              <option value="ml">ml</option>
                              <option value="tsp">tsp</option>
                              <option value="tbsp">tbsp</option>
                            </select>
                          </div>
                          <button
                            onClick={addCustomMixin}
                            className="custom-mixin-add-btn"
                            title="Add custom ingredient"
                          >
                            +
                          </button>
                          <button
                            onClick={toggleAddCustom}
                            className="custom-mixin-cancel-btn"
                            title="Cancel"
                          >
                            ×
                          </button>
                        </span>
                      </li>
                    </div>
                  </li>
                ) : (
                  <li className="ingredient-item optional add-custom-item">
                    <button
                      onClick={toggleAddCustom}
                      className="add-custom-btn"
                      title="Add custom ingredient"
                    >
                      <span className="add-custom-icon">+</span>
                      <span className="add-custom-text">Add custom ingredient</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar">
            {/* Baking Info */}
            <div className="info-card">
              <h3 className="info-card-title">Baking Info</h3>
              <div className="info-item">
                <span className="info-label">Pan size</span>
                <span className="info-value">{bakingInfo.panSize}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Temperature</span>
                <span className="info-value">{bakingInfo.temp}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time</span>
                <span className="info-value">{bakingInfo.time}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Batter weight</span>
                <span className="info-value">{bakingInfo.batterWeight}</span>
              </div>
            </div>

            {/* Quick Method */}
            <div className="info-card">
              <h3 className="info-card-title">Quick Method</h3>
              <ol className="method-list">
                {methodSteps.map((step, index) => (
                  <li key={index} className="method-step">
                    <span className="method-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Pro Tip */}
            <div className="pro-tip">
              <div className="pro-tip-header">
                <div className="pro-tip-icon">💡</div>
                <div className="pro-tip-content">
                  <h4>Pro Tip</h4>
                  <p>The more brown spots on your bananas, the sweeter your bread will be!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            Made with 🍞 by{' '}
            <a href="https://github.com/titania-nz/banana-bread-calculator" target="_blank" rel="noopener noreferrer">
              Steph
            </a>
          </p>
        </div>
      </footer>

      {/* Banana Size Guide Modal */}
      <BananaSizeGuide
        isOpen={isBananaSizeGuideOpen}
        onClose={() => setIsBananaSizeGuideOpen(false)}
      />
    </div>
  );
}