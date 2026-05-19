import { useAppSocket } from "../context/SocketContext.jsx";

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function KitchenPage() {
  const { socket, connected, state } = useAppSocket();
  const queue = state?.kitchenQueue ?? [];

  return (
    <div className="page kitchen-page">
      <div className="kitchen-top">
        <h1 className="kitchen-h1">주방</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span className="muted" style={{ fontSize: "0.95rem" }}>대기 {queue.length}건</span>
          <span className={`conn large ${connected ? "ok" : ""}`}>{connected ? "연결됨" : "끊김"}</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <p className="empty-kitchen muted">대기 중인 주문이 없습니다.</p>
      ) : (
        <div className="kitchen-grid">
          {queue.map((o) => (
            <article key={o.id} className="kitchen-card">
              <header className="kc-head">
                <span className="kc-table">{o.table}번</span>
                <time className="kc-time">{formatTime(o.createdAt)}</time>
              </header>
              <ul className="kc-items">
                {o.items.map((it, i) => (
                  <li key={it.lineKey ?? `${o.id}-${i}`} className={`kc-item ${it.done ? "kc-item--done" : ""}`}>
                    <span className="kc-item-name">{it.name}</span>
                    {it.done ? (
                      <span className="kc-done-badge">완료</span>
                    ) : (
                      <button
                        type="button"
                        className="kc-btn-done"
                        onClick={() =>
                          socket.emit("kitchen:completeLine", {
                            orderId: o.id,
                            lineKey: it.lineKey,
                            lineIndex: i,
                          })
                        }
                      >
                        완료
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
