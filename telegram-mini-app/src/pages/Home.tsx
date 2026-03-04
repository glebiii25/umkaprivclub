import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ModuleCard } from '../components/ModuleCard';
import { getMediaUrl, getMediaFallbackUrl, getMediaBaseUrl } from '../utils/getMediaUrl';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function Home() {
  const location = useLocation();
  const basePrefix = getMediaBaseUrl(location.pathname);
  return (
    <div
      className="min-h-screen safe-area-padding"
      style={{ backgroundColor: 'rgb(0,0,0)' }}
    >
      <div className="mx-auto max-w-[440px] pl-[57px] pr-[61px] pt-[79px] pb-10">
        {/* Плашка с названием — 322×100, cornerRadius 12, stroke white 40% */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center gap-0"
        >
          <div
            className="mb-4 flex w-full max-w-[360px] flex-col items-center justify-center self-center rounded-[12px] border border-white/40 px-5 py-3 text-center"
            style={{ minHeight: 56 }}
          >
            <span
              className="font-bold leading-tight"
              style={{
                fontSize: 29,
                color: '#00FF2F',
                lineHeight: 1.2,
              }}
            >
              Umka_Fit
            </span>
          </div>

          {/* Кнопки Профиль и Избранное */}
          <motion.div variants={item} className="mb-8 flex w-full max-w-[360px] gap-3 self-center">
            <Link
              to="/profile"
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-white/40 px-4 transition-opacity hover:opacity-90 active:scale-[0.99]"
              style={{ color: 'rgb(255,255,255)', height: 44 }}
            >
              <span className="font-bold" style={{ fontSize: 15, lineHeight: 1.2 }}>
                Профиль
              </span>
            </Link>
            <Link
              to="/favorites"
              className="flex flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-white/40 px-4 transition-opacity hover:opacity-90 active:scale-[0.99]"
              style={{ color: 'rgb(255,255,255)', height: 44 }}
            >
              <span className="font-bold" style={{ fontSize: 15, lineHeight: 1.2 }}>
                Избранное
              </span>
            </Link>
          </motion.div>

          {/* Уроки — 95×38 */}
          <motion.p
            variants={item}
            className="mb-2 w-full max-w-[360px] self-center text-center font-bold leading-tight"
            style={{
              fontSize: 28,
              height: 38,
              color: 'rgb(255,255,255)',
            }}
          >
            Уроки
          </motion.p>

          {/* Карточки модулей */}
          <motion.div variants={item} className="mb-8 w-full max-w-[360px] self-center">
            <ModuleCard
              title="Программы тренировок"
              subtitle="Калистеника"
              withImage
              imageSrc={getMediaUrl('/images/module-1-kalistenika.png', { basePrefix })}
              imageFallbackSrc={getMediaFallbackUrl('/images/module-1-kalistenika.png', { basePrefix })}
              imageSize={120}
              imageCornerRadius={22}
              href="/module/1"
              height={120}
              cornerRadius={20}
            />
          </motion.div>
          <motion.div variants={item} className="mb-8 w-full max-w-[360px] self-center">
            <ModuleCard
              title="Мобильность суставов и растяжка"
              titleFontSize={16}
              withImage
              imageSrc={getMediaUrl('/images/module-2-mobilnost.png', { basePrefix })}
              imageFallbackSrc={getMediaFallbackUrl('/images/module-2-mobilnost.png', { basePrefix })}
              imageSize={118}
              imageCornerRadius={19}
              href="/module/2"
              height={120}
              cornerRadius={20}
            />
          </motion.div>
          <motion.div variants={item} className="mb-8 w-full max-w-[360px] self-center">
            <ModuleCard
              title="Техника выполнения упражнений. Калистеника"
              href="/module/3"
              height={50}
              cornerRadius={15}
              titleOpacity={0.4}
            />
          </motion.div>
          <motion.div variants={item} className="w-full max-w-[360px] self-center">
            <ModuleCard
              title="Техника выполнения упражнений. Тренажерный зал"
              href="/module/4"
              height={60}
              cornerRadius={15}
              titleOpacity={0.4}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
