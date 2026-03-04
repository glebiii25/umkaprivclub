import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { slugify } from '../utils/slugify';

const BG_DARK = 'rgb(2,2,2)';
const GREEN = 'rgb(0,255,47)';
const DIVIDER = 'rgba(255,255,255,0.3)';
const NAV_BG = 'rgb(227,227,227)';
const NAV_BORDER = 'rgb(118,118,118)';
const NAV_TEXT = 'rgb(30,30,30)';

interface ScheduleRow {
  exercise: string;
  reps: string;
}

interface DayTable {
  dayTitle: string;
  rows: ScheduleRow[];
}

/** Вариант из графика → название упражнения из модуля 3 (существующая страница) */
const SCHEDULE_TO_EXERCISE: Record<string, string> = {
  'Подтягивания': 'Классические подтягивания',
  'Подтягивания на жгуте': 'Подтягивания на жгуте',
  'Негативные подтягивания': 'Негативные подтягивания',
  'Отжимания': 'Отжимания классические',
  'с колен': 'Отжимания с колен',
  'от поверхности': 'Отжимания от поверхности',
  'Приседания': 'Приседания со своим весом тела',
  'Выпрыгивания': 'Выпрыгивания (приседания + прыжок)',
  'Скручивания на брусьях': 'Скручивания на брусьях (подъём таза)',
  'Подъем колен': 'Подъем колен к груди в упоре на брусьях',
  'Подтягивания обратным хватом': 'Обратные подтягивания (обратный хват)',
  'Отжимания узким хватом': 'Отжимания узкой постановкой рук (кузнечиком)',
  'Выпады назад': 'Выпады назад',
  'Динамическая планка': 'Динамическая планка',
  'Австралийские подтягивания узким хватом': 'Австралийские подтягивания (узким обратным хватом)',
  'Зашагивания на тумбу': 'Зашагивания на тумбу',
  'Скалолаз': 'Скалолаз (Mountain Climber)',
  // Уровень 2
  'Отжимания на брусьях': 'Отжимания на брусьях',
  'на жгуте': 'Отжимания на брусьях со жгутом',
  'Ноги к перекладине': 'НКП (ноги к перекладине)',
  'Болгарский сплит присед': 'Болгарский сплит-присед',
  'Тяга жгута к поясу': 'Тяга жгута к поясу',
  'Подтягивания нейтральный хват': 'Нейтральные подтягивания',
  'Отжимания от пола': 'Отжимания от пола',
  'Жим жгута вверх': 'Жим жгута вверх',
  'Подтягивания обратный хват': 'Обратные подтягивания (обратный хват)',
  'Приседания 10-10-2': 'Приседания 10-10-2',
  'Австралийские подтягивания': 'Австралийские подтягивания (узким обратным хватом)',
  // Уровень 3
  'Вертикальные отжимания': 'Вертикальные отжимания',
  'Прыжки на тумбу + вверх': 'Прыжки на тумбу',
  'Динамические отжимания': 'Динамические отжимания',
  'Выход силой': 'Выход силой',
  'Запрыгивания на тумбу': 'Прыжки на тумбу',
};

/** Зачётная неделя: день с чекбоксами и примечаниями */
interface FinalDay {
  dayTitle: string;
  exercises: string[];
  notes?: string[];
}

const FINAL_SCHEDULE: FinalDay[] = [
  {
    dayTitle: 'День 1',
    exercises: [
      'Выход силой',
      'Отжимания на брусьях',
      'Подтягивания',
      'Отжимания от пола',
      'Ноги к перекладине',
    ],
    notes: [
      '*Записываем максимальное количество повторений по каждому упражнению',
      '*Отдых между упражнениями – до 5 минут',
    ],
  },
  {
    dayTitle: 'День 2',
    exercises: [
      'Подтягивания',
      'Отжимания на брусьях',
      'Ноги к перекладине',
      'Отжимания от пола',
      'Австралийские подтягивания',
      'Запрыгивания на тумбу',
    ],
    notes: [
      '*Задача – выполнить по 50 повторений каждого упражнения',
      '*Последовательность выполнения и стратегия – любые',
      '*Засекаем общее время выполнения тренировки',
    ],
  },
];

