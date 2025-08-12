import { JSX, splitProps } from 'solid-js';
import { cn } from '../utils/cn';

interface StatusBarProps {
  class?: string;
  children?: JSX.Element;
}

interface StatusFieldProps {
  class?: string;
  children?: JSX.Element;
}

export function StatusField(props: StatusFieldProps) {
  const [local, others] = splitProps(props, [
    'class',
    'children'
  ]);

  return (
    <div class={cn('status-bar-field', local.class)} {...others}>
      {local.children}
    </div>
  );
}

export function StatusBar(props: StatusBarProps) {
  const [local, others] = splitProps(props, [
    'class',
    'children'
  ]);

  return (
    <div class={cn('status-bar', local.class)} {...others}>
      {local.children}
    </div>
  );
}