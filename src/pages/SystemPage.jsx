import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useAppSocket } from "../context/SocketContext.jsx";

const ALL_TABLES = Array.from({ length: 33 }, (_, i) => String(i + 1));
const MOBILE_MQ = "(max-width: 640px)";

function formatHM(ts) {
  return new Date(ts).toLocaleString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

function formatHMS(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}

function useMobileLayout() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return mobile;
}

export default function SystemPage() {
  const { socket, connected, state } = useAppSocket();
  const mobile = useMobileLayout();
  const [clock, setClock] = useState(0);
  const [confirmTable, setConfirmTable] = useState(null);
  const [historyTable, setHistoryTable] = useState(null);
  const [sheetTable, setSheetTable] = useState(null);
  const [viewMode, setViewMode] = useState(() =>
    typeof window !== "undefined" && window.matchMedia(MOBILE_MQ).matches ? "active" : "all"
  );
  const [jumpInput, setJumpInput] = useState("");
  const [jumpError, setJumpError] = useState("");
  const [highlightTable, setHighlightTable] = useState(null);
  const cardRefs = useRef(/** @type {Record<string, HTMLDivElement | null>} */ ({}));
  const pendingJump = useRef(null);

  const handleReset = useCallback((table) => {
    socket.emit("system:resetTable", table);
    setConfirmTable(null);
    setSheetTable(null);
  }, [socket]);

  const handleExtend = useCallback((table) => {
    socket.emit("system:extendTable", table);
  }, [socket]);

  useEffect(() => {
    const id = setInterval(() => setClock((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!mobile) setViewMode("all");
  }, [mobile]);

  const defaultLimit = state?.settings?.defaultLimitMinutes ?? 90;

  const tableData = useMemo(() => {
    const now = Date.now();
    return ALL_TABLES.map((table) => {
      const t = state?.tables?.[table];
      if (!t || t.timerStartedAt == null) return { table, active: false };
      const bonus = Math.max(0, Math.floor(Number(t.bonusLimitMinutes) || 0));
      const partySize = Math.max(0, Math.floor(Number(t.partySize) || 0));
      const totalAmount = Math.max(0, Math.floor(Number(t.totalAmount) || 0));
      const limitMin = defaultLimit + bonus;
      const elapsed = now - t.timerStartedAt;
      const limitMs = limitMin * 60 * 1000;
      const over = elapsed >= limitMs;
      const remaining = Math.max(0, limitMs - elapsed);
      return { table, active: true, remaining, over, limitMin, partySize, totalAmount };
    });
  }, [state?.tables, defaultLimit, clock]);

  const activeCount = tableData.filter((t) => t.active).length;

  const displayedTables = useMemo(() => {
    if (viewMode === "active") return tableData.filter((t) => t.active);
    return tableData;
  }, [tableData, viewMode]);

  const sheetRow = useMemo(
    () => (sheetTable ? tableData.find((t) => t.table === sheetTable) : null),
    [sheetTable, tableData]
  );

  const jumpToTable = useCallback(() => {
    const t = jumpInput.trim().replace(/\D/g, "");
    if (!t || !ALL_TABLES.includes(t)) {
      setJumpError("1~33번 테이블을 입력하세요.");
      return;
    }
    setJumpError("");
    setJumpInput("");
    const isActive = tableData.find((x) => x.table === t)?.active;
    if (viewMode === "active" && !isActive) setViewMode("all");
    pendingJump.current = t;
  }, [jumpInput, tableData, viewMode]);

  useEffect(() => {
    const t = pendingJump.current;
    if (!t) return;
    pendingJump.current = null;
    const raf = requestAnimationFrame(() => {
      const el = cardRefs.current[t];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightTable(t);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [displayedTables, viewMode]);

  useEffect(() => {
    if (!highlightTable) return;
    const id = window.setTimeout(() => setHighlightTable(null), 2200);
    return () => window.clearTimeout(id);
  }, [highlightTable]);

  const openSheet = useCallback(
    (table, active) => {
      if (mobile && active) setSheetTable(table);
    },
    [mobile]
  );

  const renderCard = (row) => {
    const { table, active, remaining, over, limitMin, partySize, totalAmount } = row;
    const tap = mobile && active;
    return (
      <div
        key={table}
        ref={(el) => {
          cardRefs.current[table] = el;
        }}
        className={[
          "table-card",
          active ? (over ? "table-card--over" : "table-card--active") : "table-card--empty",
          tap ? "table-card--tap" : "",
          highlightTable === table ? "table-card--highlight" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={tap ? () => openSheet(table, active) : undefined}
        onKeyDown={
          tap
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openSheet(table, active);
                }
              }
            : undefined
        }
        role={tap ? "button" : undefined}
        tabIndex={tap ? 0 : undefined}
      >
        <div className="tc-header">
          <div className="tc-header-row">
            <span className="tc-num">{table}번</span>
            {active && !mobile && (
              <div className="tc-header-actions">
                <button type="button" className="tc-history-btn" onClick={() => setHistoryTable(table)}>
                  내역
                </button>
                <button
                  type="button"
                  className="tc-close"
                  aria-label="테이블 할당 해제"
                  onClick={() => setConfirmTable(table)}
                >
                  ✕
                </button>
              </div>
            )}
            {tap && <span className="tc-tap-hint">탭하여 조작</span>}
          </div>
          <span
            className={`tc-status ${active ? (over ? "tc-status--over" : "tc-status--active") : "tc-status--empty"}`}
          >
            {active ? (over ? "시간초과" : "이용 중") : "빈 테이블"}
          </span>
        </div>
        {active && (
          <>
            <div className={`tc-timer ${over ? "tc-timer--over" : ""}`}>{formatHMS(remaining)}</div>
            <div className="tc-meta">
              <span>인원 {partySize > 0 ? `${partySize}명` : "—"}</span>
              <span>제한 {limitMin}분</span>
              {totalAmount > 0 && <span className="tc-amount">{totalAmount.toLocaleString()}원</span>}
            </div>
            {!mobile && (
              <div className="tc-actions">
                <button type="button" className="btn-secondary tc-btn" onClick={() => handleExtend(table)}>
                  시간 연장
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`page system-page${mobile ? " system-page--mobile" : ""}`}>
      {confirmTable && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmTable(null)}>
          <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{confirmTable}번 테이블 해제</h2>
            <p className="modal-body">타이머와 주방 주문이 모두 초기화됩니다. 계속할까요?</p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setConfirmTable(null)}>
                취소
              </button>
              <button type="button" className="btn-danger" onClick={() => handleReset(confirmTable)}>
                해제
              </button>
            </div>
          </div>
        </div>
      )}
      {sheetTable && sheetRow?.active && (
        <div className="table-sheet-backdrop" role="presentation" onClick={() => setSheetTable(null)}>
          <div
            className="table-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="table-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="table-sheet-handle" aria-hidden="true" />
            <h2 id="table-sheet-title" className="table-sheet-title">
              {sheetTable}번 테이블
            </h2>
            <span
              className={`tc-status table-sheet-status ${sheetRow.over ? "tc-status--over" : "tc-status--active"}`}
            >
              {sheetRow.over ? "시간초과" : "이용 중"}
            </span>
            <div className={`table-sheet-timer ${sheetRow.over ? "tc-timer--over" : ""}`}>
              {formatHMS(sheetRow.remaining)}
            </div>
            <div className="table-sheet-meta">
              <span>인원 {sheetRow.partySize > 0 ? `${sheetRow.partySize}명` : "—"}</span>
              <span>제한 {sheetRow.limitMin}분</span>
              {sheetRow.totalAmount > 0 && (
                <span className="tc-amount">{sheetRow.totalAmount.toLocaleString()}원</span>
              )}
            </div>
            <div className="table-sheet-actions">
              <button type="button" className="btn-secondary btn-block table-sheet-btn" onClick={() => handleExtend(sheetTable)}>
                시간 연장
              </button>
              <button
                type="button"
                className="btn-secondary btn-block table-sheet-btn"
                onClick={() => {
                  setHistoryTable(sheetTable);
                  setSheetTable(null);
                }}
              >
                주문 내역
              </button>
              <button
                type="button"
                className="btn-danger btn-block table-sheet-btn"
                onClick={() => {
                  setSheetTable(null);
                  setConfirmTable(sheetTable);
                }}
              >
                테이블 해제
              </button>
              <button type="button" className="btn-secondary btn-block table-sheet-btn" onClick={() => setSheetTable(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {historyTable && (() => {
        const td = state?.tables?.[historyTable];
        const history = Array.isArray(td?.orderHistory) ? td.orderHistory : [];
        const total = Math.max(0, Math.floor(Number(td?.totalAmount) || 0));
        return (
          <div className="modal-backdrop" role="presentation" onClick={() => setHistoryTable(null)}>
            <div
              className="modal-panel modal-panel--history"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="modal-title">{historyTable}번 테이블 주문 내역</h2>
              <div className="oh-scroll">
                {history.length === 0 ? (
                  <p className="muted">주문 내역이 없습니다.</p>
                ) : (
                  <ol className="oh-list">
                    {history.map((batch, i) => (
                      <li key={i} className="oh-batch">
                        <div className="oh-batch-header">
                          <span className="oh-batch-num">#{i + 1}</span>
                          <time className="oh-batch-time">{formatHM(batch.createdAt)}</time>
                          <span className="oh-batch-sub">{batch.subtotal.toLocaleString()}원</span>
                        </div>
                        <ul className="oh-items">
                          {batch.items.map((it, j) => (
                            <li key={j} className="oh-item">
                              <span>
                                {it.name} × {it.qty}
                              </span>
                              <span>{(it.price * it.qty).toLocaleString()}원</span>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="oh-footer">
                <span>누적 합계</span>
                <strong>{total.toLocaleString()}원</strong>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setHistoryTable(null)}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      <div className="system-top">
        <h1 className="system-h1">시스템 / 타이머</h1>
        <span className={`conn large ${connected ? "ok" : ""}`}>{connected ? "연결됨" : "연결 끊김"}</span>
      </div>

      <section className="tables-section">
        <h2 className="section-title large tables-section-title">
          테이블 현황
          <span className="tc-count-badge">{activeCount} / 33 이용 중</span>
        </h2>

        <div className="system-table-toolbar">
          <div className="system-view-tabs" role="tablist" aria-label="테이블 보기">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "active"}
              className={`system-view-tab${viewMode === "active" ? " active" : ""}`}
              onClick={() => setViewMode("active")}
            >
              이용 중 ({activeCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "all"}
              className={`system-view-tab${viewMode === "all" ? " active" : ""}`}
              onClick={() => setViewMode("all")}
            >
              전체 33
            </button>
          </div>
          <form
            className="system-table-jump"
            onSubmit={(e) => {
              e.preventDefault();
              jumpToTable();
            }}
          >
            <label className="system-jump-label">
              <span className="sr-only">테이블 번호</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                placeholder="테이블 번호"
                value={jumpInput}
                onChange={(e) => {
                  setJumpInput(e.target.value.replace(/\D/g, ""));
                  setJumpError("");
                }}
                className="field-input system-jump-input"
              />
            </label>
            <button type="submit" className="btn-secondary system-jump-btn">
              이동
            </button>
          </form>
          {jumpError && <p className="system-jump-error">{jumpError}</p>}
        </div>

        {viewMode === "active" && displayedTables.length === 0 ? (
          <p className="muted system-empty-active">이용 중인 테이블이 없습니다. 「전체 33」에서 빈 테이블을 확인하세요.</p>
        ) : (
          <div className="table-grid">{displayedTables.map(renderCard)}</div>
        )}
      </section>
    </div>
  );
}
