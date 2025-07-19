import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
import { Input } from './components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';

export default function App() {
  const [bananaCount, setBananaCount] = useState(3);
  const [gramAmount, setGramAmount] = useState(360); // 3 bananas * 120g
  const [isMetric, setIsMetric] = useState(true);
  const [inputError, setInputError] = useState('');
  const [isEditingBananaCount, setIsEditingBananaCount] = useState(false);
  const [editingBananaValue, setEditingBananaValue] = useState('3');
  const [recipeAnnouncement, setRecipeAnnouncement] = useState('');
  const mainContentRef = useRef(null);
  const bananaInputRef = useRef(null);

  // Enhanced fraction conversion for cooking measurements
  const toFraction = useCallback((decimal) => {
    if (decimal === 0) return '0';
    
    const fractions = [
      { decimal: 0.0625, fraction: '1/16' },
      { decimal: 0.125, fraction: '1/8' },
      { decimal: 0.1667, fraction: '1/6' },
      { decimal: 0.1875, fraction: '3/16' },
      { decimal: 0.25, fraction: '1/4' },
      { decimal: 0.3125, fraction: '5/16' },
      { decimal: 0.3333, fraction: '1/3' },
      { decimal: 0.375, fraction: '3/8' },
      { decimal: 0.4167, fraction: '5/12' },
      { decimal: 0.5, fraction: '1/2' },
      { decimal: 0.5625, fraction: '9/16' },
      { decimal: 0.625, fraction: '5/8' },
      { decimal: 0.6667, fraction: '2/3' },
      { decimal: 0.6875, fraction: '11/16' },
      { decimal: 0.75, fraction: '3/4' },
      { decimal: 0.8125, fraction: '13/16' },
      { decimal: 0.8333, fraction: '5/6' },
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
      return closestFraction;
    }
    
    // If no close match, round to nearest 1/16
    const sixteenths = Math.round(remainder * 16);
    if (sixteenths === 0) {
      return wholeNumber.toString();
    } else if (sixteenths === 16) {
      return (wholeNumber + 1).toString();
    } else {
      const simplifiedFraction = simplifyFraction(sixteenths, 16);
      if (wholeNumber > 0) {
        return `${wholeNumber} ${simplifiedFraction}`;
      }
      return simplifiedFraction;
    }
  }, []);

  const simplifyFraction = useCallback((numerator, denominator) => {
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
  }, []);

  // Precise formula per banana (120g each)
  const perBananaFormula = {
    banana: 120, flour: 60, sugar: 50, butter: 28, bakingSoda: 1.5, salt: 0.75, vanilla: 1.25, cinnamon: 0.5,
    nuts: 17.5, chocolate: 17.5
  };

  const usConversions = {
    banana: 0.5, flour: 0.5, sugar: 0.25, butter: 2, bakingSoda: 0.25, salt: 0.125, vanilla: 0.25, cinnamon: 0.125,
    nuts: 2, chocolate: 2
  };

  const scaledRecipe = useMemo(() => {
    const eggs = bananaCount * 0.5;

    return {
      banana: { metric: perBananaFormula.banana * bananaCount, us: usConversions.banana * bananaCount },
      flour: { metric: perBananaFormula.flour * bananaCount, us: usConversions.flour * bananaCount },
      sugar: { metric: perBananaFormula.sugar * bananaCount, us: usConversions.sugar * bananaCount },
      butter: { metric: perBananaFormula.butter * bananaCount, us: usConversions.butter * bananaCount },
      eggs: eggs,
      bakingSoda: { metric: perBananaFormula.bakingSoda * bananaCount, us: usConversions.bakingSoda * bananaCount },
      salt: { metric: perBananaFormula.salt * bananaCount, us: usConversions.salt * bananaCount },
      vanilla: { metric: perBananaFormula.vanilla * bananaCount, us: usConversions.vanilla * bananaCount },
      cinnamon: { metric: perBananaFormula.cinnamon * bananaCount, us: usConversions.cinnamon * bananaCount },
      nuts: { metric: perBananaFormula.nuts * bananaCount, us: usConversions.nuts * bananaCount },
      chocolate: { metric: perBananaFormula.chocolate * bananaCount, us: usConversions.chocolate * bananaCount }
    };
  }, [bananaCount]);

  const getBananaStatus = useCallback(() => {
    if (bananaCount === 69) {
      return { message: "Nice.", emoji: "😎" };
    }
    if (bananaCount === 1) {
      return { message: "Lonely banana", emoji: "🍌" };
    }
    if (bananaCount <= 3) {
      return { message: "Perfect portion", emoji: "✨" };
    }
    if (bananaCount <= 6) {
      return { message: "Family loaf", emoji: "🏠" };
    }
    if (bananaCount <= 12) {
      return { message: "Baker mode", emoji: "👩‍🍳" };
    }
    if (bananaCount <= 30) {
      return { message: "Banana empire", emoji: "👑" };
    }
    return { message: "Banana legend", emoji: "🦸‍♀️" };
  }, [bananaCount]);

  const getBakingInfo = useCallback(() => {
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
      time,
      loafCount: bananaCount <= 6 ? 1 : Math.ceil(bananaCount / 5)
    };
  }, [bananaCount, isMetric]);

  const getIngredientAmount = useCallback((ingredient) => {
    const amounts = {
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
  }, [scaledRecipe, isMetric, toFraction]);

  // Input validation for banana count
  const handleBananaCountChange = useCallback((value) => {
    const numValue = parseInt(value) || 1;
    if (numValue < 1) {
      setInputError('Please enter at least 1 banana');
      setBananaCount(1);
      setGramAmount(120);
    } else if (numValue > 100) {
      setInputError('Maximum 100 bananas supported');
      setBananaCount(100);
      setGramAmount(12000);
    } else {
      setInputError('');
      setBananaCount(numValue);
      setGramAmount(numValue * 120);
      // Announce recipe update for screen readers
      const status = getBananaStatus();
      setRecipeAnnouncement(`Recipe updated for ${numValue} banana${numValue !== 1 ? 's' : ''}. Status: ${status.message}`);
      setTimeout(() => setRecipeAnnouncement(''), 3000);
    }
  }, [getBananaStatus]);

  // New gram input handler
  const handleGramChange = useCallback((value) => {
    const numValue = parseInt(value) || 120;
    if (numValue < 120) {
      setInputError('Minimum 120g (1 banana) required');
      setGramAmount(120);
      setBananaCount(1);
    } else if (numValue > 12000) {
      setInputError('Maximum 12000g (100 bananas) supported');
      setGramAmount(12000);
      setBananaCount(100);
    } else {
      setInputError('');
      setGramAmount(numValue);
      setBananaCount(Math.round(numValue / 120));
    }
  }, []);

  // Handle clicking on banana count to edit
  const handleBananaCountClick = useCallback(() => {
    setIsEditingBananaCount(true);
    setEditingBananaValue(bananaCount.toString());
    setTimeout(() => {
      if (bananaInputRef.current) {
        bananaInputRef.current.focus();
        bananaInputRef.current.select();
      }
    }, 0);
  }, [bananaCount]);

  // Handle direct banana count input
  const handleDirectBananaCountChange = useCallback((value) => {
    setEditingBananaValue(value);
  }, []);

  // Handle confirming banana count edit
  const handleBananaCountConfirm = useCallback(() => {
    const numValue = parseInt(editingBananaValue) || 1;
    handleBananaCountChange(numValue);
    setIsEditingBananaCount(false);
  }, [editingBananaValue, handleBananaCountChange]);

  // Handle canceling banana count edit
  const handleBananaCountCancel = useCallback(() => {
    setIsEditingBananaCount(false);
    setEditingBananaValue(bananaCount.toString());
  }, [bananaCount]);

  // Handle key presses in banana count input
  const handleBananaCountKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleBananaCountConfirm();
    } else if (e.key === 'Escape') {
      handleBananaCountCancel();
    }
  }, [handleBananaCountConfirm, handleBananaCountCancel]);

  // Skip to main content handler
  const skipToMain = useCallback(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus({ preventScroll: false });
      mainContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const status = getBananaStatus();
  const bakingInfo = getBakingInfo();

  // Define ingredient arrays using useMemo for performance
  const wetIngredients = useMemo(() => [
    { name: 'Mashed bananas', value: getIngredientAmount('banana') },
    { name: 'Sugar', value: getIngredientAmount('sugar') },
    { name: 'Melted butter', value: getIngredientAmount('butter') },
    { name: 'Eggs', value: getIngredientAmount('eggs') },
    { name: 'Vanilla extract', value: getIngredientAmount('vanilla') }
  ], [getIngredientAmount]);

  const dryIngredients = useMemo(() => [
    { name: 'All-purpose flour', value: getIngredientAmount('flour') },
    { name: 'Baking soda', value: getIngredientAmount('bakingSoda') },
    { name: 'Salt', value: getIngredientAmount('salt') },
    { name: 'Cinnamon (optional)', value: getIngredientAmount('cinnamon') }
  ], [getIngredientAmount]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen" style={{backgroundColor: '#F5F0E1'}}>
        {/* Screen Reader Announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
          role="status"
        >
          {recipeAnnouncement}
        </div>
        
        {/* Skip Navigation */}
        <a 
          href="#main-content" 
          onClick={skipToMain}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded font-semibold z-50"
        >
          Skip to main content
        </a>

        {/* Header */}
        <header className="py-8 text-center" style={{backgroundColor: '#FFF8E7'}}>
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl mb-2" style={{fontFamily: 'Yellowtail, cursive', color: '#6F4E37'}}>
              Banana Bread Calculator
            </h1>
            <p className="text-gray-600">
              Turn your overripe banana horde into something delicious.
            </p>
          </div>
        </header>

        <main 
          id="main-content"
          ref={mainContentRef}
          className="max-w-4xl mx-auto px-4 pb-8"
          style={{backgroundColor: '#FFF8E7'}}
          tabIndex={-1}
          role="main"
        >
          {/* Hero Banana Counter */}
          <section className="mb-8">
            <div 
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFD45C 0%, #FFF2B8 30%, #FFD45C 70%, rgba(111, 78, 55, 0.3) 100%)',
                border: '2px solid #FFD45C'
              }}
            >
              <Badge 
                className="mb-6 px-4 py-2 text-base bg-white/95 text-deep-brown border-2 border-deep-brown shadow-sm font-semibold"
                style={{color: '#6F4E37'}}
              >
                <span className="mr-2">{status.emoji}</span>
                {status.message}
              </Badge>

              <div className="flex items-center justify-center gap-6 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBananaCountChange(bananaCount - 1)}
                  className="h-16 w-16 rounded-full border-2 bg-white/95 hover:bg-deep-brown hover:text-white shadow"
                  style={{borderColor: '#6F4E37', color: '#6F4E37'}}
                  disabled={bananaCount <= 1}
                >
                  <Minus className="h-8 w-8" />
                </Button>
                
                <div className="text-center">
                  {isEditingBananaCount ? (
                    <div className="relative">
                      <Input
                        ref={bananaInputRef}
                        type="number"
                        min="1"
                        max="100"
                        value={editingBananaValue}
                        onChange={(e) => handleDirectBananaCountChange(e.target.value)}
                        onBlur={handleBananaCountConfirm}
                        onKeyDown={handleBananaCountKeyDown}
                        className="w-64 h-40 text-center font-bold bg-transparent border-none focus:ring-0 text-8xl"
                        style={{color: '#6F4E37'}}
                      />
                    </div>
                  ) : (
                    <div 
                      className="text-8xl font-bold leading-none mb-2 cursor-pointer hover:scale-105 transition-all duration-300 select-none"
                      style={{color: '#6F4E37', textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'}}
                      onClick={handleBananaCountClick}
                      role="button"
                      tabIndex={0}
                    >
                      {bananaCount}
                    </div>
                  )}
                  <div 
                    className="text-lg font-semibold bg-white/85 rounded-full px-4 py-2 shadow-sm border"
                    style={{color: '#6F4E37', borderColor: 'rgba(111, 78, 55, 0.2)'}}
                  >
                    banana{bananaCount !== 1 ? 's' : ''} • {Math.round(bananaCount * 120)}g
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBananaCountChange(bananaCount + 1)}
                  className="h-16 w-16 rounded-full border-2 bg-white/95 hover:bg-deep-brown hover:text-white shadow"
                  style={{borderColor: '#6F4E37', color: '#6F4E37'}}
                  disabled={bananaCount >= 100}
                >
                  <Plus className="h-8 w-8" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center bg-white/95 rounded-full border px-4 py-2" style={{borderColor: 'rgba(111, 78, 55, 0.3)'}}>
                  <label className="text-sm font-semibold" style={{color: '#6F4E37'}}>
                    Total weight:
                  </label>
                  <Input
                    type="number"
                    min="120"
                    max="12000"
                    step="10"
                    value={gramAmount}
                    onChange={(e) => handleGramChange(e.target.value)}
                    className="w-16 text-center border-0 bg-transparent font-semibold focus:ring-0 p-0 mx-2"
                    style={{color: '#6F4E37'}}
                  />
                  <span className="text-sm font-bold" style={{color: '#6F4E37'}}>
                    g
                  </span>
                </div>
                
                <Dialog>
                  <DialogTrigger className="text-sm flex items-center gap-1 bg-white/85 rounded-full px-3 py-2 border font-medium transition-all duration-200 shadow-sm hover:bg-deep-brown hover:text-white" style={{color: '#6F4E37', borderColor: 'rgba(111, 78, 55, 0.3)'}}>
                    <HelpCircle className="h-4 w-4" />
                    Banana sizes
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Banana Size Guide</DialogTitle>
                      <DialogDescription>
                        This calculator assumes 120g medium bananas. Enter your total banana weight in grams for precise calculations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Size Chart</h4>
                        <div className="space-y-1 text-sm">
                          <div>Small: ~100g (6-6.5")</div>
                          <div className="font-semibold">Medium: ~120g (7-8") ⭐</div>
                          <div>Large: ~140g (8-9")</div>
                          <div>X-Large: ~160g (9.5")</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Quick Tips</h4>
                        <div className="space-y-1 text-sm">
                          <div><strong>Weigh your bananas:</strong> Most accurate method</div>
                          <div><strong>No scale?</strong> Use the size guide</div>
                          <div><strong>Mixed sizes?</strong> Enter total weight</div>
                          <div><strong>Quick entry:</strong> Click the big number!</div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {inputError && (
                <div 
                  className="text-sm text-red-600 mt-2 bg-white/90 rounded px-3 py-1 inline-block border border-red-300 font-medium"
                  role="alert"
                >
                  {inputError}
                </div>
              )}
            </div>
          </section>

          {/* Desktop Layout - Side by Side */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 mb-8">
            {/* Recipe Card - Left Side */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{borderColor: '#E6D5B8'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{color: '#6F4E37'}}>
                  Your Recipe
                </h2>
                <ToggleGroup 
                  type="single" 
                  value={isMetric ? "metric" : "us"} 
                  onValueChange={(value) => setIsMetric(value === "metric")}
                  className="rounded-full p-1 border"
                  style={{backgroundColor: 'rgba(255, 212, 92, 0.2)', borderColor: 'rgba(255, 212, 92, 0.3)'}}
                >
                  <ToggleGroupItem 
                    value="metric" 
                    className="px-3 py-1 text-sm rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-0"
                  >
                    Metric
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="us" 
                    className="px-3 py-1 text-sm rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-0"
                  >
                    US
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Wet Ingredients */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{color: '#6F4E37'}}>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#FFD45C'}}></div>
                  Wet Ingredients
                </h3>
                <div className="space-y-2">
                  {wetIngredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                      <span style={{color: '#6F4E37'}}>{ingredient.name}</span>
                      <span className="font-semibold tabular-nums" style={{color: '#6F4E37'}}>
                        {ingredient.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dry Ingredients */}
              <div className="mb-6">
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{color: '#6F4E37'}}>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C9DAB7'}}></div>
                  Dry Ingredients
                </h3>
                <div className="space-y-2">
                  {dryIngredients.map((ingredient, index) => (
                    <div key={index} className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                      <span style={{color: '#6F4E37'}}>{ingredient.name}</span>
                      <span className="font-semibold tabular-nums" style={{color: '#6F4E37'}}>
                        {ingredient.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Add-ins */}
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{color: '#6F4E37'}}>
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#E8F0E1'}}></div>
                  Optional Add-ins
                </h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                    <span className="text-gray-600">Chopped nuts</span>
                    <span className="font-medium tabular-nums" style={{color: '#6F4E37'}}>
                      {getIngredientAmount('nuts')}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                    <span className="text-gray-600">Chocolate chips</span>
                    <span className="font-medium tabular-nums" style={{color: '#6F4E37'}}>
                      {getIngredientAmount('chocolate')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Baking Info and Quick Method */}
            <div className="space-y-6">
              {/* Baking Info */}
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{borderColor: '#E6D5B8'}}>
                <h3 className="text-base font-bold mb-4" style={{color: '#6F4E37'}}>
                  Baking Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pan size</span>
                    <span className="font-medium text-right" style={{color: '#6F4E37'}}>{bakingInfo.panSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature</span>
                    <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batter weight</span>
                    <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.batterWeight}</span>
                  </div>
                </div>
              </div>

              {/* Quick Method */}
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{borderColor: '#E6D5B8'}}>
                <h3 className="text-base font-bold mb-4" style={{color: '#6F4E37'}}>
                  Quick Method
                </h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>
                    <strong>1.</strong> Preheat oven to <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.temp}</span>
                  </li>
                  <li><strong>2.</strong> Mash bananas, mix with wet ingredients</li>
                  <li><strong>3.</strong> Combine dry ingredients separately</li>
                  <li><strong>4.</strong> Mix wet and dry until just combined</li>
                  <li>
                    <strong>5.</strong> Pour into greased pan, bake <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.time}</span>
                  </li>
                  <li><strong>6.</strong> Cool before removing from pan</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="lg:hidden space-y-6">
            {/* Recipe Card - Full Width on Mobile */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{borderColor: '#E6D5B8'}}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{color: '#6F4E37'}}>
                  Your Recipe
                </h2>
                <ToggleGroup 
                  type="single" 
                  value={isMetric ? "metric" : "us"} 
                  onValueChange={(value) => setIsMetric(value === "metric")}
                  className="rounded-full p-1 border"
                  style={{backgroundColor: 'rgba(255, 212, 92, 0.2)', borderColor: 'rgba(255, 212, 92, 0.3)'}}
                >
                  <ToggleGroupItem 
                    value="metric" 
                    className="px-3 py-1 text-sm rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-0"
                  >
                    Metric
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="us" 
                    className="px-3 py-1 text-sm rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border-0"
                  >
                    US
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* All ingredients sections for mobile */}
              <div className="space-y-6">
                {/* Wet Ingredients */}
                <div>
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{color: '#6F4E37'}}>
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#FFD45C'}}></div>
                    Wet Ingredients
                  </h3>
                  <div className="space-y-2">
                    {wetIngredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                        <span style={{color: '#6F4E37'}}>{ingredient.name}</span>
                        <span className="font-semibold tabular-nums" style={{color: '#6F4E37'}}>
                          {ingredient.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dry Ingredients */}
                <div>
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{color: '#6F4E37'}}>
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#C9DAB7'}}></div>
                    Dry Ingredients
                  </h3>
                  <div className="space-y-2">
                    {dryIngredients.map((ingredient, index) => (
                      <div key={index} className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                        <span style={{color: '#6F4E37'}}>{ingredient.name}</span>
                        <span className="font-semibold tabular-nums" style={{color: '#6F4E37'}}>
                          {ingredient.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Add-ins */}
                <div>
                  <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{color: '#6F4E37'}}>
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#E8F0E1'}}></div>
                    Optional Add-ins
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                      <span className="text-gray-600">Chopped nuts</span>
                      <span className="font-medium tabular-nums" style={{color: '#6F4E37'}}>
                        {getIngredientAmount('nuts')}
                      </span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto] items-center py-2 text-sm">
                      <span className="text-gray-600">Chocolate chips</span>
                      <span className="font-medium tabular-nums" style={{color: '#6F4E37'}}>
                        {getIngredientAmount('chocolate')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Baking Info - Mobile */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{borderColor: '#E6D5B8'}}>
              <h3 className="text-base font-bold mb-4" style={{color: '#6F4E37'}}>
                Baking Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pan size</span>
                  <span className="font-medium text-right" style={{color: '#6F4E37'}}>{bakingInfo.panSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.temp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batter weight</span>
                  <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.batterWeight}</span>
                </div>
              </div>
            </div>

            {/* Quick Method - Mobile */}
            <div className="bg-white rounded-xl border p-6 shadow-sm" style={{borderColor: '#E6D5B8'}}>
              <h3 className="text-base font-bold mb-4" style={{color: '#6F4E37'}}>
                Quick Method
              </h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong>1.</strong> Preheat oven to <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.temp}</span>
                </li>
                <li><strong>2.</strong> Mash bananas, mix with wet ingredients</li>
                <li><strong>3.</strong> Combine dry ingredients separately</li>
                <li><strong>4.</strong> Mix wet and dry until just combined</li>
                <li>
                  <strong>5.</strong> Pour into greased pan, bake <span className="font-medium" style={{color: '#6F4E37'}}>{bakingInfo.time}</span>
                </li>
                <li><strong>6.</strong> Cool before removing from pan</li>
              </ol>
            </div>
          </div>

          {/* Pro Tip - Full Width */}
          <div className="rounded-xl border p-4 shadow-sm" style={{backgroundColor: '#FFF2B8', borderColor: 'rgba(255, 212, 92, 0.3)'}}>
            <h4 className="font-semibold mb-2" style={{color: '#6F4E37'}}>
              <span role="img" aria-label="Light bulb">💡</span> Pro Tip
            </h4>
            <p className="text-sm" style={{color: '#6F4E37'}}>
              The more brown spots on your bananas, the sweeter your bread will be!
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 mt-12 text-center border-t" style={{backgroundColor: '#F5F0E1', borderColor: 'rgba(230, 213, 184, 0.3)'}}>
          <div className="max-w-4xl mx-auto px-4">
            <p className="text-sm text-gray-600">
              Made with <span role="img" aria-label="bread">🍞</span> by{' '}
              <a 
                href="https://titania.co.nz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium hover:text-primary"
                style={{color: '#6F4E37'}}
              >
                Steph
              </a>.
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}