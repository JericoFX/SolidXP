import { mergeProps, splitProps, createEffect, onCleanup } from 'solid-js';
import { cn } from '../utils/cn';
import type { ProgressBarProps } from '../types';
import './ProgressBar.css';
export function ProgressBar(props: ProgressBarProps) {
  const merged = mergeProps(
    {
      value: 0,
      max: 100,
      indeterminate: false,
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'value',
    'max',
    'indeterminate',
    'width',
    'height',
    'class',
  ]);

  const progressPercentage = () => {
    if (local.indeterminate) return 0;
    return Math.min(100, Math.max(0, (local.value! / local.max!) * 100));
  };

  // Estilos para progress bar XP auténtica con bloques
  const progressBarStyle = () => ({
    width: local.width || '100%',
    height: local.height || '20px',
    border: '1px solid #808080',
    'background-color': '#e0e0e0',
    'border-radius': '2px',
    overflow: 'hidden' as const,
    'box-sizing': 'border-box' as const,
    'box-shadow': 'inset 1px 1px 2px rgba(0,0,0,0.1)',
  });

  // Constants for block dimensions (moved outside function to be accessible in createEffect)
  const blockWidth = 16; // ancho total de cada bloque
  const solidWidth = 12; // parte sólida del bloque
  // const gapWidth = 4; // separación transparente - not used currently

  const progressFillStyle = () => {

    if (local.indeterminate) {
      // Modo indeterminado: solo 3 bloques moviéndose
      return {
        height: '100%',
        width: '100%',
        background: `
        linear-gradient(to bottom, #7ED321 0%, #5BA826 50%, #4E9A20 100%),
        linear-gradient(to bottom, #7ED321 0%, #5BA826 50%, #4E9A20 100%),
        linear-gradient(to bottom, #7ED321 0%, #5BA826 50%, #4E9A20 100%)
      `,
        'background-size': `${solidWidth}px 100%, ${solidWidth}px 100%, ${solidWidth}px 100%`,
        'background-position': `0px 0, ${blockWidth}px 0, ${
          blockWidth * 2
        }px 0`,
        'background-repeat': 'no-repeat',
        animation: 'xp-progress-indeterminate 5s linear infinite',
        'box-shadow': `
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      };
    }

    // Modo determinado: el ancho del progreso debe ser exactamente el porcentaje
    const currentProgressWidth = progressPercentage();

    if (currentProgressWidth === 0) {
      return {
        height: '100%',
        width: '0%',
        background: 'transparent',
      };
    }

    // Crear un patrón de bloques que se repita a lo largo de toda la barra
    // Los bloques se mostrarán dentro del área de progreso (X% de la barra)
    const blockPattern = `
      repeating-linear-gradient(
        to right,
        #5BA826 0px,
        #5BA826 ${solidWidth}px,
        transparent ${solidWidth}px,
        transparent ${blockWidth}px
      )
    `;

    return {
      height: '100%',
      width: `${currentProgressWidth}%`,
      background: blockPattern,
      'box-shadow': `
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      transition: 'width 0.3s ease',
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
            background-position: -${blockWidth * 3}px 0, -${
        blockWidth * 2
      }px 0, -${blockWidth}px 0;
          }
          to {
            background-position: 100% 0, calc(100% + ${blockWidth}px) 0, calc(100% + ${
        blockWidth * 2
      }px) 0;
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
      style={progressBarStyle()}
      {...others}
    >
      <div
        class={cn('xp-progress-bar-fill', local.indeterminate && 'animated')}
        style={progressFillStyle()}
      />
    </div>
  );
}
