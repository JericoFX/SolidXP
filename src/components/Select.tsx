import { mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';
import type { SelectProps } from '../types';

export function Select(props: SelectProps) {
  const merged = mergeProps({
    disabled: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'class',
    'children',
    'onChange',
    'placeholder'
  ]);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    local.onChange?.(target.value, event);
  };

  return (
    <div class={cn('field-row', local.class)}>
      {local.placeholder && (
        <label for={others.id}>{local.placeholder}</label>
      )}
      <select onChange={handleChange} {...others}>
        {local.children}
      </select>
    </div>
  );
}