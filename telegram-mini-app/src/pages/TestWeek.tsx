import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoriteButton } from '../components/FavoriteButton';
import { BackButton } from '../components/BackButton';
import { getMediaUrl, getMediaFallbackUrl, getMediaBaseUrl } from '../utils/getMediaUrl';

const BG_DARK = 'rgb(2,2,2)';
const GREEN = 'rgb(0,255,47)';
const BORDER_WHITE = 'rgba(255,255,255,0.4)';
const CARD_DARK = 'rgb(17,17,17)';
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

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default function TestWeek() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const location = useLocation();
  const backUrl = moduleId ? `/module/${moduleId}/level/3/lesson/1` : '/';
  const scheduleUrl = moduleId ? `/module/${moduleId}/level/final/schedule` : '#';

  return (
    <div
      className="min-h-screen safe-area-padding pb-12"
      style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}
    >
      <div className="mx-auto max-w-[440px] px-[25px]">
        <div className="pt-[20px]">
          <BackButton />
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col pt-10"
        >
          {/* 1. Плашка «Зачет» */}
          <motion.div variants={item} className="flex w-full justify-center">
            <div
              className="flex h-10 w-[268px] items-center justify-center rounded-[12px] border"
              style={{ borderColor: BORDER_WHITE, borderWidth: 1 }}
            >
              <span
              className="text-[19px] font-bold leading-tight"
              style={{
                color: GREEN,
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Зачет
            </span>
            </div>
          </motion.div>

          {/* Избранное */}
          {moduleId && (
            <motion.div variants={item} className="mt-6 flex w-full justify-end">
              <FavoriteButton
                item={{
                  id: `/module/${moduleId}/level/final/lesson/1`,
                  title: 'Зачетная неделя',
                  href: `/module/${moduleId}/level/final/lesson/1`,
                }}
              />
            </motion.div>
          )}

          {/* 2. Фото */}
          <motion.div variants={item} className="mt-[63px] flex w-full justify-center">
            <div className="flex h-[420px] w-[280px] items-center justify-center overflow-hidden rounded-lg">
              <img
                src={getMediaUrl('/images/kalistenika-zachet.png', { basePrefix: getMediaBaseUrl(location.pathname) })}
                alt=""
                className="h-full w-full object-contain"
                onError={(e) => {
                  const fallback = getMediaFallbackUrl('/images/kalistenika-zachet.png', { basePrefix: getMediaBaseUrl(location.pathname) });
                  if (fallback.startsWith('http')) e.currentTarget.src = fallback;
                }}
              />
            </div>
          </motion.div>

          {/* 3. Введение */}
          <motion.div variants={item} className="mt-[68px] w-[352px] max-w-full flex flex-col gap-4">
            <p className="text-[19px] leading-tight text-white">
              Пришло время проверить, как далеко ты продвинулся! Эта неделя – не просто тренировки, а контроль твоего прогресса. Ты зафиксируешь максимальное количество повторений в ключевых базовых движениях.
            </p>
            <p className="text-[19px] leading-tight text-white">
              Ты уже чувствуешь уверенность в своем теле? подтягивания, отжимания на брусьях и прыжки для тебя – привычное дело?
            </p>
            <p className="text-[19px] leading-tight text-white">
              Теперь пришло время выйти на новый уровень и основательно готовиться к новым элементам, которые всегда вдохновляли – стойку на руках, выходы силой и динамические движения.
            </p>
          </motion.div>

          {/* 4. Зачем это нужно? */}
          <motion.div variants={item} className="mt-[50px] w-[352px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Зачем это нужно?
            </h2>
            <p className="text-[19px] leading-tight text-white">
              Чтобы увидеть реальный результат твоих тренировок. Определить сильные и слабые стороны. Поставить новые цели на следующий этап.
            </p>
          </motion.div>

          {/* 5. Примеры движений (первый блок) */}
          <motion.div variants={item} className="mt-[40px] w-[398px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Примеры движений
            </h2>
            <p className="text-[19px] leading-tight text-white whitespace-pre-line">
              {`• Выходы силой
• Подтягивания
• НКП (ноги к перекладине)
• Отжимания на брусьях
• Отжимания от пола
• Планка (удержание)`}
            </p>
            <p className="mt-6 text-[19px] leading-tight text-white italic">
              «Ты не соревнуешься ни с кем, кроме самого себя. Дай максимум и запиши результат – через пару месяцев ты удивишься, насколько стал сильнее!»
            </p>
          </motion.div>

          {/* 6. Зачет на силовую выносливость (для продвинутых) */}
          <motion.div variants={item} className="mt-[28px] w-[352px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Зачет на силовую выносливость (для продвинутых)
            </h2>
            <p className="text-[19px] leading-tight text-white">
              для атлетов, которые уверенно выполняют базовые упражнения и готовы перейти к сложным навыкам, развивающим силу, координацию и контроль над телом.
            </p>
          </motion.div>

          {/* 7. Для кого? */}
          <motion.div variants={item} className="mt-[30px] w-[352px] max-w-full">
            <h2
              className="mb-[16px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Для кого?
            </h2>
            <p className="text-[19px] leading-tight text-white">
              Это испытание – для тех, кто готов проверить себя на прочность. Здесь важны не только сила, но и умение держать темп, бороться с усталостью и сохранять технику до конца.
            </p>
          </motion.div>

          {/* 8. Задача */}
          <motion.div variants={item} className="mt-[35px] w-[352px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Задача:
            </h2>
            <p className="text-[19px] leading-tight text-white">
              выполнить 6 движений на все тело по 50 повторений каждого на время.
            </p>
          </motion.div>

          {/* 9. Твоя цель */}
          <motion.div variants={item} className="mt-[35px] w-[352px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Твоя цель:
            </h2>
            <p className="text-[19px] leading-tight text-white">
              закончить тренировку как можно быстрее, сохраняя правильную технику.
            </p>
          </motion.div>

          {/* 10. Что проверяет этот тест? */}
          <motion.div variants={item} className="mt-[32px] w-[352px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Что проверяет этот тест?
            </h2>
            <p className="text-[19px] leading-tight text-white whitespace-pre-line">
              {`Силовую выносливость
Ментальную устойчивость
Умение работать на пределе, не теряя качества`}
            </p>
          </motion.div>

          {/* 11. Пример движений (второй блок) */}
          <motion.div variants={item} className="mt-[40px] w-[352px] max-w-full">
            <h2
              className="mb-[20px] text-[19px] font-bold leading-tight"
              style={{ color: GREEN, fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Пример движений
            </h2>
            <p className="text-[19px] leading-tight text-white whitespace-pre-line">
              {`Подтягивания
Отжимания на брусьях
НКП (ноги к перекладине)
Запрыгивания на тумбу
Австралийские подтягивания
Отжимания от пола`}
            </p>
          </motion.div>

          {/* 12. Кнопка «График выполнения упражнений» */}
          <motion.div variants={item} className="mt-[86px] flex w-full justify-center">
            <Link
              to={scheduleUrl}
              className="flex h-[50px] w-[320px] max-w-full items-center justify-center rounded-[15px] border text-[17px] text-white transition-opacity hover:opacity-90"
              style={{
                backgroundColor: CARD_DARK,
                borderColor: 'rgba(0,255,47,0.4)',
                borderWidth: 1,
              }}
            >
              График выполнения упражнений
            </Link>
          </motion.div>

          {/* 13. Мотивационная фраза */}
          <motion.div
            variants={item}
            className="mt-[57px] w-[400px] max-w-full"
          >
            <p className="text-[19px] leading-snug text-white min-h-[157px]">
              «Это не просто тренировка – это челлендж. Ты узнаешь свой реальный уровень и сможешь сравнивать результаты с собой через несколько месяцев»
            </p>
          </motion.div>

          {/* Навигация */}
          <motion.div
            variants={item}
            className="mt-[83px] mb-[83px] flex w-[280px] max-w-full items-center justify-center gap-6"
          >
            <Link
              to={backUrl}
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
              style={{
                borderColor: 'rgb(235,235,240)',
                backgroundColor: 'rgb(227,227,227)',
                color: 'rgb(30,30,30)',
              }}
              aria-label="Назад к уроку уровня 3"
            >
              <ChevronLeftIcon />
            </Link>
            <Link
              to="/"
              className="flex h-10 items-center justify-center rounded-[8px] border px-4 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'rgb(227,227,227)',
                borderColor: 'rgb(118,118,118)',
                color: 'rgb(30,30,30)',
              }}
            >
              <span className="text-[16px]">Главная</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
