import React, { useState, useCallback, useRef, useEffect, useLayoutEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Popover,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import {
  DEFAULT_CONFIG,
  mergeConfig,
  getEnabledUnits,
  parseTimeInput,
  formatTimeComponents,
  formatTimeNatural,
  adjustTimeComponent,
  validateTimeComponents,
  CONFIGURABLE_DIGITS_UNITS,
} from './utils';

const TimeComponentInput = ({
  label: componentLabel,
  component,
  value,
  onKeyDown,
  onChange,
  onFocus,
  onBlur,
  inputRef,
  disabled,
  adjustComponent,
  digits
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
    <IconButton size="small" onClick={() => adjustComponent(component, 1)} disabled={disabled} sx={{ mb: 0.5 }}>
      <AddIcon fontSize="small" />
    </IconButton>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 60, justifyContent: 'center' }}>
      <TextField
        inputRef={inputRef}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        disabled={disabled}
        size="small"
        autoComplete="off"
        inputProps={{
          style: {
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 500,
            padding: '4px 8px',
            width: `${Math.max(20, digits * 12)}px`
          }
        }}
        sx={{
          mb: 0.5,
          '& .MuiOutlinedInput-root': {
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: '1px solid rgba(0, 0, 0, 0.23)' },
            '&.Mui-focused fieldset': (theme) => ({ border: `2px solid ${theme.palette.info.main}` })
          }
        }}
      />
      <Typography variant="caption" color="text.secondary">{componentLabel}</Typography>
    </Box>
    <IconButton size="small" onClick={() => adjustComponent(component, -1)} disabled={disabled} sx={{ mt: 0.5 }}>
      <RemoveIcon fontSize="small" />
    </IconButton>
  </Box>
);

