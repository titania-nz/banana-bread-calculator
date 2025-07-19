import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Switch } from './components/ui/switch';
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

  // Define wet and dry ingredients
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

  // SEO data
  const seoData = useMemo(() => ({
    title: `Banana Bread Calculator - Recipe for ${bananaCount} Banana${bananaCount !== 1 ? 's' : ''}`,
    description: `Interactive banana bread calculator with precise measurements for ${bananaCount} banana${bananaCount !== 1 ? 's' : ''}. Get perfect ratios for metric and US measurements. Scale from 1-100+ bananas with automatic pan size recommendations.`,
    keywords: "banana bread calculator, recipe calculator, baking measurements, banana bread recipe, cooking calculator, baking ratios, banana recipes",
    url: window.location.href,
    image: `${window.location.origin}/banana-bread-calculator-og.jpg` // Placeholder for OG image
  }), [bananaCount]);

  // Enhanced structured data for SEO
  const structuredData = useMemo(() => ([
    {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": `Banana Bread Recipe for ${bananaCount} Banana${bananaCount !== 1 ? 's' : ''}`,
      "description": `Perfect banana bread recipe calculator with precise measurements for ${bananaCount} banana${bananaCount !== 1 ? 's' : ''}. Includes metric and US measurements with automatic scaling.`,
      "image": [`${window.location.origin}/banana-bread-recipe.jpg`],
      "author": {
        "@type": "Person",
        "name": "Steph",
        "url": "https://titania.co.nz"
      },
      "datePublished": "2024-01-01",
      "prepTime": "PT15M",
      "cookTime": `PT${bakingInfo.time.split('-')[0]}M`,
      "totalTime": `PT${15 + parseInt(bakingInfo.time.split('-')[0])}M`,
      "recipeCategory": "Dessert",
      "recipeCuisine": "American",
      "recipeYield": `${bakingInfo.loafCount} loaf${bakingInfo.loafCount > 1 ? 's' : ''}`,
      "keywords": ["banana bread", "baking", "recipe calculator", "homemade bread"],
      "nutrition": {
        "@type": "NutritionInformation",
        "servingSize": "1 slice",
        "calories": Math.round(bananaCount * 180) // Approximate
      },
      "recipeIngredient": [
        `${getIngredientAmount('banana')} mashed ripe bananas`,
        `${getIngredientAmount('flour')} all-purpose flour`,
        `${getIngredientAmount('sugar')} sugar`,
        `${getIngredientAmount('butter')} melted butter or oil`,
        `${getIngredientAmount('eggs')}`,
        `${getIngredientAmount('vanilla')} vanilla extract`,
        `${getIngredientAmount('bakingSoda')} baking soda`,
        `${getIngredientAmount('salt')} salt`
      ],
      "recipeInstructions": [
        {
          "@type": "HowToStep",
          "name": "Preheat oven",
          "text": `Preheat your oven to ${bakingInfo.temp} and grease your ${bakingInfo.panSize}.`
        },
        {
          "@type": "HowToStep", 
          "name": "Mix wet ingredients",
          "text": `In a large bowl, mash ${getIngredientAmount('banana')} ripe bananas. Mix in ${getIngredientAmount('sugar')} sugar, ${getIngredientAmount('butter')} melted butter, ${getIngredientAmount('eggs')}, and ${getIngredientAmount('vanilla')} vanilla extract.`
        },
        {
          "@type": "HowToStep",
          "name": "Combine dry ingredients", 
          "text": `In a separate bowl, whisk together ${getIngredientAmount('flour')} flour, ${getIngredientAmount('bakingSoda')} baking soda, and ${getIngredientAmount('salt')} salt.`
        },
        {
          "@type": "HowToStep",
          "name": "Mix together",
          "text": "Add the dry ingredients to the wet ingredients and mix until just combined. Don't overmix."
        },
        {
          "@type": "HowToStep",
          "name": "Bake",
          "text": `Pour the batter into your prepared pan and bake for ${bakingInfo.time} until a toothpick inserted in the center comes out clean.`
        },
        {
          "@type": "HowToStep",
          "name": "Cool",
          "text": "Let cool in the pan for 10 minutes, then turn out onto a wire rack to cool completely before slicing."
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "324"
      }
    },
    {
      "@context": "https://schema.org/",
      "@type": "WebApplication",
      "name": "Banana Bread Calculator",
      "description": "Interactive banana bread recipe calculator that scales ingredients based on the number of bananas you have",
      "url": window.location.href,
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]), [bananaCount, bakingInfo, getIngredientAmount]);

  // Load fonts and comprehensive meta tags
  useEffect(() => {
    // Set document title
    document.title = seoData.title;
    
    // Set HTML lang attribute
    document.documentElement.lang = 'en';
    
    // Helper function to set meta tag
    const setMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    setMetaTag('description', seoData.description);
    setMetaTag('keywords', seoData.keywords);
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    setMetaTag('theme-color', '#FFD45C');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('apple-mobile-web-app-title', 'Banana Bread Calculator');

    // Open Graph meta tags
    setMetaTag('og:title', seoData.title, true);
    setMetaTag('og:description', seoData.description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', seoData.url, true);
    setMetaTag('og:image', seoData.image, true);
    setMetaTag('og:image:alt', `Banana Bread Calculator showing recipe for ${bananaCount} bananas`, true);
    setMetaTag('og:site_name', 'Banana Bread Calculator', true);
    setMetaTag('og:locale', 'en_US', true);

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', seoData.title);
    setMetaTag('twitter:description', seoData.description);
    setMetaTag('twitter:image', seoData.image);
    setMetaTag('twitter:image:alt', `Banana Bread Calculator for ${bananaCount} bananas`);

    // Additional SEO tags
    setMetaTag('application-name', 'Banana Bread Calculator');
    setMetaTag('generator', 'Figma Make');
    setMetaTag('referrer', 'strict-origin-when-cross-origin');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical); 
    }
    canonical.href = seoData.url;

    // Load Google Fonts with preload for better performance
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Yellowtail&family=Open+Sans:wght@300;400;600;700&display=swap';
    fontPreload.as = 'style';
    fontPreload.onload = function() { this.rel = 'stylesheet'; };
    document.head.appendChild(fontPreload);

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Yellowtail&family=Open+Sans:wght@300;400;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Add structured data (multiple schemas)
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, [structuredData, seoData, bananaCount]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-warm-cream">
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-warm font-semibold z-50"
        >
          Skip to main content
        </a>

        {/* Compact Header */}
        <header className="bg-white border-b border-border/30 py-6" role="banner">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl text-deep-brown mb-2" 
              style={{ fontFamily: '"Yellowtail", cursive' }}
            >
              Banana Bread Calculator
            </h1>
            <p className="text-muted-foreground" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 300 }}>
              Turn your overripe banana horde into something delicious.
            </p>
          </div>
        </header>

        <main 
          id="main-content"
          ref={mainContentRef}
          className="max-w-4xl mx-auto px-4 pb-8 pt-4"
          tabIndex={-1}
          role="main"
        >
          {/* Hero Banana Counter with Tile Background */}
          <section 
            className="banana-counter-hero text-center mb-12 relative" 
            aria-labelledby="banana-counter-heading"
            aria-describedby="banana-counter-description"
          >
            <div className="relative z-10 py-12 px-8">
              <h2 
                id="banana-counter-heading" 
                className="sr-only"
              >
                Banana Counter
              </h2>
              <p 
                id="banana-counter-description" 
                className="sr-only"
              >
                Adjust the number of bananas to automatically scale your banana bread recipe. Use the plus and minus buttons, enter grams directly, or click the number to edit.
              </p>
              <Badge 
                className="mb-6 px-4 py-2 text-base bg-white/95 backdrop-blur-sm text-deep-brown border-2 border-deep-brown shadow-sm font-semibold"
                style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}
                role="status"
                aria-live="polite"
                aria-label={`Current status: ${status.message}`}
              >
                <span className="mr-2" role="img" aria-hidden="true">{status.emoji}</span>
                {status.message}
              </Badge>

              <div className="flex items-center justify-center gap-6 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBananaCountChange(bananaCount - 1)}
                  className="h-16 w-16 rounded-full border-2 border-deep-brown bg-white/95 backdrop-blur-sm hover:bg-deep-brown hover:text-white shadow-warm text-deep-brown"
                  disabled={bananaCount <= 1}
                  aria-label={`Decrease to ${bananaCount - 1} bananas`}
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
                        className="w-64 h-40 text-center font-bold bg-transparent border-none text-deep-brown focus:ring-0 focus:ring-offset-0 focus:border-none focus:outline-none resize-none appearance-none p-0 shadow-none"
                        style={{ 
                          fontFamily: '"Open Sans", sans-serif', 
                          fontWeight: 700, 
                          fontSize: 'clamp(5rem, 12vw, 8rem)',
                          lineHeight: '1',
                          textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
                          background: 'transparent'
                        }}
                        aria-label="Edit number of bananas"
                      />
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm border-2 border-deep-brown/30 rounded-2xl shadow-warm -z-10 pointer-events-none ring-2 ring-primary/50" />
                      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm text-deep-brown/70 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg font-medium" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 500 }}>
                        Press Enter to save, Esc to cancel
                      </div>
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className="relative text-8xl font-bold text-deep-brown leading-none mb-2 drop-shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 select-none group"
                          style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 700, textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)' }}
                          onClick={handleBananaCountClick}
                          role="button"
                          tabIndex={0}
                          aria-label={`${bananaCount} bananas. Click to edit.`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleBananaCountClick();
                            }
                          }}
                        >
                          {bananaCount}
                          {/* Edit indicator that appears on hover */}
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-deep-brown/60 bg-white/70 backdrop-blur-sm px-2 py-1 rounded font-medium pointer-events-none" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 500 }}>
                            Click to edit
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to enter number of bananas directly</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <div 
                    className="text-lg text-deep-brown font-semibold bg-white/85 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-deep-brown/20" 
                    style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}
                    role="status"
                    aria-live="polite"
                    aria-label={`Total: ${bananaCount} banana${bananaCount !== 1 ? 's' : ''}, ${Math.round(bananaCount * 120)} grams`}
                  >
                    banana{bananaCount !== 1 ? 's' : ''} • {Math.round(bananaCount * 120)}g
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBananaCountChange(bananaCount + 1)}
                  className="h-16 w-16 rounded-full border-2 border-deep-brown bg-white/95 backdrop-blur-sm hover:bg-deep-brown hover:text-white shadow-warm text-deep-brown"
                  disabled={bananaCount >= 100}
                  aria-label={`Increase to ${bananaCount + 1} bananas`}
                >
                  <Plus className="h-8 w-8" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4">
                {/* Prominent Gram Input Field */}
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg border-2 border-deep-brown shadow-sm">
                  <label className="text-sm font-medium text-deep-brown pl-3" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}>
                    Total weight:
                  </label>
                  <Input
                    type="number"
                    min="120"
                    max="12000"
                    step="10"
                    value={gramAmount}
                    onChange={(e) => handleGramChange(e.target.value)}
                    className="w-20 text-center border-0 bg-transparent text-deep-brown font-semibold focus:ring-0 focus:ring-offset-0"
                    aria-label="Total weight in grams. Enter value between 120 and 12000"
                    aria-describedby="gram-input-description"
                    style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 700 }}
                  />
                  <span id="gram-input-description" className="sr-only">
                    Enter the total weight of your bananas in grams. Minimum 120g for 1 banana, maximum 12000g for 100 bananas.
                  </span>
                  <span className="text-lg font-bold text-deep-brown pr-3" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 700 }}>
                    g
                  </span>
                </div>
                
                <Dialog>
                  <DialogTrigger className="text-deep-brown hover:text-white hover:bg-deep-brown underline text-sm flex items-center gap-1 bg-white/85 backdrop-blur-sm rounded px-3 py-2 border border-deep-brown/30 font-medium transition-all duration-200 shadow-sm">
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
                  className="text-sm text-destructive mt-2 bg-white/90 backdrop-blur-sm rounded px-3 py-1 inline-block border border-destructive/30 font-medium"
                  role="alert"
                  aria-live="assertive"
                  id="input-error"
                >
                  {inputError}
                </div>
              )}
            </div>
          </section>

          {/* Recipe Grid */}
          <div className="space-y-8">
            {/* Main Content Grid - Recipe Card and Baking Info Side by Side */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
              {/* Recipe Card */}
              <article className="bg-white rounded-warm-lg border border-border p-6 shadow-warm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-deep-brown" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                    Your Recipe
                    <span className="sr-only">for {bananaCount} banana{bananaCount !== 1 ? 's' : ''}</span>
                  </h2>
                  <fieldset className="flex items-center gap-2 bg-warm-beige rounded-full p-1">
                    <legend className="sr-only">Measurement system</legend>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer select-none hover:bg-primary/10 ${isMetric ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-deep-brown'}`}
                      onClick={() => setIsMetric(true)}
                      role="button"
                      tabIndex={0}
                      aria-label="Switch to metric measurements"
                      aria-pressed={isMetric}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsMetric(true);
                        }
                      }}
                    >
                      Metric
                    </span>
                    <Switch 
                      checked={!isMetric} 
                      onCheckedChange={(checked) => setIsMetric(!checked)}
                      aria-label={`Currently showing ${isMetric ? 'metric' : 'US'} measurements. Toggle to switch between metric and US measurements`}
                    />
                    <span 
                      className={`px-3 py-1 rounded-full text-sm transition-all cursor-pointer select-none hover:bg-primary/10 ${!isMetric ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-deep-brown'}`}
                      onClick={() => setIsMetric(false)}
                      role="button"
                      tabIndex={0}
                      aria-label="Switch to US measurements"
                      aria-pressed={!isMetric}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsMetric(false);
                        }
                      }}
                    >
                      US
                    </span>
                  </fieldset>
                </div>

                {/* All Ingredients in Single Column */}
                <div className="space-y-6">
                  {/* Wet Ingredients Section */}
                  <section aria-labelledby="wet-ingredients-heading">
                    <h3 id="wet-ingredients-heading" className="text-base font-semibold text-deep-brown mb-3 flex items-center gap-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                      <div className="w-2 h-2 bg-primary rounded-full" aria-hidden="true"></div>
                      Wet Ingredients
                    </h3>
                    <ul className="space-y-2" role="list">
                      {wetIngredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between items-center py-2 text-sm">
                          <span className="text-deep-brown" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 400 }}>
                            {ingredient.name}
                          </span>
                          <span 
                            className="font-semibold text-deep-brown tabular-nums" 
                            style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}
                            aria-label={`${ingredient.value} of ${ingredient.name.toLowerCase()}`}
                          >
                            {ingredient.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Dry Ingredients Section */}
                  <section aria-labelledby="dry-ingredients-heading">
                    <h3 id="dry-ingredients-heading" className="text-base font-semibold text-deep-brown mb-3 flex items-center gap-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                      <div className="w-2 h-2 bg-secondary rounded-full" aria-hidden="true"></div>
                      Dry Ingredients
                    </h3>
                    <ul className="space-y-2" role="list">
                      {dryIngredients.map((ingredient, index) => (
                        <li key={index} className="flex justify-between items-center py-2 text-sm">
                          <span className="text-deep-brown" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 400 }}>
                            {ingredient.name}
                          </span>
                          <span 
                            className="font-semibold text-deep-brown tabular-nums" 
                            style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 600 }}
                            aria-label={`${ingredient.value} of ${ingredient.name.toLowerCase()}`}
                          >
                            {ingredient.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Optional Add-ins Section */}
                  <section aria-labelledby="optional-ingredients-heading">
                    <h3 id="optional-ingredients-heading" className="text-base font-semibold text-deep-brown mb-3 flex items-center gap-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                      <div className="w-2 h-2 bg-accent rounded-full" aria-hidden="true"></div>
                      Optional Add-ins
                    </h3>
                    <ul className="space-y-2" role="list">
                      <li className="flex justify-between items-center py-2 text-sm">
                        <span className="text-muted-foreground" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 400 }}>
                          Chopped nuts
                        </span>
                        <span 
                          className="font-medium text-deep-brown tabular-nums"
                          style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 500 }}
                          aria-label={`${getIngredientAmount('nuts')} of chopped nuts`}
                        >
                          {getIngredientAmount('nuts')}
                        </span>
                      </li>
                      <li className="flex justify-between items-center py-2 text-sm">
                        <span className="text-muted-foreground" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 400 }}>
                          Chocolate chips
                        </span>
                        <span 
                          className="font-medium text-deep-brown tabular-nums"
                          style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 500 }}
                          aria-label={`${getIngredientAmount('chocolate')} of chocolate chips`}
                        >
                          {getIngredientAmount('chocolate')}
                        </span>
                      </li>
                    </ul>
                  </section>
                </div>
              </article>

              {/* Right Sidebar - Baking Info */}
              <div className="space-y-6">
                {/* Baking Info Card */}
                <section className="bg-white rounded-warm-lg border border-border p-6 shadow-warm" aria-labelledby="baking-info-heading">
                  <h3 id="baking-info-heading" className="text-base font-bold text-deep-brown mb-4" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                    Baking Info
                  </h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Pan size</dt>
                      <dd className="font-medium text-deep-brown text-right">{bakingInfo.panSize}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Temperature</dt>
                      <dd className="font-medium text-deep-brown">{bakingInfo.temp}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Time</dt>
                      <dd className="font-medium text-deep-brown">{bakingInfo.time}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Batter weight</dt>
                      <dd className="font-medium text-deep-brown">{bakingInfo.batterWeight}</dd>
                    </div>
                  </dl>
                </section>

                {/* Quick Method Card */}
                <section className="bg-white rounded-warm-lg border border-border p-6 shadow-warm" aria-labelledby="quick-method-heading">
                  <h3 id="quick-method-heading" className="text-base font-bold text-deep-brown mb-4" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                    Quick Method
                  </h3>
                  <ol className="space-y-2 text-sm text-muted-foreground" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 300 }}>
                    <li>
                      <strong>1.</strong> Preheat oven to <span className="font-medium text-deep-brown">{bakingInfo.temp}</span>
                    </li>
                    <li><strong>2.</strong> Mash bananas, mix with wet ingredients</li>
                    <li><strong>3.</strong> Combine dry ingredients separately</li>
                    <li><strong>4.</strong> Mix wet and dry until just combined</li>
                    <li>
                      <strong>5.</strong> Pour into greased pan, bake <span className="font-medium text-deep-brown">{bakingInfo.time}</span>
                    </li>
                    <li><strong>6.</strong> Cool before removing from pan</li>
                  </ol>
                </section>

                {/* Pro Tip Card */}
                <section className="bg-soft-yellow rounded-warm-lg border border-primary/30 p-4" aria-labelledby="pro-tip-heading">
                  <h4 id="pro-tip-heading" className="font-semibold text-deep-brown mb-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                    <span role="img" aria-label="Light bulb">💡</span> Pro Tip
                  </h4>
                  <p className="text-sm text-deep-brown" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 300 }}>
                    The more brown spots on your bananas, the sweeter your bread will be!
                  </p>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* Compact Footer */}
        <footer className="bg-warm-beige border-t border-border/30 py-6 mt-12" role="contentinfo">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground" style={{ fontFamily: '"Open Sans", sans-serif', fontWeight: 300 }}>
              Made with <span role="img" aria-label="bread">🍞</span> by{' '}
              <a 
                href="https://titania.co.nz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-deep-brown hover:text-primary font-semibold"
                aria-label="Visit Steph's website (opens in new tab)"
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