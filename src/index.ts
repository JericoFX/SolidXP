// Import xp.css styles automatically when the library is used
import 'xp.css/dist/XP.css';

// Export all components
export { Window } from './components/Window';
export { Button } from './components/Button';
export { Checkbox } from './components/Checkbox';
export { Radio } from './components/Radio';
export { TextBox } from './components/TextBox';
export { Select } from './components/Select';
export { Tabs, Tab, TabContainer } from './components/Tabs';
export { ProgressBar } from './components/ProgressBar';
export { Slider } from './components/Slider';
export { TreeView, TreeItem } from './components/TreeView';
export { StatusBar, StatusField } from './components/StatusBar';
export { Modal } from './components/Modal';
export { Table } from './components/Table';
export { FileExplorer } from './components/FileExplorer';
export { Notepad } from './components/Notepad';
export { ImageViewer } from './components/ImageViewer';

// Export utilities
export { cn } from './utils/cn';
export { useTheme, applyTheme, type Theme } from './utils/themes';

// Export types
export type * from './types';