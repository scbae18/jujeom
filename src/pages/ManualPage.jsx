export default function ManualPage() {
  return (
    <div className="page manual-page">
      <h1 className="section-title large">서버 매뉴얼</h1>

      {/* ── 운영 규정 ── */}
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

      {/* ── 탭 사용법 ── */}
      <section className="manual-section">
        <h2 className="manual-heading">주문서 탭 사용법</h2>
        <ol className="manual-list manual-list--ol">
          <li>테이블 번호 입력 (1~40)</li>
          <li>인원수 입력 — 테이블 현황에 반영되므로 반드시 입력</li>
          <li>메뉴 +/− 버튼으로 수량 선택</li>
          <li>하단 <strong>주문 완료</strong> → 입금 확인 후 <strong>주문 완료</strong> 클릭</li>
        </ol>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>테이블 번호를 잘못 입력하면 타이머가 엉뚱한 테이블에 시작됨 — 입력 전 반드시 확인</li>
            <li>주문 완료 후 취소·수정 불가 — 입금 확인 모달에서 메뉴·수량 다시 검토</li>
            <li>연결 끊김 상태에서는 주문 완료 버튼이 비활성화됨 — 재연결 후 시도</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">주방 탭 사용법</h2>
        <ul className="manual-list">
          <li>접수된 주문이 카드로 표시됨 — 테이블 번호·접수 시각 확인</li>
          <li>조리 완료된 메뉴마다 <strong>완료</strong> 버튼 클릭</li>
          <li>실수로 완료 누른 경우 <strong>취소</strong> 버튼으로 되돌리기 가능</li>
          <li>카드 내 모든 항목 완료 시 카드 자동 제거</li>
        </ul>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>모든 항목 완료 즉시 카드가 사라짐 — 제거 전 테이블 번호 확인</li>
            <li>주문이 많을 때 아래 카드를 놓치지 않도록 주기적으로 스크롤 확인</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">테이블 현황 탭 사용법</h2>
        <ul className="manual-list">
          <li>1~40번 테이블 전체를 한눈에 확인</li>
          <li>파란 테두리 — 이용 중 / 빨간 테두리 — 시간 초과</li>
          <li><strong>+연장</strong> — 설정된 연장 시간만큼 추가 (시간 초과 상태면 그 시점부터 재시작)</li>
          <li><strong>✕</strong> — 테이블 해제 (확인 모달 후 처리)</li>
        </ul>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>✕ 버튼은 타이머·주방 주문 모두 초기화됨 — 손님이 자리를 완전히 떠난 뒤 클릭</li>
            <li>시간 초과 테이블에 추가 주문이 들어오면 타이머가 자동 재시작됨</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">설정 탭 사용법</h2>
        <ul className="manual-list">
          <li><strong>기본 제한 시간</strong> — 첫 주문 후 이 시간을 넘기면 시간 초과 표시 (기본 90분)</li>
          <li><strong>연장 시간</strong> — +연장 한 번 클릭 시 추가되는 분 (기본 60분)</li>
          <li><strong>품절 설정</strong> — 메뉴 버튼 클릭으로 판매중 ↔ 품절 즉시 전환</li>
        </ul>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>품절 처리된 메뉴는 주문서에서 선택 불가 — 영업 전 미리 설정</li>
            <li>제한 시간 변경은 이후 연장 계산에만 적용, 기존 타이머에는 소급 미적용</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">예약 탭 사용법</h2>
        <ul className="manual-list">
          <li>손님이 QR 코드(/reserve)로 접수한 예약 목록 실시간 확인</li>
          <li>이름·인원·전화번호·접수 시각 표시</li>
          <li>테이블 안내 완료 후 <strong>삭제</strong> 버튼으로 제거</li>
        </ul>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">전체 초기화</h2>
        <ul className="manual-list">
          <li>주방 큐·테이블 타이머·매출·예약을 전부 초기화</li>
          <li>영업 종료 후 다음 행사 준비 시 사용</li>
        </ul>
        <div className="manual-warn manual-warn--danger">
          <p className="manual-warn-title">경고</p>
          <ul className="manual-list">
            <li>되돌릴 수 없음 — 영업 중 절대 사용 금지</li>
            <li>초기화 전 매출 탭 스크린샷 보관 권장</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
