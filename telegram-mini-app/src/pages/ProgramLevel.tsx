import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FavoriteButton } from '../components/FavoriteButton';
import { BackButton } from '../components/BackButton';
import { getMediaUrl, getMediaFallbackUrl, getMediaBaseUrl } from '../utils/getMediaUrl';

const BG_DARK = 'rgb(2,2,2)';
const GREEN = 'rgb(0,255,47)';
const PURPLE = 'rgba(234,0,255,1)';
const BORDER_WHITE = 'rgba(255,255,255,0.4)';
const CARD_DARK = 'rgb(11,11,11)';
const QUOTE_CARD_BG = 'rgb(183,226,25)';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

function ChevronLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/** Контент только для FHT Men Level 1 */
const FHT_MEN_1 = {
  title: 'Functional Hybrid Training For Men',
  focus: 'Фокус: техника и контроль',
  goal: 'Цель: выстроить фундамент силы, стабильности и осознанности в движении',
  format: 'Формат: 6 недель/3 тренировки в неделю',
  equipment: 'Оборудование: перекладина, жгуты, свободные веса',
  hint: '*НАЖАВ НА УПРАЖНЕНИЕ, МОЖНО БУДЕТ УВИДЕТЬ ТЕХНИКУ ЕГО ИСПОЛНЕНИЯ',
  loadTitle: 'Принцип нагрузки:',
  loadParagraphs: [
    'Все упражнения выполняются с ощутимым, но контролируемым усилием — примерно 6–8 из 10 по ощущениям (RPE).',
    'Это значит, что ты чувствуешь работу, но сохраняешь технику и можешь сделать ещё 2–3 повторения, если понадобится.',
    'Такой подход помогает прогрессировать без переутомления и травм.',
    'С каждым блоком нагрузка растёт постепенно — от техники к силе, от силы к контролю.',
  ],
  week12: {
    title: 'Неделя 1-2 Адаптация и Техника',
    goal: 'Цель: включить базовые двигательные паттерны, научить тело работать с контролем.',
    principle: 'Принцип: 2-3 подхода × 10–15 повторений, фокус на технику и дыхание.',
  },
  week34: {
    title: 'Неделя 3-4 Формирование силы',
    goal: 'Цель: увеличить нагрузку, укрепить базовые группы мышц.',
    principle: 'Принцип: 3-4 подхода × 8-12 повторений.',
  },
  week56: {
    title: 'Неделя 5-6 Контроль и устойчивость',
    goal: 'Цель: объединить движения в связки, развить координацию и выносливость',
    principle: 'Принцип: силовые 3-4 подхода × 8-10 повторений.',
  },
  miniTestTitle: 'Мини-тест для перехода к Уровню 2',
  important: {
    title: 'Важно!!',
    lines: [
      'Этот блок не про изнеможение, а про развитие.',
      'Двигайся в своём темпе, восстанавливайся, и прогресс не заставит себя ждать.',
      'Главное — контроль и стабильность, а не максимальные цифры.',
    ],
  },
  motivation: [
    'Если ты пока не готов перейти к уровню 2',
    'Это абсолютно нормально.',
    'Каждый человек прогрессирует в своём ритме — важна не скорость, а качество движений.',
  ],
  pathTitle: 'Umkafitclub — не гонка, а путь.',
  pathParagraphs: [
    'Если ты чувствуешь, что пока не достиг целей мини-теста — останься на этом уровне ещё на один цикл (6 недель).',
    'Повтори УРОВЕНЬ 1, просто добавь немного интенсивности: • выполняй упражнения с чуть большей нагрузкой (rpe 7–8 вместо 6–7) • уменьшай время отдыха между подходами на 15–30 секунд • используй более сложные вариации движений (например, вместо отжиманий от колен — полные)',
    'Так ты постепенно укрепишь фундамент и плавно перейдёшь к следующему УРОВНЮ "СИЛА" когда тело действительно будет готово к новой нагрузке.',
  ],
  quote: 'ПОМНИ: СТАБИЛЬНОСТЬ И КОНТРОЛЬ ВАЖНЕЕ, ЧЕМ БЫСТРЫЙ ПЕРЕХОД. ТВОЯ ЦЕЛЬ ДВИЖЕНИЕ ВПЕРЁД, А НЕ ГОНКА',
};

