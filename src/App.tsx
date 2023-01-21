import * as React from "react";
import Header from "./Header";
import Control, { RequiredIndicator } from "./ui/Control";

const App: React.FC = () => {
  return (
    <div className="container px-4 mt-4 mb-80 m-auto flex flex-col">
      <Header />
      <p className="mb-4 text-xs text-slate-500">
        PG가 콘솔에서 테스트로 설정된 경우, 승인된 결제 건은 매일
        자정(23:00~23:50분 사이)에 자동으로 취소됩니다.<br />
        "<RequiredIndicator />" 표시는 필수입력 항목을 의미합니다.
      </p>
      <Control required label="가맹점 식별코드" code="userCode">
        <input className="border" type="text" />
      </Control>
    </div>
  );
};

export default App;
