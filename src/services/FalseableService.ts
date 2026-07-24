import type { Falseable } from "#/types/Falseable";

export function isFalseable<T extends Falseable<unknown>>(
  value: Falseable<T>,
): value is Falseable<never> {
  // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons
  return value === false || value === undefined || value === null;
}
