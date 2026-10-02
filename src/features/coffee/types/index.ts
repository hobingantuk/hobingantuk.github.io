export type FlavorAdjustment = "sweet" | "balanced" | "bright";

export type StrengthAdjustment = "light" | "balanced" | "strong";

export interface PourStep {
  index: number;
  time: string;
  amount: number;
  cumulative: number;
  phase: "balance" | "strength";
}

export interface TetsuRecipeInput {
  coffeeDose: number;
  ratio: number;
  flavor: FlavorAdjustment;
  strength: StrengthAdjustment;
  pourIntervalSeconds: number;
}

export interface TetsuRecipe {
  coffeeDose: number;
  requestedRatio: number;
  exactWater: number;
  practicalWater: number;
  actualRatio: number;
  flavor: FlavorAdjustment;
  strength: StrengthAdjustment;
  pours: PourStep[];
}

export interface BagPlannerInput {
  remainingBeans: number;
  desiredBrews: number;
  minimumDose: number;
  maximumDose: number;
  preferredDose: number;
}

export interface BagDosePlan {
  brews: number;
  dose: number;
  exactDose: number;
  leftover: number;
  distanceFromTarget: number;
  distanceFromPreferredDose: number;
  recommendationScore: number;
  isBestLeftover: boolean;
  isRecommended: boolean;
  isTarget: boolean;
}

export interface ReverseDosePlan {
  dose: number;
  completeBrews: number;
  used: number;
  remaining: number;
}
