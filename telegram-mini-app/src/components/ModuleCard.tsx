import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export interface ModuleCardProps {
  title: string;
  /** Кастомный размер шрифта заголовка (по умолчанию 13 или 16) */
  titleFontSize?: number;
  titleBold?: boolean;
  titleOpacity?: number;
  subtitle?: string;
  withImage?: boolean;
  /** URL изображения (если задан — показывается вместо серого плейсхолдера) */
  imageSrc?: string;
  /** Fallback URL при ошибке загрузки imageSrc (например, локальный путь при 404 из Supabase) */
  imageFallbackSrc?: string;
  /** Image size: 120 (first card), 118 (second), 50 or 60 (compact with media) */
  imageSize?: 120 | 118 | 50 | 60;
  imageCornerRadius?: 22 | 19 | 12;
  href: string;
  /** Card height: 120 (large), 50 or 60 (compact) */
  height: 120 | 50 | 60;
  /** Card cornerRadius: 20 (large) or 15 (compact) */
  cornerRadius: 20 | 15;
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|mov)$/i.test(url);
}

export function ModuleCard({
  title,
  titleFontSize,
  titleBold = false,
  titleOpacity,
  subtitle,
  withImage = false,
  imageSrc,
  imageFallbackSrc,
  imageSize = 120,
  imageCornerRadius = 22,
  href,
  height,
  cornerRadius,
}: ModuleCardProps) {
  const imageOffset = imageSize === 118 ? 1 : 0;
  return (
    <motion.div
      whileHover={{ opacity: 0.9 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        to={href}
        className="block w-full cursor-pointer overflow-hidden transition-opacity hover:opacity-95"
        style={{
          height: `${height}px`,
          borderRadius: `${cornerRadius}px`,
          border: '1px solid rgba(255,255,255,0.4)',
        }}
      >
        <div className="flex h-full w-full items-stretch">
          {withImage && (
            <div
              className="shrink-0 overflow-hidden bg-gray-700"
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: `${imageCornerRadius}px`,
                margin: imageOffset,
              }}
              aria-hidden
            >
              {imageSrc ? (
                isVideoUrl(imageSrc) ? (
                  <video
                    src={imageSrc}
                    className="h-full w-full object-cover"
                    style={{ borderRadius: `${imageCornerRadius}px` }}
                    muted
                    loop
                    playsInline
                    autoPlay
                    aria-hidden
                    onError={imageFallbackSrc && imageFallbackSrc.startsWith('http') ? (e) => { e.currentTarget.src = imageFallbackSrc; } : undefined}
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ borderRadius: `${imageCornerRadius}px` }}
                    onError={imageFallbackSrc && imageFallbackSrc.startsWith('http') ? (e) => { e.currentTarget.src = imageFallbackSrc; } : undefined}
                  />
                )
              ) : null}
            </div>
          )}
          <div
            className="flex flex-1 flex-col justify-center"
            style={{
              paddingLeft: withImage ? 24 : 22,
              paddingRight: 20,
              color: 'rgb(255,255,255)',
            }}
          >
            <span
              className={`leading-tight ${titleBold ? 'font-bold' : 'font-normal'}`}
              style={{
                fontSize: titleFontSize ?? (height === 60 ? 13 : withImage && subtitle ? 16 : 13),
                lineHeight: 1.2,
                opacity: titleOpacity,
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              {title}
            </span>
            {subtitle != null && subtitle !== '' && (
              <span
                className="mt-0.5 block"
                style={{
                  fontSize: 17,
                  lineHeight: 1.2,
                  opacity: 0.4,
                  fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
