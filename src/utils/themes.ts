import { createSignal } from 'solid-js';

export type Theme = 'xp' | 'zune' | 'royale';

const [currentTheme, setCurrentTheme] = createSignal<Theme>('xp');

export function useTheme() {
  return [currentTheme, setCurrentTheme] as const;
}

export function applyTheme(theme: Theme) {
  const body = document.body;
  
  // Remover todas las clases de tema existentes
  body.classList.remove('theme-xp', 'theme-zune', 'theme-royale');
  
  // Aplicar la nueva clase de tema
  if (theme === 'zune') {
    body.classList.add('theme-zune');
    // Import Zune CSS dynamically
    import('../themes/zune.css');
  } else if (theme === 'royale') {
    body.classList.add('theme-royale');
    // Import Royale CSS dynamically
    import('../themes/royale.css');
  } else {
    body.classList.add('theme-xp');
  }
  
  setCurrentTheme(theme);
}

// Inicializar con tema por defecto
applyTheme('xp');