const TimePickerInput = forwardRef(({
  value = '',
  onChange,
  onBlur,
  label = 'Time',
  disabled = false,
  error = false,
  helperText = '',
  size = 'medium',
  fullWidth = false,
  name = '',
  placeholder = '0',
  config = {},
  format = 'compact',
  separator = ':',
  ...textFieldProps
}, ref) => {
  const mergedConfig = mergeConfig(config);
  const enabledUnits = getEnabledUnits(mergedConfig);
  
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [displayValue, setDisplayValue] = useState('');
  const [timeComponents, setTimeComponents] = useState({});
  const [componentInputs, setComponentInputs] = useState({});
  const [shouldShowFocused, setShouldShowFocused] = useState(false);
  
  const anchorRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const pickerRef = useRef(null);
  const componentInputRefs = useRef({});
  const isEnteringValue = useRef({});
  const justClosedRef = useRef(false);
  const isMounted = useRef(false);

  // Initialize component input refs and entering flags
  useEffect(() => {
    enabledUnits.forEach(unit => {
      if (!componentInputRefs.current[unit]) {
        componentInputRefs.current[unit] = null;
      }
      if (!isEnteringValue.current[unit]) {
        isEnteringValue.current[unit] = false;
      }
    });
  }, [enabledUnits]);

  useLayoutEffect(() => {
    const parsed = parseTimeInput(value, mergedConfig);
    setInputValue(value);
    setTimeComponents(parsed);
    
    const newComponentInputs = {};
    enabledUnits.forEach(unit => {
      const val = parsed[unit] || 0;
      newComponentInputs[unit] = val.toString().padStart(mergedConfig[unit].digits, '0');
    });
    setComponentInputs(newComponentInputs);
    
    setDisplayValue(formatTimeNatural(parsed, mergedConfig, separator));
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      const parsed = parseTimeInput(value, mergedConfig);
      setInputValue(value);
      setTimeComponents(parsed);
      
      const newComponentInputs = {};
      enabledUnits.forEach(unit => {
        const val = parsed[unit] || 0;
        newComponentInputs[unit] = val.toString().padStart(mergedConfig[unit].digits, '0');
      });
      setComponentInputs(newComponentInputs);
      
      setDisplayValue(formatTimeNatural(parsed, mergedConfig, separator));
    }
  }, [value, mergedConfig, separator]);

  useEffect(() => {
    if (open && enabledUnits.length > 0) {
      const timer = setTimeout(() => {
        const firstUnit = enabledUnits[0];
        componentInputRefs.current[firstUnit]?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, enabledUnits]);

  const handleExit = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

    justClosedRef.current = true;
    setTimeout(() => {
      justClosedRef.current = false;
    }, 50);

    setOpen(false);
    setShouldShowFocused(true);

    if (onBlur) {
      const formattedValue = formatTimeComponents(timeComponents, mergedConfig, format, separator);
      const syntheticEvent = { target: { value: formattedValue, name: name } };
      onBlur(syntheticEvent);
    }
  }, [onBlur, timeComponents, name, mergedConfig, format, separator]);

  const handleInputFocus = useCallback((event) => {
    if (justClosedRef.current) {
      return;
    }

    if (!disabled) {
      setShouldShowFocused(true);
      setTimeout(() => {
        setOpen(true);
      }, 0);
    }
  }, [disabled]);

  const handleInputKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && open) {
      event.preventDefault();
      handleExit();
    }
  }, [open, handleExit]);

  const handleInputBlur = useCallback((event) => {
    const relatedTarget = event.relatedTarget;
    const isBlurringToOtherElement = relatedTarget && !anchorRef.current?.contains(relatedTarget);

    if (isBlurringToOtherElement || !relatedTarget) {
      setShouldShowFocused(false);
    }
  }, []);

  const handlePickerChange = useCallback((newComponents, updateFormatted, isUserInteraction = false) => {
    const validated = validateTimeComponents(newComponents, mergedConfig);
    setTimeComponents(validated);
    
    if (updateFormatted) {
      const newComponentInputs = {};
      enabledUnits.forEach(unit => {
        const val = validated[unit] || 0;
        newComponentInputs[unit] = val.toString().padStart(mergedConfig[unit].digits, '0');
      });
      setComponentInputs(newComponentInputs);
    }
    
    const formattedValue = formatTimeComponents(validated, mergedConfig, format, separator);
    const naturalValue = formatTimeNatural(validated, mergedConfig, separator);

    setInputValue(formattedValue);
    setDisplayValue(naturalValue);

    if (onChange && isUserInteraction) {
      setTimeout(() => {
        const syntheticEvent = { target: { value: formattedValue, name: name } };
        onChange(syntheticEvent);
      }, 0);
    }
  }, [onChange, name, mergedConfig, enabledUnits, format, separator]);

  const handleClear = useCallback(() => {
    const emptyComponents = {};
    enabledUnits.forEach(unit => {
      emptyComponents[unit] = 0;
    });
    
    setInputValue('');
    setDisplayValue('');
    setTimeComponents(emptyComponents);
    
    const emptyInputs = {};
    enabledUnits.forEach(unit => {
      emptyInputs[unit] = '0'.padStart(mergedConfig[unit].digits, '0');
    });
    setComponentInputs(emptyInputs);
    
    if (onChange) {
      setTimeout(() => {
        const syntheticEvent = { target: { value: '', name: name } };
        onChange(syntheticEvent);
      }, 0);
    }
  }, [onChange, name, enabledUnits, mergedConfig]);

  const adjustComponentHandler = useCallback((component, delta) => {
    setTimeComponents(prev => {
      const newComponents = adjustTimeComponent(prev, component, delta, mergedConfig);
      handlePickerChange(newComponents, true, true);
      return newComponents;
    });
  }, [handlePickerChange, mergedConfig]);

  const handleComponentInputChange = useCallback((component, value) => {
    const lastTypedDigit = value.replace(/[^0-9]/g, '').slice(-1);
    if (lastTypedDigit === '') return;

    let newRawValue;
    const maxLen = mergedConfig[component].digits;

    if (isEnteringValue.current[component]) {
      newRawValue = lastTypedDigit;
      isEnteringValue.current[component] = false;
    } else {
      const currentVal = componentInputs[component] || '';
      newRawValue = (currentVal + lastTypedDigit).slice(-maxLen);
    }

    setComponentInputs(prev => ({ ...prev, [component]: newRawValue }));

    const parsedValue = parseInt(newRawValue, 10);
    setTimeComponents(prev => {
      const newComponents = { ...prev, [component]: isNaN(parsedValue) ? 0 : parsedValue };
      handlePickerChange(newComponents, false, true);
      return newComponents;
    });

    if (newRawValue.length >= maxLen) {
      const currentIndex = enabledUnits.indexOf(component);
      const nextIndex = (currentIndex + 1) % enabledUnits.length;
      const nextUnit = enabledUnits[nextIndex];
      componentInputRefs.current[nextUnit]?.focus();
    }
  }, [componentInputs, handlePickerChange, enabledUnits, mergedConfig]);

  const handleComponentInputBlur = useCallback((component) => {
    isEnteringValue.current[component] = false;
    const valueToParse = componentInputs[component];
    let parsedValue = parseInt(valueToParse || '0', 10);

    if (isNaN(parsedValue)) parsedValue = 0;

    const newComponents = { ...timeComponents };
    const max = mergedConfig[component].max || Infinity;
    newComponents[component] = Math.max(0, Math.min(max, parsedValue));
    
    handlePickerChange(newComponents, true, true);

    blurTimeoutRef.current = setTimeout(() => {
      const activeElement = document.activeElement;
      const pickerElement = pickerRef.current;
      if (!pickerElement || !pickerElement.contains(activeElement)) {
        handleExit();
      }
    }, 100);
  }, [componentInputs, timeComponents, handlePickerChange, handleExit, mergedConfig]);

  const handleComponentInputFocus = useCallback((e, component) => {
    e.target.select();
    isEnteringValue.current[component] = true;
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  }, []);

  const handleKeyDown = useCallback((e, currentComponent) => {
    const currentIndex = enabledUnits.indexOf(currentComponent);

    if (e.key === 'Enter') {
      e.preventDefault();
      handleExit();
      return;
    }

    if (e.key.startsWith('Arrow') || e.key === 'Tab') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        adjustComponentHandler(currentComponent, e.key === 'ArrowUp' ? 1 : -1);
        return;
      }

      e.preventDefault();
      let nextIndex;
      if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        nextIndex = (currentIndex - 1 + enabledUnits.length) % enabledUnits.length;
      } else {
        nextIndex = (currentIndex + 1) % enabledUnits.length;
      }
      componentInputRefs.current[enabledUnits[nextIndex]]?.focus();
    }
  }, [adjustComponentHandler, handleExit, enabledUnits]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  const getSeparatorForIndex = (index) => {
    if (index >= enabledUnits.length - 1) return null;
    
    const currentUnit = enabledUnits[index];
    const nextUnit = enabledUnits[index + 1];
    
    // Use different separators for logical groupings
    if ((currentUnit === 'years' && nextUnit === 'weeks') ||
        (currentUnit === 'weeks' && nextUnit === 'days') ||
        (currentUnit === 'days' && nextUnit === 'hours')) {
      return ' ';
    }
    
    if (currentUnit === 'seconds' && nextUnit === 'milliseconds') {
      return '.';
    }
    
    return separator;
  };

  return (
    <>
      <TextField
        ref={(el) => {
          anchorRef.current = el;
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              ref.current = el;
            }
          }
        }}
        value={displayValue}
        onClick={() => !disabled && setOpen(true)}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        size={size}
        fullWidth={fullWidth}
        name={name}
        autoComplete="off"
        InputProps={{
          readOnly: true,
          style: { cursor: 'pointer' },
          onFocus: handleInputFocus
        }}
        InputLabelProps={{
          shrink: true,
          focused: open || shouldShowFocused
        }}
        focused={open || shouldShowFocused}
        {...textFieldProps}
      />
      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={handleExit}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, minWidth: Math.max(280, enabledUnits.length * 80) }, ref: pickerRef }}
      >
        <Typography variant="subtitle2" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
          Select Time
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {enabledUnits.map((unit, index) => (
            <React.Fragment key={unit}>
              <TimeComponentInput
                label={mergedConfig[unit].label}
                component={unit}
                value={componentInputs[unit] || ''}
                onChange={(e) => handleComponentInputChange(unit, e.target.value)}
                onFocus={(e) => handleComponentInputFocus(e, unit)}
                onBlur={() => handleComponentInputBlur(unit)}
                onKeyDown={(e) => handleKeyDown(e, unit)}
                inputRef={(el) => (componentInputRefs.current[unit] = el)}
                disabled={disabled}
                adjustComponent={adjustComponentHandler}
                digits={mergedConfig[unit].digits}
              />
              {getSeparatorForIndex(index) && (
                <Typography variant="h4" sx={{ mx: 1, color: "text.primary", mb: 3 }}>
                  {getSeparatorForIndex(index)}
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Button variant="text" onClick={handleClear} size="small">Clear</Button>
          <Button variant="contained" onClick={handleExit} size="small">OK</Button>
        </Box>
      </Popover>
    </>
  );
});

TimePickerInput.displayName = 'TimePickerInput';

TimePickerInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  fullWidth: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  config: PropTypes.object,
  format: PropTypes.oneOf(['compact', 'full']),
  separator: PropTypes.string,
};

export default TimePickerInput;