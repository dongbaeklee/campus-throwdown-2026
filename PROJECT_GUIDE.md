# 캠퍼스 스로우다운 2026 — 프로젝트 운영 가이드

## 핵심 링크

| 항목 | 주소 |
|------|------|
| 홈페이지 | https://campus-throwdown.netlify.app |
| 구글 시트 | https://docs.google.com/spreadsheets/d/12w5mm0mogb7-I0ulxb8TWju6divaL82ZWw-4IHOJ2jU |
| Apps Script | https://script.google.com |
| Netlify 대시보드 | https://app.netlify.com/projects/campus-throwdown |

---

## 대회 기본 정보

- **대회명**: 캠퍼스 스로우다운 2026
- **일정**: 2026년 9월 12일 ~ 13일
- **장소**: 서울 올림픽공원 체조경기장
- **모집**: 선착순 200명
- **참가비**: 개인전 30,000원 / 팀전 90,000원 (3인)
- **마감**: 2026년 8월 31일
- **주관**: 전국 대학생 크로스핏 연합회
- **문의**: crossfit2026@university.ac.kr
- **SNS**: @campus_throwdown2026

---

## 입금 계좌

- **은행**: 신한은행
- **계좌번호**: 110-367-511137
- **예금주**: 이도형
- **입금 기한**: 신청일로부터 7일 이내

---

## 시스템 구조

```
신청자 → 홈페이지 (Netlify) → Apps Script (Google) → 구글 시트
```

- **홈페이지**: 정적 HTML 1개 파일 (index.html)
- **백엔드**: Google Apps Script (서버리스)
- **데이터베이스**: Google Sheets
- **배포**: Netlify (무료)

---

## 구글 시트 컬럼 구조

| 열 | 항목 |
|----|------|
| A | 신청일시 |
| B | 참가유형 (개인전/팀전) |
| C | 이름 |
| D | 학교 |
| E | 연락처 |
| F | 이메일 |
| G | 부문 |
| H | 경력 |
| I | 팀명 |
| J | 팀원1 |
| K | 팀원2 |
| L | 영수증유형 |
| M | 현금영수증번호 |
| N | 사업자번호 |
| O | 상호명 |
| P | 세금계산서이메일 |

---

## 운영 절차

### 신청자 접수 흐름
1. 홈페이지에서 개인전/팀전 선택 후 신청서 작성
2. 신청 완료 → 계좌 안내 화면 표시
3. 7일 이내 참가비 입금
4. **재학증명서** 이메일 제출 (crossfit2026@university.ac.kr)
5. 입금 + 서류 확인 후 접수 최종 확정

### 관리자 확인 절차
1. 구글 시트에서 신청 내역 확인
2. 입금 확인 (신한은행 앱)
3. 재학증명서 이메일 확인
4. 영수증 신청자: 입금 확인 후 영업일 3일 이내 발급

---

## 홈페이지 수정 방법

### 내용 수정 (문구, 날짜 등)
1. `/Users/dohyeong/workspace/crossfit-registration/index.html` 수정
2. 터미널에서: `netlify deploy --prod --dir /Users/dohyeong/workspace/crossfit-registration`

### Apps Script 수정이 필요한 경우
1. `appsscript.gs` 수정
2. `cat appsscript.gs | pbcopy` (클립보드 복사)
3. script.google.com → 에디터 Cmd+A → Cmd+V → Cmd+S
4. 배포 → 배포 관리 → 연필 → 새 버전 → 배포
5. 새 URL을 index.html에 반영 후 Netlify 재배포

---

## 자주 쓰는 명령어

```bash
# Netlify 배포
netlify deploy --prod --dir /Users/dohyeong/workspace/crossfit-registration

# 신청 인원 확인
curl -sL "https://script.google.com/macros/s/AKfycbzJc_7kFKP5u5ZSsvAFQ_4Wu4D0l8xMlGG1s-1KaBAmtjuExxoDjz5wI2AYcse0rkK9/exec?action=count&callback=cb"

# 데이터 리셋 (테스트 후)
curl -sL "https://script.google.com/macros/s/AKfycbzJc_7kFKP5u5ZSsvAFQ_4Wu4D0l8xMlGG1s-1KaBAmtjuExxoDjz5wI2AYcse0rkK9/exec?action=reset&callback=cb"
```

---

## 현재 Apps Script URL

```
https://script.google.com/macros/s/AKfycbzJc_7kFKP5u5ZSsvAFQ_4Wu4D0l8xMlGG1s-1KaBAmtjuExxoDjz5wI2AYcse0rkK9/exec
```

---

## 주의사항

- 홍보 문구에 "국내 최대", "공식 인증" 등 확인되지 않은 표현 금지
- 환불 정책은 실제 운영 문서 확정 후 페이지에 추가 필요
- 개인정보 처리방침 실제 문서 연결 필요
- 대회 날짜/장소 변경 시 index.html과 agents/team.json 모두 수정
