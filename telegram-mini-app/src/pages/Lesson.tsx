import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoriteButton } from '../components/FavoriteButton';
import { BackButton } from '../components/BackButton';
import { getMediaUrl, getMediaFallbackUrl, getMediaBaseUrl } from '../utils/getMediaUrl';

const BG_DARK = 'rgb(2,2,2)';
const GREEN = 'rgb(0,255,47)';
const BORDER_WHITE = 'rgba(255,255,255,0.4)';
const CARD_DARK = 'rgb(17,17,17)';
const QUOTE_CARD_BG = 'rgb(183,226,25)';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export interface LessonContent {
  levelLabel: string;
  /** Текст вступления после фото (опционально) */
  introText?: string;
  /** Несколько абзацев вступления (урок 3) — если задано, используется вместо introText */
  introParagraphs?: string[];
  /** Блок "Что тебя ждёт" (опционально) */
  whatToExpectTitle?: string;
  whatToExpectText?: string;
  forWhoTitle: string;
  forWhoText: string;
  goalTitle: string;
  goalText: string;
  equipmentTitle: string;
  equipmentText: string;
  /** Совет с вертикальной линией (опционально — урок 3 без блока) */
  tipText?: string;
  recommendationsTitle: string;
  recommendationsItems: string[];
  quoteText: string;
  scheduleButtonText: string;
  /** Урок 2: сначала «Цель», потом «Для кого» */
  goalBeforeForWho?: boolean;
}

