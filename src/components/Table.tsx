import { mergeProps, splitProps, For, createSignal, createMemo } from 'solid-js';
import { cn } from '../utils/cn';
import type { TableProps, TableColumn, TableRow } from '../types';
import "./Table.css";

export function Table<T = any>(props: TableProps<T>) {
  const merged = mergeProps({
    striped: false,
    bordered: true,
    hoverable: true,
    sortable: false,
    selectable: false,
    size: 'medium' as const,
    stickyHeader: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'columns',
    'data',
    'striped',
    'bordered',
    'hoverable',
    'sortable',
    'selectable',
    'size',
    'width',
    'height',
    'stickyHeader',
    'onRowClick',
    'onRowDoubleClick',
    'onRowSelect',
    'onCellClick',
    'onHeaderClick',
    'onSort',
    'selectedRows',
    'class',
    'caption'
  ]);

  const [sortColumn, setSortColumn] = createSignal<string | null>(null);
  const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');

  const sortedData = createMemo(() => {
    if (!local.sortable || !sortColumn()) {
      return local.data;
    }

    const column = local.columns.find(col => col.key === sortColumn());
    if (!column) return local.data;

    return [...local.data].sort((a, b) => {
      const aValue = column.accessor ? column.accessor(a) : a[column.key];
      const bValue = column.accessor ? column.accessor(b) : b[column.key];
      
      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;
      
      return sortDirection() === 'desc' ? -comparison : comparison;
    });
  });

  const handleHeaderClick = (column: TableColumn<T>, event: MouseEvent) => {
    // Always call the header click callback if provided
    if (local.onHeaderClick) {
      local.onHeaderClick(column, event);
    }
    
    // Only handle sorting if enabled
    if (!local.sortable || !column.sortable) return;
    
    const newDirection = sortColumn() === column.key 
      ? (sortDirection() === 'asc' ? 'desc' : 'asc')
      : 'asc';
    
    setSortColumn(column.key);
    setSortDirection(newDirection);
    
    // Call sort callback if provided
    if (local.onSort) {
      local.onSort(column.key, newDirection);
    }
  };

  const handleRowClick = (row: T, index: number, event: MouseEvent) => {
    if (local.onRowClick) {
      local.onRowClick(row, index, event);
    }
    
    if (local.selectable && local.onRowSelect) {
      local.onRowSelect(row, index);
    }
  };

  const handleRowDoubleClick = (row: T, index: number, event: MouseEvent) => {
    if (local.onRowDoubleClick) {
      local.onRowDoubleClick(row, index, event);
    }
  };

  const handleCellClick = (row: T, column: TableColumn<T>, event: MouseEvent) => {
    // Prevent row click when cell is clicked
    event.stopPropagation();
    
    if (local.onCellClick) {
      const value = column.accessor ? column.accessor(row) : row[column.key];
      local.onCellClick(row, column, value, event);
    }
  };

  const isRowSelected = (row: T, index: number) => {
    if (!local.selectedRows) return false;
    return local.selectedRows.some(selectedRow => 
      selectedRow === row || (typeof selectedRow === 'object' && 
      JSON.stringify(selectedRow) === JSON.stringify(row))
    );
  };

  const containerStyle = () => ({
    width: local.width || '100%',
    height: local.height || 'auto',
    ...(local.height && { 'max-height': local.height })
  });

  return (
    <div 
      class={cn(
        'xp-table-container',
        local.size === 'small' && 'xp-table-size-small',
        local.size === 'large' && 'xp-table-size-large',
        local.stickyHeader && 'xp-table-sticky-header',
        local.class
      )}
      style={containerStyle()}
      {...others}
    >
      {local.caption && (
        <div class="xp-table-caption">{local.caption}</div>
      )}
      
      {/* Header fijo cuando stickyHeader está habilitado */}
      {local.stickyHeader ? (
        <>
          <div class="xp-table-header-container">
            <table class={cn(
              'xp-table',
              'xp-table-header-only',
              local.bordered && 'xp-table-bordered'
            )}>
              <thead class="xp-table-head">
                <tr class="xp-table-header-row">
                  <For each={local.columns}>
                    {(column) => (
                      <th 
                        class={cn(
                          'xp-table-header-cell',
                          local.sortable && column.sortable && 'xp-table-sortable',
                          sortColumn() === column.key && 'xp-table-sorted'
                        )}
                        onClick={(e) => handleHeaderClick(column, e)}
                        style={column.width ? { width: column.width } : {}}
                      >
                        <div class="xp-table-header-content">
                          <span class="xp-table-header-text">{column.header}</span>
                          {local.sortable && column.sortable && (
                            <span class="xp-table-sort-indicator">
                              {sortColumn() === column.key ? (
                                sortDirection() === 'asc' ? '▲' : '▼'
                              ) : '◆'}
                            </span>
                          )}
                        </div>
                      </th>
                    )}
                  </For>
                </tr>
              </thead>
            </table>
          </div>
          
          <div class="xp-table-body-container">
            <table class={cn(
              'xp-table',
              'xp-table-body-only',
              local.striped && 'xp-table-striped',
              local.bordered && 'xp-table-bordered',
              local.hoverable && 'xp-table-hoverable',
              local.selectable && 'xp-table-selectable'
            )}>
              <thead class="xp-table-head-spacer">
                <tr>
                  <For each={local.columns}>
                    {(column) => (
                      <th style={column.width ? { width: column.width } : {}}></th>
                    )}
                  </For>
                </tr>
              </thead>
              <tbody class="xp-table-body">
                <For each={sortedData()}>
                  {(row, index) => (
                    <tr 
                      class={cn(
                        'xp-table-row',
                        isRowSelected(row, index()) && 'xp-table-row-selected'
                      )}
                      onClick={(e) => handleRowClick(row, index(), e)}
                      onDblClick={(e) => handleRowDoubleClick(row, index(), e)}
                    >
                      <For each={local.columns}>
                        {(column) => (
                          <td 
                            class={cn(
                              'xp-table-cell',
                              local.onCellClick && 'xp-table-cell-clickable'
                            )} 
                            style={column.width ? { width: column.width } : {}}
                            onClick={(e) => local.onCellClick && handleCellClick(row, column, e)}
                          >
                            {column.render 
                              ? column.render(row, index())
                              : column.accessor 
                              ? column.accessor(row)
                              : row[column.key]
                            }
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Tabla normal sin sticky header */
        <table class={cn(
          'xp-table',
          local.striped && 'xp-table-striped',
          local.bordered && 'xp-table-bordered',
          local.hoverable && 'xp-table-hoverable',
          local.selectable && 'xp-table-selectable'
        )}>          
          <thead class="xp-table-head">
            <tr class="xp-table-header-row">
              <For each={local.columns}>
                {(column) => (
                  <th 
                    class={cn(
                      'xp-table-header-cell',
                      local.sortable && column.sortable && 'xp-table-sortable',
                      sortColumn() === column.key && 'xp-table-sorted'
                    )}
                    onClick={(e) => handleHeaderClick(column, e)}
                    style={column.width ? { width: column.width } : {}}
                  >
                    <div class="xp-table-header-content">
                      <span class="xp-table-header-text">{column.header}</span>
                      {local.sortable && column.sortable && (
                        <span class="xp-table-sort-indicator">
                          {sortColumn() === column.key ? (
                            sortDirection() === 'asc' ? '▲' : '▼'
                          ) : '◆'}
                        </span>
                      )}
                    </div>
                  </th>
                )}
              </For>
            </tr>
          </thead>
          
          <tbody class="xp-table-body">
            <For each={sortedData()}>
              {(row, index) => (
                <tr 
                  class={cn(
                    'xp-table-row',
                    isRowSelected(row, index()) && 'xp-table-row-selected'
                  )}
                  onClick={(e) => handleRowClick(row, index(), e)}
                  onDblClick={(e) => handleRowDoubleClick(row, index(), e)}
                >
                  <For each={local.columns}>
                    {(column) => (
                      <td 
                        class={cn(
                          'xp-table-cell',
                          local.onCellClick && 'xp-table-cell-clickable'
                        )} 
                        style={column.width ? { width: column.width } : {}}
                        onClick={(e) => local.onCellClick && handleCellClick(row, column, e)}
                      >
                        {column.render 
                          ? column.render(row, index())
                          : column.accessor 
                          ? column.accessor(row)
                          : row[column.key]
                        }
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      )}
    </div>
  );
}