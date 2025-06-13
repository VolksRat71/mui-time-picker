import React, { useState } from 'react';
import { TimePickerInput } from 'mui-time-picker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Typography, Box, Paper } from '@mui/material';

const theme = createTheme();

function BasicExample() {
  const [value, setValue] = useState('00:30:00');

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Basic Usage
      </Typography>
      <TimePickerInput
        label="Duration"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Enter time duration"
      />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Current value: {value}
      </Typography>
    </Box>
  );
}

function StopwatchExample() {
  const [value, setValue] = useState('');

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Stopwatch Timer
      </Typography>
      <TimePickerInput
        label="Stopwatch"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        config={{
          minutes: { enabled: true },
          seconds: { enabled: true },
          milliseconds: { enabled: true, digits: 2 }
        }}
        separator=":"
      />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Current value: {value}
      </Typography>
    </Box>
  );
}

function ProjectDurationExample() {
  const [value, setValue] = useState('');

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Project Duration
      </Typography>
      <TimePickerInput
        label="Project Duration"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        config={{
          weeks: { enabled: true },
          days: { enabled: true, digits: 2 },
          hours: { enabled: true }
        }}
        format="full"
      />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Current value: {value}
      </Typography>
    </Box>
  );
}

function CountdownExample() {
  const [value, setValue] = useState('');

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Countdown Timer
      </Typography>
      <TimePickerInput
        label="Countdown"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        config={{
          days: { enabled: true, digits: 3 },
          hours: { enabled: true },
          minutes: { enabled: true },
          seconds: { enabled: true }
        }}
      />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Current value: {value}
      </Typography>
    </Box>
  );
}

function CustomLabelsExample() {
  const [value, setValue] = useState('');

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Custom Labels
      </Typography>
      <TimePickerInput
        label="Custom Time Picker"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        config={{
          hours: { enabled: true, label: 'Hours' },
          minutes: { enabled: true, label: 'Mins' },
          seconds: { enabled: true, label: 'Secs' },
          milliseconds: { enabled: true, label: 'MS', digits: 3 }
        }}
      />
      <Typography variant="body2" sx={{ mt: 1 }}>
        Current value: {value}
      </Typography>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          MUI Time Picker Examples
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <BasicExample />
          <StopwatchExample />
          <ProjectDurationExample />
          <CountdownExample />
          <CustomLabelsExample />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;