import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import RecipeGenerator from './components/RecipeGenerator';
import PrivacyPolicy from './components/PrivacyPolicy';
import About from './components/About';
import MyRecipes from './components/MyRecipes';
import CookingMode from './components/CookingMode';
import Intro from './components/Intro';
import Settings from './components/Settings';
import type { View, Recipe, TFunction } from './types';
import { translations } from './translations';

const App: React.FC = () => {
  const [view, setView] = useState<View>('recipe');
  const [cookingState, setCookingState] = useState<{ recipe: Recipe; language: string } | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem('cooky_language') || 'en-US';
  });
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('cooky_theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cooky_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cooky_language', language);
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);
  
  const t: TFunction = useCallback((key, replacements) => {
    let translation = translations[language]?.[key] || translations['en-US']?.[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
        });
    }
    return translation;
  }, [language]);

  const handleStartCooking = useCallback((recipe: Recipe) => {
    setCookingState({ recipe, language });
  }, [language]);

  const renderView = () => {
    switch (view) {
      case 'recipe':
        return <RecipeGenerator setView={setView} onStartCooking={handleStartCooking} language={language} setLanguage={setLanguage} t={t} />;
      case 'my-recipes':
        return <MyRecipes setView={setView} onStartCooking={handleStartCooking} t={t} />;
      case 'privacy':
        return <PrivacyPolicy t={t}/>;
      case 'about':
        return <About t={t}/>;
      case 'settings':
        return <Settings language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} t={t} />;
      default:
        return <RecipeGenerator setView={setView} onStartCooking={handleStartCooking} language={language} setLanguage={setLanguage} t={t} />;
    }
  };

  if (showIntro) {
    return <Intro />;
  }

  return (
    <div className="min-h-screen font-sans text-text-primary dark:text-dark-text-primary">
      {cookingState && (
        <CookingMode 
          recipe={cookingState.recipe} 
          language={cookingState.language} 
          onClose={() => setCookingState(null)} 
          t={t}
        />
      )}
      <div className={cookingState ? 'blur-sm' : ''}>
        <Header currentView={view} setView={setView} t={t} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderView()}
        </main>
        <footer className="text-center py-4 text-text-secondary dark:text-dark-text-secondary text-sm">
          <p>{t('footer_text')}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;