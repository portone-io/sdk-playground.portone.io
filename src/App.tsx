import * as React from "react";
import Header from "./Header";
import { codePreviewSignal } from "./state/code-preview";
import {
  fields,
  fieldSignals,
  jsonTextSignal,
  jsonValueSignal,
  userCodeSignal,
} from "./state/v1x";
import Control, { RequiredIndicator } from "./ui/Control";
import HtmlEditor from "./ui/HtmlEditor";
import JsonEditor from "./ui/JsonEditor";
import Toggle from "./ui/Toggle";

const App: React.FC = () => {
  const parseJsonFailed = jsonValueSignal.value == null;
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
          <details>
            <summary
              className={`text-xs ${
                parseJsonFailed ? "text-red-700" : "text-slate-500"
              } cursor-pointer`}
            >
              추가 파라미터 (JSON{parseJsonFailed && " 파싱 실패"})
            </summary>
            <JsonEditor
              value="{}"
              onChange={(json) => jsonTextSignal.value = json}
            />
          </details>
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
          {Object.entries(fields).map(([key, field]) => {
            const { enabledSignal, valueSignal } = fieldSignals[key];
            return (
              <Control
                key={key}
                label={field.label}
                code={key}
                required={field.required}
                enabled={enabledSignal.value}
                onToggle={(value) => enabledSignal.value = value}
              >
                {field.input.type === "text"
                  ? (
                    <input
                      className="border"
                      type="text"
                      placeholder={field.input.placeholder}
                      value={valueSignal.value}
                      onChange={(e) => {
                        enabledSignal.value = true;
                        valueSignal.value = e.currentTarget.value;
                      }}
                    />
                  )
                  : field.input.type === "toggle"
                  ? (
                    <Toggle
                      value={valueSignal.value}
                      onToggle={(value) => {
                        enabledSignal.value = true;
                        valueSignal.value = value;
                      }}
                    />
                  )
                  : null}
              </Control>
            );
          })}
        </div>
        <div>
          <div
            className="md:sticky top-4 flex flex-col"
            style={{ height: "calc(100vh - 2rem)" }}
          >
            <h2 className="text-xs text-slate-500">연동 코드 예시</h2>
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
