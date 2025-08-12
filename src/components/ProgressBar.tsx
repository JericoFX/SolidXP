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

  const progressFillStyle = () => {
    const blockWidth = 16; // ancho total de cada bloque
    const solidWidth = 12; // parte sólida del bloque
    const gapWidth = 4; // separación transparente

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
        animation: 'xp-progress-indeterminate 2s linear infinite',
        'box-shadow': `
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
      };
    }

    // Modo determinado: calcular número de bloques basado en progreso
    // Calcular el ancho disponible dinámicamente
    const getContainerWidth = () => {
      if (local.width) {
        // Si se especifica un ancho, usarlo (menos bordes)
        const widthValue = parseFloat(local.width.replace('px', ''));
        return widthValue - 2; // Restar bordes
      }
      // Si no se especifica ancho, usar un valor por defecto
      return 298; // Valor por defecto menos bordes
    };

    const containerWidth = getContainerWidth();
    const maxBlocks = Math.floor(containerWidth / blockWidth);
    const progressWidth = (progressPercentage() / 100) * containerWidth;
    const numberOfBlocks = Math.floor(progressWidth / blockWidth);

    if (numberOfBlocks === 0) {
      return {
        height: '100%',
        width: '0%',
        background: 'transparent',
      };
    }

    // Crear un patrón de bloques que respete el porcentaje exacto
    const exactProgressWidth = (progressPercentage() / 100) * containerWidth;

    // Si hay al menos un bloque completo o parcial
    if (exactProgressWidth > 0) {
      const completeBlocks = Math.floor(exactProgressWidth / blockWidth);
      const remainingWidth = exactProgressWidth % blockWidth;

      // Crear gradientes para bloques completos
      const completeBlockGradients = Array.from(
        { length: completeBlocks },
        () =>
          `linear-gradient(to bottom, #7ED321 0%, #5BA826 50%, #4E9A20 100%)`
      );

      // Si hay un bloque parcial, agregarlo
      if (remainingWidth > 0 && completeBlocks < maxBlocks) {
        const partialBlockWidth = Math.min(remainingWidth, solidWidth);
        completeBlockGradients.push(
          `linear-gradient(to bottom, #7ED321 0%, #5BA826 50%, #4E9A20 100%)`
        );
      }

      const gradients = completeBlockGradients.join(', ');

      const totalBlocks = completeBlockGradients.length;
      const sizes = Array.from({ length: totalBlocks }, (_, i) => {
        if (
          i === totalBlocks - 1 &&
          remainingWidth > 0 &&
          remainingWidth < solidWidth
        ) {
          // Último bloque parcial
          return `${Math.min(remainingWidth, solidWidth)}px 100%`;
        }
        return `${solidWidth}px 100%`;
      }).join(', ');

      const positions = Array.from(
        { length: totalBlocks },
        (_, i) => `${i * blockWidth}px 0`
      ).join(', ');

      return {
        height: '100%',
        width: `${exactProgressWidth}%`,
        background: gradients,
        'background-size': sizes,
        'background-position': positions,
        'background-repeat': 'no-repeat',
        'box-shadow': `
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
      `,
        transition: 'width 0.3s ease',
      };
    }

    // Si no hay progreso, devolver transparente
    return {
      height: '100%',
      width: '0%',
      background: 'transparent',
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
