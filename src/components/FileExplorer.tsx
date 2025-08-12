import {
  mergeProps,
  splitProps,
  createSignal,
  For,
  Show,
  createMemo,
} from 'solid-js';
import { cn } from '../utils/cn';
import type { FileExplorerProps, FileItem } from '../types';
import './FileExplorer.css';

export function FileExplorer(props: FileExplorerProps) {
  const merged = mergeProps(
    {
      width: '100%',
      height: '400px',
      viewMode: 'icons' as const,
      showHidden: false,
      showSearch: true,
      searchPlaceholder: 'Search files and folders...',
      currentPath: '',
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'data',
    'currentPath',
    'width',
    'height',
    'viewMode',
    'showHidden',
    'showSearch',
    'searchPlaceholder',
    'onNavigate',
    'onFileSelect',
    'onFileOpen',
    'onSearchChange',
    'class',
  ]);

  const [selectedItems, setSelectedItems] = createSignal<string[]>([]);
  const [lastClickTime, setLastClickTime] = createSignal<number>(0);
  const [lastClickedItem, setLastClickedItem] = createSignal<string>('');
  const [history, setHistory] = createSignal<string[]>([]);
  const [historyIndex, setHistoryIndex] = createSignal<number>(-1);
  const [searchTerm, setSearchTerm] = createSignal<string>('');

  // Navigation functions
  const canGoBack = () => historyIndex() > 0;
  const canGoForward = () => historyIndex() < history().length - 1;

  const navigateBack = () => {
    if (canGoBack()) {
      const newIndex = historyIndex() - 1;
      setHistoryIndex(newIndex);
      const path = history()[newIndex];
      local.onNavigate?.(path, { name: path.split('/').pop() || '', type: 'folder' });
    }
  };

  const navigateForward = () => {
    if (canGoForward()) {
      const newIndex = historyIndex() + 1;
      setHistoryIndex(newIndex);
      const path = history()[newIndex];
      local.onNavigate?.(path, { name: path.split('/').pop() || '', type: 'folder' });
    }
  };

  const navigateUp = () => {
    const currentPath = local.currentPath || '';
    if (currentPath) {
      const parentPath = currentPath.split('/').slice(0, -1).join('/');
      navigateToPath(parentPath);
    }
  };

  const navigateToPath = (newPath: string) => {
    const currentPath = local.currentPath || '';
    if (newPath !== currentPath) {
      // Add to history
      const currentHistory = history();
      const currentIndex = historyIndex();
      
      // Remove any forward history when navigating to a new path
      const newHistory = currentHistory.slice(0, currentIndex + 1);
      newHistory.push(newPath);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      local.onNavigate?.(newPath, { name: newPath.split('/').pop() || 'My Computer', type: 'folder' });
    }
  };

  // Breadcrumb generation
  const breadcrumbs = createMemo(() => {
    const path = local.currentPath || '';
    if (!path) return [{ name: 'My Computer', path: '' }];
    
    const parts = path.split('/').filter(Boolean);
    const crumbs = [{ name: 'My Computer', path: '' }];
    
    let currentPath = '';
    for (const part of parts) {
      currentPath += (currentPath ? '/' : '') + part;
      crumbs.push({ name: part, path: currentPath });
    }
    
    return crumbs;
  });

  // Filter and sort items
  const visibleItems = createMemo(() => {
    if (!local.data) return [];

    let items = local.data.filter(
      (item: { name: string }) => local.showHidden || !item.name.startsWith('.')
    );

    // Apply search filter
    const search = searchTerm().toLowerCase().trim();
    if (search) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search)
      );
    }

    // Sort: folders first, then files, alphabetically
    const sortedItems = items.sort(
      (a: { type: string; name: string }, b: { type: string; name: any }) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      }
    );

    // Notify search changes
    local.onSearchChange?.(search, sortedItems);

    return sortedItems;
  });

  const containerStyle = () => ({
    width: local.width,
    height: local.height,
  });

  // Handle search input
  const handleSearchInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    setSearchTerm(target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleItemClick = (item: FileItem, event: MouseEvent) => {
    const now = Date.now();
    const timeDiff = now - lastClickTime();
    const isDoubleClick = timeDiff < 500 && lastClickedItem() === item.name;

    setLastClickTime(now);
    setLastClickedItem(item.name);

    if (isDoubleClick) {
      // Double click - navigate or open
      if (item.type === 'folder') {
        const newPath = local.currentPath
          ? `${local.currentPath}/${item.name}`
          : item.name;
        navigateToPath(newPath);
      } else {
        local.onFileOpen?.(item);
      }
    } else {
      // Single click - select
      if (event.ctrlKey) {
        // Multi-select with Ctrl
        setSelectedItems((prev) =>
          prev.includes(item.name)
            ? prev.filter((name) => name !== item.name)
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
      case 'txt':
        return '📄';
      case 'doc':
        return '📝';
      case 'docx':
        return '📝';
      case 'pdf':
        return '📋';
      case 'jpg':
        return '🖼️';
      case 'jpeg':
        return '🖼️';
      case 'png':
        return '🖼️';
      case 'gif':
        return '🖼️';
      case 'mp3':
        return '🎵';
      case 'wav':
        return '🎵';
      case 'mp4':
        return '🎥';
      case 'avi':
        return '🎬';
      case 'zip':
        return '🗜️';
      case 'rar':
        return '🗜️';
      case 'exe':
        return '⚙️';
      default:
        return '📄';
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
      <div class='xp-explorer-address-bar'>
        <div class='xp-explorer-nav-buttons'>
          <button
            class='xp-explorer-nav-button'
            onClick={navigateBack}
            disabled={!canGoBack()}
            title='Back'
          >
            ◀
          </button>
          <button
            class='xp-explorer-nav-button'
            onClick={navigateForward}
            disabled={!canGoForward()}
            title='Forward'
          >
            ▶
          </button>
          <button
            class='xp-explorer-nav-button'
            onClick={navigateUp}
            disabled={!local.currentPath}
            title='Up'
          >
            ⬆
          </button>
        </div>
        <div class='xp-explorer-breadcrumb'>
          <For each={breadcrumbs()}>
            {(crumb, index) => (
              <>
                <span
                  class='xp-explorer-breadcrumb-item'
                  onClick={() => index() < breadcrumbs().length - 1 && navigateToPath(crumb.path)}
                >
                  {crumb.name}
                </span>
                <Show when={index() < breadcrumbs().length - 1}>
                  <span class='xp-explorer-breadcrumb-separator'>▶</span>
                </Show>
              </>
            )}
          </For>
        </div>
      </div>

      {/* Search Bar */}
      <Show when={local.showSearch}>
        <div class="xp-explorer-search-bar">
          <div class="xp-explorer-search-container">
            <input
              type="text"
              class="xp-explorer-search-input"
              placeholder={local.searchPlaceholder}
              value={searchTerm()}
              onInput={handleSearchInput}
            />
            <Show when={searchTerm()}>
              <button
                class="xp-explorer-search-clear"
                onClick={clearSearch}
                title="Clear search"
              >
                ✕
              </button>
            </Show>
          </div>
        </div>
      </Show>

      {/* File Area */}
      <div class='xp-explorer-content'>
        <Show when={local.viewMode === 'icons'}>
          <div class='xp-explorer-icons-view'>
            <For each={visibleItems()}>
              {(item) => (
                <div
                  class={cn(
                    'xp-explorer-item',
                    isSelected(item) && 'xp-explorer-item-selected'
                  )}
                  onClick={(e) => handleItemClick(item, e)}
                  title={`${item.name}${
                    item.size ? ` (${formatFileSize(item.size)})` : ''
                  }`}
                >
                  <div class='xp-explorer-item-icon'>{getFileIcon(item)}</div>
                  <div class='xp-explorer-item-name'>{item.name}</div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={local.viewMode === 'details'}>
          <div class='xp-explorer-details-view'>
            <div class='xp-explorer-details-header'>
              <div class='xp-explorer-details-col'>Name</div>
              <div class='xp-explorer-details-col'>Size</div>
              <div class='xp-explorer-details-col'>Type</div>
              <div class='xp-explorer-details-col'>Modified</div>
            </div>
            <div class='xp-explorer-details-content'>
              <For each={visibleItems()}>
                {(item) => (
                  <div
                    class={cn(
                      'xp-explorer-details-row',
                      isSelected(item) && 'xp-explorer-details-row-selected'
                    )}
                    onClick={(e) => handleItemClick(item, e)}
                  >
                    <div class='xp-explorer-details-cell'>
                      <span class='xp-explorer-details-icon'>
                        {getFileIcon(item)}
                      </span>
                      {item.name}
                    </div>
                    <div class='xp-explorer-details-cell'>
                      {item.type === 'folder' ? '' : formatFileSize(item.size)}
                    </div>
                    <div class='xp-explorer-details-cell'>
                      {item.type === 'folder'
                        ? 'File Folder'
                        : `${item.name.split('.').pop()?.toUpperCase()} File`}
                    </div>
                    <div class='xp-explorer-details-cell'>
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
      <div class='xp-explorer-status'>
        <span>
          {visibleItems().length} object(s)
          {searchTerm() && ` (filtered from ${local.data?.length || 0})`}
        </span>
        {selectedItems().length > 0 && (
          <span>{selectedItems().length} selected</span>
        )}
        {searchTerm() && (
          <span>Search: "{searchTerm()}"</span>
        )}
      </div>
    </div>
  );
}
