import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from './components/ui/toggle-group';
import { Input } from './components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';

export default function App() {
  const [bananaCount, setBananaCount] = useState(3);
  const [isMetric, setIsMetric] = useState(true);

  // Enhanced fraction conversion for cooking measurements
  const toFraction = useCallback((decimal) => {
    if (decimal === 0) return '0';
    
    const fractions = [
      { decimal: 0.125, fraction: '1/8' },
      { decimal: 0.25, fraction: '1/4' },
      { decimal: 0.3333, fraction: '1/3' },
      { decimal: 0.5, fraction: '1/2' },
      { decimal: 0.6667, fraction: '2/3' },
      { decimal: 0.75, fraction: '3/4' }
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
    
    return decimal.toFixed(1);
  }, []);

  // Precise formula per banana (120g each)
  const perBananaFormula = {
    banana: 120, flour: 60, sugar: 50, butter: 28, bakingSoda: 1.5, salt: 0.75, vanilla: 1.25, cinnamon: 0.5
  };

  const usConversions = {
    banana: 0.5, flour: 0.5, sugar: 0.25, butter: 2, bakingSoda: 0.25, salt: 0.125, vanilla: 0.25, cinnamon: 0.125
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
      cinnamon: { metric: perBananaFormula.cinnamon * bananaCount, us: usConversions.cinnamon * bananaCount }
    };
  }, [bananaCount]);

  const getBananaStatus = useCallback(() => {
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
    return { message: "Banana empire", emoji: "👑" };
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
      time
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
      cinnamon: isMetric ? `${scaledRecipe.cinnamon.metric.toFixed(1)}g` : `${toFraction(scaledRecipe.cinnamon.us)} tsp`
    };
    return amounts[ingredient] || '';
  }, [scaledRecipe, isMetric, toFraction]);

  const handleBananaCountChange = useCallback((value) => {
    const numValue = Math.max(1, Math.min(100, parseInt(value) || 1));
    setBananaCount(numValue);
  }, []);

  const status = getBananaStatus();
  const bakingInfo = getBakingInfo();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFF8E7' }}>
      {/* Header */}
      <div style={{ padding: '2rem 0', textAlign: 'center', backgroundColor: '#FFF8E7' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4.5vw, 2.7rem)', 
            fontFamily: 'Yellowtail, cursive', 
            color: '#6F4E37',
            marginBottom: '0.5rem',
            fontWeight: 400
          }}>
            Banana Bread Calculator
          </h1>
          <p style={{ color: '#8B7355', fontSize: '1rem' }}>
            Turn your overripe banana horde into something delicious.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 2rem' }}>
        
        {/* Hero Banana Counter */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD45C 0%, #FFF2B8 30%, #FFD45C 70%, rgba(111, 78, 55, 0.3) 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          border: '2px solid #FFD45C'
        }}>
          <Badge style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#6F4E37',
            border: '2px solid #6F4E37',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>{status.emoji}</span>
            {status.message}
          </Badge>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBananaCountChange(bananaCount - 1)}
              style={{
                height: '4rem',
                width: '4rem',
                borderRadius: '50%',
                border: '2px solid #6F4E37',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#6F4E37'
              }}
              disabled={bananaCount <= 1}
            >
              <Minus style={{ height: '2rem', width: '2rem' }} />
            </Button>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '5rem',
                fontWeight: 'bold',
                color: '#6F4E37',
                lineHeight: 1,
                marginBottom: '0.5rem',
                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)'
              }}>
                {bananaCount}
              </div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                color: '#6F4E37',
                border: '1px solid rgba(111, 78, 55, 0.2)'
              }}>
                banana{bananaCount !== 1 ? 's' : ''} • {Math.round(bananaCount * 120)}g
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleBananaCountChange(bananaCount + 1)}
              style={{
                height: '4rem',
                width: '4rem',
                borderRadius: '50%',
                border: '2px solid #6F4E37',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#6F4E37'
              }}
              disabled={bananaCount >= 100}
            >
              <Plus style={{ height: '2rem', width: '2rem' }} />
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '9999px',
              border: '1px solid rgba(111, 78, 55, 0.3)',
              padding: '0.5rem 1rem',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6F4E37' }}>
                Total weight:
              </span>
              <Input
                type="number"
                min="120"
                max="12000"
                step="10"
                value={bananaCount * 120}
                onChange={(e) => handleBananaCountChange(Math.round(parseInt(e.target.value) / 120))}
                style={{
                  width: '4rem',
                  textAlign: 'center',
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: 600,
                  color: '#6F4E37',
                  padding: 0,
                  margin: 0
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6F4E37' }}>
                g
              </span>
            </div>
            
            <Dialog>
              <DialogTrigger style={{
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                borderRadius: '9999px',
                padding: '0.5rem 0.75rem',
                border: '1px solid rgba(111, 78, 55, 0.3)',
                fontWeight: 500,
                color: '#6F4E37',
                cursor: 'pointer'
              }}>
                <HelpCircle style={{ height: '1rem', width: '1rem' }} />
                Banana sizes
              </DialogTrigger>
              <DialogContent style={{ maxWidth: '32rem' }}>
                <DialogHeader>
                  <DialogTitle>Banana Size Guide</DialogTitle>
                  <DialogDescription>
                    This calculator assumes 120g medium bananas. Adjust the total weight for different sizes.
                  </DialogDescription>
                </DialogHeader>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Size Chart</h4>
                    <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                      <div>Small: ~100g (6-6.5")</div>
                      <div style={{ fontWeight: 600 }}>Medium: ~120g (7-8") ⭐</div>
                      <div>Large: ~140g (8-9")</div>
                      <div>X-Large: ~160g (9.5")</div>
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Quick Tips</h4>
                    <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                      <div><strong>Weigh your bananas:</strong> Most accurate</div>
                      <div><strong>No scale?</strong> Use the size guide</div>
                      <div><strong>Mixed sizes?</strong> Enter total weight</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Desktop Layout */}
        <div style={{ display: 'none' }} className="lg:block">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Recipe Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '0.75rem',
              border: '1px solid #E6D5B8',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6F4E37' }}>
                  Your Recipe
                </h2>
                <ToggleGroup 
                  type="single" 
                  value={isMetric ? "metric" : "us"} 
                  onValueChange={(value) => setIsMetric(value === "metric")}
                  style={{
                    borderRadius: '9999px',
                    padding: '0.25rem',
                    border: '1px solid rgba(255, 212, 92, 0.3)',
                    backgroundColor: 'rgba(255, 212, 92, 0.2)'
                  }}
                >
                  <ToggleGroupItem value="metric" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '9999px' }}>
                    Metric
                  </ToggleGroupItem>
                  <ToggleGroupItem value="us" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '9999px' }}>
                    US
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Wet Ingredients */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6F4E37' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#FFD45C' }}></div>
                  Wet Ingredients
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Mashed bananas</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('banana')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Sugar</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('sugar')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Melted butter</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('butter')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Eggs</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('eggs')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Vanilla extract</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('vanilla')}</span>
                  </div>
                </div>
              </div>

              {/* Dry Ingredients */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6F4E37' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#C9DAB7' }}></div>
                  Dry Ingredients
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>All-purpose flour</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('flour')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Baking soda</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('bakingSoda')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Salt</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('salt')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Cinnamon (optional)</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('cinnamon')}</span>
                  </div>
                </div>
              </div>

              {/* Optional Add-ins */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6F4E37' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#E8F0E1' }}></div>
                  Optional Add-ins
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8B7355' }}>Chopped nuts</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>53g</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8B7355' }}>Chocolate chips</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>53g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Baking Info */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '0.75rem',
                border: '1px solid #E6D5B8',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6F4E37' }}>
                  Baking Info
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8B7355' }}>Pan size</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37', textAlign: 'right' }}>{bakingInfo.panSize}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8B7355' }}>Temperature</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.temp}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8B7355' }}>Time</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8B7355' }}>Batter weight</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.batterWeight}</span>
                  </div>
                </div>
              </div>

              {/* Quick Method */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '0.75rem',
                border: '1px solid #E6D5B8',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6F4E37' }}>
                  Quick Method
                </h3>
                <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#8B7355' }}>
                  <li>
                    <strong>1.</strong> Preheat oven to <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.temp}</span>
                  </li>
                  <li><strong>2.</strong> Mash bananas, mix with wet ingredients</li>
                  <li><strong>3.</strong> Combine dry ingredients separately</li>
                  <li><strong>4.</strong> Mix wet and dry until just combined</li>
                  <li>
                    <strong>5.</strong> Pour into greased pan, bake <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.time}</span>
                  </li>
                  <li><strong>6.</strong> Cool before removing from pan</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Recipe Card - Mobile */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E6D5B8',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#6F4E37' }}>
                Your Recipe
              </h2>
              <ToggleGroup 
                type="single" 
                value={isMetric ? "metric" : "us"} 
                onValueChange={(value) => setIsMetric(value === "metric")}
                style={{
                  borderRadius: '9999px',
                  padding: '0.25rem',
                  border: '1px solid rgba(255, 212, 92, 0.3)',
                  backgroundColor: 'rgba(255, 212, 92, 0.2)'
                }}
              >
                <ToggleGroupItem value="metric" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '9999px' }}>
                  Metric
                </ToggleGroupItem>
                <ToggleGroupItem value="us" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', borderRadius: '9999px' }}>
                  US
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* All ingredients sections for mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Wet Ingredients */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6F4E37' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#FFD45C' }}></div>
                  Wet Ingredients
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Mashed bananas</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('banana')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Sugar</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('sugar')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Melted butter</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('butter')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Eggs</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('eggs')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Vanilla extract</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('vanilla')}</span>
                  </div>
                </div>
              </div>

              {/* Dry Ingredients */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6F4E37' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#C9DAB7' }}></div>
                  Dry Ingredients
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>All-purpose flour</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('flour')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Baking soda</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('bakingSoda')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Salt</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('salt')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#6F4E37' }}>Cinnamon (optional)</span>
                    <span style={{ fontWeight: 600, color: '#6F4E37' }}>{getIngredientAmount('cinnamon')}</span>
                  </div>
                </div>
              </div>

              {/* Optional Add-ins */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6F4E37' }}>
                  <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#E8F0E1' }}></div>
                  Optional Add-ins
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8B7355' }}>Chopped nuts</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>53g</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                    <span style={{ color: '#8B7355' }}>Chocolate chips</span>
                    <span style={{ fontWeight: 500, color: '#6F4E37' }}>53g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Baking Info - Mobile */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E6D5B8',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6F4E37' }}>
              Baking Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8B7355' }}>Pan size</span>
                <span style={{ fontWeight: 500, color: '#6F4E37', textAlign: 'right' }}>{bakingInfo.panSize}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8B7355' }}>Temperature</span>
                <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.temp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8B7355' }}>Time</span>
                <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.time}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#8B7355' }}>Batter weight</span>
                <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.batterWeight}</span>
              </div>
            </div>
          </div>

          {/* Quick Method - Mobile */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '0.75rem',
            border: '1px solid #E6D5B8',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6F4E37' }}>
              Quick Method
            </h3>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#8B7355' }}>
              <li>
                <strong>1.</strong> Preheat oven to <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.temp}</span>
              </li>
              <li><strong>2.</strong> Mash bananas, mix with wet ingredients</li>
              <li><strong>3.</strong> Combine dry ingredients separately</li>
              <li><strong>4.</strong> Mix wet and dry until just combined</li>
              <li>
                <strong>5.</strong> Pour into greased pan, bake <span style={{ fontWeight: 500, color: '#6F4E37' }}>{bakingInfo.time}</span>
              </li>
              <li><strong>6.</strong> Cool before removing from pan</li>
            </ol>
          </div>
        </div>

        {/* Pro Tip - Full Width */}
        <div style={{
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 212, 92, 0.3)',
          padding: '1rem',
          boxShadow: '0 2px 8px rgba(111, 78, 55, 0.08)',
          backgroundColor: '#FFF2B8',
          marginTop: '1.5rem'
        }}>
          <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#6F4E37' }}>
            <span role="img" aria-label="Light bulb">💡</span> Pro Tip
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#6F4E37' }}>
            The more brown spots on your bananas, the sweeter your bread will be!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '1.5rem 0',
        marginTop: '3rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(230, 213, 184, 0.3)',
        backgroundColor: '#F5F0E1'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#8B7355' }}>
            Made with <span role="img" aria-label="bread">🍞</span> by{' '}
            <a 
              href="https://titania.co.nz" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontWeight: 500, color: '#6F4E37' }}
            >
              Steph
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}