import { useEffect, useMemo, useState } from "react";
import { useAppSocket } from "../context/SocketContext.jsx";

const ALL_TABLES = Array.from({ length: 40 }, (_, i) => String(i + 1));

function formatHMS(ms) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n) => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}

export default function SystemPage() {
  const { socket, connected, state } = useAppSocket();
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setClock((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const defaultLimit = state?.settings?.defaultLimitMinutes ?? 90;

  const tableData = useMemo(() => {
    const now = Date.now();
    return ALL_TABLES.map((table) => {
      const t = state?.tables?.[table];
      if (!t || t.timerStartedAt == null) return { table, active: false };
      const bonus = Math.max(0, Math.floor(Number(t.bonusLimitMinutes) || 0));
      const coverQty = Math.max(0, Math.floor(Number(t.coverQty) || 0));
      const limitMin = defaultLimit + bonus;
      const elapsed = now - t.timerStartedAt;
      const limitMs = limitMin * 60 * 1000;
      const over = elapsed >= limitMs;
      const remaining = Math.max(0, limitMs - elapsed);
      return { table, active: true, remaining, over, limitMin, bonus, coverQty };
    });
  }, [state?.tables, defaultLimit, clock]);

  const activeCount = tableData.filter((t) => t.active).length;

  return (
    <div className="page system-page">
      <div className="system-top">
        <h1 className="system-h1">시스템 / 타이머</h1>
        <span className={`conn large ${connected ? "ok" : ""}`}>{connected ? "연결됨" : "연결 끊김"}</span>
      </div>

      <section className="tables-section">
        <h2 className="section-title large tables-section-title">
          테이블 현황
          <span className="tc-count-badge">{activeCount} / 40 이용 중</span>
        </h2>

        <div className="table-grid">
          {tableData.map(({ table, active, remaining, over, limitMin, bonus, coverQty }) => (
            <div key={table} className={`table-card ${active ? (over ? "table-card--over" : "table-card--active") : "table-card--empty"}`}>
              <div className="tc-header">
                <span className="tc-num">{table}번</span>
                <span className={`tc-status ${active ? (over ? "tc-status--over" : "tc-status--active") : "tc-status--empty"}`}>
                  {active ? (over ? "시간초과" : "이용 중") : "빈 테이블"}
                </span>
                {active && (
                  <button
                    type="button"
                    className="tc-close"
                    aria-label="테이블 할당 해제"
                    onClick={() => socket.emit("system:resetTable", table)}
                  >✕</button>
                )}
              </div>
              {active && (
                <>
                  <div className={`tc-timer ${over ? "tc-timer--over" : ""}`}>{formatHMS(remaining)}</div>
                  <div className="tc-meta">
                    <span>인원 {coverQty}명</span>
                    <span>제한 {limitMin}분{bonus > 0 ? ` (+${bonus})` : ""}</span>
                  </div>
                  <div className="tc-actions">
                    <button type="button" className="btn-secondary tc-btn" onClick={() => socket.emit("system:extend", table)}>+연장</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
