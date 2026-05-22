# festival_SWing — 주점 주문 관리 시스템

축제 주점 운영을 위한 실시간 주문·주방·타이머·예약 관리 웹앱.  
모바일 LTE 환경 최적화, **1~33번** 테이블 지원.

---

## 서비스 접속 주소

| 대상 | URL |
|---|---|
| 손님 예약 (QR·링크) | https://festival-swing.duckdns.org/reserve |
| 운영자 (주문·주방·현황 등) | https://festival-swing.duckdns.org |
| 매출 (비공개) | https://festival-swing.duckdns.org/stats |

---

## 로컬 개발

```bash
cd festival_SWing
npm install
npm run dev
```

| 구분 | 주소 |
|---|---|
| 프론트 (Vite) | http://localhost:5173 |
| 백엔드 (Socket.io) | http://127.0.0.1:3002 |

- `npm run dev` — Express 서버 + Vite를 동시 실행 (`concurrently`)
- 운영 화면: http://localhost:5173/
- 손님 예약: http://localhost:5173/reserve

프로덕션 단일 포트 실행:

```bash
npm run build
npm start   # dist 빌드 후 3002 포트에서 정적 파일 + API
```

---

## 화면·라우트

| 경로 | 대상 | 설명 |
|---|---|---|
| `/` | 운영 | 주문서 (테이블·인원·메뉴·주문 완료) |
| `/kitchen` | 운영 | 주방 주문 카드·조리 완료 |
| `/system` | 운영 | 테이블 현황·타이머·시간 연장·내역·해제 |
| `/settings` | 운영 | 기본/연장 시간·품절 |
| `/reservations` | 운영 | 예약 목록·수기 등록·삭제 |
| `/reserve` | 손님 | 자가 예약 (헤더·탭 없음) |
| `/manual` | 운영 | 서버 매뉴얼 |
| `/reset` | 운영 | 전체 초기화 |
| `/stats` | 운영 | 매출 (nav 미노출, URL 직접 접속) |

---

## 현재 운영 정책 (앱 반영)

### 자릿세·타이머

- 자릿세 **2,900원** / 인당, **1시간 30분** 기준 (기본 제한 **90분**)
- 설정 탭에서 기본 제한·**연장 시간**(기본 **60분**) 변경 가능
- 테이블 현황 **「시간 연장」** 버튼: `bonusLimitMinutes`에 연장 분 가산
- 시간 초과 후 **세트 추가 주문**이 인원별 기준 이상이면 연장 분 **자동 가산**

### 메뉴 (`shared/menu.js`)

| 구분 | 내용 |
|---|---|
| 세트 | A~D (16,900 / 12,900원), 주방에 구성품목별 표시 |
| 개별 | 메인 12,900원, 사이드 6,900원 — **추가 주문만** (`addonOnly`) |
| 첫 주문 | 세트 또는 자릿세 필수 (개별 메뉴 단독 불가) |

**인원별 필수 세트 수** (첫 주문·연장 안내)

| 인원 | 세트 수 |
|---|---|
| 1~2인 | 1개 |
| 3~4인 | 2개 |
| 5~6인 | 3개 |
| 7~8인 | 4개 |

### 예약

- 손님: `/reserve`에서 이름·전화·인원 제출 → Socket `reservation:create`
- 운영: `/reservations`에서 목록 확인·수기 등록·전화·삭제(4초 유예 취소 가능)

---

## 목차

