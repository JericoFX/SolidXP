import { JSX, mergeProps, splitProps } from 'solid-js';
import { cn } from '../utils/cn';

interface TreeViewProps {
  class?: string;
  children?: JSX.Element;
  width?: string;
  height?: string;
  onItemClick?: (item: any, event: MouseEvent) => void;
  onItemDoubleClick?: (item: any, event: MouseEvent) => void;
}

interface TreeItemProps {
  class?: string;
  children?: JSX.Element;
  open?: boolean;
  label?: JSX.Element;
  data?: any;
  onClick?: (item: any, event: MouseEvent) => void;
  onDoubleClick?: (item: any, event: MouseEvent) => void;
}

export function TreeItem(props: TreeItemProps) {
  const merged = mergeProps({
    open: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'open',
    'label',
    'data',
    'onClick',
    'onDoubleClick',
    'class',
    'children'
  ]);

  const handleClick = (event: MouseEvent) => {
    if (local.onClick) {
      local.onClick(local.data, event);
    }
  };

  const handleDoubleClick = (event: MouseEvent) => {
    if (local.onDoubleClick) {
      local.onDoubleClick(local.data, event);
    }
  };

  return (
    <li class={cn(local.class)} {...others}>
      {local.label ? (
        <details open={local.open}>
          <summary 
            onClick={handleClick}
            onDblClick={handleDoubleClick}
          >
            {local.label}
          </summary>
          {local.children && (
            <ul class="tree-view">
              {local.children}
            </ul>
          )}
        </details>
      ) : (
        <span 
          onClick={handleClick}
          onDblClick={handleDoubleClick}
        >
          {local.children}
        </span>
      )}
    </li>
  );
}

export function TreeView(props: TreeViewProps) {
  const [local, others] = splitProps(props, [
    'class',
    'width',
    'height',
    'onItemClick',
    'onItemDoubleClick',
    'children'
  ]);

  const containerStyle = () => ({
    width: local.width || '100%',
    height: local.height || 'auto',
    ...(local.height && { 'overflow-y': 'auto' as const })
  });

  return (
    <ul 
      class={cn('tree-view', local.class)} 
      style={containerStyle()}
      {...others}
    >
      {local.children}
    </ul>
  );
}