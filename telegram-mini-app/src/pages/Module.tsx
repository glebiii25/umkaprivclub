import { useParams, Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { motion } from 'framer-motion';
import { slugify } from '../utils/slugify';

const BORDER_WHITE = 'rgba(255,255,255,0.4)';
const GREEN = 'rgb(0,255,47)';
const PURPLE = 'rgb(234,0,255)';
const BG_DARK = 'rgb(2,2,2)';
const MAIN_BTN_BG = 'rgb(11,11,11)';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

interface LevelItem {
  label: string;
  search: string;
}

interface ProgramBlock {
  title: string;
  borderColor: string;
  levels: LevelItem[];
}

interface ModuleConfig {
  title: string;
  titleHeight?: 70 | 60 | 90;
  titleRadius?: 12 | 20;
  levels?: LevelItem[];
  programs?: ProgramBlock[];
  topics?: LevelItem[];
  exercises?: string[];
}

/** Конфиг модулей по id (экспорт для страницы упражнения) */
export const MODULES: Record<string, ModuleConfig> = {
  '1': {
    title: 'Программа тренировок. Калистеника',
    titleHeight: 70,
    levels: [
      { label: 'Уровень 1. Для начинающих', search: 'level=1' },
      { label: 'Уровень 2. Для продолжающих', search: 'level=2' },
      { label: 'Уровень 3. Для продвинутых', search: 'level=3' },
      { label: 'Зачетная неделя', search: 'level=final' },
    ],
    programs: [
      {
        title: 'Functional Hybrid Training for Men',
        borderColor: GREEN,
        levels: [
          { label: 'Уровень 1', search: 'program=fht-men&level=1' },
          { label: 'Уровень 2', search: 'program=fht-men&level=2' },
          { label: 'Уровень 3', search: 'program=fht-men&level=3' },
        ],
      },
      {
        title: 'Functional Hybrid Training for Women',
        borderColor: PURPLE,
        levels: [
          { label: 'Уровень 1', search: 'program=fht-women&level=1' },
          { label: 'Уровень 2', search: 'program=fht-women&level=2' },
          { label: 'Уровень 3', search: 'program=fht-women&level=3' },
        ],
      },
    ],
  },
  '2': {
    title: 'Мобильность суставов и растяжка',
    titleHeight: 60,
    topics: [
      { label: 'Плечевые суставы', search: 'topic=shoulders' },
      { label: 'Грудной и поясничный отдел позвоночника', search: 'topic=spine' },
      { label: 'Тазобедренный сустав', search: 'topic=hip' },
      { label: 'Растяжка. Все тело', search: 'topic=fullbody' },
    ],
  },
  '3': {
    title: 'Техника выполнения упражнений. Калистеника',
    titleHeight: 90,
    titleRadius: 20,
    exercises: [
      'Гибридные отжимания',
      'Прыжки на тумбу + выпрыгивания',
      'Приседания 10-10-2',
      'Вертикальные отжимания',
      'Болгарский сплит-присед',
      'Подъем колен в висе',
      'НКП (ноги к перекладине)',
      'Скручивания на брусьях (подъём таза)',
      'Негативные подтягивания',
      'Прыжки на тумбу',
      'Классические подтягивания',
      'Австралийские подтягивания (узким обратным хватом)',
      'Отжимания классические',
      'Подъем колен к груди в упоре на брусьях',
      'Приседания со своим весом тела',
      'Выпрыгивания (приседания + прыжок)',
      'Выпады назад',
      'Зашагивания на тумбу',
      'Скалолаз (Mountain Climber)',
      'Обратные подтягивания (обратный хват)',
      'Нейтральные подтягивания',
      'Динамическая планка',
      'Планка статическая',
      'Взрывные подтягивания',
      'Отжимания на брусьях',
      'Отжимания на брусьях со жгутом',
      'Динамические отжимания',
      'Австралийские подтягивания (широкий прямой хват)',
      'Подтягивания на жгуте',
      'Жим жгута вверх',
      'Тяга жгута к поясу',
      'Сгибания жгута на бицепс стоя',
      'Отжимания узкой постановкой рук (кузнечиком)',
      'Алмазные отжимания',
    ],
  },
  '4': {
    title: 'Техника выполнения упражнений. Тренажерный зал',
    titleHeight: 90,
    titleRadius: 20,
    exercises: [
      'Присед с гирей',
      'Присед фронтальный с гантелью',
      'Присед фронтальный со штангой',
      'Присед (классический со штангой)',
      'Жим ног в наклоне',
      'Румынская тяга с грифом',
      'Выпады назад',
      'Болгарский сплит-присед',
      'Зашагивания на платформу',
      'Ягодичный мост',
      'Разгибание голени сидя в тренажёре',
      'Сгибание голени сидя',
      'Сгибание голени лёжа',
      'Разведение ног (в тренажёре)',
      'Экстензия на бицепс бедра',
      'Экстензия на спину',
      'Жим лёжа',
      'Жим гантелей на наклонной скамье',
      'Жим вверх (армейский)',
      'Бабочка (сведение рук в тренажёре)',
      'Тяга вертикального блока (классический хват)',
      'Тяга вертикального блока (нейтральный хват)',
      'Тяга горизонтального блока сидя',
      'Тяга горизонтального блока широким хватом',
      'Брусья (с доп весом)',
      'Тяга гантелей к поясу в наклоне',
      'Тяга Т-грифа в наклоне',
      'Тяга нижнего блока стоя',
      'Пуловер в кроссовере',
      'Подъём EZ-грифа на бицепс',
      'Подъём гантелей на бицепс "молот"',
      'Разгибание рук на блоке',
      'Махи гантелями в стороны',
      'Махи вперед в полную амплитуду',
      'Подъем ног в упоре на локтях',
      'Подъем колена в планке',
      'Лодочка (супермен)',
      'Подъем гантелей на бицепс + жим вверх',
    ],
  },
};

function LevelCard({
  to,
  state,
  children,
  variants,
}: {
  to: string;
  state?: object;
  children: React.ReactNode;
  variants?: typeof item;
}) {
  return (
    <motion.div variants={variants} className="w-[350px] max-w-full">
      <Link
        to={to}
        state={state}
        className="flex h-[70px] w-full cursor-pointer items-center justify-center rounded-[12px] border border-white/40 px-4 text-center transition-opacity hover:opacity-80"
        style={{ borderColor: BORDER_WHITE }}
      >
        <span
          className="text-[17px] font-bold leading-tight text-white"
          style={{
            fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
            backgroundClip: 'unset',
            WebkitBackgroundClip: 'unset',
          }}
        >
          {children}
        </span>
      </Link>
    </motion.div>
  );
}

function ProgramBlockCard({ program, moduleId }: { program: ProgramBlock; moduleId: string }) {
  return (
    <motion.div variants={item} className="w-full max-w-[350px] self-center">
      <div
        className="rounded-[12px] border px-4 pb-4 pt-4"
        style={{
          borderColor: program.borderColor,
          borderWidth: 1,
        }}
      >
        <div className="flex h-[70px] w-full items-center justify-center">
          <span
            className="text-center text-[19px] font-bold leading-tight text-white"
            style={{
              fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {program.title}
          </span>
        </div>
        <div className="mt-4 flex justify-center gap-3">
          {program.levels.map((lev) => {
            const levelMatch = lev.search.match(/level=(\d+)/);
            const levelId = levelMatch ? levelMatch[1] : '1';
            const resolvedProgramId = lev.search.includes('fht-men') ? 'fht-men' : 'fht-women';
            return (
              <Link
                key={lev.search}
                to={`/module/${moduleId}/program/${resolvedProgramId}/level/${levelId}`}
                className="flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-white/40 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
              >
                {lev.label}
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export function Module() {
  const { id } = useParams<{ id: string }>();
  const moduleId = id ?? '';

  const content = MODULES[moduleId] ?? null;

  if (!content) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center safe-area-padding p-4"
        style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}
      >
        <p className="text-lg font-medium">Модуль {moduleId || '—'}</p>
        <Link
          to="/"
          className="mt-4 cursor-pointer text-sm underline opacity-90 transition-opacity hover:opacity-100"
        >
          На главную
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto max-w-[440px] px-10">
        <div className="pt-[20px]">
          <BackButton to="/" />
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center pt-10"
        >
          {/* Название модуля — не кликабельно */}
          <motion.div
            variants={item}
            className="flex w-full max-w-[350px] items-center self-center border px-4"
            style={{
              borderColor: BORDER_WHITE,
              height: content.titleHeight ?? 70,
              borderRadius: content.titleRadius ?? 12,
            }}
          >
            <span
              className="w-full text-center text-[19px] font-bold leading-tight"
              style={{
                color: GREEN,
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {content.title}
            </span>
          </motion.div>

          {/* Уровни (модуль 1) — переход на первый урок уровня */}
          {content.levels && content.levels.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-7">
              {content.levels.map((lev) => {
                const levelId = lev.search.startsWith('level=') ? lev.search.slice(6) : lev.search;
                return (
                  <LevelCard
                    key={lev.search}
                    to={`/module/${moduleId}/level/${levelId}/lesson/1`}
                    variants={item}
                  >
                    {lev.label}
                  </LevelCard>
                );
              })}
            </div>
          )}

          {/* Упражнения (модуль 3, 4) — переход на страницу упражнения */}
          {content.exercises && content.exercises.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-7">
              {content.exercises.map((name) => (
                <LevelCard
                  key={name}
                  to={`/module/${moduleId}/exercise/${slugify(name)}`}
                  state={{ name }}
                  variants={item}
                >
                  {name}
                </LevelCard>
              ))}
            </div>
          )}

          {/* Темы (модуль 2) — отступ 72 после заголовка, 27 между карточками */}
          {content.topics && content.topics.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-7">
              {content.topics.map((t) => (
                <LevelCard
                  key={t.search}
                  to={`/module/${moduleId}/lessons?${t.search}`}
                  variants={item}
                >
                  {t.label}
                </LevelCard>
              ))}
            </div>
          )}

          {/* FHT программы (модуль 1) — отступ 52 перед блоком, 27 между блоками */}
          {content.programs && content.programs.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-7">
              {content.programs.map((program) => (
                <ProgramBlockCard
                  key={program.title}
                  program={program}
                  moduleId={moduleId}
                />
              ))}
            </div>
          )}

          {/* Кнопка главная */}
          <motion.div
            variants={item}
            className="mb-12 flex justify-center"
            style={{ marginTop: content.exercises ? 43 : content.topics ? 55 : 52 }}
          >
            <Link
              to="/"
              className="flex h-10 min-w-[130px] cursor-pointer items-center justify-center rounded-[10px] border text-[16px] font-normal text-white transition-opacity hover:opacity-80"
              style={{
                backgroundColor: MAIN_BTN_BG,
                borderColor: BORDER_WHITE,
              }}
            >
              главная
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
