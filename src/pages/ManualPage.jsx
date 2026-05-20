export default function ManualPage() {
  return (
    <div className="page manual-page">
      <h1 className="section-title large">서버 매뉴얼</h1>

      <section className="manual-section">
        <h2 className="manual-heading">자릿세</h2>
        <ul className="manual-list">
          <li>인당 <strong>5,000원</strong> — 2시간 기준</li>
          <li>
            중간 합류 손님
            <ul className="manual-list manual-list--sub">
              <li><strong>테이블 첫 손님 기준 2시간</strong>으로 통일, 입장 시 명확히 안내</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">인원당 최소 주문</h2>
        <p className="manual-desc">인원 × 8,000원 이상 주문 / 객단가 13,000원 이상</p>
        <div className="manual-table-wrap">
          <table className="manual-table">
            <thead>
              <tr>
                <th>인원</th>
                <th>최소 금액</th>
                <th>구성 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2명</td>
                <td>16,000원 이상</td>
                <td>메인 1개 + 사이드 1개</td>
              </tr>
              <tr>
                <td>3명</td>
                <td>24,000원 이상</td>
                <td>메인 1개 + 사이드 1개 or 메인 2개</td>
              </tr>
              <tr>
                <td>4명</td>
                <td>32,000원 이상</td>
                <td>세트 1개 + 사이드 1개</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
