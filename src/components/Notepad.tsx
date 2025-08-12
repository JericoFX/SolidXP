import {
  mergeProps,
  splitProps,
  createSignal,
  createMemo,
  createEffect,
} from 'solid-js';
import { cn } from '../utils/cn';
import type { NotepadProps } from '../types';
import './Notepad.css';

export function Notepad(props: NotepadProps) {
  const merged = mergeProps(
    {
      value: '',
      placeholder: 'Start typing...',
      readOnly: false,
      showLineNumbers: false,
      fontFamily: 'Lucida Console, monospace',
      fontSize: '12px',
      width: '100%',
      height: '400px',
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'value',
    'placeholder',
    'readOnly',
    'showLineNumbers',
    'fontFamily',
    'fontSize',
    'width',
    'height',
    'onChange',
    'onSave',
    'class',
  ]);

  const [internalValue, setInternalValue] = createSignal(local.value || '');
  let textareaRef: HTMLTextAreaElement;

  // Update internal value when props change
  createEffect(() => {
    if (local.value !== internalValue()) {
      setInternalValue(local.value || '');
    }
  });

  // Calculate line numbers
  const lineNumbers = createMemo(() => {
    if (!local.showLineNumbers) return [];
    const lines = internalValue().split('\n').length;
    return Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);
  });

  // Container styles
  const containerStyle = () => ({
    width: local.width,
    height: local.height,
  });

  // Text area styles
  const textareaStyle = () => ({
    'font-family': local.fontFamily,
    'font-size': local.fontSize,
    'padding-left': local.showLineNumbers ? '45px' : '8px',
  });

  // Line numbers styles
  const lineNumbersStyle = () => ({
    'font-family': local.fontFamily,
    'font-size': local.fontSize,
    width: '40px',
  });

  // Handle text change
  const handleInput = (event: InputEvent) => {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    setInternalValue(value);
    local.onChange?.(value);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      local.onSave?.(internalValue());
    }
  };

  // Focus methods - not used but exposed for potential API
  // const focus = () => textareaRef?.focus();
  // const selectAll = () => {
  //   textareaRef?.focus();
  //   textareaRef?.select();
  // };

  return (
    <div
      class={cn('xp-notepad', local.class)}
      style={containerStyle()}
      {...others}
    >
      {/* Line numbers */}
      {local.showLineNumbers && (
        <div class="xp-notepad-line-numbers" style={lineNumbersStyle()}>
          {lineNumbers().map((num) => (
            <div class="xp-notepad-line-number">{num}</div>
          ))}
        </div>
      )}

      {/* Text area */}
      <textarea
        ref={textareaRef!}
        class="xp-notepad-textarea"
        style={textareaStyle()}
        value={internalValue()}
        placeholder={local.placeholder}
        readOnly={local.readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        spellcheck={false}
        wrap="off"
      />
    </div>
  );
}