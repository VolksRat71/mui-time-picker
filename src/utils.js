export const DEFAULT_CONFIG = {
  years: { enabled: false, digits: 3, max: 999, label: 'Y' },
  weeks: { enabled: false, digits: 2, max: 99, label: 'W' },
  days: { enabled: false, digits: 3, max: 365, label: 'D' },
  hours: { enabled: false, digits: 2, max: 23, label: 'H' },
  minutes: { enabled: true, digits: 2, max: 59, label: 'MIN' },
  seconds: { enabled: true, digits: 2, max: 59, label: 'SEC' },
  milliseconds: { enabled: true, digits: 3, max: 999, label: 'MS' },
};

export const TIME_UNIT_MULTIPLIERS = {
  years: 365 * 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
  hours: 60 * 60 * 1000,
  minutes: 60 * 1000,
  seconds: 1000,
  milliseconds: 1,
};

export const TIME_UNIT_ORDER = [
  'years',
  'weeks', 
  'days',
  'hours',
  'minutes',
  'seconds',
  'milliseconds'
];

export const CONFIGURABLE_DIGITS_UNITS = ['years', 'days', 'milliseconds'];

export function mergeConfig(userConfig = {}) {
  const merged = { ...DEFAULT_CONFIG };
  
  Object.entries(userConfig).forEach(([unit, config]) => {
    if (config && merged[unit]) {
      merged[unit] = { ...merged[unit], ...config };
      
      // Validate digits for configurable units
      if (CONFIGURABLE_DIGITS_UNITS.includes(unit) && config.digits) {
        const digits = Math.max(1, Math.min(3, config.digits));
        merged[unit].digits = digits;
        
        // Adjust max value based on digits for these units
        if (unit === 'years') {
          merged[unit].max = Math.pow(10, digits) - 1;
        } else if (unit === 'days') {
          merged[unit].max = Math.min(Math.pow(10, digits) - 1, 365);
        } else if (unit === 'milliseconds') {
          merged[unit].max = Math.pow(10, digits) - 1;
        }
      }
    }
  });
  
  return merged;
}

export function getEnabledUnits(config) {
  return TIME_UNIT_ORDER.filter(unit => config[unit].enabled);
}

export function parseTimeInput(input, config) {
  if (!input || input.trim() === '') {
    const emptyComponents = {};
    getEnabledUnits(config).forEach(unit => {
      emptyComponents[unit] = 0;
    });
    return {
      ...emptyComponents,
      isValid: true,
      totalMilliseconds: 0
    };
  }

  const enabledUnits = getEnabledUnits(config);
  const components = {};
  let totalMs = 0;
  let isValid = true;

  // Split by common separators
  const parts = input.split(/[:\s.,-]+/).filter(part => part.trim() !== '');
  
  // Parse each part as a number and assign to units in order
  parts.forEach((part, index) => {
    if (index < enabledUnits.length) {
      const unit = enabledUnits[index];
      const value = parseInt(part.replace(/[^\d]/g, ''), 10);
      
      if (isNaN(value)) {
        isValid = false;
        components[unit] = 0;
      } else {
        const max = config[unit].max || Infinity;
        const clampedValue = Math.min(Math.max(0, value), max);
        components[unit] = clampedValue;
        totalMs += clampedValue * TIME_UNIT_MULTIPLIERS[unit];
      }
    }
  });

  // Fill in any missing units with 0
  enabledUnits.forEach(unit => {
    if (components[unit] === undefined) {
      components[unit] = 0;
    }
  });

  return {
    ...components,
    isValid,
    totalMilliseconds: totalMs
  };
}

export function timeComponentsToMilliseconds(components) {
  let total = 0;
  
  Object.entries(components).forEach(([unit, value]) => {
    if (value && TIME_UNIT_MULTIPLIERS[unit]) {
      total += value * TIME_UNIT_MULTIPLIERS[unit];
    }
  });
  
  return total;
}