1. [기술 스택](#기술-스택)
2. [기능 구현 이력](#기능-구현-이력)
3. [트러블슈팅 기록](#트러블슈팅-기록)
4. [운영 설정 변경 이력](#운영-설정-변경-이력)
5. [성능 측정 결과](#성능-측정-결과)
6. [서버 운영 가이드](#서버-운영-가이드)
7. [주요 파일](#주요-파일)

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| 프론트엔드 | React 18, Vite 6, React Router v6 |
| 백엔드 | Node.js, Express, Socket.io |
| 상태 영속성 | 인메모리 + JSON (`data/state.json`, EC2: `/home/ubuntu/data/state.json`) |
| 프로세스 관리 | PM2 (fork mode, startup 등록) |
| 리버스 프록시 | Nginx (WebSocket, `proxy_read_timeout 86400s`) |
| SSL | ZeroSSL (acme.sh DNS-01) |
| 인프라 | AWS EC2 t3.micro (ap-northeast-2c), Ubuntu 24.04 |
| 도메인 | DuckDNS — festival-swing.duckdns.org |
| Elastic IP | 13.125.114.50 |

개발 시 Vite가 `/socket.io`를 `127.0.0.1:3002`로 프록시합니다 (`vite.config.js`).

---

## 기능 구현 이력

### v0 — 기초

- Express + Socket.io, `state.json` 영속성
- 주문서 / 주방 / 테이블 현황 / 설정
- 타이머·품절·PM2 자동 복구

### v1 — 모바일·연결

- Socket `pingTimeout` / `pingInterval` 조정, `reconnectionDelayMax: 10000`
- 반응형 CSS

### v2 — 주문 안전성

- `MENU_LIST` 기반 주문 처리 (`state.menu` undefined 크래시 방지)
- `submitId` 중복 주문 방지, 연결 끊김 시 `isSubmitting` 리셋

### v3 — 매뉴얼·UI (당시)

- `/manual` 탭, 매출 nav 제거 (`/stats` 직접 접속)
- (이후 v6에서 메뉴·타이머 정책 재개편)

### v4 — 예약

- 손님 `/reserve`, 운영 `/reservations`
- 수기 등록·전화·삭제 확인·4초 유예 삭제

### v5 — 테이블 현황 고도화 (당시)

- 누적 금액·주문 내역 모달, 8열 그리드
- (입금자 필드는 v6에서 제거)

### v6 — 현재 운영 메뉴·정책 (2026)

- **테이블 33개**, 자릿세 **2,900원**, 기본 제한 **90분**, 연장 **60분**
- **세트 A~D** + **개별 메뉴**(추가 주문만), 주방 세트 구성품목 펼침
- 첫 주문 세트/자릿세 필수, 시간 초과 후 세트 주문 시 연장 자동 가산
- 테이블 현황 **시간 연장** 버튼·`system:extendTable` 복원
- 설정: 연장 시간 입력, 품절에 세트 **구성 표시**
- 주문서: 자릿세 최상단, 입금자 입력 제거
- 개발 모드 Socket: Vite 프록시 + StrictMode `disconnect` 이슈 수정
- 손님 예약 `ReservePage.jsx` 복구·라우트 분리 (헤더 없음)

---

## 트러블슈팅 기록

| # | 현상 | 원인 | 해결 |
|---|---|---|---|
| 1 | 주문 완료 시 전체 연결 끊김 | `state.menu.map()` TypeError → PM2 재시작 | `MENU_LIST.map()` |
| 2 | 처리 중 + 연결 끊김 동시 표시 | ack 미도착으로 `isSubmitting` 고착 | 연결 끊김 시 리셋 |
| 3 | dev에서 항상 「연결 끊김」 | StrictMode cleanup `socket.disconnect()` | cleanup에서 disconnect 제거, Vite 프록시 사용 |
| 4 | state.json이 코드 기본값 덮음 | load 시 저장값 우선 | 설정 탭에서 재적용 또는 JSON 수정 |
| 5 | 모바일 예약 폼 가로 넘침 | Grid `min-width: auto` | `min-width: 0` |
| 6 | 테이블 카드 헤더 겹침 | 한 줄에 요소 과다 | 2행 헤더 구조 |

---

## 운영 설정 변경 이력

| 항목 | 과거 | **현재** |
|---|---|---|
| 테이블 수 | 40 | **33** |
| 자릿세 | 5,000원 | **2,900원** |
| 기본 제한 | 120분 등 | **90분** (1시간 30분) |
| 연장 시간 | 제거됐던 시기 있음 | **60분** (설정·버튼·세트 주문 연동) |
| 메뉴 | 단일 메인/사이드 | **세트 4종 + 개별 추가 주문** |
| 입금자 입력 | 있음 | **없음** |
| 손님 예약 | — | **`/reserve`** |

---

## 성능 측정 결과

> 40개 테이블 시뮬레이션 기준 (2025-05-21). 실운영은 **33테이블·동시 접속 ~15~20** 예상.

| 항목 | 30 클라이언트 | 50 클라이언트 |
|---|---|---|
| 연결 성공률 | 100% | 100% |
| 주문 ack | 100% | 100% |
| 평균 지연 | 16ms | 54ms |
| p95 지연 | ~20ms | 129ms |

→ t3.micro + Swap 512MB로 운영 가능 판정 (상세 수치는 과거 부하 테스트 로그 참고).

---

## 서버 운영 가이드

### 일상 운영

```bash
ssh -i ~/festival-swing-key.pem ubuntu@13.125.114.50
pm2 status
pm2 restart festival
pm2 logs festival --lines 50
sudo systemctl status nginx
```

### 비상 대응

| 상황 | 조치 |
|---|---|
| 앱 무응답 | `pm2 restart festival` |
| 페이지 안 열림 | `sudo systemctl restart nginx` |
| 데이터 백업 | `/home/ubuntu/data/state.json` |
| SSL 만료 | `acme.sh --renew -d festival-swing.duckdns.org --force && sudo systemctl reload nginx` |

### 행사 당일 체크리스트

```
[ ] pm2 status → festival online
[ ] https://festival-swing.duckdns.org 접속
[ ] 설정 → 기본 제한 90분, 연장 60분 확인
[ ] 설정 → 품절 사전 처리
[ ] 전체 초기화 → 이전 데이터 정리
[ ] 예약 QR → /reserve
[ ] 주문·주방·테이블 현황 연결 상태 확인
```

### 로컬 → EC2 배포

```bash
npm run build

rsync -av -e "ssh -i ~/festival-swing-key.pem" --delete \
  dist/ ubuntu@13.125.114.50:/home/ubuntu/festival_SWing/dist/

rsync -av -e "ssh -i ~/festival-swing-key.pem" \
  server/index.js shared/menu.js \
  ubuntu@13.125.114.50:/home/ubuntu/festival_SWing/

# 프론트 소스 변경 시 dist만으로 충분 (빌드 후 rsync dist)
ssh -i ~/festival-swing-key.pem ubuntu@13.125.114.50 "pm2 restart festival"
```

### 배포 구조

```
[브라우저] ──HTTPS 443──▶ [Nginx]
                               │ HTTP 3002 (WebSocket Upgrade)
                               ▼
                     [Node.js + Socket.io]  ← PM2
                               │ broadcastState() → state.json
                               ▼
                     /home/ubuntu/data/state.json
```

### Socket 이벤트 (요약)

| 이벤트 | 용도 |
|---|---|
| `order:submit` | 주문 접수 |
| `kitchen:completeLine` / `uncompleteLine` | 조리 완료·취소 |
| `kitchen:soldOut:toggle` | 품절 |
| `system:resetTable` / `resetAll` | 테이블·전체 초기화 |
| `system:setDefaultLimitMinutes` | 기본 제한(분) |
| `system:setExtensionMinutes` | 연장 1회 분량 |
| `system:extendTable` | 테이블 시간 연장 |
| `reservation:create` / `delete` | 예약 |

---

## 주요 파일

| 파일 | 설명 |
|---|---|
| `shared/menu.js` | 메뉴·세트 ID·인원별 세트 수·주방 펼침 |
| `server/index.js` | Express + Socket.io, 상태·주문·연장·예약 |
| `src/App.jsx` | 라우트 (`/reserve`는 헤더 없음) |
| `src/context/SocketContext.jsx` | Socket 연결·전역 state |
| `src/pages/OrderPage.jsx` | 주문서 |
| `src/pages/KitchenPage.jsx` | 주방 |
| `src/pages/SystemPage.jsx` | 테이블 현황·연장·내역 |
| `src/pages/SettingsPage.jsx` | 타이머·품절(세트 구성 표시) |
| `src/pages/ReservePage.jsx` | 손님 예약 `/reserve` |
| `src/pages/ReservationsPage.jsx` | 운영 예약 관리 |
| `src/pages/ManualPage.jsx` | 매뉴얼 |
| `src/pages/StatsPage.jsx` | 매출 |
| `vite.config.js` | dev 프록시, `@shared` alias |
| `ecosystem.config.cjs` | PM2 |
| `nginx.conf` | Nginx + SSL |

메뉴·가격 변경은 **`shared/menu.js`** 만 수정 후 서버 재시작(또는 배포)하면 됩니다.
