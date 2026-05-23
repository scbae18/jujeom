/** 운영 테이블 번호 범위 */
export const TABLE_NUM_MIN = 1;
export const TABLE_NUM_MAX = 33;

export const ALL_TABLE_NUMBERS = Array.from(
  { length: TABLE_NUM_MAX - TABLE_NUM_MIN + 1 },
  (_, i) => String(i + TABLE_NUM_MIN)
);

/**
 * @param {unknown} raw
 * @returns {{ ok: true, table: string } | { ok: false, error: string }}
 */
export function validateTableNumber(raw) {
  const digits = String(raw ?? "").trim().replace(/\D/g, "");
  if (!digits) return { ok: false, error: "테이블 번호를 입력하세요." };
  const n = Number(digits);
  if (!Number.isInteger(n) || n < TABLE_NUM_MIN || n > TABLE_NUM_MAX) {
    return { ok: false, error: `테이블 번호는 ${TABLE_NUM_MIN}~${TABLE_NUM_MAX}번만 가능합니다.` };
  }
  return { ok: true, table: String(n) };
}

/**
 * @param {unknown} raw
 */
export function isValidTableNumber(raw) {
  return validateTableNumber(raw).ok;
}
