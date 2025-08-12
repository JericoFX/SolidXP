import { JSX } from 'solid-js';

/**
 * Base props that all components accept
 */
export interface BaseProps {
  class?: string;
  children?: JSX.Element;
}

/**
 * Common event handlers
 */
export interface ClickableProps {
  onClick?: (event: MouseEvent) => void;
}

/**
 * Form element common props
 */
export interface FormElementProps {
  disabled?: boolean;
  id?: string;
  name?: string;
}

/**
 * Window component specific types
 */
export interface WindowProps extends BaseProps {
  title?: string;
  resizable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
}

/**
 * Button variants and sizes
 */
export type ButtonVariant = 'default' | 'default-focus';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends BaseProps, ClickableProps, FormElementProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Form input props
 */
export interface InputProps extends BaseProps, FormElementProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onInput?: (event: InputEvent) => void;
  onChange?: (event: Event) => void;
}

/**
 * Checkbox and Radio props
 */
export interface CheckboxProps extends BaseProps, FormElementProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean, event: Event) => void;
}

export interface RadioProps extends CheckboxProps {
  value?: string;
}

/**
 * Select dropdown props
 */
export interface SelectProps extends BaseProps, FormElementProps {
  value?: string;
  onChange?: (value: string, event: Event) => void;
  placeholder?: string;
}

/**
 * Tab related props
 */
export interface TabProps extends BaseProps, ClickableProps {
  active?: boolean;
  tabId: string;
}

export interface TabsProps extends BaseProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * Progress bar props
 */
export interface ProgressBarProps extends BaseProps {
  value?: number;
  max?: number;
  indeterminate?: boolean;
}

/**
 * Slider props
 */
export interface SliderProps extends BaseProps, FormElementProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: number, event: Event) => void;
}