const LESSON_CONTENT: Record<string, LessonContent> = {
  '1-1': {
    levelLabel: 'Уровень 1',
    forWhoTitle: 'Для кого:',
    forWhoText:
      'Для новичков, которые хотят освоить базовые движения, стать сильнее и увереннее в своем теле.',
    goalTitle: 'Цель программы:',
    goalText:
      'Научить тебя основам калистеники, развить силу, выносливость и гибкость, а главное – помочь сделать первые подтягивания, правильные отжимания и уверенный прыжки. ',
    equipmentTitle: 'Оборудование:',
    equipmentText:
      'На данном этапе можно обойтись весом собственного тела! Но будет классно иметь резиновые петли (жгуты). Они помогут как облегчить движение, так и усложнить его, чтобы прогресс никогда не останавливался.',
    tipText: 'Рекомендую набор жгутов разной толщины из латекса.',
    recommendationsTitle: 'Рекомендации:',
    recommendationsItems: [
      'У тебя 3 тренировки! Между ними минимум 1 день отдыха.',
      'В промежуточные дни рекомендую сделать по одному рабочему подходу',
      '2 движения на выбор: те, которые ты хотел бы освоить быстрее или улучшить результат, например подтягивания и отжимания.',
      'И/или заняться: мобильностью, кардио (если есть цель ввести больше активности).',
      'Но минимум 2 дня отдыхать от силовой нагрузки полностью! Не забывай набираться сил! ',
    ],
    quoteText:
      '"ты на старте, но если ты здесь – значит готов изменить себя и построить тело, о котором мечтаешь. И поверь, ты это сделаешь!"',
    scheduleButtonText: 'График выполнения упражнений',
  },
  '2-1': {
    levelLabel: 'Уровень 2',
    goalBeforeForWho: true,
    introText:
      'Ты уже сделал первый шаг и освоил базу? Почти научился подтягиваться или уже делаешь несколько повторов? Легко отжимаешься и хочешь большего?',
    whatToExpectTitle: 'Что тебя ждет:',
    whatToExpectText:
      'Более высокий объем и новые вариации упражнений.  Прогрессия нагрузок: усложнение движений и увеличение повторов; фокус на развитии силы хвата, корпуса и плечевого пояса; начальная подготовка; подготовка к будущим элементам.',
    goalTitle: 'Цель программы:',
    goalText:
      'перейти от новичка к более опытному тренирующемуся атлету, довести подтягивания до стабильного уровня, улучшить технику отжиманий и приседаний, развить контроль над телом. ',
    forWhoTitle: 'Для кого:',
    forWhoText:
      'для тех, кто уже укрепил тело, освоил азы и готов к новым вызовам: увеличить силу, объем тренировок и освоить более сложные элементы.  ',
    equipmentTitle: 'Оборудование:',
    equipmentText:
      'Резиновые петли остаются твоим помощником. Но теперь ты будешь использовать их реже, в качестве поддержки, и чаще в качестве самостоятельных упражнений!',
    tipText:
      'Ты уже на пути, и осталось совсем немного, чтобы твои подтягивания были чистыми, техника идеальной, а тело – сильным и управляемым.',
    recommendationsTitle: 'Рекомендации:',
    recommendationsItems: [
      'У тебя 3 тренировки! между ними минимум 1 день отдыха.',
      'В промежуточные дни рекомендую сделать по одному рабочему подходу 2 движения на выбор: те, которые ты хотел бы освоить быстрее или улучшить результат, например подтягивания и отжимания.',
      'И/или заняться: мобильностью, кардио ( если есть цель ввести больше активности).',
      'Но минимум 2 дня отдыхать от силовой нагрузки полностью!',
      'Не забывай набираться сил!',
    ],
    quoteText: 'Этот уровень сделает тебя готовым к еще более серьезным целям!',
    scheduleButtonText: 'График выполнения упражнений',
  },
  '3-1': {
    levelLabel: 'Уровень 3',
    introParagraphs: [
      'Теперь пришло время выйти на новый уровень и основательно готовиться к новым элементам, которые всегда вдохновляли: стойку на руках, выходы силой и динамические движения.',
      'Ты уже чувствуешь уверенность в своем теле? подтягивания, отжимания на брусьях и прыжки для тебя – привычное дело?',
    ],
    whatToExpectTitle: 'Что тебя ждет:',
    whatToExpectText:
      'Более высокий объем и новые вариации упражнений.\n\nПрогрессия нагрузок: усложнение движений и увеличение повторов;\n\nФокус на развитии: силы хвата, корпуса и плечевого пояса; начальная подготовка; подготовка к будущим элементам.',
    forWhoTitle: 'Для кого:',
    forWhoText:
      'для атлетов, которые уверенно выполняют базовые упражнения и готовы перейти к сложным навыкам, развивающим силу, координацию и контроль над телом.',
    goalTitle: 'Цель программы:',
    goalText:
      'перейти от новичка к более опытному тренирующемуся атлету, довести подтягивания до стабильного уровня, улучшить технику отжиманий и приседаний, развить контроль над телом. ',
    equipmentTitle: 'Оборудование:',
    equipmentText: 'перекладина, брусья, резиновые петли для отдельных упражнений.',
    recommendationsTitle: 'Рекомендации:',
    recommendationsItems: [
      'У тебя 3 тренировки!',
      'Между ними минимум 1 день отдыха.',
      'В промежуточные дни рекомендую сделать по одному рабочему подходу 2 движения на выбор:',
      'те, которые ты хотел бы освоить быстрее или улучшить результат, например подтягивания и отжимания.',
      'И/или заняться: мобильностью, кардио ( если есть цель ввести больше активности).',
      'Но минимум 2 дня отдыхать от силовой нагрузки полностью!',
      'Не забывай набираться сил!',
    ],
    quoteText:
      'Ты уже прошел долгий путь, и теперь твоя цель – движения, которые восхищают. Готов? Тогда начнем строить силу и контроль, о которых мечтает каждый, кто любит калистенику!',
    scheduleButtonText: 'График выполнения упражнений',
  },
};

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function Lesson() {
  const { moduleId, levelId, lessonId } = useParams<{
    moduleId: string;
    levelId: string;
    lessonId: string;
  }>();
  const location = useLocation();

  const lessonNum = lessonId ? parseInt(lessonId, 10) : 1;
  const levelNum = levelId ? parseInt(levelId, 10) : 1;
  const isFirstLesson = lessonNum <= 1;
  const prevLessonUrl = lessonNum > 1 ? String(lessonNum - 1) : undefined;
  const scheduleUrl = moduleId && levelId
    ? `/module/${moduleId}/level/${levelId}/schedule`
    : '#';

  const contentKey = `${levelId ?? '1'}-${lessonId ?? '1'}`;
  const content = LESSON_CONTENT[contentKey] ?? LESSON_CONTENT['1-1'];

  // Навигация по уровням: «Назад» — предыдущий уровень урок 1, «Вперёд» — следующий уровень или Зачётная неделя
  const prevLevelUrl =
    levelNum > 1 && moduleId ? `/module/${moduleId}/level/${levelNum - 1}/lesson/1` : undefined;
  const nextLevelUrl = moduleId
    ? levelNum === 3
      ? `/module/${moduleId}/level/final/lesson/1`
      : levelNum < 3
        ? `/module/${moduleId}/level/${levelNum + 1}/lesson/1`
        : undefined
    : undefined;

  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto max-w-[440px] px-10">
        <div className="pt-[20px]">
          <BackButton />
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center pt-10"
        >
          {/* 1. Номер уровня */}
          <motion.div
            variants={item}
            className="flex h-10 w-full max-w-[268px] items-center justify-center self-center rounded-[12px] border"
            style={{
              borderColor: BORDER_WHITE,
              borderWidth: 1,
            }}
          >
            <span
              className="text-[19px] leading-tight"
              style={{
                color: GREEN,
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {content.levelLabel}
            </span>
          </motion.div>

          {/* Избранное */}
          {moduleId && levelId && lessonId && (
            <motion.div variants={item} className="mt-6 flex w-full max-w-[360px] justify-end self-center">
              <FavoriteButton
                item={{
                  id: `/module/${moduleId}/level/${levelId}/lesson/${lessonId}`,
                  title: `Калистеника: ${content.levelLabel}`,
                  href: `/module/${moduleId}/level/${levelId}/lesson/${lessonId}`,
                }}
              />
            </motion.div>
          )}

          {/* 2. Фото */}
          <motion.div
            variants={item}
            className="mx-auto mt-16 flex h-[420px] w-full max-w-[320px] items-center justify-center overflow-hidden rounded-lg"
          >
            <img
              src={getMediaUrl(
                levelId === '3'
                  ? '/images/kalistenika-uroven-3.png'
                  : levelId === '2'
                    ? '/images/kalistenika-uroven-2.png'
                    : '/images/kalistenika-uroven-1.png',
                { basePrefix: getMediaBaseUrl(location.pathname) }
              )}
              alt=""
              className="h-full w-full object-contain"
              onError={(e) => {
                const path = levelId === '3' ? '/images/kalistenika-uroven-3.png' : levelId === '2' ? '/images/kalistenika-uroven-2.png' : '/images/kalistenika-uroven-1.png';
                const fallback = getMediaFallbackUrl(path, { basePrefix: getMediaBaseUrl(location.pathname) });
                if (fallback.startsWith('http')) e.currentTarget.src = fallback;
              }}
            />
          </motion.div>

          {/* Введение (урок 2 — один абзац, урок 3 — несколько) */}
          {(content.introParagraphs?.length || content.introText) && (
            <motion.div
              variants={item}
              initial="show"
              className="mt-12 w-full max-w-[360px] self-center"
            >
              {content.introParagraphs?.length ? (
                content.introParagraphs.map((p, i) => (
                  <p key={i} className={`text-[19px] leading-tight text-white ${i > 0 ? 'mt-4' : ''}`}>
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-[19px] leading-tight text-white">{content.introText}</p>
              )}
            </motion.div>
          )}

          {/* Что тебя ждёт (урок 2, 3) */}
          {content.whatToExpectTitle && content.whatToExpectText && (
            <motion.div
              variants={item}
              initial="show"
              className={`w-full max-w-[360px] self-center ${content.introText || content.introParagraphs?.length ? 'mt-12' : 'mt-12'}`}
            >
              <h2
                className="mb-[16px] text-[19px] font-bold leading-tight"
                style={{
                  color: GREEN,
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {content.whatToExpectTitle}
              </h2>
              <p className="text-[19px] leading-tight text-white whitespace-pre-line">{content.whatToExpectText}</p>
            </motion.div>
          )}

          {/* Цель и Для кого — порядок по макету (урок 2: цель сначала) */}
          {content.goalBeforeForWho ? (
            <>
              <motion.div variants={item} className="mt-12 w-full max-w-[360px] self-center">
                <h2
                  className="mb-[16px] text-[19px] font-bold leading-tight"
                  style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {content.goalTitle}
                </h2>
                <p className="text-[19px] leading-tight text-white">{content.goalText}</p>
              </motion.div>
              <motion.div variants={item} className="mt-12 w-full max-w-[360px] self-center">
                <h2
                  className="mb-[16px] text-[19px] font-bold leading-tight"
                  style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {content.forWhoTitle}
                </h2>
                <p className="text-[19px] leading-tight text-white">{content.forWhoText}</p>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div variants={item} className={`w-full max-w-[360px] self-center ${content.whatToExpectTitle ? 'mt-12' : 'mt-12'}`}>
                <h2
                  className="mb-[16px] text-[19px] font-bold leading-tight"
                  style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {content.forWhoTitle}
                </h2>
                <p className="text-[19px] leading-tight text-white">{content.forWhoText}</p>
              </motion.div>
              <motion.div variants={item} className="mt-12 w-full max-w-[360px] self-center">
                <h2
                  className="mb-[16px] text-[19px] font-bold leading-tight"
                  style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {content.goalTitle}
                </h2>
                <p className="text-[19px] leading-tight text-white">{content.goalText}</p>
              </motion.div>
            </>
          )}

          {/* 5. Оборудование */}
          <motion.div variants={item} className="mt-12 w-full max-w-[360px] self-center">
            <h2
              className="mb-[16px] text-[19px] font-bold leading-tight"
              style={{
                color: GREEN,
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {content.equipmentTitle}
            </h2>
            <p className="text-[19px] leading-tight text-white">{content.equipmentText}</p>
          </motion.div>

          {/* 6. Совет (опционально — нет в уроке 3) */}
          {content.tipText && (
            <motion.div variants={item} className="mt-8 flex w-full max-w-[360px] self-center gap-3">
              <div
                className="h-full min-h-[38px] w-[1px] shrink-0 self-stretch"
                style={{ backgroundColor: 'rgb(255,255,255)', width: 1 }}
                aria-hidden
              />
              <p className="text-[19px] leading-tight text-white">{content.tipText}</p>
            </motion.div>
          )}

          {/* 7. Рекомендации */}
          <motion.div
            variants={item}
            className="mt-10 w-full max-w-[360px] self-center rounded-[20px] px-5 py-7"
            style={{ backgroundColor: CARD_DARK }}
          >
            <h2
              className="mb-4 text-[28px] font-bold leading-tight"
              style={{
                color: GREEN,
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {content.recommendationsTitle}
            </h2>
            <div className="flex flex-col gap-4">
              {content.recommendationsItems.map((paragraph, i) => (
                <p key={i} className="text-[19px] leading-tight text-white">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          {/* 9. Кнопка с графиком (перед карточкой по порядку в макете) */}
          <motion.div variants={item} className="mt-[62px]">
            <Link
              to={scheduleUrl}
              className="flex h-[50px] w-full max-w-[360px] items-center justify-center self-center rounded-[15px] border px-4 py-3 text-[16px] text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: CARD_DARK,
                borderColor: 'rgba(0,255,47,0.4)',
                borderWidth: 1,
              }}
            >
              {content.scheduleButtonText}
            </Link>
          </motion.div>

          {/* 8. Мотивационная карточка */}
          <motion.div
            variants={item}
            className="mx-auto mt-16 w-full max-w-[280px] self-center rounded-[12px] px-4 py-4"
            style={{ backgroundColor: QUOTE_CARD_BG }}
          >
            <p
              className="text-[15px] font-bold leading-snug"
              style={{ color: 'rgb(0,0,0)' }}
            >
              {content.quoteText}
            </p>
          </motion.div>

          {/* 10. Навигация */}
          <motion.div
            variants={item}
            className="mx-auto mt-8 mb-20 flex w-full max-w-[280px] items-center justify-between"
          >
            {/* Назад: на уровне 1 — отключена; на уроке 1 уровня 2/3 — ссылка на предыдущий уровень */}
            {isFirstLesson && !prevLevelUrl ? (
              <span
                className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border opacity-50"
                style={{
                  borderColor: 'rgb(235,235,240)',
                  backgroundColor: 'rgb(227,227,227)',
                  color: 'rgb(30,30,30)',
                }}
                aria-disabled
              >
                <ChevronLeftIcon />
              </span>
            ) : isFirstLesson && prevLevelUrl ? (
              <Link
                to={prevLevelUrl}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
                style={{
                  borderColor: 'rgb(235,235,240)',
                  backgroundColor: 'rgb(227,227,227)',
                  color: 'rgb(30,30,30)',
                }}
                aria-label={levelNum === 2 ? 'Уровень 1. Для начинающих' : 'Уровень 2. Для продолжающих'}
              >
                <ChevronLeftIcon />
              </Link>
            ) : (
              <Link
                to={prevLessonUrl!}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
                style={{
                  borderColor: 'rgb(235,235,240)',
                  backgroundColor: 'rgb(227,227,227)',
                  color: 'rgb(30,30,30)',
                }}
              >
                <ChevronLeftIcon />
              </Link>
            )}

            {/* Главная */}
            <Link
              to="/"
              className="flex h-10 items-center gap-2 rounded-[8px] border px-3 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'rgb(227,227,227)',
                borderColor: 'rgb(118,118,118)',
                color: 'rgb(30,30,30)',
              }}
            >
              <span className="text-[16px]">Главная</span>
            </Link>

            {/* Вперёд: на уроке 1 — следующий уровень; на уровне 3 — отключена */}
            {nextLevelUrl ? (
              <Link
                to={nextLevelUrl}
                className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
                style={{
                  borderColor: 'rgb(235,235,240)',
                  backgroundColor: 'rgb(227,227,227)',
                  color: 'rgb(30,30,30)',
                }}
                aria-label={levelNum === 1 ? 'Уровень 2. Для продолжающих' : levelNum === 2 ? 'Уровень 3. Для продвинутых' : 'Зачетная неделя'}
              >
                <ChevronRightIcon />
              </Link>
            ) : (
              <span
                className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border opacity-50"
                style={{
                  borderColor: 'rgb(235,235,240)',
                  backgroundColor: 'rgb(227,227,227)',
                  color: 'rgb(30,30,30)',
                }}
                aria-disabled
              >
                <ChevronRightIcon />
              </span>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
