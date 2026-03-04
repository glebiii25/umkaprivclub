import { useParams, Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { useCallback, useEffect, useState } from 'react';
import { slugify } from '../utils/slugify';

const BG_DARK = 'rgb(2,2,2)';
const GREEN = 'rgb(0,255,47)';
const DIVIDER = 'rgba(255,255,255,0.3)';
const NAV_BG = 'rgb(227,227,227)';
const NAV_BORDER = 'rgb(118,118,118)';
const NAV_TEXT = 'rgb(30,30,30)';
const CHECKBOX_BORDER = 'rgba(202,199,208,1)';

const STORAGE_KEY_PREFIX = 'mini-test';

export type MiniTestSectionId = 'minimum' | 'goal';

export interface MiniTestCompleted {
  minimum: Record<string, boolean>;
  goal: Record<string, boolean>;
}

function loadCompleted(moduleId: string, programId: string, levelId: string): MiniTestCompleted {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${moduleId}-${programId}-${levelId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return { minimum: {}, goal: {} };
    const parsed = JSON.parse(raw) as MiniTestCompleted;
    return {
      minimum: typeof parsed.minimum === 'object' && parsed.minimum ? parsed.minimum : {},
      goal: typeof parsed.goal === 'object' && parsed.goal ? parsed.goal : {},
    };
  } catch {
    return { minimum: {}, goal: {} };
  }
}

function saveCompleted(
  moduleId: string,
  programId: string,
  levelId: string,
  data: MiniTestCompleted
) {
  try {
    const key = `${STORAGE_KEY_PREFIX}-${moduleId}-${programId}-${levelId}`;
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/** Упражнение в мини-тесте → каноническое название для страницы */
const MINI_TEST_EXERCISE: Record<string, string> = {
  подтягивания: 'Подтягивания на жгуте',
  отжимания: 'Отжимания классические',
  присед: 'Приседания со своим весом тела',
  планка: 'Планка статическая',
  'присед со штангой': 'Присед со штангой',
  'отжимания на брусьях': 'Отжимания на брусьях',
  'скручивания на брусьях': 'Скручивания на брусьях (подъём таза)',
  'выход силой на одну руку': 'Выход силой на одну руку',
  'прыжок на плиобокс': 'Запрыгивания на бокс',
  'стойка у стены': 'Стойка у стены',
  'присед с собственным весом': 'Приседания со своим весом тела',
  'ягодичный мост': 'Ягодичный мост',
  'отжимания — чистые от пола': 'Отжимания классические',
};

function getExerciseName(key: string): string | null {
  const k = key.trim().toLowerCase();
  return MINI_TEST_EXERCISE[k] ?? null;
}

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L4.5 8.5 2 6" />
    </svg>
  );
}

interface MiniTestRow {
  exercise: string;
  value: string;
}

const MINIMUM_ROWS: MiniTestRow[] = [
  { exercise: 'подтягивания', value: '3 раза' },
  { exercise: 'отжимания', value: '10 раз' },
  { exercise: 'присед', value: '20 раз' },
  { exercise: 'планка', value: '45 секунд' },
];

const GOAL_ROWS: MiniTestRow[] = [
  { exercise: 'подтягивания', value: '5+ раз' },
  { exercise: 'отжимания', value: '15+ раз' },
  { exercise: 'присед', value: '30+ раз' },
  { exercise: 'планка', value: '60 секунд' },
];

/** Мини-тест Level 2: Минимум и Цель */
const MINIMUM_ROWS_LEVEL2: MiniTestRow[] = [
  { exercise: 'присед со штангой', value: '1 × вес тела × 3' },
  { exercise: 'подтягивания', value: '6+ раз' },
  { exercise: 'отжимания на брусьях', value: '10 раз' },
  { exercise: 'скручивания на брусьях', value: '15 раз' },
];

const GOAL_ROWS_LEVEL2: MiniTestRow[] = [
  { exercise: 'присед со штангой', value: '1 × вес тела × 5' },
  { exercise: 'подтягивания', value: '8+ раз' },
  { exercise: 'отжимания на брусьях', value: '15+ раз' },
  { exercise: 'скручивания на брусьях', value: '15+ раз' },
];

/** Мини-тест Level 3: Минимум и Цель */
const MINIMUM_ROWS_LEVEL3: MiniTestRow[] = [
  { exercise: 'подтягивания', value: '12 раз' },
  { exercise: 'выход силой на одну руку', value: '2 раза' },
  { exercise: 'отжимания на брусьях', value: '20 раз' },
  { exercise: 'прыжок на плиобокс', value: '60 см' },
  { exercise: 'стойка у стены', value: '20 сек' },
];

const GOAL_ROWS_LEVEL3: MiniTestRow[] = [
  { exercise: 'подтягивания', value: '15+ раз' },
  { exercise: 'выход силой на одну руку', value: '2+ раза' },
  { exercise: 'отжимания на брусьях', value: '20+ раз' },
  { exercise: 'прыжок на плиобокс', value: '70 см' },
  { exercise: 'стойка у стены', value: '20+ сек' },
];

/** Мини-тест FHT Women Level 1 */
const MINIMUM_ROWS_WOMEN_1: MiniTestRow[] = [
  { exercise: 'присед с собственным весом', value: '30 раз' },
  { exercise: 'ягодичный мост', value: '20 кг × 10 раз' },
  { exercise: 'планка', value: '60 сек' },
  { exercise: 'отжимания — чистые от пола', value: '3+' },
];

const GOAL_ROWS_WOMEN_1: MiniTestRow[] = [
  { exercise: 'присед с собственным весом', value: '40+' },
  { exercise: 'ягодичный мост', value: '30 кг × 10 раз' },
  { exercise: 'планка', value: '90 сек' },
  { exercise: 'отжимания — чистые от пола', value: 'чистые от пола 5+' },
];

/** Мини-тест FHT Women Level 2: Минимум и Цель */
const MINIMUM_ROWS_WOMEN_2: MiniTestRow[] = [
  { exercise: 'присед со штангой', value: '1 × 80% веса тела × 5' },
  { exercise: 'подтягивания', value: '1+' },
  { exercise: 'отжимания', value: '8+' },
  { exercise: 'планка', value: '90 сек' },
];

const GOAL_ROWS_WOMEN_2: MiniTestRow[] = [
  { exercise: 'присед со штангой', value: '1×собственного веса × 5' },
  { exercise: 'подтягивания', value: '3+' },
  { exercise: 'отжимания', value: '12+' },
  { exercise: 'планка', value: '120 сек' },
];

/** Мини-тест FHT Women Level 3 */
const MINIMUM_ROWS_WOMEN_3: MiniTestRow[] = [
  { exercise: 'подтягивания', value: '3+' },
  { exercise: 'отжимания', value: '12+' },
  { exercise: 'прыжок на плиобокс', value: '50-60 см' },
  { exercise: 'планка', value: '90 сек' },
];

const GOAL_ROWS_WOMEN_3: MiniTestRow[] = [
  { exercise: 'подтягивания', value: '5+' },
  { exercise: 'отжимания', value: '15+' },
  { exercise: 'прыжок на плиобокс', value: '70 см' },
  { exercise: 'планка', value: '120 сек' },
  { exercise: 'flow-комплекс', value: '4 раунда без пауз' },
];

function MiniTestSection({
  title,
  headerRight,
  rows,
  moduleId,
  sectionId,
  completed,
  onToggle,
}: {
  title: string;
  headerRight: string;
  rows: MiniTestRow[];
  moduleId: string;
  sectionId: MiniTestSectionId;
  completed: Record<string, boolean>;
  onToggle: (sectionId: MiniTestSectionId, exercise: string) => void;
}) {
  return (
    <div className="w-[382px] max-w-full">
      <div
        className="flex items-start justify-between border-b pb-2"
        style={{ borderColor: DIVIDER }}
      >
        <span className="text-[17px] leading-tight text-white">{title}</span>
        <span className="text-[17px] leading-tight text-white">{headerRight}</span>
      </div>
      <ul className="mt-4 list-none space-y-4">
        {rows.map((row) => {
          const name = getExerciseName(row.exercise);
          const href = name && moduleId ? `/module/${moduleId}/exercise/${slugify(name)}` : null;
          const checked = Boolean(completed[row.exercise]);
          return (
            <li key={row.exercise} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  aria-label={checked ? `${row.exercise} — выполнено` : `${row.exercise} — отметить`}
                  className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[2px] border-2 transition-colors"
                  style={{
                    borderColor: checked ? GREEN : CHECKBOX_BORDER,
                    backgroundColor: checked ? GREEN : 'transparent',
                    color: checked ? BG_DARK : 'transparent',
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle(sectionId, row.exercise);
                  }}
                >
                  {checked ? <CheckIcon /> : null}
                </button>
                {href ? (
                  <Link
                    to={href}
                    state={{ name }}
                    className="text-[17px] leading-tight text-white transition-opacity hover:opacity-80"
                  >
                    {row.exercise}
                  </Link>
                ) : (
                  <span className="text-[17px] leading-tight text-white">{row.exercise}</span>
                )}
              </div>
              <span className="shrink-0 text-[17px] leading-tight text-white">{row.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MiniTest() {
  const { moduleId, programId, levelId } = useParams<{ moduleId: string; programId: string; levelId: string }>();
  const backUrl = moduleId && programId && levelId ? `/module/${moduleId}/program/${programId}/level/${levelId}` : '/';
  const exerciseModuleId = moduleId ?? '3';
  const isWomen1 = programId === 'fht-women' && levelId === '1';
  const isWomen2 = programId === 'fht-women' && levelId === '2';
  const isWomen3 = programId === 'fht-women' && levelId === '3';
  const isLevel2 = levelId === '2';
  const isLevel3 = levelId === '3';
  const minimumRows = isWomen3 ? MINIMUM_ROWS_WOMEN_3 : isWomen2 ? MINIMUM_ROWS_WOMEN_2 : isWomen1 ? MINIMUM_ROWS_WOMEN_1 : isLevel3 ? MINIMUM_ROWS_LEVEL3 : isLevel2 ? MINIMUM_ROWS_LEVEL2 : MINIMUM_ROWS;
  const goalRows = isWomen3 ? GOAL_ROWS_WOMEN_3 : isWomen2 ? GOAL_ROWS_WOMEN_2 : isWomen1 ? GOAL_ROWS_WOMEN_1 : isLevel3 ? GOAL_ROWS_LEVEL3 : isLevel2 ? GOAL_ROWS_LEVEL2 : GOAL_ROWS;

  const [completed, setCompleted] = useState<MiniTestCompleted>(() =>
    moduleId && programId && levelId ? loadCompleted(moduleId, programId, levelId) : { minimum: {}, goal: {} }
  );

  useEffect(() => {
    if (moduleId && programId && levelId) {
      setCompleted(loadCompleted(moduleId, programId, levelId));
    }
  }, [moduleId, programId, levelId]);

  const handleToggle = useCallback(
    (sectionId: MiniTestSectionId, exercise: string) => {
      if (!moduleId || !programId || !levelId) return;
      setCompleted((prev) => {
        const next = {
          minimum: { ...prev.minimum },
          goal: { ...prev.goal },
        };
        const section = next[sectionId];
        section[exercise] = !section[exercise];
        saveCompleted(moduleId, programId, levelId, next);
        return next;
      });
    },
    [moduleId, programId, levelId]
  );

  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto max-w-[440px] px-[25px] pt-[20px]">
        <BackButton />
        <h1
          className="mt-8 mb-[46px] text-[19px] leading-tight"
          style={{
            color: GREEN,
            fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Мини-тест
        </h1>

        <div className="flex flex-col gap-[68px]">
          <MiniTestSection
            title="Минимум:"
            headerRight="Повторения:"
            rows={minimumRows}
            moduleId={exerciseModuleId}
            sectionId="minimum"
            completed={completed.minimum}
            onToggle={handleToggle}
          />
          <MiniTestSection
            title="Цель:"
            headerRight="Повторения:"
            rows={goalRows}
            moduleId={exerciseModuleId}
            sectionId="goal"
            completed={completed.goal}
            onToggle={handleToggle}
          />
        </div>

        <div className="mt-[60px] flex w-[280px] max-w-full items-center justify-center gap-6">
          <Link
            to={backUrl}
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
            style={{
              borderColor: 'rgb(235,235,240)',
              backgroundColor: NAV_BG,
              color: NAV_TEXT,
            }}
            aria-label="Назад к программе"
          >
            <ChevronLeftIcon />
          </Link>
          <Link
            to="/"
            className="flex h-10 items-center justify-center rounded-[8px] border px-4 transition-opacity hover:opacity-90"
            style={{
              backgroundColor: NAV_BG,
              borderColor: NAV_BORDER,
              color: NAV_TEXT,
            }}
          >
            <span className="text-[16px]">Главная</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