/** Контент для FHT Men Level 2 (FHD Men 2) */
const FHT_MEN_2 = {
  title: 'Functional Hybrid Training For Men',
  focus: 'Фокус: развитие силы и формы',
  goal: 'Цель: укрепить тело, повысить плотность и мощность движений',
  format: 'Формат: 6 недель/3 тренировки в неделю',
  equipment: 'Оборудование: штанга, гантели, гири, турник, брусья, резина, плиобокс',
  hint: '*НАЖАВ НА УПРАЖНЕНИЕ, МОЖНО БУДЕТ УВИДЕТЬ ТЕХНИКУ ЕГО ИСПОЛНЕНИЯ',
  loadTitle: 'Принцип нагрузки:',
  loadParagraphs: [
    'Все упражнения выполняются с ощутимым, но контролируемым усилием — примерно 7–8 из 10 по ощущениям (RPE).',
    'Это значит: ты работаешь на грани, но сохраняешь технику. Оставляй запас в 2–3 повторения — именно там растёт сила.',
    'Нагрузка увеличивается поэтапно: от техники → к силе → к контролю.',
  ],
  week12: {
    title: 'Неделя 1-2 Введение в силовую работу',
    goal: 'Цель: техника со свободными весами, освоение базовых паттернов с нагрузкой.',
    principle: 'Принцип: 3-4 подхода × 8–12 повторений, фокус на технику и дыхание.',
  },
  week34: {
    title: 'Неделя 3-4 Развитие силы и новых движений',
    goal: 'Цель: увеличение рабочего веса, стабилизация и контроль под нагрузкой.',
    principle: '',
  },
  week56: {
    title: 'Неделя 5-6 Пиковая сила',
    goal: 'Цель: интеграция силы и скорости, контроль движения под нагрузкой.',
    principle: '',
  },
  miniTestTitle: 'Мини-тест для перехода к уровню 3',
  important: {
    title: 'Важно!!',
    lines: [
      'ты перешёл в новый этап — сила приходит с контролем.',
      'следи за техникой, дыханием и отдыхом между подходами (2–4 минуты).',
      'Не спеши: качество движения всегда важнее скорости. С каждым циклом ты приближаешься к атлетизму уровня 3 "движение"',
    ],
  },
  motivation: [
    'Если ты пока не готов перейти к уровню 3',
    'Не торопись — это часть процесса. На этом этапе мы учимся не просто быть сильными, а управлять силой.',
    'Если тест уровня 2 сила, пока не пройден полностью — останься в этом блоке ещё на 4–6 недель, чтобы укрепить базу.',
  ],
  pathTitle: 'Если пока не готов к уровню 3',
  pathParagraphs: [
    'Повтори уровень 2 сила, скорректировав следующий цикл: увеличить нагрузку (RPE 8–9, но без отказа);',
    'добавить 1–2 повторения в базовых упражнениях (присед, подтягивания, отжимания на брусьях); заменить одно упражнение на более продвинутую вариацию (например, подтягивания со жгутом плавно менять на классическое).',
    'Это не откат, а углубление. Сила, выработанная под контролем, — это твоя гарантия прогресса на следующем Уровне 3.',
  ],
  quote: 'ПОМНИ: СИЛА БЕЗ КОНТРОЛЯ ЛОМАЕТ. А СИЛА С ОСОЗНАННОСТЬЮ — СОЗДАЁТ ТВОЙ АТЛЕТИЗМ',
};

