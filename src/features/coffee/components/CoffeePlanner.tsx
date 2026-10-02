import { useMemo, useState } from "react";
import { Coffee, Scale, Timer, Utensils } from "lucide-react";

import { calculateBagDosePlans, calculateReverseDosePlan } from "../bag-planner/bagPlanner";
import { calculateTetsuKasuya46 } from "../recipes/tetsuKasuya46";
import type { FlavorAdjustment, StrengthAdjustment } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type PlannerState = {
  remainingBeans: number;
  desiredBrews: number;
  preferredDose: number;
  maximumDose: number;
  coffeeDose: number;
  ratio: number;
  flavor: FlavorAdjustment;
  strength: StrengthAdjustment;
  pourIntervalSeconds: number;
};

const DEFAULT_STATE: PlannerState = {
  remainingBeans: 250,
  desiredBrews: 15,
  preferredDose: 16.7,
  maximumDose: 20,
  coffeeDose: 14.6,
  ratio: 15,
  flavor: "sweet",
  strength: "balanced",
  pourIntervalSeconds: 45,
};

const MINIMUM_DOSE = 10;
const POUR_INTERVAL_OPTIONS = [30, 35, 40, 45];

function formatGrams(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)} g`;
}

function roundToOneDecimal(value: number): number {
  return Number.isFinite(value) ? Math.round(value * 10) / 10 : value;
}

function NumberField({
  id,
  label,
  value,
  min = 0,
  max,
  step = 0.1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-200">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? Number.NaN : Number(event.target.value))
        }
        className="h-11 border-white/15 bg-white/[0.03] text-white placeholder:text-gray-500"
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-200">
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full rounded-md border border-white/15 bg-white/[0.03] px-3 text-sm text-white outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-gray-900 text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-200">{label}</p>
      <div className="grid grid-cols-3 gap-2 rounded-md border border-white/10 bg-black/20 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-9 rounded-sm px-3 text-sm transition-colors",
              value === option.value
                ? "bg-primary text-primary-foreground"
                : "text-gray-300 hover:bg-white/10 hover:text-white",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CoffeePlanner() {
  const [state, setState] = useState<PlannerState>(DEFAULT_STATE);

  const updateState = <K extends keyof PlannerState>(key: K, value: PlannerState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const availableBeans = Math.max(0, state.remainingBeans || 0);

  const bagInput = useMemo(
    () => ({
      remainingBeans: availableBeans,
      desiredBrews: state.desiredBrews,
      minimumDose: MINIMUM_DOSE,
      maximumDose: state.maximumDose,
      preferredDose: state.preferredDose,
    }),
    [availableBeans, state.desiredBrews, state.maximumDose, state.preferredDose],
  );

  const dosePlans = useMemo(() => calculateBagDosePlans(bagInput), [bagInput]);
  const recommendedPlan = useMemo(
    () => dosePlans.find((plan) => plan.isRecommended) ?? null,
    [dosePlans],
  );
  const afterCurrentBrewBeans = Math.max(0, availableBeans - (state.coffeeDose || 0));
  const followUpPlans = useMemo(
    () =>
      calculateBagDosePlans({
        remainingBeans: afterCurrentBrewBeans,
        desiredBrews: Math.max(1, Math.round((state.desiredBrews || 1) - 1)),
        minimumDose: MINIMUM_DOSE,
        maximumDose: state.maximumDose,
        preferredDose: state.preferredDose,
      }),
    [afterCurrentBrewBeans, state.desiredBrews, state.maximumDose, state.preferredDose],
  );
  const followUpPlan = useMemo(
    () => followUpPlans.find((plan) => plan.isRecommended) ?? null,
    [followUpPlans],
  );
  const reverseDosePlan = useMemo(
    () => calculateReverseDosePlan(availableBeans, state.coffeeDose),
    [availableBeans, state.coffeeDose],
  );
  const recipe = useMemo(
    () =>
      calculateTetsuKasuya46({
        coffeeDose: roundToOneDecimal(state.coffeeDose),
        ratio: state.ratio,
        flavor: state.flavor,
        strength: state.strength,
        pourIntervalSeconds: state.pourIntervalSeconds,
      }),
    [state.coffeeDose, state.flavor, state.pourIntervalSeconds, state.ratio, state.strength],
  );

  const canLogBrew = state.coffeeDose > 0 && roundToOneDecimal(state.coffeeDose) <= availableBeans;

  function useRecommendedDose() {
    if (recommendedPlan) {
      updateState("coffeeDose", recommendedPlan.dose);
    }
  }

  function logBrew() {
    if (!canLogBrew) {
      return;
    }

    setState((current) => ({
      ...current,
      remainingBeans: Math.max(0, Number((availableBeans - current.coffeeDose).toFixed(2))),
    }));
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-md border border-white/10 bg-black/25 p-5 shadow-[0_0_40px_rgba(0,0,0,0.18)]">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Scale className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-nis-m9-condensed text-2xl text-primary">BAG DOSE PLANNER</h2>
            <p className="text-sm text-gray-400">Pick a target brew count and keep the bag evenly paced.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            id="remaining-beans"
            label="Beans remaining"
            value={state.remainingBeans}
            onChange={(value) => updateState("remainingBeans", value)}
          />
          <NumberField
            id="desired-brews"
            label="Desired brews"
            value={state.desiredBrews}
            step={1}
            min={1}
            onChange={(value) => updateState("desiredBrews", value)}
          />
          <NumberField
            id="preferred-dose"
            label="Preferred dose"
            value={state.preferredDose}
            step={0.1}
            min={MINIMUM_DOSE}
            max={state.maximumDose}
            onChange={(value) => updateState("preferredDose", value)}
          />
          <NumberField
            id="maximum-dose"
            label="Maximum dose"
            value={state.maximumDose}
            step={0.1}
            min={MINIMUM_DOSE}
            onChange={(value) => updateState("maximumDose", value)}
          />
        </div>
        <p className="mt-3 text-sm text-gray-500">Minimum dose is fixed at {formatGrams(MINIMUM_DOSE, 0)}.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Available</p>
            <p className="mt-1 text-2xl text-white">{formatGrams(availableBeans, 1)}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">By selected dose</p>
            <p className="mt-1 text-2xl text-white">{reverseDosePlan.completeBrews} brews</p>
          </div>
        </div>

        <div className="mt-5 rounded-md border border-primary/20 bg-primary/[0.06] p-4">
          {recommendedPlan ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-300">Closest practical plan</p>
                <p className="mt-1 text-xl text-white">
                  {recommendedPlan.brews} brews x {formatGrams(recommendedPlan.dose, 1)}
                </p>
                <p className="text-sm text-gray-400">
                  Target {Math.round(state.desiredBrews || 0)} brews
                  {recommendedPlan.isTarget
                    ? " exactly"
                    : `, best dose compromise is ${recommendedPlan.brews}`}
                </p>
              </div>
              <Button type="button" onClick={useRecommendedDose} className="sm:w-auto">
                Use dose
              </Button>
            </div>
          ) : (
            <p className="text-sm text-gray-300">
              No practical plan fits. Lower the desired brews or raise the maximum dose.
            </p>
          )}
        </div>

        {state.coffeeDose > 0 && availableBeans >= state.coffeeDose && followUpPlan && (
          <div className="mt-5 rounded-md border border-white/10 bg-white/[0.03] p-4">
            <p className="text-sm text-gray-300">If the next brew uses {formatGrams(state.coffeeDose, 1)}</p>
            <p className="mt-1 text-lg text-white">
              Then {followUpPlan.brews} brews remain at {formatGrams(followUpPlan.dose, 1)} each.
            </p>
            <p className="text-sm text-gray-500">
              That is the adjusted dose after spending one brew differently.
            </p>
          </div>
        )}

        {dosePlans.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-md border border-white/10">
            <div className="grid grid-cols-[4rem_1fr_1fr_5rem] bg-white/[0.05] px-4 py-3 text-xs uppercase tracking-wide text-gray-400">
              <span>Brews</span>
              <span>Dose</span>
              <span>Left</span>
              <span>Pick</span>
            </div>
            <div>
              {dosePlans.map((plan) => {
                return (
                  <div
                    key={`${plan.brews}-${plan.dose}`}
                    className={cn(
                      "grid grid-cols-[4rem_1fr_1fr_5rem] items-center border-t border-white/10 px-4 py-3 text-sm",
                      plan.isRecommended ? "bg-primary/[0.05] text-white" : "text-gray-300",
                    )}
                  >
                    <span className="text-primary">{plan.brews}</span>
                    <span>
                      {formatGrams(plan.dose, 1)}
                      {plan.isRecommended ? (
                        <span className="ml-2 text-xs text-primary">best</span>
                      ) : null}
                    </span>
                    <span>{plan.leftover === 0 ? "0 g" : formatGrams(plan.leftover, 1)}</span>
                    <button
                      type="button"
                      onClick={() => updateState("coffeeDose", plan.dose)}
                      className="rounded-sm border border-white/10 px-2 py-1 text-xs text-gray-200 transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      Use
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-md border border-white/10 bg-black/25 p-5 shadow-[0_0_40px_rgba(0,0,0,0.18)]">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Coffee className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-nis-m9-condensed text-2xl text-primary">TETSU KASUYA 4:6</h2>
            <p className="text-sm text-gray-400">Requested ratio stays visible; practical water is compensated.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            id="coffee-dose"
            label="Coffee dose"
            value={state.coffeeDose}
            step={0.1}
            onChange={(value) => updateState("coffeeDose", roundToOneDecimal(value))}
          />
          <NumberField
            id="ratio"
            label="Coffee-to-water ratio"
            value={state.ratio}
            step={0.25}
            min={1}
            onChange={(value) => updateState("ratio", value)}
          />
          <SelectField
            id="pour-interval"
            label="Pour interval seconds"
            value={state.pourIntervalSeconds}
            options={POUR_INTERVAL_OPTIONS}
            onChange={(value) => updateState("pourIntervalSeconds", value)}
          />
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500">Requested / actual</p>
            <p className="mt-1 text-xl text-white">
              1:{recipe.requestedRatio.toFixed(2)} / 1:{recipe.actualRatio.toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">
              Exact {formatGrams(recipe.exactWater, 1)} · Practical {formatGrams(recipe.practicalWater, 0)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SegmentedControl<FlavorAdjustment>
            label="First 40%"
            value={state.flavor}
            options={[
              { value: "sweet", label: "Sweet" },
              { value: "balanced", label: "Balanced" },
              { value: "bright", label: "Bright" },
            ]}
            onChange={(value) => updateState("flavor", value)}
          />
          <SegmentedControl<StrengthAdjustment>
            label="Remaining 60%"
            value={state.strength}
            options={[
              { value: "light", label: "Light" },
              { value: "balanced", label: "Balanced" },
              { value: "strong", label: "Strong" },
            ]}
            onChange={(value) => updateState("strength", value)}
          />
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-white/10">
          <div className="grid grid-cols-[4rem_1fr_1fr_1fr] bg-white/[0.05] px-4 py-3 text-xs uppercase tracking-wide text-gray-400">
            <span>Pour</span>
            <span className="flex items-center gap-1">
              <Timer className="size-3" aria-hidden="true" />
              Time
            </span>
            <span>Amount</span>
            <span>Scale</span>
          </div>
          <div>
            {recipe.pours.map((pour) => (
              <div
                key={pour.index}
                className="grid grid-cols-[4rem_1fr_1fr_1fr] border-t border-white/10 px-4 py-3 text-sm text-gray-200"
              >
                <span className="text-primary">{pour.index}</span>
                <span>{pour.time}</span>
                <span>+{formatGrams(pour.amount, 0)}</span>
                <span>{formatGrams(pour.cumulative, 0)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm text-gray-300">
              <Utensils className="size-4 text-primary" aria-hidden="true" />
              Log one brew using {formatGrams(recipe.coffeeDose, 1)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Remaining will become {formatGrams(Math.max(0, availableBeans - recipe.coffeeDose), 2)}.
            </p>
          </div>
          <Button type="button" onClick={logBrew} disabled={!canLogBrew}>
            Log brew
          </Button>
        </div>
      </section>
    </div>
  );
}
