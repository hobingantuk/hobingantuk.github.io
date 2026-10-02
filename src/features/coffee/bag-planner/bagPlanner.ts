import { isPositiveFinite, roundTo } from "../calculations/rounding";
import type { BagDosePlan, BagPlannerInput, ReverseDosePlan } from "../types";

const PRACTICAL_LEFTOVER_LIMIT = 0.5;
const MAX_VISIBLE_PLANS = 5;

function practicalLeftover(remainingBeans: number, brews: number, dose: number): number {
  const nominalLeftover = roundTo(remainingBeans - dose * brews, 2);
  return Math.abs(nominalLeftover) <= PRACTICAL_LEFTOVER_LIMIT ? 0 : nominalLeftover;
}

export function calculateDosePlanForBrews(
  input: BagPlannerInput,
  brews: number,
): Omit<BagDosePlan, "isBestLeftover"> | null {
  const remainingBeans = input.remainingBeans;

  if (!isPositiveFinite(remainingBeans) || brews < 1) {
    return null;
  }

  const minimumDose = Math.max(0, input.minimumDose);
  const maximumDose = Math.max(minimumDose, input.maximumDose);
  const preferredDose = input.preferredDose;
  const exactDose = remainingBeans / brews;
  const dose = roundTo(exactDose, 1);

  if (dose < minimumDose || dose > maximumDose) {
    return null;
  }

  const leftover = practicalLeftover(remainingBeans, brews, dose);

  if (Math.abs(leftover) > PRACTICAL_LEFTOVER_LIMIT) {
    return null;
  }

  return {
    brews,
    dose,
    exactDose: roundTo(exactDose, 3),
    leftover,
    distanceFromTarget: Math.abs(brews - Math.round(input.desiredBrews || brews)),
    distanceFromPreferredDose: isPositiveFinite(preferredDose) ? Math.abs(dose - preferredDose) : 0,
    recommendationScore: 0,
    isRecommended: false,
    isTarget: brews === Math.round(input.desiredBrews || brews),
  };
}

export function calculateBagDosePlans(input: BagPlannerInput): BagDosePlan[] {
  const remainingBeans = input.remainingBeans;
  const minimumDose = Math.max(0, input.minimumDose);
  const maximumDose = Math.max(minimumDose, input.maximumDose);

  if (!isPositiveFinite(remainingBeans) || !isPositiveFinite(minimumDose) || !isPositiveFinite(maximumDose)) {
    return [];
  }

  const maxBrews = Math.max(1, Math.floor(remainingBeans / minimumDose));
  const plans = Array.from({ length: maxBrews }, (_, index) => index + 1)
    .map((brews) => calculateDosePlanForBrews(input, brews))
    .filter((plan): plan is Omit<BagDosePlan, "isBestLeftover"> => Boolean(plan));

  const lowestLeftover = plans.reduce(
    (lowest, plan) => Math.min(lowest, plan.leftover),
    Number.POSITIVE_INFINITY,
  );
  const preferredBrewCount = isPositiveFinite(input.preferredDose)
    ? input.remainingBeans / input.preferredDose
    : Math.round(input.desiredBrews || 1);
  const compromiseBrewCount = (Math.round(input.desiredBrews || 1) + preferredBrewCount) / 2;

  const rankedPlans = plans
    .map((plan) => {
      const recommendationScore =
        Math.abs(plan.brews - compromiseBrewCount) +
        plan.distanceFromPreferredDose * 0.2;

      return {
        ...plan,
        recommendationScore,
        isBestLeftover: plan.leftover === lowestLeftover,
      };
    })
    .sort(
      (a, b) =>
        a.recommendationScore - b.recommendationScore ||
        Math.abs(a.leftover) - Math.abs(b.leftover) ||
        a.distanceFromTarget - b.distanceFromTarget,
    )
    .slice(0, MAX_VISIBLE_PLANS);

  const recommendedPlan = rankedPlans[0] ?? null;

  return rankedPlans
    .map((plan) => ({
      ...plan,
      isRecommended: recommendedPlan
        ? plan.brews === recommendedPlan.brews && plan.dose === recommendedPlan.dose
        : false,
    }))
    .sort((a, b) => a.brews - b.brews);
}

export function calculateReverseDosePlan(remainingBeans: number, dose: number): ReverseDosePlan {
  if (!isPositiveFinite(remainingBeans) || !isPositiveFinite(dose)) {
    return {
      dose: isPositiveFinite(dose) ? dose : 0,
      completeBrews: 0,
      used: 0,
      remaining: isPositiveFinite(remainingBeans) ? remainingBeans : 0,
    };
  }

  const completeBrews = Math.floor(remainingBeans / dose);
  const used = roundTo(completeBrews * dose, 2);

  return {
    dose: roundTo(dose, 2),
    completeBrews,
    used,
    remaining: roundTo(remainingBeans - used, 2),
  };
}