/** Контент для FHT Men Level 3 (FHD Men 3 — движение) */
const FHT_MEN_3 = {
  title: 'Functional Hybrid Training For Men',
  focus: 'Фокус: атлетизм, мощь, контроль тела',
  goal: 'Цель: объединить силу, координацию и мобильность.',
  format: 'Формат: 6 недель/3 тренировки в неделю',
  equipment: 'Оборудование: турник, брусья, гири, плиобоксы, собственный вес',
  hint: '*НАЖАВ НА УПРАЖНЕНИЕ, МОЖНО БУДЕТ УВИДЕТЬ ТЕХНИКУ ЕГО ИСПОЛНЕНИЯ',
  loadTitle: 'Принцип нагрузки:',
  loadParagraphs: [
    'Работаем на уровне 7–8 из 10 по ощущениям (RPE).',
    'Здесь важно не только усилие, но и контроль — движение должно быть точным и плавным.',
    'Добавляем элементы скорости, баланса и координации и более сложные элементы.',
  ],
  week12: {
    title: 'Неделя 1-2 Контроль и техника в движении',
    goal: 'Цель: переход от статичных движений к динамическим с сохранением точности.',
    principle: '',
  },
  week34: {
    title: 'Неделя 3-4 Сила, координация и взрыв',
    goal: 'Цель: развиваем взрывную силу и реакцию, сохраняем технику под динамикой.',
    principle: '',
  },
  week56: {
    title: 'Неделя 5-6 Гибридный атлетизм',
    goal: 'Цель: гибридное развитие.',
    principle: '',
  },
  miniTestTitle: 'Мини-тест для завершения курса',
  important: {
    title: 'Важно!!',
    lines: [
      'Ты на финальном этапе системы.',
      'Этот блок — про свободу движения, уверенность и контроль. Сила и мобильность работают вместе. С каждым раундом ты становишься ближе к естественному атлетизму тела.',
      'Не гонись за скоростью — стремись к плавности и лёгкости.',
    ],
  },
  motivation: [
    'Если ты закончил уровень 3 "движение", но хочешь продолжать:',
    'Поздравляем — ты прошёл путь от техники к силе и дальше к свободе движения!!! Но на этом развитие не заканчивается. Теперь твоя цель — сохранять форму, углублять контроль и открывать новые движения.',
    'Чтобы продолжить прогресс, повтори блоки: движение в динамичном режиме (уменьши отдых, добавь темп), увеличь рабочие веса, усложни упражнения (подтягивания с весом, стойка без стены, прыжки на высоту 70+ см), объединяй движения в собственные flow-комплексы (5–6 упражнений подряд, без пауз), добавь 1 день в неделю под мобильность и дыхание.',
  ],
  pathTitle: 'Движение 2.0',
  pathParagraphs: [
    'Ты можешь назвать этот этап: "движение 2.0" — это поддерживающий цикл.',
  ],
  quote: 'ТЕПЕРЬ ТЫ НЕ ПРОСТО ТРЕНИРУЕШЬСЯ, А ЖИВЁШЬ В ТЕЛЕ, КОТОРОЕ УМЕЕТ ВСЁ, ЧЕМУ ТЫ ЕГО НАУЧИЛ',
};

