import { useState } from "react";
import { useAppSocket } from "../context/SocketContext.jsx";

/**
 * 손님 자가 예약 — /reserve (운영자 헤더·탭 없음, QR 배포용)
 */
export default function ReservePage() {
  const { socket, connected } = useAppSocket();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    connected &&
    !submitting &&
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    Number(partySize) >= 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError("");
    setSubmitting(true);
    socket.emit("reservation:create", { name, phone, partySize }, (res) => {
      setSubmitting(false);
      if (res?.ok) {
        setDone(true);
        setName("");
        setPhone("");
        setPartySize("");
      } else {
        setError(res?.error ?? "예약 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    });
  };

  const handleNew = () => {
    setDone(false);
    setError("");
  };

  return (
    <div className="page reserve-page">
      <div className="reserve-shell">
        <h1 className="reserve-title">테이블 예약</h1>
        <p className="reserve-lead muted">이름·연락처·인원을 입력해 주세요. 접수 후 매장에서 연락드립니다.</p>

        {!connected && (
          <p className="reserve-warn">서버에 연결 중입니다. 잠시만 기다려 주세요…</p>
        )}

        {done ? (
          <div className="reserve-done">
            <p className="reserve-done-msg">예약이 접수되었습니다. 감사합니다!</p>
            <p className="muted small">매장에서 순서대로 연락드릴 예정입니다.</p>
            <button type="button" className="btn-primary btn-block" onClick={handleNew}>
              추가 예약하기
            </button>
          </div>
        ) : (
          <form className="reserve-form" onSubmit={handleSubmit}>
            <label className="field-label">
              이름
              <input
                type="text"
                className="field-input"
                placeholder="홍길동"
                maxLength={40}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!connected || submitting}
              />
            </label>
            <label className="field-label">
              전화번호
              <input
                type="tel"
                inputMode="tel"
                className="field-input"
                placeholder="01000000000"
                maxLength={30}
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!connected || submitting}
              />
            </label>
            <label className="field-label">
              인원
              <input
                type="number"
                inputMode="numeric"
                className="field-input"
                placeholder="명"
                min={1}
                max={99}
                value={partySize}
                onChange={(e) => setPartySize(e.target.value.replace(/\D/g, ""))}
                disabled={!connected || submitting}
              />
            </label>
            {error && <p className="reserve-error">{error}</p>}
            <button type="submit" className="btn-primary btn-block" disabled={!canSubmit}>
              {submitting ? "접수 중…" : "예약하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
