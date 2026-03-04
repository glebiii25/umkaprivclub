// Временно отключено (вернуть при включении проверки доступа):
// import { supabase } from '../lib/supabase';
// const ALLOWED_TABLE = 'allowed_users';
// const TELEGRAM_ID_COLUMN = 'telegram_user_id';

/**
 * Проверяет, есть ли пользователь Telegram в списке допущенных (таблица allowed_users).
 * Таблица в Supabase: колонка telegram_user_id (bigint или text).
 */
export async function checkAccess(_telegramUserId: number): Promise<boolean> {
  return true; // TODO: временно открытый доступ
  // if (!supabase) return false;
  // try {
  //   const { data, error } = await supabase
  //     .from(ALLOWED_TABLE)
  //     .select('id')
  //     .eq(TELEGRAM_ID_COLUMN, String(_telegramUserId))
  //     .limit(1)
  //     .maybeSingle();
  //   if (error) return false;
  //   return data != null;
  // } catch {
  //   return false;
  // }
}
