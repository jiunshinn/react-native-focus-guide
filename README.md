# react-native-focus-guide

A React Native library that provides an elegant way to create interactive focus guides and tooltips. It allows you to highlight specific components and display tooltips with smooth animations, perfect for creating onboarding experiences, feature walkthroughs, and interactive tutorials in your React Native applications.

## Features

- 🔍 Highlight specific components with customizable overlay
- 💬 Display tooltips with flexible positioning
- 🎯 Multiple tooltip position options (top, bottom, left, right, center, and more)
- 📱 Responsive design that adapts to screen boundaries
- 🎨 Customizable styling and positioning
- ⚡️ Smooth animations and transitions

## Installation

```sh
npm install react-native-focus-guide
# or
yarn add react-native-focus-guide
```

## Usage

Here's a basic example of how to use the library:

```jsx
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { HighlightToolTip } from 'react-native-focus-guide';

const App = () => {
  const targetRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        ref={targetRef}
        onPress={() => setShowTooltip(true)}
        style={{
          padding: 20,
          backgroundColor: '#007AFF',
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white' }}>Click me!</Text>
      </TouchableOpacity>

      {showTooltip && (
        <HighlightToolTip
          targetRef={targetRef}
          tooltipPosition="bottom"
          onRequestClose={() => setShowTooltip(false)}
        >
          <View
            style={{ padding: 16, backgroundColor: 'white', borderRadius: 8 }}
          >
            <Text>This is a tooltip!</Text>
          </View>
        </HighlightToolTip>
      )}
    </View>
  );
};
```

## Props

The `HighlightToolTip` component accepts the following props:

| Prop              | Type                         | Required | Default          | Description                                         |
| ----------------- | ---------------------------- | -------- | ---------------- | --------------------------------------------------- |
| `targetRef`       | `React.RefObject`            | Yes      | -                | Reference to the component you want to highlight    |
| `children`        | `React.ReactNode`            | Yes      | -                | Content to display in the tooltip                   |
| `onRequestClose`  | `() => void`                 | Yes      | -                | Function called when the tooltip should be closed   |
| `tooltipPosition` | `TooltipPosition`            | No       | 'bottom'         | Position of the tooltip relative to the target      |
| `offset`          | `{ x?: number; y?: number }` | No       | `{ x: 0, y: 0 }` | Offset for tooltip positioning                      |
| `allowOverlap`    | `boolean`                    | No       | `false`          | Whether to allow tooltip to overlap with the target |

### TooltipPosition Types

```typescript
type TooltipPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';
```

## Advanced Usage

### Custom Styling

You can customize the tooltip's appearance by wrapping your content in a styled View:

```jsx
<HighlightToolTip
  targetRef={targetRef}
  tooltipPosition="bottom"
  onRequestClose={() => setShowTooltip(false)}
>
  <View
    style={{
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}
  >
    <Text style={{ fontSize: 16, color: '#333' }}>Custom styled tooltip!</Text>
  </View>
</HighlightToolTip>
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