/** Контент для FHT Women Level 1 (FHD Girl 1) */
const FHT_WOMEN_1 = {
  accentColor: PURPLE,
  quoteCardBg: PURPLE,
  quoteCardColor: 'rgb(255,255,255)',
  title: 'Functional Hybrid Training for Women',
  focus: 'Фокус: техника, контроль и развитие атлетического тела',
  goal: 'Цель: выстроить сильное, функциональное и гармоничное тело, развить устойчивость, координацию и качество движений',
  format: 'Формат: 6 недель/3 тренировки в неделю',
  equipment: 'Оборудование: гантели, гири, штанга, кроссовер, тренажёры для сгибания / разгибания голени (сидя, лёжа), плиобокс, коврик',
  hint: '*НАЖАВ НА УПРАЖНЕНИЕ, МОЖНО БУДЕТ УВИДЕТЬ ТЕХНИКУ ЕГО ИСПОЛНЕНИЯ',
  loadTitle: 'Принцип нагрузки:',
  loadParagraphs: [
    'Работа ведётся в диапазоне 6–8 из 10 по ощущениям (rpe). Движения выполняются с точностью, контролем и стабильностью. Главная цель - не количество повторений, а качество.',
  ],
  week12: {
    title: 'Неделя 1-2 Основа техники и контроль движения',
    goal: 'Цель: освоить ключевые паттерны движений, укрепить суставы и корпус. Развить координацию и устойчивость.',
    principle: 'Принцип: 2-3 подхода × 10–15 повторений, спокойное, контролируемое выполнение.',
  },
  week34: {
    title: 'Неделя 3-4 Развитие силы и структуры тела',
    goal: 'Цель: увеличить силовую устойчивость, развить структуру тела и контроль под нагрузкой.',
    principle: 'Принцип: 3-4 подхода × 8-12 повторений.',
  },
  week56: {
    title: 'Неделя 5-6 Контроль динамика и устойчивость',
    goal: 'Цель: развить устойчивость, контроль и координацию в сложных движениях.',
    principle: 'Принцип: 3-4 подхода × 8-10 повторений.',
  },
  miniTestTitle: 'Мини-тест для перехода к уровню 2',
  important: {
    title: 'Важно!!',
    lines: [
      'ты развиваешь тело атлета — сильное, устойчивое и эстетичное. задача не "сжечь", а построить. двигайся с осознанностью, ощущай ритм и механику движений. красота тела — это результат уверенного, точного движения.',
    ],
  },
  motivation: [
    'Если пока не можешь перейти к уровню 2 "сила" это абсолютно нормально.',
    'Каждый прогрессирует в своём ритме — важно не скорость, а стабильность.',
  ],
  pathTitle: 'Umkafitclub — не гонка а путь',
  pathParagraphs: [
    'Если ты чувствуешь, что тело ещё не готово к следующей ступени, продолжай тренироваться на текущем уровне, но в новом качестве.',
    'Попробуй применить следующий подход:',
    'повтори цикл, но работай чуть увереннее — rpe 7-8 вместо 6-7.',
    'увеличь точность движений — контролируй дыхание, амплитуду, баланс.',
    'добавь 1-2 новых вариаций упражнений или небольшое утяжеление.',
    'сократи паузы между подходами, если чувствуешь себя сильнее.',
  ],
  quote: 'ТЫ НЕ "ЗАСТРЯЛА" — ТЫ ЗАКРЕПЛЯЕШЬ ФУНДАМЕНТ, И ИМЕННО ЭТО ДАЁТ НАСТОЯЩИЙ ПРОГРЕСС',
};

/** Контент для FHT Women Level 2 (FHD Girl 2) */
const FHT_WOMEN_2 = {
  accentColor: PURPLE,
  quoteCardBg: PURPLE,
  quoteCardColor: 'rgb(255,255,255)',
  title: 'Functional Hybrid Training for Women',
  focus: 'Фокус: сила, форма и динамика',
  goal: 'Цель: укрепить тело, развить мощь и устойчивость, подготовить к блоку "движение"',
  format: 'Формат: 6 недель/3 тренировки в неделю',
  equipment: 'Оборудование: гантели, гири, штанга, кроссовер, тренажёры, плиобокс, коврик',
  hint: '*НАЖАВ НА УПРАЖНЕНИЕ, МОЖНО БУДЕТ УВИДЕТЬ ТЕХНИКУ ЕГО ИСПОЛНЕНИЯ',
  loadTitle: 'Принцип нагрузки:',
  loadParagraphs: [
    'работа в диапазоне rpe 7–8, умеренно тяжело, с акцентом на точность. добавляем элементы динамики — движение остаётся подконтрольным, но "живым".',
  ],
  week12: {
    title: 'Неделя 1-2 Введение в силовую работу',
    goal: '',
    principle: '',
  },
  week34: {
    title: 'Неделя 3-4 Сила и динамическая устойчивость',
    goal: '',
    principle: '',
  },
  week56: {
    title: 'Неделя 5-6 Контроль силы и взрывная динамика',
    goal: '',
    principle: '',
  },
  miniTestTitle: 'Мини-тест для перехода к уровню 3',
  important: {
    title: 'Важно!!',
    lines: [
      'ты развиваешь тело атлета — сильное, устойчивое и эстетичное. задача не "сжечь", а построить. двигайся с осознанностью, ощущай ритм и механику движений. красота тела — это результат уверенного, точного движения.',
    ],
  },
  motivation: [
    'Если пока не можешь перейти к уровню 3 "движение" это абсолютно нормально. Этап "сила" — это время, когда тело учится управлять весом и сохранять технику под нагрузкой.',
    'Если чувствуешь, что не готова перейти дальше — отлично, значит, ты осознала, как важно движение, а не просто килограммы.',
    'Повтори цикл, но добавь чуть больше акцента: работай ближе к rpe 8, но без потери формы. увеличь амплитуду, точность, контроль темпа. Добавь немного повторений и/или усложни движение если чувствуешь уверенность - сократи время отдыха между подходами на 10-15 секунд.',
  ],
  pathTitle: '',
  pathParagraphs: [] as string[],
  quote: 'ТЫ НЕ СТОИШЬ НА МЕСТЕ - ТЫ ЗАКРЕПЛЯЕШЬ СИЛУ, КОТОРАЯ СТАНЕТ ТВОЕЙ СВОБОДОЙ НА СЛЕДУЮЩЕМ УРОВНЕ',
};