export function millisecondsToTimeComponents(milliseconds, config) {
  const components = {};
  let remaining = Math.max(0, milliseconds);
  
  const enabledUnits = getEnabledUnits(config);
  
  enabledUnits.forEach(unit => {
    const multiplier = TIME_UNIT_MULTIPLIERS[unit];
    const value = Math.floor(remaining / multiplier);
    const max = config[unit].max || Infinity;
    
    components[unit] = Math.min(value, max);
    remaining -= components[unit] * multiplier;
  });
  
  return components;
}

export function formatTimeComponents(components, config, format = 'compact', separator = ':') {
  const enabledUnits = getEnabledUnits(config);
  
  if (format === 'full') {
    return enabledUnits
      .map(unit => {
        const value = components[unit] || 0;
        const digits = config[unit].digits;
        return value.toString().padStart(digits, '0');
      })
      .join(separator);
  }
  
  // Compact format: omit leading zeros for major units
  const values = enabledUnits.map(unit => {
    const value = components[unit] || 0;
    const digits = config[unit].digits;
    return { unit, value, formatted: value.toString().padStart(digits, '0') };
  });
  
  // Find first non-zero unit or use the last unit
  let startIndex = values.findIndex(v => v.value > 0);
  if (startIndex === -1) startIndex = Math.max(0, values.length - 1);
  
  return values
    .slice(startIndex)
    .map(v => v.formatted)
    .join(separator);
}

export function formatTimeNatural(components, config, separator = ':') {
  const enabledUnits = getEnabledUnits(config);
  const nonZeroUnits = enabledUnits.filter(unit => (components[unit] || 0) > 0);
  
  if (nonZeroUnits.length === 0) {
    // All zeros - show the smallest enabled unit
    const lastUnit = enabledUnits[enabledUnits.length - 1];
    return (components[lastUnit] || 0).toString();
  }
  
  // Show from first non-zero to end
  const firstNonZeroIndex = enabledUnits.findIndex(unit => (components[unit] || 0) > 0);
  
  return enabledUnits
    .slice(firstNonZeroIndex)
    .map(unit => {
      const value = components[unit] || 0;
      const isFirst = unit === enabledUnits[firstNonZeroIndex];
      const digits = isFirst ? 1 : config[unit].digits;
      return value.toString().padStart(digits, '0');
    })
    .join(separator);
}

export function adjustTimeComponent(components, unit, delta, config) {
  const current = components[unit] || 0;
  const max = config[unit].max || Infinity;
  const newValue = Math.max(0, Math.min(max, current + delta));
  
  return {
    ...components,
    [unit]: newValue
  };
}

export function validateTimeComponents(components, config) {
  const validated = {};
  
  Object.entries(components).forEach(([unit, value]) => {
    if (config[unit]?.enabled) {
      const max = config[unit].max || Infinity;
      validated[unit] = Math.max(0, Math.min(max, value || 0));
    }
  });
  
  return validated;
}

// Legacy compatibility functions for existing codebase
export function timeFormatToSeconds(timeString) {
  if (!timeString) return 0;
  
  // Handle MM:SS.d format
  const timeRegex = /^(\d{1,2}):(\d{2})\.(\d)$/;
  const match = timeString.match(timeRegex);
  
  if (match) {
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const decimal = parseInt(match[3], 10);
    return minutes * 60 + seconds + decimal / 10;
  }
  
  // Fallback to parseTimeInput for other formats
  const parsed = parseTimeInput(timeString, DEFAULT_CONFIG);
  return timeComponentsToMilliseconds(parsed) / 1000;
}

export function secondsToTimeFormat(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) {
    return '';
  }

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const wholeSeconds = Math.floor(remainingSeconds);
  const decimal = Math.round((remainingSeconds - wholeSeconds) * 10);

  return `${minutes.toString().padStart(2, '0')}:${wholeSeconds.toString().padStart(2, '0')}.${decimal}`;
}