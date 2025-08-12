import { mergeProps, splitProps, Show, createEffect, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { cn } from '../utils/cn';
import { Window } from './Window';
import type { ModalProps } from '../types';
import "./Modal.css";

export function Modal(props: ModalProps) {
  const merged = mergeProps({
    open: false,
    closable: true,
    centered: true,
    overlay: true,
    escapeToClose: true,
  }, props);

  const [local, others] = splitProps(merged, [
    'open',
    'title',
    'children',
    'onClose',
    'closable',
    'centered',
    'overlay',
    'escapeToClose',
    'class'
  ]);

  let dialogRef: HTMLDivElement;

  // Handle escape key
  createEffect(() => {
    if (local.open && local.escapeToClose) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && local.onClose) {
          local.onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      onCleanup(() => document.removeEventListener('keydown', handleEscape));
    }
  });

  // Focus management
  createEffect(() => {
    if (local.open && dialogRef) {
      dialogRef.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget && local.onClose && local.closable) {
      local.onClose();
    }
  };

  return (
    <Show when={local.open}>
      <Portal>
        <div
          class={cn(
            'xp-modal-overlay',
            !local.overlay && 'xp-modal-overlay-transparent',
            local.centered && 'xp-modal-centered'
          )}
          onClick={handleOverlayClick}
        >
          <div
            ref={dialogRef!}
            role="dialog"
            aria-modal="true"
            aria-labelledby={local.title ? 'modal-title' : undefined}
            tabindex="-1"
            class={cn('xp-modal', local.class)}
            {...others}
          >
            <Window
              title={local.title}
              closable={local.closable}
              minimizable={false}
              maximizable={false}
              resizable={false}
              onClose={local.onClose}
            >
              {local.children}
            </Window>
          </div>
        </div>
      </Portal>
    </Show>
  );
}