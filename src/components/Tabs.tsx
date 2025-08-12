import { mergeProps, splitProps, createSignal, For } from 'solid-js';
import { cn } from '../utils/cn';
import type { TabsProps, TabProps } from '../types';

export function Tab(props: TabProps) {
  const merged = mergeProps({
    active: false,
  }, props);

  const [local, others] = splitProps(merged, [
    'active',
    'tabId',
    'class',
    'children'
  ]);

  return (
    <button
      role="tab"
      aria-selected={local.active}
      class={cn(local.class)}
      {...others}
    >
      {local.children}
    </button>
  );
}

interface TabContainerProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  tabs: Array<{ id: string; label: string; content: any }>;
  class?: string;
}

export function TabContainer(props: TabContainerProps) {
  const [activeTab, setActiveTab] = createSignal(props.activeTab || props.tabs[0]?.id || '');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    props.onTabChange?.(tabId);
  };

  return (
    <div class={cn(props.class)}>
      <menu role="tablist" aria-label="Tab Navigation">
        <For each={props.tabs}>
          {(tab) => (
            <button
              role="tab"
              aria-selected={activeTab() === tab.id}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          )}
        </For>
      </menu>
      <For each={props.tabs}>
        {(tab) => (
          activeTab() === tab.id ? (
            <div role="tabpanel">
              {tab.content}
            </div>
          ) : null
        )}
      </For>
    </div>
  );
}

export function Tabs(props: TabsProps) {
  const [local, others] = splitProps(props, [
    'activeTab',
    'onTabChange',
    'class',
    'children'
  ]);

  return (
    <section class={cn(local.class)} {...others}>
      <menu role="tablist" aria-label="Tab Navigation">
        {local.children}
      </menu>
    </section>
  );
}