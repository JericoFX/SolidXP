import { mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';
import type { InputProps } from '../types';

export function TextBox(props: InputProps) {
  const merged = mergeProps({
    disabled: false,
    readOnly: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'class',
    'children',
    'onInput',
    'onChange'
  ]);

  const handleInput = (event: InputEvent) => {
    local.onInput?.(event);
  };

  const handleChange = (event: Event) => {
    local.onChange?.(event);
  };

  return (
    <div class={cn('field-row', local.class)}>
      {local.children && (
        <label for={others.id}>{local.children}</label>
      )}
      <input
        type="text"
        onInput={handleInput}
        onChange={handleChange}
        {...others}
      />
    </div>
  );
}