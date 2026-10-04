import { useState } from "react";

export const useControllable = <T>(
  value: T | undefined,
  defaultValue: T,
  onChange: ((value: T) => void) | undefined,
): readonly [T, (next: T) => void, () => void] => {
  const [internal, setInternal] = useState(defaultValue);
  const current = value === undefined ? internal : value;
  const update = (next: T): void => {
    if (value === undefined) setInternal(next);
    if (next !== current) onChange?.(next);
  };
  const reset = (): void => {
    if (value === undefined) setInternal(defaultValue);
  };
  return [current, update, reset];
};
