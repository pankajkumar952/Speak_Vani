import React, { createContext, useContext, useState } from 'react';
import { Category, Topic, PracticeModeType, TopicDifficulty, TimeLimitSeconds, AudienceType } from '../types';
import { generalCategoriesData, kidsCategoriesData } from '../data/topics';
import { getSoundEnabled, setSoundEnabled as setSoundUtil } from '../utils/sound';

interface AppStateContextType {
  isKidsMode: boolean;
  setIsKidsMode: (isKids: boolean) => void;
  selectedAudience: AudienceType;
  setSelectedAudience: (aud: AudienceType) => void;
  setKidsAgeTier: (tier: '5-7' | '8-10' | '11-13') => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  selectedDifficulty: TopicDifficulty;
  setSelectedDifficulty: (diff: TopicDifficulty) => void;
  selectedTimeLimit: TimeLimitSeconds;
  setSelectedTimeLimit: (secs: TimeLimitSeconds) => void;
  selectedMode: PracticeModeType;
  setSelectedMode: (mode: PracticeModeType) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  switchToKidsMode: (ageGroup?: AudienceType) => void;
  switchToNormalMode: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isKidsMode, setIsKidsModeState] = useState<boolean>(false);
  const [selectedAudience, setSelectedAudienceState] = useState<AudienceType>('GENERAL');

  const [selectedCategory, setSelectedCategoryState] = useState<Category>(() => {
    return generalCategoriesData[0];
  });

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<TopicDifficulty>('EASY');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<TimeLimitSeconds>(120);
  const [selectedMode, setSelectedMode] = useState<PracticeModeType>('self');
  const [soundEnabled, setSoundState] = useState<boolean>(() => getSoundEnabled());

  const setSelectedCategory = (cat: Category) => {
    setSelectedCategoryState(cat);
    setSelectedTopic(null); // immediately reset topic on category change
  };

  const setKidsAgeTier = (tier: '5-7' | '8-10' | '11-13') => {
    setIsKidsModeState(true);
    let aud: AudienceType = 'KIDS_5_7';
    let timeLimit: TimeLimitSeconds = 30;

    if (tier === '8-10') {
      aud = 'KIDS_8_10';
      timeLimit = 60;
    } else if (tier === '11-13') {
      aud = 'KIDS_11_13';
      timeLimit = 90;
    }

    setSelectedAudienceState(aud);
    setSelectedCategoryState(kidsCategoriesData[0]);
    setSelectedTopic(null);
    setSelectedDifficulty('EASY');
    setSelectedTimeLimit(timeLimit);
    setSelectedMode('self');
  };

  const setSelectedAudience = (aud: AudienceType) => {
    setSelectedAudienceState(aud);
    setSelectedTopic(null);

    if (aud === 'GENERAL') {
      setIsKidsModeState(false);
      setSelectedCategoryState(generalCategoriesData[0]);
      setSelectedTimeLimit(120);
    } else {
      setIsKidsModeState(true);
      setSelectedCategoryState(kidsCategoriesData[0]);
      setSelectedTimeLimit(aud === 'KIDS_5_7' ? 30 : aud === 'KIDS_8_10' ? 60 : 90);
    }
  };

  const switchToKidsMode = (ageGroup: AudienceType = 'KIDS_5_7') => {
    setIsKidsModeState(true);
    setSelectedAudienceState(ageGroup);
    setSelectedCategoryState(kidsCategoriesData[0]);
    setSelectedTopic(null);
    setSelectedDifficulty('EASY');
    setSelectedTimeLimit(ageGroup === 'KIDS_5_7' ? 30 : ageGroup === 'KIDS_8_10' ? 60 : 90);
    setSelectedMode('self');
  };

  const switchToNormalMode = () => {
    setIsKidsModeState(false);
    setSelectedAudienceState('GENERAL');
    setSelectedCategoryState(generalCategoriesData[0]);
    setSelectedTopic(null);
    setSelectedDifficulty('EASY');
    setSelectedTimeLimit(120);
    setSelectedMode('self');
  };

  const setIsKidsMode = (isKids: boolean) => {
    if (isKids) {
      switchToKidsMode(selectedAudience !== 'GENERAL' ? selectedAudience : 'KIDS_5_7');
    } else {
      switchToNormalMode();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundState(next);
    setSoundUtil(next);
  };

  return (
    <AppStateContext.Provider
      value={{
        isKidsMode,
        setIsKidsMode,
        selectedAudience,
        setSelectedAudience,
        setKidsAgeTier,
        selectedCategory,
        setSelectedCategory,
        selectedTopic,
        setSelectedTopic,
        selectedDifficulty,
        setSelectedDifficulty,
        selectedTimeLimit,
        setSelectedTimeLimit,
        selectedMode,
        setSelectedMode,
        soundEnabled,
        toggleSound,
        switchToKidsMode,
        switchToNormalMode,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};
