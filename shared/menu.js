/**
 * 메뉴 목록 — 운영 시 이 배열만 수정하면 됩니다.
 * addonOnly: true → 추가 주문만 가능 (첫 주문에는 세트·자릿세 필요).
 * friendService: true → 지인서비스(가격 없음, 매출 0원).
 * kitchenParts: 세트 주문 시 주방 큐에 펼쳐 넣을 구성 메뉴명.
 */
export const COVER_MENU_ID = 1;

/** @type {number[]} */
export const SET_MENU_IDS = [2, 3, 4, 5];

export function isSetMenuId(menuId) {
  return SET_MENU_IDS.includes(Number(menuId));
}

/** 인원별 필수 세트 주문 수 (연장·안내용) */
export function requiredSetCount(partySize) {
  const n = Math.max(0, Math.floor(Number(partySize) || 0));
  if (n <= 0) return 0;
  if (n <= 2) return 1;
  if (n <= 4) return 2;
  if (n <= 6) return 3;
  return 4;
}

/** @param {{ menuId: number, qty: number }[]} items */
export function countSetQty(items) {
  return items.reduce((s, it) => s + (isSetMenuId(it.menuId) ? it.qty : 0), 0);
}

export const MENU_LIST = [
  { id: COVER_MENU_ID, name: "자릿세", price: 2900, category: "자릿세" },
  {
    id: 2,
    name: "A세트",
    price: 16900,
    category: "세트",
    description: "제육볶음 + 주먹밥",
    kitchenParts: ["제육볶음", "주먹밥"],
  },
  {
    id: 3,
    name: "B세트",
    price: 16900,
    category: "세트",
    description: "소세지불닭 + 콘치즈",
    kitchenParts: ["소세지불닭", "콘치즈"],
  },
  {
    id: 4,
    name: "C세트",
    price: 16900,
    category: "세트",
    description: "두부김치 + 계란찜",
    kitchenParts: ["두부김치", "계란찜"],
  },
  {
    id: 5,
    name: "D세트",
    price: 12900,
    category: "세트",
    description: "콘치즈 + 나쵸",
    kitchenParts: ["콘치즈", "나쵸"],
  },
  { id: 7, name: "제육볶음", price: 12900, category: "메인", addonOnly: true },
  { id: 8, name: "두부김치", price: 12900, category: "메인", addonOnly: true },
  { id: 9, name: "소세지불닭", price: 12900, category: "메인", addonOnly: true },
  { id: 10, name: "주먹밥", price: 6900, category: "사이드", addonOnly: true },
  { id: 11, name: "나쵸", price: 6900, category: "사이드", addonOnly: true },
  { id: 12, name: "계란찜", price: 6900, category: "사이드", addonOnly: true },
  { id: 13, name: "콘치즈", price: 6900, category: "사이드", addonOnly: true },
  {
    id: 14,
    name: "오지치즈프라이",
    price: 0,
    category: "지인서비스",
    friendService: true,
  },
];

/**
 * 주방 큐용: 세트는 구성 메뉴 각각 한 줄, 그 외 메뉴는 그대로 한 줄.
 * @param {{ menuId: number, name: string, price: number, qty: number }[]} items
 * @returns {{ menuId: number, name: string, price: number, qty: number }[]}
 */
export function expandKitchenLines(items) {
  const out = [];
  for (const it of items) {
    const m = MENU_LIST.find((x) => x.id === it.menuId);
    const parts = m?.kitchenParts;
    if (Array.isArray(parts) && parts.length > 0) {
      for (const partName of parts) {
        out.push({
          menuId: it.menuId,
          name: String(partName),
          price: 0,
          qty: it.qty,
        });
      }
    } else {
      out.push({ menuId: it.menuId, name: it.name, price: it.price, qty: it.qty });
    }
  }
  return out;
}
