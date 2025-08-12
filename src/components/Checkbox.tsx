import { mergeProps, splitProps, createEffect } from 'solid-js';
import { cn } from '../utils/cn';
import type { CheckboxProps } from '../types';

export function Checkbox(props: CheckboxProps) {
  const merged = mergeProps({
    checked: false,
    disabled: false,
    indeterminate: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'checked',
    'indeterminate',
    'class',
    'children',
    'onChange',
    'disabled'
  ]);

  let inputRef: HTMLInputElement | undefined;

  createEffect(() => {
    if (inputRef) {
      inputRef.indeterminate = local.indeterminate || false;
    }
  });

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    local.onChange?.(target.checked, event);
  };

  return (
    <div class={cn('field-row', local.class)}>
      <input
        ref={inputRef!}
        type="checkbox"
        checked={local.checked}
        disabled={local.disabled}
        onChange={handleChange}
        {...others}
      />
      {local.children && (
        <label for={others.id}>{local.children}</label>
      )}
    </div>
  );
}