import { mergeProps, splitProps, createSignal, For, Show, createMemo } from 'solid-js';
import { cn } from '../utils/cn';
import type { FileExplorerProps, FileItem } from '../types';
import "./FileExplorer.css";

export function FileExplorer(props: FileExplorerProps) {
  const merged = mergeProps({
    width: '100%',
    height: '400px',
    viewMode: 'icons' as const,
    showHidden: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'data',
    'currentPath',
    'width',
    'height',
    'viewMode',
    'showHidden',
    'onNavigate',
    'onFileSelect',
    'onFileOpen',
    'class'
  ]);

  const [selectedItems, setSelectedItems] = createSignal<string[]>([]);
  const [lastClickTime, setLastClickTime] = createSignal<number>(0);
  const [lastClickedItem, setLastClickedItem] = createSignal<string>('');

  // Filter and sort items
  const visibleItems = createMemo(() => {
    if (!local.data) return [];
    
    let items = local.data.filter(item => 
      local.showHidden || !item.name.startsWith('.')
    );
    
    // Sort: folders first, then files, alphabetically
    return items.sort((a, b) => {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    });
  });

  const containerStyle = () => ({
    width: local.width,
    height: local.height
  });

  const handleItemClick = (item: FileItem, event: MouseEvent) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime();
    const isDoubleClick = timeDiff < 500 && lastClickedItem() === item.name;

    setLastClickTime(now);
    setLastClickedItem(item.name);

    if (isDoubleClick) {
      // Double click - navigate or open
      if (item.type === 'folder') {
        const newPath = local.currentPath ? `${local.currentPath}/${item.name}` : item.name;
        local.onNavigate?.(newPath, item);
      } else {
        local.onFileOpen?.(item);
      }
    } else {
      // Single click - select
      if (event.ctrlKey) {
        // Multi-select with Ctrl
        setSelectedItems(prev => 
          prev.includes(item.name) 
            ? prev.filter(name => name !== item.name)
            : [...prev, item.name]
        );
      } else {
        // Single select
        setSelectedItems([item.name]);
      }
      local.onFileSelect?.(item, selectedItems());
    }
  };

  const isSelected = (item: FileItem) => selectedItems().includes(item.name);

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return '📁';
    }
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'txt': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'pdf': return '📋';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      case 'mp3':
      case 'wav': return '🎵';
      case 'mp4':
      case 'avi': return '🎬';
      case 'zip':
      case 'rar': return '🗜️';
      case 'exe': return '⚙️';
      default: return '📄';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  };

  return (
    <div 
      class={cn('xp-file-explorer', local.class)}
      style={containerStyle()}
      {...others}
    >
      {/* Address Bar */}
      <div class="xp-explorer-address-bar">
        <span class="xp-explorer-path">
          {local.currentPath || 'My Computer'}
        </span>
      </div>

      {/* File Area */}
      <div class="xp-explorer-content">
        <Show when={local.viewMode === 'icons'}>
          <div class="xp-explorer-icons-view">
            <For each={visibleItems()}>
              {(item) => (
                <div 
                  class={cn(
                    'xp-explorer-item',
                    isSelected(item) && 'xp-explorer-item-selected'
                  )}
                  onClick={(e) => handleItemClick(item, e)}
                  title={`${item.name}${item.size ? ` (${formatFileSize(item.size)})` : ''}`}
                >
                  <div class="xp-explorer-item-icon">
                    {getFileIcon(item)}
                  </div>
                  <div class="xp-explorer-item-name">
                    {item.name}
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={local.viewMode === 'details'}>
          <div class="xp-explorer-details-view">
            <div class="xp-explorer-details-header">
              <div class="xp-explorer-details-col">Name</div>
              <div class="xp-explorer-details-col">Size</div>
              <div class="xp-explorer-details-col">Type</div>
              <div class="xp-explorer-details-col">Modified</div>
            </div>
            <div class="xp-explorer-details-content">
              <For each={visibleItems()}>
                {(item) => (
                  <div 
                    class={cn(
                      'xp-explorer-details-row',
                      isSelected(item) && 'xp-explorer-details-row-selected'
                    )}
                    onClick={(e) => handleItemClick(item, e)}
                  >
                    <div class="xp-explorer-details-cell">
                      <span class="xp-explorer-details-icon">{getFileIcon(item)}</span>
                      {item.name}
                    </div>
                    <div class="xp-explorer-details-cell">
                      {item.type === 'folder' ? '' : formatFileSize(item.size)}
                    </div>
                    <div class="xp-explorer-details-cell">
                      {item.type === 'folder' ? 'File Folder' : `${item.name.split('.').pop()?.toUpperCase()} File`}
                    </div>
                    <div class="xp-explorer-details-cell">
                      {item.modified?.toLocaleDateString()}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Show>
      </div>

      {/* Status Bar */}
      <div class="xp-explorer-status">
        <span>{visibleItems().length} object(s)</span>
        {selectedItems().length > 0 && (
          <span>{selectedItems().length} selected</span>
        )}
      </div>
    </div>
  );
}