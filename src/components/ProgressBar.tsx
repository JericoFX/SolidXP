import { mergeProps, splitProps, createEffect, onCleanup } from 'solid-js';
import { cn } from '../utils/cn';
import type { ProgressBarProps } from '../types';
import "./ProgressBar.css"
export function ProgressBar(props: ProgressBarProps) {
  const merged = mergeProps({
    value: 0,
    max: 100,
    indeterminate: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'value',
    'max',
    'indeterminate',
    'class'
  ]);

  const progressPercentage = () => {
    if (local.indeterminate) return 0;
    return Math.min(100, Math.max(0, (local.value! / local.max!) * 100));
  };

// Estilos para progress bar XP auténtica con bloques
const progressBarStyle = {
  width: '100%',
  'max-width': '300px',
  height: '20px',
  border: '1px solid #808080',
  'background-color': '#e0e0e0',
  'border-radius': '2px',
  overflow: 'hidden' as const,
  'box-sizing': 'border-box' as const
};

const progressFillStyle = () => {
  const blockSize = 16; // ancho de cada bloque
  return {
    height: '100%',
    width: local.indeterminate ? '100%' : `${progressPercentage()}%`,
    background: local.indeterminate
      ? `repeating-linear-gradient(
          90deg,
          #7ED321 0px,
          #5BA826 ${blockSize - 4}px,
          #4E9A20 ${blockSize - 4}px,
          #4E9A20 ${blockSize}px
        )`
      : `repeating-linear-gradient(
          90deg,
          #7ED321 0px,
          #5BA826 ${blockSize - 4}px,
          #4E9A20 ${blockSize - 4}px,
          #4E9A20 ${blockSize}px
        )`,
    'background-size': `${blockSize}px 100%`,
    animation: local.indeterminate
      ? 'xp-progress 1s linear infinite'
      : 'none',
    'box-shadow': 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transition: local.indeterminate ? 'none' : 'width 0.3s ease'
  };
};


  // Crear animación CSS para el efecto "marching ants"
  let styleElement: HTMLStyleElement;
  createEffect(() => {
    if (local.indeterminate && !styleElement) {
      styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes marching-ants {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 40px 0;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }
  });

  onCleanup(() => {
    if (styleElement) {
      document.head.removeChild(styleElement);
    }
  });

  return (
    <div
      class={cn('xp-progress-bar-container', local.class)}
      style={progressBarStyle}
      {...others}
    >
      <div
        class={cn('xp-progress-bar-fill', local.indeterminate && 'animated')}
        style={progressFillStyle()}
      />
    </div>
  );
}