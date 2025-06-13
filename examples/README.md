# Examples

This directory contains usage examples for the MUI Time Picker component.

## Running Examples

To run these examples, you'll need to set up a React project and install the required dependencies:

```bash
# Create a new React app
npx create-react-app mui-time-picker-examples
cd mui-time-picker-examples

# Install MUI dependencies
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Install the time picker (after publishing to NPM)
npm install mui-time-picker

# Or install locally during development
npm install ../mui-time-picker
```

## Available Examples

### basic-usage.js
Demonstrates various configurations of the TimePickerInput component:
- Basic time input
- Stopwatch timer
- Project duration tracker
- Countdown timer
- Custom labels

Copy the content of `basic-usage.js` into your `src/App.js` file to see the examples in action.

## Example Configurations

### Simple Time Input
```jsx
<TimePickerInput
  label="Meeting Duration"
  config={{
    hours: { enabled: true },
    minutes: { enabled: true }
  }}
/>
```

### Millisecond Precision
```jsx
<TimePickerInput
  label="Precise Timer"
  config={{
    minutes: { enabled: true },
    seconds: { enabled: true },
    milliseconds: { enabled: true, digits: 3 }
  }}
/>
```

### Long Duration Tracking
```jsx
<TimePickerInput
  label="Project Timeline"
  config={{
    years: { enabled: true, digits: 2 },
    weeks: { enabled: true },
    days: { enabled: true, digits: 3 }
  }}
/>
```

## Testing Locally

To test the component during development:

1. Build the package: `npm run build`
2. Create a tarball: `npm pack`
3. Install in your test project: `npm install ../mui-time-picker-1.0.0.tgz`

This ensures you're testing the actual built package that would be distributed via NPM.