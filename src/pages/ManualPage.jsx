export default function ManualPage() {
  return (
    <div className="page manual-page">
      <h1 className="section-title large">서버 매뉴얼</h1>

      <section className="manual-section">
        <h2 className="manual-heading">자릿세</h2>
        <ul className="manual-list">
          <li>인당 <strong>2,900원</strong> — <strong>1시간 30분</strong> 기준</li>
          <li>
            중간 합류 손님
            <ul className="manual-list manual-list--sub">
              <li><strong>테이블 첫 손님 기준 1시간 30분</strong>으로 통일, 입장 시 명확히 안내</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">인원별 필수 주문 (세트)</h2>
        <p className="manual-desc">첫 주문·연장 시 아래 세트 수량을 안내하세요. 개별 메뉴(메인·사이드·기본안주)만으로는 첫 주문이 불가합니다.</p>
        <div className="manual-table-wrap">
          <table className="manual-table">
            <thead>
              <tr>
                <th>인원</th>
                <th>필수 세트 주문 수</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1~2인</td><td>세트 1개</td></tr>
              <tr><td>3~4인</td><td>세트 2개</td></tr>
              <tr><td>5~6인</td><td>세트 3개</td></tr>
              <tr><td>7~8인</td><td>세트 4개</td></tr>
            </tbody>
          </table>
        </div>
        <div className="manual-table-wrap" style={{ marginTop: "1rem" }}>
          <table className="manual-table">
            <thead>
              <tr>
                <th>세트</th>
                <th>구성</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>A세트</td><td>제육볶음 + 주먹밥</td><td>16,900원</td></tr>
              <tr><td>B세트</td><td>소세지불닭 + 콘치즈</td><td>16,900원</td></tr>
              <tr><td>C세트</td><td>두부김치 + 계란찜</td><td>16,900원</td></tr>
              <tr><td>D세트</td><td>콘치즈 + 나쵸</td><td>12,900원</td></tr>
            </tbody>
          </table>
        </div>
        <p className="manual-desc muted small" style={{ marginTop: "0.75rem" }}>
          개별 메뉴(추가 주문): 메인 12,900원(제육볶음·두부김치·소세지불닭), 사이드 6,900원(주먹밥·나쵸·계란찜·콘치즈)
        </p>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">시간 연장 정책</h2>
        <ul className="manual-list">
          <li>기본 <strong>1시간 30분</strong> 이후, 추가 주문으로 <strong>1시간 연장</strong> 가능 (설정 기본 연장 60분)</li>
          <li><strong>연장 조건</strong>: 세트 메뉴 추가 주문 — 인원별 필수 세트 수 이상</li>
        </ul>
        <div className="manual-table-wrap">
          <table className="manual-table">
            <thead>
              <tr>
                <th>인원</th>
                <th>연장 시 세트 주문 수</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1~2인</td><td>세트 1개</td></tr>
              <tr><td>3~4인</td><td>세트 2개</td></tr>
              <tr><td>5~6인</td><td>세트 3개</td></tr>
              <tr><td>7~8인</td><td>세트 4개</td></tr>
            </tbody>
          </table>
        </div>
        <p className="manual-desc">추가 연장 시에도 동일 조건을 반복 적용합니다.</p>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">주문서 탭 사용법</h2>
        <ol className="manual-list manual-list--ol">
          <li>테이블 번호 입력 (1~33)</li>
          <li>인원수 입력 — 테이블 현황·연장 조건에 반영되므로 반드시 입력</li>
          <li>첫 주문: <strong>세트</strong> 또는 <strong>자릿세</strong> 포함 후, 개별 메뉴 추가 주문</li>
          <li>메뉴 +/− 버튼으로 수량 선택 (「추가 주문만」 표시 메뉴는 첫 주문 단독 불가)</li>
          <li>하단 <strong>주문 완료</strong> → 입금 확인 모달에서 검토 후 <strong>주문 완료</strong> 클릭</li>
        </ol>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>테이블 번호를 잘못 입력하면 타이머가 엉뚱한 테이블에 시작됨 — 입력 전 반드시 확인</li>
            <li>주문 완료 후 취소·수정 불가 — 입금 확인 모달에서 메뉴·수량 다시 검토</li>
            <li>8초 안에 서버 응답이 없으면 화면에 안내 메시지가 표시됨 — 주방 화면에서 주문 접수 여부 확인</li>
            <li>연결 끊김 상태에서는 주문 완료 버튼이 비활성화됨 — 재연결 후 시도</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">주방 탭 사용법</h2>
        <ul className="manual-list">
          <li>접수된 주문이 카드로 표시됨 — 테이블 번호·접수 시각 확인</li>
          <li>세트 주문은 구성 메뉴별로 줄이 나뉘어 표시됨</li>
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
          <li>1~33번 테이블 전체를 한눈에 확인</li>
          <li>파란 테두리 — 이용 중 / 빨간 테두리 — 시간 초과</li>
          <li>카드에 인원수·제한 시간(기본+연장)·누적 금액 표시</li>
          <li><strong>시간 연장</strong> — 제한 시간에 연장 분을 더함 (세트 추가 주문·안내 후 사용)</li>
          <li><strong>내역</strong> 버튼 — 해당 테이블의 주문 내역 및 누적 합계 조회</li>
          <li><strong>✕</strong> — 테이블 해제 (확인 모달 후 처리)</li>
        </ul>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>✕ 버튼은 타이머·주방 주문 모두 초기화됨 — 손님이 자리를 완전히 떠난 뒤 클릭</li>
            <li>시간 초과 후 인원별 세트 수 이상 주문이 접수되면 연장 분이 자동 가산될 수 있음</li>
            <li>연장은 「시간 연장」 버튼으로도 수동 적용 가능 — 세트 주문·입금 확인 후 진행</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">설정 탭 사용법</h2>
        <ul className="manual-list">
          <li><strong>기본 제한 시간</strong> — 첫 주문 후 이 시간을 넘기면 시간 초과 표시 (기본 90분), 변경 후 <strong>적용</strong></li>
          <li><strong>연장 시간</strong> — 「시간 연장」·세트 추가 주문 시 더해지는 분 (기본 60분), 변경 후 <strong>적용</strong></li>
          <li><strong>품절 설정</strong> — 세트·개별 메뉴 버튼으로 판매중 ↔ 품절 전환, 주문서에 실시간 반영 (자릿세 제외)</li>
        </ul>
        <div className="manual-warn">
          <p className="manual-warn-title">주의</p>
          <ul className="manual-list">
            <li>품절 처리된 메뉴는 주문서에서 선택 불가 — 영업 전 미리 설정</li>
            <li>제한·연장 시간 변경은 이후 연장·신규 안내에 적용, 이미 쌓인 연장 분은 유지</li>
          </ul>
        </div>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">손님 예약 페이지</h2>
        <ul className="manual-list">
          <li>주소 <strong>/reserve</strong> — QR·링크로 손님이 직접 예약 (운영자 메뉴 없음)</li>
          <li>접수 내용은 <strong>예약</strong> 탭 목록에 수기 등록과 함께 표시</li>
        </ul>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">예약 탭 사용법</h2>
        <ul className="manual-list">
          <li>상단 등록 폼에 이름·전화번호·인원을 입력 후 <strong>등록</strong> (전화·현장 접수용)</li>
          <li>이름·인원·전화번호·접수 시각 표시</li>
          <li><strong>전화하기</strong> 버튼으로 해당 번호로 바로 전화 가능</li>
          <li>테이블 안내 완료 후 <strong>삭제</strong> → 확인 모달 → <strong>4초 유예</strong> 후 삭제 실행</li>
          <li>유예 시간 안에 화면 하단 <strong>취소</strong> 버튼을 누르면 삭제 취소 가능</li>
        </ul>
      </section>

      <section className="manual-section">
        <h2 className="manual-heading">전체 초기화</h2>
        <ul className="manual-list">
          <li>주방 큐·테이블 타이머·매출·품절·예약을 전부 초기화</li>
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
