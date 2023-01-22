import * as React from "react";
import Header from "./Header";
import { codePreviewSignal } from "./state/code-preview";
import {
  enabledFieldsSignal,
  escrowSignal,
  payMethodSignal,
  pgSignal,
  toggleEnableField,
  userCodeSignal,
} from "./state/v1x";
import Control, { RequiredIndicator } from "./ui/Control";
import HtmlEditor from "./ui/HtmlEditor";
import Toggle from "./ui/Toggle";

const App: React.FC = () => {
  const enabledFields = enabledFieldsSignal.value;
  return (
    <div className="container px-4 my-4 m-auto flex flex-col">
      <Header />
      <p className="mb-4 text-xs text-slate-500">
        PG가 콘솔에서 테스트로 설정된 경우, 승인된 결제 건은 매일
        자정(23:00~23:50분 사이)에 자동으로 취소됩니다.<br />
        "<RequiredIndicator />" 표시는 필수입력 항목을 의미합니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 md:pb-80">
          <Control
            required
            label="가맹점 식별코드"
            code="userCode"
          >
            <input
              className="border"
              type="text"
              placeholder="imp00000000"
              value={userCodeSignal.value}
              onInput={(e) => userCodeSignal.value = e.currentTarget.value}
            />
          </Control>
          <Control
            label="지원 PG사"
            code="pg"
            enabled={enabledFields.has("pg")}
            onToggle={() => toggleEnableField("pg")}
          >
            <input
              className="border"
              type="text"
              placeholder="html5_inicis"
              value={pgSignal.value}
              onChange={(e) => {
                toggleEnableField("pg", true);
                pgSignal.value = e.currentTarget.value;
              }}
            />
          </Control>
          <Control
            required
            label="결제 수단"
            code="pay_method"
          >
            <input
              className="border"
              type="text"
              placeholder="card"
              value={payMethodSignal.value}
              onChange={(e) => payMethodSignal.value = e.currentTarget.value}
            />
          </Control>
          <Control
            label="에스크로 여부"
            code="escrow"
            enabled={enabledFields.has("escrow")}
            onToggle={() => toggleEnableField("escrow")}
          >
            <Toggle
              value={escrowSignal.value}
              onToggle={(value) => {
                toggleEnableField("escrow", true);
                escrowSignal.value = value;
              }}
            />
          </Control>
        </div>
        <div>
          <div
            className="md:sticky top-4 flex flex-col"
            style={{ height: "calc(100vh - 2rem)" }}
          >
            <h2 className="text-sm">연동 코드 예시</h2>
            <div className="flex-1">
              <HtmlEditor
                className="h-full"
                readOnly
                value={codePreviewSignal.value}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
