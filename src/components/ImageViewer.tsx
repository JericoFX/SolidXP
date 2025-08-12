import {
  mergeProps,
  splitProps,
  createSignal,
  createEffect,
  onCleanup,
  For,
  Show,
  createMemo,
} from 'solid-js';
import { cn } from '../utils/cn';
import type { ImageViewerProps } from '../types';
import { Window } from './Window';
import './ImageViewer.css';

export function ImageViewer(props: ImageViewerProps) {
  const merged = mergeProps(
    {
      currentIndex: 0,
      showThumbnails: true,
      showControls: true,
      autoPlay: false,
      autoPlayInterval: 3000,
      width: '100%',
      height: '500px',
      fit: 'contain' as const,
      modal: false,
      modalTitle: 'Image Viewer',
      modalOverlay: true,
      modalCentered: true,
      modalEscapeToClose: true,
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'images',
    'currentIndex',
    'showThumbnails',
    'showControls',
    'autoPlay',
    'autoPlayInterval',
    'width',
    'height',
    'fit',
    'modal',
    'modalTitle',
    'modalOverlay',
    'modalCentered',
    'modalEscapeToClose',
    'onImageChange',
    'onClose',
    'class',
  ]);

  const [currentIndex, setCurrentIndex] = createSignal(local.currentIndex || 0);
  const [isLoading, setIsLoading] = createSignal(false);
  const [autoPlayActive, setAutoPlayActive] = createSignal(local.autoPlay);
  let intervalId: number | undefined;

  // Ensure current index is within bounds
  createEffect(() => {
    const maxIndex = Math.max(0, local.images.length - 1);
    if (currentIndex() > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  });

  // Current image
  const currentImage = createMemo(() => {
    const index = currentIndex();
    return local.images[index] || '';
  });

  // Navigation functions
  const goToPrevious = () => {
    const newIndex = currentIndex() === 0 ? local.images.length - 1 : currentIndex() - 1;
    changeImage(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex() === local.images.length - 1 ? 0 : currentIndex() + 1;
    changeImage(newIndex);
  };

  const goToImage = (index: number) => {
    if (index >= 0 && index < local.images.length) {
      changeImage(index);
    }
  };

  const changeImage = (index: number) => {
    setCurrentIndex(index);
    local.onImageChange?.(index, local.images[index]);
  };

  // Auto-play functionality
  createEffect(() => {
    if (autoPlayActive() && local.images.length > 1) {
      intervalId = window.setInterval(() => {
        goToNext();
      }, local.autoPlayInterval);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = undefined;
      }
    }
  });

  onCleanup(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  // Toggle auto-play
  const toggleAutoPlay = () => {
    setAutoPlayActive(!autoPlayActive());
  };

  // Container styles
  const containerStyle = () => ({
    width: local.width,
    height: local.height,
  });

  // Image styles
  const imageStyle = () => ({
    'object-fit': local.fit,
  });

  // Keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
      case 'Escape':
        if (local.modal && local.modalEscapeToClose) {
          event.preventDefault();
          local.onClose?.();
        }
        break;
      case ' ':
        event.preventDefault();
        toggleAutoPlay();
        break;
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
  };

  // Start loading when image changes
  createEffect(() => {
    if (currentImage()) {
      setIsLoading(true);
    }
  });

  // Modal handler for overlay clicks
  const handleOverlayClick = (event: MouseEvent) => {
    if (local.modal && event.target === event.currentTarget && local.onClose) {
      local.onClose();
    }
  };

  // Main viewer component
  const ViewerComponent = () => (
    <div
      class={cn('xp-image-viewer', local.class)}
      style={containerStyle()}
      onKeyDown={handleKeyDown}
      tabIndex="0"
      {...others}
    >
      {/* Main image area */}
      <div class="xp-image-viewer-main">
        {/* Image container */}
        <div class="xp-image-viewer-image-container">
          <Show when={isLoading()}>
            <div class="xp-image-viewer-loading">Loading...</div>
          </Show>
          
          <Show when={currentImage()}>
            <img
              class="xp-image-viewer-image"
              src={currentImage()}
              alt={`Image ${currentIndex() + 1} of ${local.images.length}`}
              style={imageStyle()}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </Show>

          {/* Navigation arrows */}
          <Show when={local.showControls && local.images.length > 1}>
            <button
              class="xp-image-viewer-nav xp-image-viewer-nav-prev"
              onClick={goToPrevious}
              title="Previous image (←)"
            >
              ◀
            </button>
            <button
              class="xp-image-viewer-nav xp-image-viewer-nav-next"
              onClick={goToNext}
              title="Next image (→)"
            >
              ▶
            </button>
          </Show>
        </div>

        {/* Controls bar */}
        <Show when={local.showControls}>
          <div class="xp-image-viewer-controls">
            <div class="xp-image-viewer-info">
              <span>{currentIndex() + 1} of {local.images.length}</span>
            </div>
            
            <div class="xp-image-viewer-buttons">
              <Show when={local.images.length > 1}>
                <button
                  class={cn(
                    'xp-image-viewer-button',
                    autoPlayActive() && 'xp-image-viewer-button-active'
                  )}
                  onClick={toggleAutoPlay}
                  title={autoPlayActive() ? 'Pause slideshow (Space)' : 'Start slideshow (Space)'}
                >
                  {autoPlayActive() ? '⏸' : '▶'}
                </button>
              </Show>
              
              <Show when={local.onClose}>
                <button
                  class="xp-image-viewer-button"
                  onClick={local.onClose}
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </Show>
            </div>
          </div>
        </Show>
      </div>

      {/* Thumbnails */}
      <Show when={local.showThumbnails && local.images.length > 1}>
        <div class="xp-image-viewer-thumbnails">
          <div class="xp-image-viewer-thumbnails-container">
            <For each={local.images}>
              {(image, index) => (
                <div
                  class={cn(
                    'xp-image-viewer-thumbnail',
                    index() === currentIndex() && 'xp-image-viewer-thumbnail-active'
                  )}
                  onClick={() => goToImage(index())}
                  title={`Go to image ${index() + 1}`}
                >
                  <img
                    class="xp-image-viewer-thumbnail-image"
                    src={image}
                    alt={`Thumbnail ${index() + 1}`}
                    loading="lazy"
                  />
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Empty state */}
      <Show when={local.images.length === 0}>
        <div class="xp-image-viewer-empty">
          <div class="xp-image-viewer-empty-icon">🖼️</div>
          <div class="xp-image-viewer-empty-text">No images to display</div>
        </div>
      </Show>
    </div>
  );

  // Return modal version or inline version
  if (local.modal) {
    return (
      <div
        class={cn(
          'xp-image-viewer-modal-overlay',
          local.modalCentered && 'xp-image-viewer-modal-centered',
          !local.modalOverlay && 'xp-image-viewer-modal-no-overlay'
        )}
        onClick={handleOverlayClick}
      >
        <Window
          title={local.modalTitle}
          closable={true}
          minimizable={false}
          maximizable={false}
          onClose={local.onClose}
          class="xp-image-viewer-modal-window"
        >
          <ViewerComponent />
        </Window>
      </div>
    );
  }

  return <ViewerComponent />;
}