import { storage } from './storage';

type ThemeType = 'light' | 'dark';

export const getInitialTheme = (): ThemeType => {
  const saved = storage.getTheme();
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
};

export const applyTheme = (theme: ThemeType): void => {
  const html = document.documentElement;
  const body = document.body;

  html.classList.toggle('dark', theme === 'dark');
  body.classList.toggle('dark', theme === 'dark');

  storage.saveTheme(theme);
};
