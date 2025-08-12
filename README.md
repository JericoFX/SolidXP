# SolidXP

A comprehensive SolidJS component library that wraps [xp.css](https://github.com/botoxparty/XP.css) to provide type-safe, reactive Windows XP UI components.

## Features

- 🎨 **Windows XP Aesthetic**: Authentic Windows XP styling via xp.css
- ⚡ **SolidJS Powered**: Fast, reactive components with minimal overhead
- 📦 **TypeScript Support**: Full type safety and IntelliSense
- 🔧 **Modular Architecture**: Import only the components you need
- 📱 **Responsive Design**: Adapts to different screen sizes while maintaining XP look
- 🎯 **Developer Experience**: Easy to use with intuitive APIs

## Installation

```bash
npm install solidxp
# or
yarn add solidxp
# or
bun add solidxp
```

## Quick Start

```tsx
import { Window, Button } from 'solidxp';

function App() {
  return (
    <Window title="My XP App">
      <Button onClick={() => alert('Hello XP!')}>
        Click me!
      </Button>
    </Window>
  );
}
```

## Available Components

- `Window` - Main window container with title bar and controls
- `Button` - Windows XP style buttons
- `Checkbox` - Checkbox inputs
- `Radio` - Radio button inputs  
- `TextBox` - Text input fields
- `Select` - Dropdown selection
- `Tabs` - Tab navigation
- `TreeView` - Hierarchical tree navigation
- `ProgressBar` - Progress indicators
- `Slider` - Range input sliders
- And more...

## Development

This project uses Bun as the package manager and build tool.

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build library
bun run build:lib

# Build playground
bun run build

# Type check
bun run typecheck

# Lint code
bun run lint
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Credits

- Built with [SolidJS](https://solidjs.com)
- Styled with [xp.css](https://github.com/botoxparty/XP.css)
- Inspired by the classic Windows XP interface