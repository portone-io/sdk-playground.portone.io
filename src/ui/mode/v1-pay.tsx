import { signal, useSignal } from "@preact/signals";
import * as React from "react";
import { reset as resetV1 } from "../../state/v1";
import {
  accountSignals,
  codePreviewSignal,
  extraFields,
  extraFieldSignals,
  fields,
  fieldSignals,
  reset,
} from "../../state/v1-pay";
import Control, { RequiredIndicator } from "../../ui/Control";
import HtmlEditor from "../../ui/HtmlEditor";
import Reset from "./Reset";
import { ForQa } from "./v1";
import FieldControls from "../field/FieldControls";

const resetCountSignal = signal(0);
const resetFn = () => {
  resetV1();
  reset();
  ++resetCountSignal.value;
};

const {
  userCodeSignal,
  tierCodeSignal,
  tierCodeEnabledSignal,
} = accountSignals;

const View: React.FC = () => {
  const isJsonOpen = useSignal(false);
  return (
    <>
      <p className="mb-4 text-xs text-slate-500">
        PG가 콘솔에서 테스트로 설정된 경우, 승인된 결제 건은 매일
        자정(23:00~23:50분 사이)에 자동으로 취소됩니다.<br />
        "<RequiredIndicator />" 표시는 필수입력 항목을 의미합니다. 상황에 따라서
        필수입력 표시가 아니어도 입력이 필요할 수 있습니다.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 md:pb-80">
          <Reset resetFn={resetFn} />
          <details open={isJsonOpen.value}>
            <summary
              className="text-xs text-slate-500 cursor-pointer"
            >
              추가 파라미터
            </summary>
            <FieldControls fields={extraFields.value} fieldSignals={extraFieldSignals.value} />
            <details className="open:py-2 opacity-0 hover:opacity-100 open:opacity-100 transition-all delay-100">
              <summary className="text-xs text-slate-500 cursor-pointer">
                포트원 내부 QA 전용 설정
              </summary>
              <ForQa />
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
          <Control
            label="하위가맹점(Tier) 코드"
            code="tierCode"
            enabled={tierCodeEnabledSignal.value}
            onToggle={(value) => tierCodeEnabledSignal.value = value}
          >
            <input
              className="border"
              type="text"
              placeholder="000"
              value={tierCodeSignal.value}
              onInput={(e) => {
                tierCodeEnabledSignal.value = true;
                tierCodeSignal.value = e.currentTarget.value;
              }}
            />
          </Control>
          <FieldControls fields={fields} fieldSignals={fieldSignals} />
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
