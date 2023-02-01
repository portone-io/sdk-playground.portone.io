import * as React from "react";
import { apiServerSignal, userCodeSignal } from "../../state/v1";
import {
  codePreviewSignal,
  fields,
  fieldSignals,
  jsonTextSignal,
  jsonValueSignal,
} from "../../state/v1-cert";
import Control, { RequiredIndicator } from "../../ui/Control";
import HtmlEditor from "../../ui/HtmlEditor";
import JsonEditor from "../../ui/JsonEditor";
import FieldControl from "../field/FieldControl";

const View: React.FC = () => {
  const parseJsonFailed = jsonValueSignal.value == null;
  return (
    <>
      <p className="mb-4 text-xs text-slate-500">
        "<RequiredIndicator />" 표시는 필수입력 항목을 의미합니다. 상황에 따라서
        필수입력 표시가 아니어도 입력이 필요할 수 있습니다.
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
              value={jsonTextSignal.value}
              onChange={(json) => jsonTextSignal.value = json}
            />
            <details className="open:py-2 opacity-0 hover:opacity-100 open:opacity-100 transition-all delay-100">
              <summary className="text-xs text-slate-500 cursor-pointer">
                포트원 내부 QA 전용 설정
              </summary>
              <label>
                <div>Core API URL</div>
                <input
                  type="text"
                  className="border w-full"
                  value={apiServerSignal.value}
                  onChange={(e) => {
                    apiServerSignal.value = e.currentTarget.value;
                  }}
                />
                <p className="text-xs text-red-700">
                  ⚠️ 올바르지 않은 주소를 입력하고 실행할 시 조용하게 실패합니다.
                  이 때는 페이지를 새로고침 해주세요.
                </p>
              </label>
            </details>
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
          {Object.entries(fields).map(([key, field]) => (
            <FieldControl
              key={key}
              code={key}
              field={field}
              fieldSignal={fieldSignals[key]}
            />
          ))}
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
    </>
  );
};

export default View;
