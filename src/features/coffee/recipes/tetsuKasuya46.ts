import { allocateWholeGrams, isPositiveFinite, roundTo } from "../calculations/rounding";
import type {
  FlavorAdjustment,
  PourStep,
  StrengthAdjustment,
  TetsuRecipe,
  TetsuRecipeInput,
} from "../types";

const FLAVOR_WEIGHTS: Record<FlavorAdjustment, [number, number]> = {
  sweet: [39, 61],
  balanced: [50, 50],
  bright: [61, 39],
};

const LATER_POUR_WEIGHTS: Record<StrengthAdjustment, number[]> = {
  light: [1],
  balanced: [1, 1],
  strong: [1, 1, 1],
};

function clampPourInterval(seconds: number): number {
  if (!Number.isFinite(seconds)) {
    return 45;
  }

  return Math.min(45, Math.max(30, Math.round(seconds)));
}

function formatPourTime(index: number, intervalSeconds: number): string {
  const totalSeconds = index * intervalSeconds;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function calculatePracticalWater(exactWater: number): number {
  if (!isPositiveFinite(exactWater)) {
    return 0;
  }

  return Math.max(1, Math.round(exactWater / 5) * 5);
}

export function calculateTetsuKasuya46(input: TetsuRecipeInput): TetsuRecipe {
  const coffeeDose = isPositiveFinite(input.coffeeDose) ? roundTo(input.coffeeDose, 1) : 0;
  const requestedRatio = isPositiveFinite(input.ratio) ? input.ratio : 0;
  const exactWater = coffeeDose * requestedRatio;
  const practicalWater = calculatePracticalWater(exactWater);
  const firstPhaseWater = Math.round(practicalWater * 0.4);
  const secondPhaseWater = practicalWater - firstPhaseWater;
  const pourIntervalSeconds = clampPourInterval(input.pourIntervalSeconds);

  const firstPours = allocateWholeGrams(firstPhaseWater, FLAVOR_WEIGHTS[input.flavor]);
  const laterPours = allocateWholeGrams(secondPhaseWater, LATER_POUR_WEIGHTS[input.strength]);
  const amounts = [...firstPours, ...laterPours];

  let cumulative = 0;
  const pours: PourStep[] = amounts.map((amount, index) => {
    cumulative += amount;

    return {
      index: index + 1,
      time: formatPourTime(index, pourIntervalSeconds),
      amount,
      cumulative,
      phase: index < 2 ? "balance" : "strength",
    };
  });

  return {
    coffeeDose: roundTo(coffeeDose, 1),
    requestedRatio: roundTo(requestedRatio, 2),
    exactWater: roundTo(exactWater, 2),
    practicalWater,
    actualRatio: coffeeDose > 0 ? roundTo(practicalWater / coffeeDose, 2) : 0,
    flavor: input.flavor,
    strength: input.strength,
    pours,
  };
}