/** Контент для FHT Women Level 3 (FHD Girl 3) */
const FHT_WOMEN_3 = {
  accentColor: PURPLE,
  quoteCardBg: PURPLE,
  quoteCardColor: 'rgb(255,255,255)',
  title: 'Functional Hybrid Training for Women',
  focus: 'Фокус: координация, мобильность, сила и мощь',
  goal: 'Цель: объединить силу, баланс, гибкость и эстетику движения в одну систему',
  format: 'Формат: 6 недель/3 тренировки в неделю',
  equipment: 'Оборудование: гантели, гири, плиобокс, коврик, кроссовер, штанга, тренажеры',
  hint: '*НАЖАВ НА УПРАЖНЕНИЕ, МОЖНО БУДЕТ УВИДЕТЬ ТЕХНИКУ ЕГО ИСПОЛНЕНИЯ',
  loadTitle: 'Принцип нагрузки:',
  loadParagraphs: [
    'работа ведётся в диапазоне 7–8 из 10 по ощущениям (rpe) чувствуем движение, но не теряем контроль. Главная идея — сила должная быть динамичной, а движение — точным. Каждое упражнение — это навык, который делает тело свободным. ТЫ БОЛЬШЕ НЕ "ТРЕНИРУЕШЬСЯ", ТЫ ДВИГАЕШЬСЯ. КАЖДОЕ УПРАЖНЕНИЕ — ЭТО НАВЫК, КОТОРЫЙ ДЕЛАЕТ ТЕЛО СВОБОДНЫМ',
  ],
  week12: {
    title: 'Неделя 1-2 Контроль и координация',
    goal: 'Цель: адаптировать тело к новым формам движения, улучшить баланс и контроль центра. Соединяем силу и плавность, развиваем устойчивость.',
    principle: '',
  },
  week34: {
    title: 'Неделя 3-4 Динамика и атлетизм',
    goal: 'Цель: развить взрывную силу, лёгкость и динамику в движениях без потери техники. Добавляем мощность, скорость реакции и контроль.',
    principle: '',
  },
  week56: {
    title: 'Неделя 5-6 FLOW и свобода движения',
    goal: 'Цель: объединить силу, гибкость ритм, развить уверенность в каждом движении. Соединяем всё тело в одно целое.',
    principle: '',
  },
  miniTestTitle: 'Мини-тест для завершения программы',
  important: {
    title: 'Важно!!',
    lines: [
      'Ты завершила путь от техники к силе и теперь двигаешься как атлет. Твоё тело умеет быть сильным, гибким и устойчивым одновременно. Не прекращай — играй с движением: добавляй темп, усложняй flow, исследуй новые связки.',
    ],
  },
  motivation: [
    'С этого момента тренировки umkafitclub становятся не задачей, а стилем жизни. Если пока не можешь перейти на следующий уровень. Это абсолютно нормально. Каждый прогрессирует в своём ритме — важно не скорость, а стабильность.',
  ],
  pathTitle: 'Umkafitclub — не гонка, а путь.',
  pathParagraphs: [
    'Если ты чувствуешь, что тело ещё не готово к следующей ступени, продолжай тренироваться на текущем уровне, но в новом качестве.',
    'Попробуй применить следующий подход: • повтори цикл, но работай чуть увереннее — rpe 7-8 вместо 6-7. • увеличь точность движений — контролируй дыхание, амплитуду, баланс. • добавь 1-2 новых вариаций упражнений или небольшое утяжеление. • сократи паузы между подходами, если чувствуешь себя сильнее.',
  ],
  quote: 'ТЫ НЕ "ЗАСТРЯЛА" — ТЫ ЗАКРЕПЛЯЕШЬ ФУНДАМЕНТ, И ИМЕННО ЭТО ДАЁТ НАСТОЯЩИЙ ПРОГРЕСС',
};