function ScheduleTable({ days }: { days: DayTable[] }) {
  const { moduleId } = useParams<{ moduleId: string; levelId: string }>();
  return (
    <div className="flex flex-col gap-[59px]">
      {days.map((day) => (
        <div key={day.dayTitle} className="w-[352px] max-w-full">
          <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: DIVIDER }}>
            <span className="text-[17px] leading-tight text-white">{day.dayTitle} / Упражнение</span>
            <span className="text-[17px] leading-tight text-white">Повторения</span>
          </div>
          <div className="mt-4 flex flex-col gap-5">
            {day.rows.map((row, i) => {
              const parts = row.exercise.split(/\s*\/\s*/).map((p) => p.trim()).filter(Boolean);
              return (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 text-[17px] leading-tight text-white">
                    {parts.map((part, j) => {
                      const canonicalName = getCanonicalExerciseName(part, row.exercise);
                      /* График используется для модуля 1 (калистеника) — упражнения в модуле 3 */
                      const exerciseModuleId = moduleId === '1' ? '3' : moduleId;
                      const href = exerciseModuleId
                        ? `/module/${exerciseModuleId}/exercise/${slugify(canonicalName)}`
                        : '#';
                      return (
                        <span key={j}>
                          {j > 0 && ' / '}
                          <Link to={href} state={{ name: canonicalName }} className="transition-opacity hover:opacity-80">
                            {part}
                          </Link>
                        </span>
                      );
                    })}
                  </div>
                  <span className="shrink-0 text-[17px] leading-tight text-white">{row.reps}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const CHECKBOX_BORDER = 'rgb(202,196,208)';
const FINAL_SCHEDULE_STORAGE_KEY = 'final-schedule-completed';

function loadCompletedFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(FINAL_SCHEDULE_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function saveCompletedToStorage(completed: Set<string>) {
  try {
    localStorage.setItem(FINAL_SCHEDULE_STORAGE_KEY, JSON.stringify([...completed]));
  } catch {
    // ignore
  }
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function FinalScheduleTable({ days }: { days: FinalDay[] }) {
  const { moduleId } = useParams<{ moduleId: string; levelId: string }>();
  const [completed, setCompleted] = useState<Set<string>>(loadCompletedFromStorage);

  useEffect(() => {
    saveCompletedToStorage(completed);
  }, [completed]);

  const toggle = (dayIdx: number, exerciseIdx: number) => {
    const key = `${dayIdx}-${exerciseIdx}`;
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-[66px]">
      {days.map((day, dayIdx) => (
        <div key={day.dayTitle} className="w-[352px] max-w-full">
          <div className="border-b pb-2" style={{ borderColor: DIVIDER }}>
            <span className="text-[17px] leading-tight text-white">{day.dayTitle} / Упражнение</span>
          </div>
          <div className="mt-4 flex flex-col gap-[10px]">
            {day.exercises.map((name, i) => {
              const key = `${dayIdx}-${i}`;
              const checked = completed.has(key);
              const canonicalName = getCanonicalExerciseName(name);
              /* График используется для модуля 1 (калистеника) — упражнения в модуле 3 */
              const exerciseModuleId = moduleId === '1' ? '3' : moduleId;
              const href = exerciseModuleId
                ? `/module/${exerciseModuleId}/exercise/${slugify(canonicalName)}`
                : undefined;
              return (
                <div key={i} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggle(dayIdx, i)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border-2 transition-colors"
                    style={{
                      borderColor: checked ? GREEN : CHECKBOX_BORDER,
                      backgroundColor: checked ? GREEN : 'transparent',
                      color: checked ? BG_DARK : 'transparent',
                    }}
                    aria-label={checked ? 'Отметить как не выполненное' : 'Отметить как выполненное'}
                    aria-pressed={checked}
                  >
                    {checked ? <CheckIcon /> : null}
                  </button>
                  {href ? (
                    <Link to={href} state={{ name: canonicalName }} className="text-[17px] leading-tight text-white transition-opacity hover:opacity-80">
                      {name}
                    </Link>
                  ) : (
                    <span className="text-[17px] leading-tight text-white">{name}</span>
                  )}
                </div>
              );
            })}
          </div>
          {day.notes && day.notes.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              {day.notes.map((note, i) => (
                <p key={i} className="text-[17px] leading-tight text-white">
                  {note}
                </p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getCanonicalExerciseName(part: string, rowExercise?: string): string {
  const trimmed = part.trim();
  // «на жгуте» зависит от контекста: подтягивания → Подтягивания на жгуте, отжимания на брусьях → Отжимания на брусьях со жгутом
  if (trimmed === 'на жгуте' && rowExercise) {
    if (rowExercise.includes('Отжимания на брусьях')) return 'Отжимания на брусьях со жгутом';
    if (rowExercise.includes('Подтягивания')) return 'Подтягивания на жгуте';
  }
  return SCHEDULE_TO_EXERCISE[trimmed] ?? trimmed;
}

const LESSON_1_SCHEDULE: DayTable[] = [
  {
    dayTitle: 'День 1',
    rows: [
      { exercise: 'Подтягивания / Подтягивания на жгуте / Негативные подтягивания', reps: '3×Max' },
      { exercise: 'Отжимания / с колен / от поверхности', reps: '3×6-12' },
      { exercise: 'Приседания / Выпрыгивания', reps: '3×10-20' },
      { exercise: 'Скручивания на брусьях / Подъем колен', reps: '3×6-12' },
    ],
  },
  {
    dayTitle: 'День 2',
    rows: [
      { exercise: 'Подтягивания обратным хватом / Негативные подтягивания', reps: '3×Max' },
      { exercise: 'Отжимания узким хватом', reps: '3×6-12' },
      { exercise: 'Выпады назад', reps: '3×10-12' },
      { exercise: 'Динамическая планка', reps: '3×6-10' },
    ],
  },
  {
    dayTitle: 'День 3',
    rows: [
      { exercise: 'Австралийские подтягивания узким хватом', reps: '3×6-12' },
      { exercise: 'Отжимания / с колен / от поверхности', reps: '3×6-12' },
      { exercise: 'Зашагивания на тумбу', reps: '3×8-12' },
      { exercise: 'Скалолаз', reps: '3×20-40 (сек)' },
    ],
  },
];

/** График уровня 2 — для продолжающих */
const LESSON_2_SCHEDULE: DayTable[] = [
  {
    dayTitle: 'День 1',
    rows: [
      { exercise: 'Подтягивания / Подтягивания на жгуте', reps: '3×Max' },
      { exercise: 'Отжимания на брусьях / на жгуте', reps: '3×Max' },
      { exercise: 'Ноги к перекладине', reps: '3×10' },
      { exercise: 'Болгарский сплит присед', reps: '3×10' },
      { exercise: 'Тяга жгута к поясу', reps: '3×10' },
    ],
  },
  {
    dayTitle: 'День 2',
    rows: [
      { exercise: 'Подтягивания нейтральный хват / на жгуте', reps: '3×Max' },
      { exercise: 'Отжимания от пола', reps: '3×15' },
      { exercise: 'Выпрыгивания', reps: '3×15' },
      { exercise: 'Австралийские подтягивания', reps: '3×10' },
      { exercise: 'Жим жгута вверх', reps: '3×10' },
    ],
  },
  {
    dayTitle: 'День 3',
    rows: [
      { exercise: 'Подтягивания обратный хват', reps: '3×Max' },
      { exercise: 'Скручивания на брусьях / Подъем колен', reps: '3×10' },
      { exercise: 'Приседания 10-10-2', reps: '3×3' },
      { exercise: 'Австралийские подтягивания', reps: '3×15' },
      { exercise: 'Отжимания от пола', reps: '3×15' },
    ],
  },
];

/** График уровня 3 — для продвинутых */
const LESSON_3_SCHEDULE: DayTable[] = [
  {
    dayTitle: 'День 1',
    rows: [
      { exercise: 'Подтягивания / Подтягивания на жгуте', reps: '3×Max' },
      { exercise: 'Отжимания на брусьях', reps: '3×Max' },
      { exercise: 'Ноги к перекладине', reps: '3×15' },
      { exercise: 'Болгарский сплит присед', reps: '3×15' },
      { exercise: 'Отжимания от пола', reps: '3×20' },
      { exercise: 'Тяга жгута к поясу', reps: '3×20' },
    ],
  },
  {
    dayTitle: 'День 2',
    rows: [
      { exercise: 'Подтягивания нейтральный хват', reps: '3×Max' },
      { exercise: 'Отжимания от пола', reps: '3×20' },
      { exercise: 'Прыжки на тумбу + вверх', reps: '3×12' },
      { exercise: 'Австралийские подтягивания', reps: '3×20' },
      { exercise: 'Скручивания на брусьях', reps: '3×15' },
    ],
  },
  {
    dayTitle: 'День 3',
    rows: [
      { exercise: 'Подтягивания обратный хват', reps: '3×Max' },
      { exercise: 'Вертикальные отжимания', reps: '3×10' },
      { exercise: 'Приседания 10-10-2', reps: '3×4' },
      { exercise: 'Динамические отжимания', reps: '3×22' },
      { exercise: 'Австралийские подтягивания', reps: '3×15' },
    ],
  },
];

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function Schedule() {
  const { moduleId, levelId } = useParams<{ moduleId: string; levelId: string }>();
  const lessonUrl = moduleId && levelId ? `/module/${moduleId}/level/${levelId}/lesson/1` : '/';
  const scheduleData =
    levelId === '1' ? LESSON_1_SCHEDULE : levelId === '2' ? LESSON_2_SCHEDULE : levelId === '3' ? LESSON_3_SCHEDULE : null;
  const isFinal = levelId === 'final';

  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto max-w-[440px] px-[25px] pt-[20px]">
        <BackButton />
        {/* Заголовок */}
        <h1
          className="mt-8 mb-[45px] text-[19px] leading-tight"
          style={{
            color: GREEN,
            fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          График выполнения упражнений
        </h1>

        {/* Уровень 3: блок «Подготовка к стойке на руках» */}
        {levelId === '3' && (
          <div className="mb-[45px] w-[312px] max-w-full">
            <h2 className="text-[17px] leading-tight text-white">
              Подготовка к стойке на руках:
            </h2>
            <p className="mt-3 text-[17px] leading-snug text-white opacity-90">
              Укрепление плеч, баланса и корпуса. Новые специальные скоростно-силовые упражнения
            </p>
          </div>
        )}

        {isFinal ? (
          <FinalScheduleTable days={FINAL_SCHEDULE} />
        ) : scheduleData ? (
          <ScheduleTable days={scheduleData} />
        ) : (
          <p className="text-[19px] leading-tight text-white opacity-90">
            График для этого уровня будет добавлен позже.
          </p>
        )}

        {/* Навигация */}
        <div className="mt-8 mb-20 flex w-[280px] max-w-full items-center justify-center gap-6">
          <Link
            to={lessonUrl}
            className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
            style={{
              borderColor: 'rgb(235,235,240)',
              backgroundColor: NAV_BG,
              color: NAV_TEXT,
            }}
            aria-label="Назад к уроку"
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
