/** Activity level multipliers for TDEE */
export const ACTIVITY_MULTIPLIERS = {
  low: { label: 'Низкая — хожу в магазин или недолго прогуливаюсь', value: 1.375 },
  medium: { label: 'Средняя — ежедневно гуляю не меньше часа', value: 1.55 },
  high: { label: 'Высокая — занимаюсь активными видами спорта/досуга (велосипед, ролики, лыжи, коньки и др) 2-3 раза в неделю', value: 1.725 },
  veryHigh: { label: 'Очень высокая — регулярно занимаюсь спортом (бег, гимнастика, тренажерный зал), минимум 5 раз в неделю', value: 1.9 },
} as const;

export type ActivityKey = keyof typeof ACTIVITY_MULTIPLIERS;

export interface KbjuInput {
  weight: number;
  height: number;
  age: number;
  isMale: boolean;
  activityKey: ActivityKey;
}

export interface KbjuResult {
  mifflin: number;
  harris: number;
  rangeMin: number;
  rangeMax: number;
}

/**
 * Mifflin-St Jeor formula → TDEE (kcal/day)
 */
function mifflinStJeor(weight: number, height: number, age: number, isMale: boolean, mult: number): number {
  const bmr = isMale
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(bmr * mult);
}

/**
 * Harris-Benedict formula → TDEE (kcal/day)
 */
function harrisBenedict(weight: number, height: number, age: number, isMale: boolean, mult: number): number {
  const bmr = isMale
    ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  return Math.round(bmr * mult);
}

/**
 * Average per kg (30–38 kcal/kg) × activity multiplier
 */
function rangePerKg(weight: number, mult: number): { min: number; max: number } {
  return {
    min: Math.round(weight * 30 * mult),
    max: Math.round(weight * 38 * mult),
  };
}

export function calculateKbju(input: KbjuInput): KbjuResult {
  const mult = ACTIVITY_MULTIPLIERS[input.activityKey].value;
  const mifflin = mifflinStJeor(input.weight, input.height, input.age, input.isMale, mult);
  const harris = harrisBenedict(input.weight, input.height, input.age, input.isMale, mult);
  const range = rangePerKg(input.weight, mult);
  return {
    mifflin,
    harris,
    rangeMin: range.min,
    rangeMax: range.max,
  };
}
