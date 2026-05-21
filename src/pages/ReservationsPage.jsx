import { useEffect, useMemo, useRef, useState } from "react";
import { useAppSocket } from "../context/SocketContext.jsx";

function formatWhen(ts) {
  const d = new Date(ts);
  return d.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function telHref(phone) {
  const digits = String(phone).replace(/\D/g, "");
  return digits.length > 0 ? `tel:${digits}` : null;
}

export default function ReservationsPage() {
  const { socket, connected, state } = useAppSocket();
  const list = useMemo(() => {
    const raw = state?.reservations ?? [];
    return [...raw].sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
  }, [state?.reservations]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const pendingTimerRef = useRef(null);

  useEffect(() => () => { if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current); }, []);

  const executePendingDelete = (id) => {
    socket.emit("reservation:delete", id);
    setPendingDelete(null);
  };

  const handleDeleteConfirm = () => {
    const target = confirmTarget;
    setConfirmId(null);
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    setPendingDelete({ id: target.id, name: target.name });
    pendingTimerRef.current = setTimeout(() => executePendingDelete(target.id), 4000);
  };

  const cancelPendingDelete = () => {
    if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
    setPendingDelete(null);
  };

  const handleAdd = () => {
    setError("");
    socket.emit("reservation:create", { name, phone, partySize }, (res) => {
      if (res?.ok) {
        setName("");
        setPhone("");
        setPartySize("");
      } else {
        setError(res?.error ?? "오류가 발생했습니다.");
      }
    });
  };

  const canAdd = connected && name.trim().length > 0 && phone.trim().length > 0 && Number(partySize) >= 1;

  const confirmTarget = confirmId ? list.find((r) => r.id === confirmId) : null;

  return (
    <div className="page reservations-page">
      {pendingDelete && (
        <div className="undo-toast">
          <span>{pendingDelete.name} 예약 삭제 중…</span>
          <button type="button" className="btn-secondary" onClick={cancelPendingDelete}>취소</button>
        </div>
      )}
      {confirmTarget && (
        <div className="modal-backdrop" role="presentation" onClick={() => setConfirmId(null)}>
          <div className="modal-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">예약 삭제</h2>
            <p className="modal-body">
              <strong>{confirmTarget.name}</strong> ({confirmTarget.phone}) 예약을 삭제할까요?
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setConfirmId(null)}>취소</button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteConfirm}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="reservations-top">
        <h1 className="reservations-h1">예약 목록</h1>
        <span className={`conn large ${connected ? "ok" : ""}`}>{connected ? "연결됨" : "연결 끊김"}</span>
      </div>

      <div className="reservation-form">
        <h2 className="reservation-form-title">수기 등록</h2>
        <div className="reservation-form-fields">
          <input
            type="text"
            className="field-input"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            inputMode="numeric"
            className="field-input"
            placeholder="전화번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="number"
            inputMode="numeric"
            className="field-input"
            placeholder="인원"
            min={1}
            max={99}
            value={partySize}
            onChange={(e) => setPartySize(e.target.value.replace(/\D/g, ""))}
          />
          <button type="button" className="btn-primary" onClick={handleAdd} disabled={!canAdd}>
            등록
          </button>
        </div>
        {error && <p className="reservation-form-error">{error}</p>}
      </div>

      <p className="muted reservations-hint">접수된 순서대로 표시됩니다.</p>

      {list.length === 0 ? (
        <p className="muted">등록된 예약이 없습니다.</p>
      ) : (
        <ul className="reservation-list">
          {list.map((r) => {
            const href = telHref(r.phone);
            return (
              <li key={r.id} className="reservation-card">
                <div className="reservation-main">
                  <span className="reservation-name">{r.name}</span>
                  <span className="reservation-meta muted">
                    인원 {r.partySize}명 · {r.phone}
                  </span>
                  <time className="reservation-time muted">{formatWhen(r.createdAt)}</time>
                </div>
                <div className="reservation-actions">
                  {href ? (
                    <a className="btn-secondary reservation-call" href={href}>
                      전화하기
                    </a>
                  ) : (
                    <button type="button" className="btn-secondary" disabled>
                      전화하기
                    </button>
                  )}
                  <button type="button" className="btn-danger" onClick={() => setConfirmId(r.id)}>
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
