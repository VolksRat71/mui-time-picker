import { ComponentType } from 'react';

export type TimeUnit = 'years' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds';

export interface TimeComponents {
  years?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface TimeUnitConfig {
  enabled: boolean;
  digits: 1 | 2 | 3;
  max?: number;
  label?: string;
}

export interface TimePickerConfig {
  years?: TimeUnitConfig;
  weeks?: TimeUnitConfig;
  days?: TimeUnitConfig;
  hours?: TimeUnitConfig;
  minutes?: TimeUnitConfig;
  seconds?: TimeUnitConfig;
  milliseconds?: TimeUnitConfig;
}

export interface TimePickerInputProps {
  value?: string;
  onChange?: (event: { target: { value: string; name?: string } }) => void;
  onBlur?: (event: { target: { value: string; name?: string } }) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  name?: string;
  placeholder?: string;
  config?: TimePickerConfig;
  format?: 'compact' | 'full';
  separator?: string;
}

export interface ParsedTimeInput extends TimeComponents {
  isValid: boolean;
  totalMilliseconds: number;
}

declare const TimePickerInput: ComponentType<TimePickerInputProps>;

export { TimePickerInput };
export default TimePickerInput;

// Utility functions
export function parseTimeInput(input: string, config: TimePickerConfig): ParsedTimeInput;
export function timeComponentsToMilliseconds(components: TimeComponents): number;
export function millisecondsToTimeComponents(milliseconds: number, config: TimePickerConfig): TimeComponents;
export function formatTimeComponents(components: TimeComponents, config: TimePickerConfig, format?: 'compact' | 'full', separator?: string): string;
export function formatTimeNatural(components: TimeComponents, config: TimePickerConfig, separator?: string): string;
export function adjustTimeComponent(components: TimeComponents, unit: TimeUnit, delta: number, config: TimePickerConfig): TimeComponents;
export function validateTimeComponents(components: TimeComponents, config: TimePickerConfig): TimeComponents;
export function mergeConfig(userConfig?: TimePickerConfig): TimePickerConfig;
export function getEnabledUnits(config: TimePickerConfig): TimeUnit[];

// Legacy compatibility functions
export function timeFormatToSeconds(timeString: string): number;
export function secondsToTimeFormat(totalSeconds: number): string;

// Constants
export const DEFAULT_CONFIG: TimePickerConfig;
export const TIME_UNIT_MULTIPLIERS: Record<TimeUnit, number>;
export const TIME_UNIT_ORDER: TimeUnit[];
export const CONFIGURABLE_DIGITS_UNITS: TimeUnit[];