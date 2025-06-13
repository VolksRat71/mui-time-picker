# MUI Time Picker

A flexible Material-UI time picker component with support for Years, Weeks, Days, Hours, Minutes, Seconds, and Milliseconds with configurable digit options.

## Features

- 🕒 **Flexible Time Units**: Support for Years, Weeks, Days, Hours, Minutes, Seconds, and Milliseconds
- 🔧 **Configurable Digits**: 1-3 digit options for Years, Days, and Milliseconds
- 🎨 **Material-UI Integration**: Seamless integration with MUI themes and components
- ⌨️ **Keyboard Navigation**: Full keyboard support with arrow keys and tab navigation
- 📱 **Responsive Design**: Works great on mobile and desktop
- 🎯 **Accessible**: Built with accessibility in mind
- 🔄 **Multiple Formats**: Compact and full formatting options
- ✨ **TypeScript Ready**: Includes TypeScript definitions (optional)

## Installation

```bash
npm install mui-time-picker
```

## Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install @mui/material @mui/icons-material react react-dom
```

## Basic Usage

```jsx
import React, { useState } from 'react';
import { TimePickerInput } from 'mui-time-picker';

function App() {
  const [value, setValue] = useState('00:30:00');

  return (
    <TimePickerInput
      label="Duration"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
```

## Configuration Options

### Basic Configuration

Enable specific time units using the `config` prop:

```jsx
<TimePickerInput
  label="Project Duration"
  value={value}
  onChange={handleChange}
  config={{
    days: { enabled: true },
    hours: { enabled: true },
    minutes: { enabled: true },
    seconds: { enabled: false },
    milliseconds: { enabled: false }
  }}
/>
```

### Configurable Digits

For Years, Days, and Milliseconds, you can configure 1-3 digits:

```jsx
<TimePickerInput
  label="Countdown Timer"
  value={value}
  onChange={handleChange}
  config={{
    years: { enabled: true, digits: 2 },    // 00-99 years
    days: { enabled: true, digits: 3 },     // 000-365 days
    hours: { enabled: true },               // Always 2 digits (00-23)
    minutes: { enabled: true },             // Always 2 digits (00-59)
    seconds: { enabled: true },             // Always 2 digits (00-59)
    milliseconds: { enabled: true, digits: 3 } // 000-999 milliseconds
  }}
/>
```

### Custom Labels

Customize the labels for each time unit:

```jsx
<TimePickerInput
  config={{
    years: { enabled: true, label: 'Years' },
    months: { enabled: true, label: 'Months' },
    days: { enabled: true, label: 'Days' },
    hours: { enabled: true, label: 'Hours' },
    minutes: { enabled: true, label: 'Mins' },
    seconds: { enabled: true, label: 'Secs' },
    milliseconds: { enabled: true, label: 'MS' }
  }}
/>
```

## Configuration Reference

### Default Configuration

```javascript
const DEFAULT_CONFIG = {
  years: { enabled: false, digits: 3, max: 999, label: 'Y' },
  weeks: { enabled: false, digits: 2, max: 99, label: 'W' },
  days: { enabled: false, digits: 3, max: 365, label: 'D' },
  hours: { enabled: false, digits: 2, max: 23, label: 'H' },
  minutes: { enabled: true, digits: 2, max: 59, label: 'MIN' },
  seconds: { enabled: true, digits: 2, max: 59, label: 'SEC' },
  milliseconds: { enabled: true, digits: 3, max: 999, label: 'MS' },
};
```

### Digit Configuration Rules

- **Years**: 1-3 digits (1-999 years)
- **Weeks**: Fixed 2 digits (00-99 weeks)
- **Days**: 1-3 digits (1-365 days)
- **Hours**: Fixed 2 digits (00-23 hours)
- **Minutes**: Fixed 2 digits (00-59 minutes)
- **Seconds**: Fixed 2 digits (00-59 seconds)  
- **Milliseconds**: 1-3 digits (1-999 milliseconds)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The current time value |
| `onChange` | `function` | - | Callback fired when the value changes |
| `onBlur` | `function` | - | Callback fired when the input loses focus |
| `label` | `string` | `'Time'` | The input label |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `error` | `boolean` | `false` | Whether the input has an error state |
| `helperText` | `string` | `''` | Helper text displayed below the input |
| `size` | `'small' \| 'medium'` | `'medium'` | The size of the input |
| `fullWidth` | `boolean` | `false` | Whether the input takes full width |
| `name` | `string` | `''` | The name attribute of the input |
| `placeholder` | `string` | `'0'` | Placeholder text |
| `config` | `object` | `{}` | Configuration for enabled units and options |
| `format` | `'compact' \| 'full'` | `'compact'` | Output format style |
| `separator` | `string` | `':'` | Separator character between units |

## Examples

### Stopwatch Timer

```jsx
<TimePickerInput
  label="Stopwatch"
  config={{
    minutes: { enabled: true },
    seconds: { enabled: true },
    milliseconds: { enabled: true, digits: 2 }
  }}
  separator=":"
/>
```

### Project Duration

```jsx
<TimePickerInput
  label="Project Duration"
  config={{
    weeks: { enabled: true },
    days: { enabled: true, digits: 2 },
    hours: { enabled: true }
  }}
  format="full"
/>
```

### Countdown Timer

```jsx
<TimePickerInput
  label="Countdown"
  config={{
    days: { enabled: true, digits: 3 },
    hours: { enabled: true },
    minutes: { enabled: true },
    seconds: { enabled: true }
  }}
/>
```

### Simple Time Input

```jsx
<TimePickerInput
  label="Meeting Duration"
  config={{
    hours: { enabled: true },
    minutes: { enabled: true }
  }}
  placeholder="0:00"
/>
```

## Keyboard Navigation

- **Arrow Up/Down**: Increment/decrement the focused time unit
- **Arrow Left/Right**: Move between time units
- **Tab**: Move to next time unit
- **Shift+Tab**: Move to previous time unit
- **Enter**: Close the picker and confirm the value
- **Number Keys**: Direct input of values

## Utility Functions

The package also exports utility functions for working with time values:

```jsx
import {
  parseTimeInput,
  timeComponentsToMilliseconds,
  millisecondsToTimeComponents,
  formatTimeComponents,
  formatTimeNatural
} from 'mui-time-picker';

// Parse a time string
const parsed = parseTimeInput('01:30:45', config);

// Convert to milliseconds
const ms = timeComponentsToMilliseconds({ hours: 1, minutes: 30, seconds: 45 });

// Convert from milliseconds
const components = millisecondsToTimeComponents(5445000, config);

// Format time components
const formatted = formatTimeComponents(components, config, 'compact', ':');
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you find this package helpful, please consider giving it a star on GitHub!