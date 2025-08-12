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
  statusBar?: JSX.Element;
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
  width?: string;
  height?: string;
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

/**
 * Modal props
 */
export interface ModalProps extends BaseProps {
  open?: boolean;
  title?: string;
  onClose?: () => void;
  closable?: boolean;
  centered?: boolean;
  overlay?: boolean;
  escapeToClose?: boolean;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  accessor?: (row: T) => any;
  render?: (row: T, index: number) => JSX.Element;
}

/**
 * Table row type (generic)
 */
export type TableRow = Record<string, any>;

/**
 * Table props
 */
export interface TableProps<T = any> extends BaseProps {
  columns: TableColumn<T>[];
  data: T[];
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  size?: 'small' | 'medium' | 'large';
  caption?: string;
  selectedRows?: T[];
  width?: string;
  height?: string;
  stickyHeader?: boolean;
  onRowClick?: (row: T, index: number, event: MouseEvent) => void;
  onRowDoubleClick?: (row: T, index: number, event: MouseEvent) => void;
  onRowSelect?: (row: T, index: number) => void;
  onCellClick?: (row: T, column: TableColumn<T>, value: any, event: MouseEvent) => void;
  onHeaderClick?: (column: TableColumn<T>, event: MouseEvent) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
}

/**
 * File Explorer types
 */
export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: Date;
  icon?: string;
  path?: string;
}

export interface FileExplorerProps extends BaseProps {
  data?: FileItem[];
  currentPath?: string;
  viewMode?: 'icons' | 'details';
  showHidden?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  width?: string;
  height?: string;
  onNavigate?: (path: string, item: FileItem) => void;
  onFileSelect?: (item: FileItem, selectedItems: string[]) => void;
  onFileOpen?: (item: FileItem) => void;
  onSearchChange?: (searchTerm: string, filteredItems: FileItem[]) => void;
}

/**
 * Notepad component types
 */
export interface NotepadProps extends BaseProps {
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  fontFamily?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  onChange?: (value: string) => void;
  onSave?: (value: string) => void;
}

/**
 * ImageViewer component types
 */
export interface ImageViewerProps extends BaseProps {
  images: string[];
  currentIndex?: number;
  showThumbnails?: boolean;
  showControls?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  width?: string;
  height?: string;
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  modal?: boolean;
  modalTitle?: string;
  modalOverlay?: boolean;
  modalCentered?: boolean;
  modalEscapeToClose?: boolean;
  onImageChange?: (index: number, src: string) => void;
  onClose?: () => void;
}