import { mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';
import type { ButtonProps } from '../types';

export function Button(props: ButtonProps) {
  const merged = mergeProps({
    variant: 'default' as const,
    size: 'medium' as const,
    type: 'button' as const,
    disabled: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'variant',
    'size', 
    'class',
    'children',
    'disabled'
  ]);

  return (
    <button
      class={cn(
        // Base XP button styles are handled by xp.css
        local.variant === 'default-focus' && 'default-focus',
        local.disabled && 'disabled',
        local.class
      )}
      disabled={local.disabled}
      {...others}
    >
      {local.children}
    </button>
  );
}