export default function ProgramLevel() {
  const { moduleId, programId, levelId } = useParams<{ moduleId: string; programId: string; levelId: string }>();
  const location = useLocation();
  const backUrl = moduleId ? `/module/${moduleId}` : '/';

  const content =
    programId === 'fht-men' && levelId === '1'
      ? FHT_MEN_1
      : programId === 'fht-men' && levelId === '2'
        ? FHT_MEN_2
        : programId === 'fht-men' && levelId === '3'
          ? FHT_MEN_3
          : programId === 'fht-women' && levelId === '1'
            ? FHT_WOMEN_1
            : programId === 'fht-women' && levelId === '2'
              ? FHT_WOMEN_2
              : programId === 'fht-women' && levelId === '3'
                ? FHT_WOMEN_3
                : null;

  const accent = (content as { accentColor?: string }).accentColor ?? GREEN;

  if (!content) {
    return (
      <div className="min-h-screen safe-area-padding flex flex-col items-center justify-center p-4" style={{ backgroundColor: BG_DARK, color: '#fff' }}>
        <p className="text-lg">Программа не найдена</p>
        <Link to={backUrl} className="mt-4 text-sm underline opacity-90">К модулю</Link>
        <Link to="/" className="mt-2 text-sm underline opacity-90">На главную</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-padding pb-12" style={{ backgroundColor: BG_DARK, color: 'rgb(255,255,255)' }}>
      <div className="mx-auto max-w-[440px] px-10">
        <div className="pt-[20px]">
          <BackButton />
        </div>
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center pt-10">
          {/* Заголовок в рамке */}
          <motion.div
            variants={item}
            className="flex h-[70px] w-[350px] max-w-full self-center items-center justify-center rounded-[12px] border px-4"
            style={{ borderColor: BORDER_WHITE }}
          >
            <span className="text-center text-[19px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.title}
            </span>
          </motion.div>

          {/* Избранное */}
          {moduleId && programId && levelId && (
            <motion.div variants={item} className="mt-6 flex w-full max-w-[360px] justify-end self-center">
              <FavoriteButton
                item={{
                  id: `/module/${moduleId}/program/${programId}/level/${levelId}`,
                  title: `${content.title} — Уровень ${levelId}`,
                  href: `/module/${moduleId}/program/${programId}/level/${levelId}`,
                }}
              />
            </motion.div>
          )}

          {/* Фото */}
          <motion.div
            variants={item}
            className="mt-[37px] flex h-[130px] w-[350px] max-w-full self-center overflow-hidden rounded"
          >
            <img
              src={getMediaUrl(
                programId === 'fht-men' && levelId === '2'
                  ? '/images/fht-men-sila.jpg.jpg'
                  : programId === 'fht-men' && levelId === '3'
                    ? '/images/fht-men-dvizhenie.jpg'
                    : programId === 'fht-women' && levelId === '2'
                      ? '/images/fht-women-sila.jpg'
                      : programId === 'fht-women' && levelId === '3'
                        ? '/images/fht-women-dvizhenie.jpg'
                        : programId === 'fht-women'
                          ? '/images/fht-women-osnova.jpg'
                          : '/images/fht-men-osnova.jpg',
                { basePrefix: getMediaBaseUrl(location.pathname) }
              )}
              alt=""
              className="block h-full w-full object-contain"
              onError={(e) => {
                const path = programId === 'fht-men' && levelId === '2' ? '/images/fht-men-sila.jpg.jpg' : programId === 'fht-men' && levelId === '3' ? '/images/fht-men-dvizhenie.jpg' : programId === 'fht-women' && levelId === '2' ? '/images/fht-women-sila.jpg' : programId === 'fht-women' && levelId === '3' ? '/images/fht-women-dvizhenie.jpg' : programId === 'fht-women' ? '/images/fht-women-osnova.jpg' : '/images/fht-men-osnova.jpg';
                const fallback = getMediaFallbackUrl(path, { basePrefix: getMediaBaseUrl(location.pathname) });
                if (fallback.startsWith('http')) e.currentTarget.src = fallback;
              }}
            />
          </motion.div>

          {/* Фокус */}
          <motion.div variants={item} className="mt-[64px] w-[352px] max-w-full">
            <p className="text-[19px] leading-tight text-white">{content.focus}</p>
          </motion.div>

          {/* Цель */}
          <motion.div variants={item} className="mt-[20px] w-[352px] max-w-full">
            <p className="text-[19px] leading-tight text-white">{content.goal}</p>
          </motion.div>

          {/* Формат */}
          <motion.div variants={item} className="mt-[20px] w-[352px] max-w-full">
            <p className="text-[19px] leading-tight text-white">{content.format}</p>
          </motion.div>

          {/* Оборудование */}
          <motion.div variants={item} className="mt-[20px] w-[352px] max-w-full">
            <p className="text-[19px] leading-tight text-white">{content.equipment}</p>
          </motion.div>

          {/* Подсказка */}
          <motion.div variants={item} className="mt-[30px] w-[352px] max-w-full">
            <p className="text-[14px] leading-snug" style={{ color: accent }}>
              {content.hint}
            </p>
          </motion.div>

          {/* Принцип нагрузки */}
          <motion.div variants={item} className="mt-[50px] w-[352px] max-w-full space-y-3">
            <h2 className="mb-4 text-[19px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.loadTitle}
            </h2>
            {content.loadParagraphs.map((p, i) => (
              <p key={i} className="text-[19px] leading-tight text-white">{p}</p>
            ))}
          </motion.div>

          {/* Неделя 1-2 */}
          <motion.div variants={item} className="mt-[52px] flex w-[352px] max-w-full flex-col items-center">
            <h2 className="mb-4 w-full text-left text-[19px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.week12.title}
            </h2>
            <div className="w-full space-y-3">
              <p className="text-[19px] leading-tight text-white">{content.week12.goal}</p>
              {content.week12.principle ? (
                <p className="text-[19px] leading-tight text-white">{content.week12.principle}</p>
              ) : null}
            </div>
            <Link
              to={moduleId && programId && levelId ? `/module/${moduleId}/program/${programId}/level/${levelId}/schedule` : '/'}
              className="mt-[23px] flex h-[50px] w-[200px] items-center justify-center rounded-[10px] border text-[16px] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CARD_DARK, borderColor: BORDER_WHITE }}
            >
              перейти к выполнению
            </Link>
          </motion.div>

          {/* Неделя 3-4 */}
          <motion.div variants={item} className="mt-[76px] flex w-[352px] max-w-full flex-col items-center">
            <h2 className="mb-4 w-full text-left text-[19px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.week34.title}
            </h2>
            <div className="w-full space-y-3">
              <p className="text-[19px] leading-tight text-white">{content.week34.goal}</p>
              {content.week34.principle ? (
                <p className="text-[19px] leading-tight text-white">{content.week34.principle}</p>
              ) : null}
            </div>
            <Link
              to={moduleId && programId && levelId ? `/module/${moduleId}/program/${programId}/level/${levelId}/schedule?week=3-4` : '/'}
              className="mt-6 flex h-[50px] w-[200px] items-center justify-center rounded-[10px] border text-[16px] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CARD_DARK, borderColor: BORDER_WHITE }}
            >
              перейти к выполнению
            </Link>
          </motion.div>

          {/* Неделя 5-6 */}
          <motion.div variants={item} className="mt-[76px] flex w-[352px] max-w-full flex-col items-center">
            <h2 className="mb-4 w-full text-left text-[19px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.week56.title}
            </h2>
            <div className="w-full space-y-3">
              <p className="text-[19px] leading-tight text-white">{content.week56.goal}</p>
              {content.week56.principle ? (
                <p className="text-[19px] leading-tight text-white">{content.week56.principle}</p>
              ) : null}
            </div>
            <Link
              to={moduleId && programId && levelId ? `/module/${moduleId}/program/${programId}/level/${levelId}/schedule?week=5-6` : '/'}
              className="mt-6 flex h-[50px] w-[200px] items-center justify-center rounded-[10px] border text-[16px] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CARD_DARK, borderColor: BORDER_WHITE }}
            >
              перейти к выполнению
            </Link>
          </motion.div>

          {/* Мини-тест */}
          <motion.div variants={item} className="mt-[65px] flex w-[352px] max-w-full flex-col items-center">
            <h2 className="mb-6 w-full text-left text-[19px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.miniTestTitle}
            </h2>
            <Link
              to={moduleId && programId && levelId ? `/module/${moduleId}/program/${programId}/level/${levelId}/mini-test` : '/'}
              className="mt-0 mb-0 flex h-[50px] w-[200px] items-center justify-center rounded-[10px] border text-[16px] text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: CARD_DARK, borderColor: BORDER_WHITE }}
            >
              перейти к выполнению
            </Link>
          </motion.div>

          {/* Важно — тёмная карточка */}
          <motion.div
            variants={item}
            className="mt-[71px] flex w-[390px] max-w-full flex-col items-center self-center rounded-[25px] px-5 py-6"
            style={{ backgroundColor: 'rgb(17,17,17)' }}
          >
            <h2 className="mb-4 w-full text-center text-[22px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
              {content.important.title}
            </h2>
            <div className="w-full space-y-3">
              {content.important.lines.map((line, i) => (
                <p key={i} className="text-[19px] leading-tight text-white">{line}</p>
              ))}
            </div>
          </motion.div>

          {/* Мотивация */}
          <motion.div variants={item} className="mt-[70px] w-[352px] max-w-full space-y-3">
            {content.motivation.map((m, i) => (
              <p key={i} className="text-[19px] leading-tight text-white">{m}</p>
            ))}
          </motion.div>

          {/* Umkafitclub — не гонка / path */}
          {(content.pathTitle || content.pathParagraphs.length > 0) && (
            <motion.div variants={item} className="mt-[25px] w-[352px] max-w-full text-left">
              {content.pathTitle && (
                <h2 className="mb-4 mt-4 ml-0 mr-0 h-[40px] w-[351px] max-w-full py-[10px] text-center text-[18px] font-bold leading-tight" style={{ color: accent, fontFamily: '"SF Pro", -apple-system, sans-serif' }}>
                  {content.pathTitle}
                </h2>
              )}
              {content.pathParagraphs.map((p, i) => (
                <p key={i} className="mt-4 text-left text-[19px] leading-tight text-white">{p}</p>
              ))}
            </motion.div>
          )}

          {/* Цитата */}
          <motion.div
            variants={item}
            className="mt-[70px] flex w-[190px] max-w-full flex-col items-center self-center rounded-[8px] px-4 py-4 text-center"
            style={{
              backgroundColor: 'quoteCardBg' in content ? (content as { quoteCardBg?: string }).quoteCardBg : QUOTE_CARD_BG,
              color: 'quoteCardColor' in content ? (content as { quoteCardColor?: string }).quoteCardColor : 'rgb(0,0,0)',
            }}
          >
            <p className="text-[15px] font-bold leading-snug">
              {content.quote}
            </p>
          </motion.div>

          {/* Навигация */}
          <motion.div variants={item} className="mt-[73px] mb-[60px] flex w-[280px] max-w-full items-center justify-center gap-[24px] py-3">
            <Link
              to={backUrl}
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-opacity hover:opacity-90"
              style={{ borderColor: 'rgb(235,235,240)', backgroundColor: 'rgb(227,227,227)', color: 'rgb(30,30,30)' }}
              aria-label="Назад к модулю"
            >
              <ChevronLeftIcon />
            </Link>
            <Link
              to="/"
              className="flex h-10 items-center justify-center rounded-[8px] border px-4 transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'rgb(227,227,227)', borderColor: 'rgb(118,118,118)', color: 'rgb(30,30,30)' }}
            >
              <span className="text-[16px]">Главная</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
