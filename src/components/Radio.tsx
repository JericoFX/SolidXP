import { mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';
import type { RadioProps } from '../types';

export function Radio(props: RadioProps) {
  const merged = mergeProps({
    checked: false,
    disabled: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'checked',
    'value',
    'class',
    'children',
    'onChange',
    'disabled'
  ]);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    local.onChange?.(target.checked, event);
  };

  return (
    <div class={cn('field-row', local.class)}>
      <input
        type="radio"
        checked={local.checked}
        disabled={local.disabled}
        value={local.value}
        onChange={handleChange}
        {...others}
      />
      {local.children && (
        <label for={others.id}>{local.children}</label>
      )}
    </div>
  );
}