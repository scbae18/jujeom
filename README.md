# festival_SWing — 주점 주문 관리 시스템

축제 주점 운영을 위한 실시간 주문·주방·타이머 관리 웹앱.  
모바일 LTE 환경 최적화, 1~40번 테이블 지원.

---

## 서비스 접속 주소

| 대상 | URL |
|---|---|
| 손님 주문 | https://festival-swing.duckdns.org/reserve |
| 운영자 전체 | https://festival-swing.duckdns.org |

---

## 탭별 사용 방법

### 주문서 `/`

운영자가 테이블 주문을 직접 입력하는 화면.

1. **테이블 번호** 입력 (1~40)
2. **인원수** 입력 → 테이블 현황 카드에 반영됨
3. 메뉴 목록에서 **+/−** 버튼으로 수량 선택
4. 하단 **주문 완료** 버튼 → 입금 확인 모달 → **주문 완료** 클릭

> 세트 메뉴는 가격 내림차순으로 표시됩니다.  
> `첫 주문 후` 배지가 붙은 메뉴는 해당 테이블에 첫 주문이 들어온 뒤부터 추가 선택 가능합니다.

---

### 주방 `/kitchen`

주방 전용 화면. 접수된 주문이 카드 형태로 표시됩니다.

- 상단: **대기 N건** 현황
- 각 카드: 테이블 번호 + 접수 시각 + 메뉴별 **완료** 버튼
- 메뉴별로 조리가 끝나면 **완료** 클릭 → 해당 항목 흐리게 처리
- 카드 내 모든 항목이 완료되면 카드 자동 제거

---

### 테이블 현황 `/system`

1~40번 테이블 전체를 그리드로 한눈에 확인.

| 카드 상태 | 표시 |
|---|---|
| 빈 테이블 | 흐린 카드, 번호만 표시 |
| 이용 중 | 파란 테두리, 카운트다운 타이머 |
| 시간 초과 | 빨간 테두리·빨간 타이머, 펄스 애니메이션 |

**카드 구성 (이용 중 테이블)**

```
[N번]  [이용 중]  [✕]
 01:23:45          ← 남은 시간 (기본 90분 차감)
 인원 3명 / 제한 90분
 [+연장]
```

- **✕ 버튼**: 테이블 할당 해제 (주문 내역·타이머 초기화)
- **+연장**: 설정에서 지정한 연장 시간만큼 제한 시간 추가 (타이머는 유지)
- 타이머가 0이 되면 빨간 글씨로 유지, 수동으로 해제하기 전까지 표시

---

### 설정 `/settings`

**타이머 설정**

| 항목 | 설명 |
|---|---|
| 기본 제한 시간 (분) | 첫 주문 후 이 시간을 넘기면 시간 초과 표시 (기본 90분) |
| 연장 시간 (분) | 「+연장」 한 번 클릭 시 제한 시간에 더해지는 분 (기본 60분) |

**품절 설정**

- 메뉴 버튼을 클릭하면 즉시 **품절 ↔ 판매중** 전환
- 품절 처리된 메뉴는 주문서에서 선택 불가로 표시됨

---

### 매출 `/stats`

주문 완료로 접수된 데이터 기준 실시간 집계.

- 총 매출 / 총 주문 수량 / 주문 완료 건수
- 카테고리별 메뉴 수량·금액 상세

> 서버 재시작 시 초기화됩니다. 영업 종료 전 스크린샷 보관을 권장합니다.

---

### 예약 `/reservations`

손님이 `/reserve` 에서 제출한 예약 목록 확인.

- 이름 / 인원 / 전화번호 / 접수 시각 표시
- 처리 완료된 예약은 **삭제** 버튼으로 제거

---

### 전체 초기화 `/reset`

주방 큐·테이블 타이머·매출·예약을 전부 초기화.  
영업 종료 후 다음 행사 준비 시 사용. **되돌릴 수 없습니다.**

---

### 손님 주문 `/reserve`

손님 전용 화면 (헤더·탭 없음). QR 코드로 제공.

