const EPSILON = 0.0000001;

export function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + EPSILON) * factor) / factor;
}

export function floorToStep(value: number, step = 0.1): number {
  if (step <= 0) {
    return value;
  }

  const decimals = step.toString().split(".")[1]?.length ?? 0;
  return roundTo(Math.floor((value + EPSILON) / step) * step, decimals);
}

export function isPositiveFinite(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function allocateWholeGrams(total: number, weights: number[]): number[] {
  if (!Number.isFinite(total) || total <= 0 || weights.length === 0) {
    return weights.map(() => 0);
  }

  const target = Math.round(total);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

  if (weightTotal <= 0) {
    return weights.map(() => 0);
  }

  const raw = weights.map((weight) => (target * weight) / weightTotal);
  const floors = raw.map(Math.floor);
  let remainder = target - floors.reduce((sum, value) => sum + value, 0);

  const order = raw
    .map((value, index) => ({ index, remainder: value - floors[index] }))
    .sort((a, b) => b.remainder - a.remainder);

  for (const item of order) {
    if (remainder <= 0) {
      break;
    }

    floors[item.index] += 1;
    remainder -= 1;
  }

  return floors;
}
