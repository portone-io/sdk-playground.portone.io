# PortOne SDK 놀이터

주소: <https://sdk-playground.portone.io/>

PortOne의 JS SDK를 시험해볼 수 있는 놀이터입니다.

결제, 본인인증 등을 실행할 수 있습니다.

## 개발하기

### 준비물

- Node.js: <https://nodejs.org/en/>
- pnpm: <https://pnpm.io/>

### 개발 서버 실행하기

```sh
pnpm install
pnpm dev
```

### 배포하는 법

수정사항을 이 저장소의 `main` 브랜치에 병합하면 Vercel을 통해서 자동으로
프로덕션에 배포됩니다.

### 주의사항

- SDK 놀이터는 CDN에서 제공되는 포트원 SDK의 문서화되지 않은 API를 활용하거나,
  SDK의 일부분을 동적으로 패치하여 작동합니다.
  - v1.3.0과 v2.0.0 SDK의 경우, `IMP.deinit()` 메소드와 `slots` export를 사용합니다.
  - v1.3.0 미만 레거시 SDK의 경우, SDK의 빌드 결과물의 형태에 강하게 의존하는 [별도의 동적 패치 과정](https://github.com/portone-io/sdk-playground.portone.io/blob/74a0f999f045e1e104e9e3af219f0404dce182ac/src/state/v1.ts#L116-L155)을 거칩니다.
  - SDK에 위 사항에 대해 변경이 일어날 경우, SDK 놀이터에서도 변경사항에 대해 대응하여야 합니다.