1. 이름, 인원, 전화번호 입력
2. **예약하기** 클릭
3. 운영자의 `/reservations` 탭에 실시간 반영

---

## 행사 당일 운영 흐름

```
[영업 시작 전]
  설정 탭 → 타이머 제한 시간 확인
  설정 탭 → 품절 메뉴 있으면 미리 처리
  QR 코드 각 테이블에 부착 (→ /reserve)

[영업 중]
  손님   : QR 스캔 → /reserve 예약 접수
  운영자 : /reservations 확인 → 테이블 안내
  운영자 : 주문서에서 테이블 번호·인원수·메뉴 입력 → 주문 완료
  주방   : /kitchen 에서 주문 카드 확인 → 메뉴별 완료 처리
  운영자 : /system 에서 타이머 모니터링 → 시간 초과 테이블 처리

[영업 종료]
  /stats 에서 매출 최종 확인 (스크린샷 보관)
  /reset 에서 전체 초기화
```

---

## 서버 시작 (행사 당일)

### 1. EC2 접속

```bash
ssh -i ~/festival-swing-key.pem ubuntu@13.125.114.50
```

### 2. 서버 상태 확인

```bash
pm2 status
```

`festival` 앱이 `online` 이면 정상. `stopped` 이면:

```bash
cd ~/festival_SWing && pm2 start ecosystem.config.cjs
```

### 3. Nginx 상태 확인

```bash
sudo systemctl status nginx
# 내려가 있으면:
sudo systemctl start nginx
```

### 4. 접속 확인

브라우저에서 https://festival-swing.duckdns.org 로드 확인.

---

## 비상 대응

| 상황 | 조치 |
|---|---|
| 앱이 응답 없음 | `pm2 restart festival` |
| 페이지 열리지 않음 | `sudo systemctl restart nginx` |
| EC2 재부팅 후 | 자동 복구 (PM2 startup + Nginx systemd 등록됨) |
| 주문 데이터 날아감 | 재시작 전 `/home/ubuntu/data/state.json` 자동 저장됨, 재시작 후 복원 |
| 인증서 만료 | `~/.acme.sh/acme.sh --renew -d festival-swing.duckdns.org --force && sudo systemctl reload nginx` |

---

## 로컬 개발 환경

```bash
npm install
npm run dev
# 프론트엔드: http://localhost:5173
# 백엔드:     http://localhost:3002
```

프로덕션 빌드 후 EC2 배포:

```bash
npm run build
rsync -az --delete dist/ ubuntu@13.125.114.50:~/festival_SWing/dist/
rsync -az server/index.js ubuntu@13.125.114.50:~/festival_SWing/server/index.js
ssh ubuntu@13.125.114.50 "pm2 restart festival"
```

---

## 배포 구조

```
[브라우저] ──HTTPS 443──▶ [Nginx]
                               │ HTTP 3002
                               ▼
                     [Node.js + Socket.io]  ← PM2 관리
                               │
                               ▼
                     [state.json]  ← /home/ubuntu/data/state.json
```

- SSL: ZeroSSL (acme.sh DNS-01, 자동 갱신)
- 상태 영속성: PM2 재시작 후에도 주문·테이블·예약 데이터 유지
- 모바일 최적화: pingTimeout 60s, reconnectionDelayMax 10s

---

## 주요 파일

| 파일 | 설명 |
|---|---|
| `server/index.js` | Express + Socket.io 서버, 상태 관리 |
| `shared/menu.js` | 메뉴 목록 (메뉴 변경 시 여기만 수정) |
| `src/pages/OrderPage.jsx` | 주문서 탭 |
| `src/pages/KitchenPage.jsx` | 주방 탭 |
| `src/pages/SystemPage.jsx` | 테이블 현황 탭 |
| `src/pages/SettingsPage.jsx` | 설정 탭 |
| `src/pages/StatsPage.jsx` | 매출 탭 |
| `src/pages/ReservePage.jsx` | 손님 주문 화면 |
| `ecosystem.config.cjs` | PM2 설정 |
| `nginx.conf` | Nginx 리버스 프록시 설정 |
