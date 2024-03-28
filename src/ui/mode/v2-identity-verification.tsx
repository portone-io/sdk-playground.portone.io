import { signal, useSignal } from "@preact/signals";
import * as React from "react";
import { checkoutServerSignal, reset as resetV2 } from "../../state/v2";
import {
  codePreviewSignal,
  extraFields,
  extraFieldSignals,
  fields,
  fieldSignals,
  reset,
} from "../../state/v2-identity-verification";
import { RequiredIndicator } from "../Control";
import HtmlEditor from "../HtmlEditor";
import Reset from "./Reset";
import FieldControls from "../field/FieldControls";

const resetCountSignal = signal(0);
const resetFn = () => {
  resetV2();
  reset();
  ++resetCountSignal.value;
};

const View: React.FC = () => {
  const isJsonOpen = useSignal(false);
  return (
    <>
      <p className="mb-4 text-xs text-slate-500">
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
              <div className="flex flex-col gap-2">
                <label>
                  <div>Checkout API URL</div>
                  <input
                    type="text"
                    className="border w-full"
                    value={checkoutServerSignal.value}
                    onChange={(e) => {
                      checkoutServerSignal.value = e.currentTarget.value;
                    }}
                  />
                </label>
              </div>
            </details>
          </details>
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
