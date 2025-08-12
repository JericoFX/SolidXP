import { JSX, mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';

interface TreeViewProps {
  class?: string;
  children?: JSX.Element;
}

interface TreeItemProps {
  class?: string;
  children?: JSX.Element;
  open?: boolean;
  label?: JSX.Element;
}

export function TreeItem(props: TreeItemProps) {
  const merged = mergeProps({
    open: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'open',
    'label',
    'class',
    'children'
  ]);

  return (
    <li class={cn(local.class)} {...others}>
      {local.label ? (
        <details open={local.open}>
          <summary>{local.label}</summary>
          {local.children && (
            <ul class="tree-view">
              {local.children}
            </ul>
          )}
        </details>
      ) : (
        local.children
      )}
    </li>
  );
}

export function TreeView(props: TreeViewProps) {
  const [local, others] = splitProps(props, [
    'class',
    'children'
  ]);

  return (
    <ul class={cn('tree-view', local.class)} {...others}>
      {local.children}
    </ul>
  );
}