import { mergeProps, splitProps, createSignal } from 'solid-js';
import { cn } from '../utils/cn';
import type { WindowProps } from '../types';

export function Window(props: WindowProps) {
  const merged = mergeProps({
    title: 'Window',
    resizable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
  }, props);

  const [local, others] = splitProps(merged, [
    'title',
    'resizable',
    'minimizable', 
    'maximizable',
    'closable',
    'onClose',
    'onMinimize',
    'onMaximize',
    'class',
    'children'
  ]);

  const [isMaximized, setIsMaximized] = createSignal(false);

  const handleMinimize = () => {
    local.onMinimize?.();
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized());
    local.onMaximize?.();
  };

  const handleClose = () => {
    local.onClose?.();
  };

  return (
    <div
      class={cn(
        'window',
        isMaximized() && 'maximized',
        local.class
      )}
      {...others}
    >
      <div class="title-bar">
        <div class="title-bar-text">{local.title}</div>
        <div class="title-bar-controls">
          {local.minimizable && (
            <button
              aria-label="Minimize"
              onClick={handleMinimize}
              type="button"
            />
          )}
          {local.maximizable && (
            <button
              aria-label="Maximize"
              onClick={handleMaximize}
              type="button"
            />
          )}
          {local.closable && (
            <button
              aria-label="Close"
              onClick={handleClose}
              type="button"
            />
          )}
        </div>
      </div>
      <div class="window-body">
        {local.children}
      </div>
    </div>
  );
}