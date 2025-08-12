import { mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';
import type { SliderProps } from '../types';

export function Slider(props: SliderProps) {
  const merged = mergeProps({
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal' as const,
    disabled: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'value',
    'min',
    'max',
    'step',
    'orientation',
    'class',
    'children',
    'onChange'
  ]);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    local.onChange?.(Number(target.value), event);
  };

  return (
    <div class={cn('field-row', local.class)}>
      {local.children && (
        <label for={others.id}>{local.children}</label>
      )}
      <input
        type="range"
        min={local.min}
        max={local.max}
        step={local.step}
        value={local.value}
        onChange={handleChange}
        class={cn(
          local.orientation === 'vertical' && 'vertical'
        )}
        {...others}
      />
    </div>
  );
}