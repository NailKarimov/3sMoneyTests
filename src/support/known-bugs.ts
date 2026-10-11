import { test } from '@playwright/test';

/**
 * Известные дефекты сайта (см. docs/findings/).
 * Тест, который ловит такой дефект, помечается как «ожидаемо падающий»:
 * пока баг есть — тест считается пройденным и CI зелёный, а в отчёте видна метка с номером бага.
 * Когда сайт исправят, тест неожиданно пройдёт и Playwright отметит его как упавший —
 * это сигнал убрать метку и закрыть баг.
 */
export const KNOWN_BUGS = {
  'BUG-001': 'Главная страница слишком тяжёлая: видео загружаются сразу',
  'BUG-002': 'Мобильное бургер-меню не является кнопкой',
  'BUG-003': 'Ссылка с неподставленным плейсхолдером [#DSR_FORM_URL#]',
  'BUG-004': 'Нарушения WCAG 2.2 AA: кнопки и поля без имён, низкий контраст',
  'BUG-005': 'Несколько <h1> на главной',
  'BUG-006': 'Ссылки target=_blank без rel=noopener',
  'BUG-007': 'Ссылки-заглушки href="#"',
  'BUG-009': 'Трекеры работают до согласия на cookie и после отказа',
  'BUG-010': 'Нет видимого индикатора фокуса у ссылок и кнопок (WCAG 2.4.7)',
} as const;

export type KnownBugId = keyof typeof KNOWN_BUGS;

/** Пометить текущий тест как ожидаемо падающий из-за известного бага. */
export function knownBug(id: KnownBugId, condition = true): void {
  if (!condition) return;
  const description = `${id}: ${KNOWN_BUGS[id]}`;
  test.info().annotations.push({ type: 'known-bug', description });
  test.fail(true, description);
}
