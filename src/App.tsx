import * as React from "react";
import Header from "./Header";
import { codePreviewSignal } from "./state/code-preview";
import {
  Field,
  fields,
  FieldSignal,
  fieldSignals,
  Input,
  IntegerInput,
  jsonTextSignal,
  jsonValueSignal,
  TextInput,
  ToggleInput,
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
    </div>
  );
};
export default App;

interface FieldControlProps {
  code: string;
  field: Field;
  fieldSignal: FieldSignal;
}
const FieldControl: React.FC<FieldControlProps> = (
  { code, field, fieldSignal },
) => {
  const { enabledSignal } = fieldSignal;
  const FieldInput = fieldInputComponents[field.input.type];
  return (
    <Control
      label={field.label}
      code={code}
      required={field.required}
      enabled={enabledSignal.value}
      onToggle={(value) => enabledSignal.value = value}
    >
      <FieldInput fieldInput={field.input} fieldSignal={fieldSignal} />
    </Control>
  );
};

interface FieldInputProps<TInput extends Input> {
  fieldInput: TInput;
  fieldSignal: FieldSignal;
}
const FieldInputText: React.FC<FieldInputProps<TextInput>> = ({
  fieldInput,
  fieldSignal,
}) => {
  const { enabledSignal, valueSignal } = fieldSignal;
  const { generate } = fieldInput;
  return (
    <>
      <input
        className="border"
        type="text"
        placeholder={fieldInput.placeholder}
        value={valueSignal.value}
        onChange={(e) => {
          enabledSignal.value = true;
          valueSignal.value = e.currentTarget.value;
        }}
      />
      {generate && (
        <button
          title="자동 생성"
          onClick={() => valueSignal.value = generate()}
        >
          🎲
        </button>
      )}
    </>
  );
};

const FieldInputInteger: React.FC<FieldInputProps<IntegerInput>> = ({
  fieldSignal,
}) => {
  const { enabledSignal, valueSignal } = fieldSignal;
  return (
    <input
      className="border"
      type="number"
      value={valueSignal.value}
      min={0}
      onChange={(e) => {
        enabledSignal.value = true;
        valueSignal.value = Number(e.currentTarget.value);
      }}
    />
  );
};

const FieldInputToggle: React.FC<FieldInputProps<ToggleInput>> = ({
  fieldSignal,
}) => {
  const { enabledSignal, valueSignal } = fieldSignal;
  return (
    <Toggle
      value={valueSignal.value}
      onToggle={(value) => {
        enabledSignal.value = true;
        valueSignal.value = value;
      }}
    />
  );
};

const fieldInputComponents: {
  [key in Input["type"]]: React.FC<FieldInputProps<any>>;
} = {
  text: FieldInputText,
  integer: FieldInputInteger,
  toggle: FieldInputToggle,
};
