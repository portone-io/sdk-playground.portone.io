import { Signal, signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";
import { appModeSignal } from "../state/app";
import {
  accountSignals as v1CertAccountSignals,
  fields as v1CertFields,
  fieldSignals as v1CertFieldSignals,
  jsonTextSignal as v1CertJsonTextSignal,
} from "../state/v1-cert";
import {
  accountSignals as v1PayAccountSignals,
  fields as v1PayFields,
  fieldSignals as v1PayFieldSignals,
  jsonTextSignal as v1PayJsonTextSignal,
} from "../state/v1-pay";
import {
  accountSignals as v1LoadUiAccountSignals,
  fields as v1LoadUiFields,
  fieldSignals as v1LoadUiFieldSignals,
  uiTypeSignal as v1LoadUiUiTypeSignal,
  jsonTextSignal as v1LoadUiJsonTextSignal,
} from "../state/v1-load-ui";
import {
  fields as v2PayFields,
  fieldSignals as v2PayFieldSignals,
  jsonTextSignal as v2PayJsonTextSignal,
} from "../state/v2-pay";
import {
  fields as v2IdentityVerificationFields,
  fieldSignals as v2IdentityVerificationFieldSignals,
  jsonTextSignal as v2IdentityVerificationJsonTextSignal,
} from "../state/v2-identity-verification";
import {
  fields as v2LoadPaymentUiFields,
  fieldSignals as v2LoadPaymentUiFieldSignals,
  jsonTextSignal as v2LoadPaymentUiJsonTextSignal,
} from "../state/v2-load-payment-ui";
import _trialData from "./trial.yaml";
import { Field, FieldSignal, FieldSignals, Fields } from "../state/fields";

interface TrialDataItem {
  label: string;
  icon: string;
  "v1-cert": {
    account: { userCode: string };
    field: Record<keyof typeof v1CertFields, any>;
  };
  "v1-pay": {
    account: { userCode: string };
    field: Record<keyof typeof v1PayFields, any>;
    case: Record<string, Record<keyof typeof v1PayFields, any>>;
  };
  "v1-load-ui": {
    account: { userCode: string };
    uiType: string;
    field: Record<keyof typeof v1LoadUiFields, any>;
  };
  "v2-pay": {
    field: Record<keyof typeof v2PayFields, any>;
    case: Record<string, Record<keyof typeof v2PayFields, any>>;
  };
  "v2-identity-verification": {
    field: Record<keyof typeof v2IdentityVerificationFields, any>;
  };
  "v2-load-payment-ui": {
    field: Record<keyof typeof v2LoadPaymentUiFields, any>;
  };
}
const trialData = _trialData as TrialDataItem[];

export const trialModalOpenSignal = signal(false);
export const trialVersionSignal = signal<"v1" | "v2">("v1");
const TrialModal: React.FC = () => {
  const open = trialModalOpenSignal.value;
  const trialVersion = trialVersionSignal.value;
  return (
    <Modal
      open={open}
      title={
        <div className="inline-flex items-center gap-2">
          체험하기
          <VersionToggle />
        </div>
      }
      description="원하는 항목을 선택하면 입력칸이 자동으로 채워집니다"
      onClose={() => trialModalOpenSignal.value = false}
    >
      {trialVersion === "v1" ? <V1Trials /> : <V2Trials />}
    </Modal>
  );
};

export default TrialModal;

function applyFieldsToSignals(
  fields: [string, any][],
  signals: FieldSignals,
  jsonTextSignal?: Signal<string>,
) {
  const json: Record<string, any> = {};
  for (const [field, value] of fields) {
    if (!signals[field]) {
      if (jsonTextSignal) json[field] = value;
      continue;
    }
    signals[field].enabledSignal.value = true;
    if (value != null && typeof value === "object") {
      applyFieldsToSignals(
        Object.entries(value),
        signals[field].valueSignal.value,
      );
    } else {
      signals[field].valueSignal.value = value;
    }
  }
  if (jsonTextSignal) jsonTextSignal.value = JSON.stringify(json, null, 2);
}

const V1Trials: React.FC = () => {
  return (
    <div className="px-4 pb-4 h-full flex flex-col gap-2 overflow-y-scroll">
      <Group>본인인증</Group>
      <div className="grid sm:grid-cols-2 gap-2">
        {trialData.filter((item) => "v1-cert" in item).map(
          (item, index) => (
            <CertPreset
              key={index}
              icon={item.icon}
              handler={() => {
                trialModalOpenSignal.value = false;
                appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-cert" };
                v1CertAccountSignals.userCodeSignal.value =
                  item["v1-cert"].account.userCode;
                v1CertFieldSignals.merchant_uid.valueSignal.value = v1CertFields
                  .merchant_uid.input.generate();
                const fields = Object.entries(item["v1-cert"].field);
                applyFieldsToSignals(
                  fields,
                  v1CertFieldSignals,
                );
              }}
            >
              {item.label}
            </CertPreset>
          ),
        )}
      </div>
      <Group>PG 제공 UI</Group>
      <div className="grid sm:grid-cols-2 gap-2">
        {trialData.filter((item) => "v1-load-ui" in item).map(
          (item, index) => (
            <LoadUiPreset
              key={index}
              icon={item.icon}
              handler={() => {
                trialModalOpenSignal.value = false;
                appModeSignal.value = {
                  sdkVersion: "1.3.0",
                  fn: "v1-load-ui",
                };
                v1LoadUiAccountSignals.userCodeSignal.value =
                  item["v1-load-ui"].account.userCode;
                v1LoadUiUiTypeSignal.value = item["v1-load-ui"].uiType;
                v1LoadUiFieldSignals.merchant_uid.valueSignal.value =
                  v1LoadUiFields.merchant_uid.input.generate();
                const fields = Object.entries(item["v1-load-ui"].field);
                applyFieldsToSignals(
                  fields,
                  v1LoadUiFieldSignals,
                  v1LoadUiJsonTextSignal,
                );
              }}
            >
              {item.label}
            </LoadUiPreset>
          ),
        )}
      </div>
      <Group>결제</Group>
      <div className="grid sm:grid-cols-2 gap-2">
        {trialData.filter((item) => "v1-pay" in item).map(
          (item, index) => (
            <PayPreset
              key={index}
              name={item.label}
              icon={item.icon}
              cases={Object.entries(item["v1-pay"].case).map((
                [label, caseFields],
              ) => ({
                label,
                handler() {
                  trialModalOpenSignal.value = false;
                  appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
                  v1PayAccountSignals.userCodeSignal.value =
                    item["v1-pay"].account.userCode;
                  v1PayFieldSignals.merchant_uid.valueSignal.value = v1PayFields
                    .merchant_uid.input.generate();
                  const fields = [
                    ...Object.entries(item["v1-pay"].field),
                    ...Object.entries(caseFields),
                  ];
                  applyFieldsToSignals(
                    fields,
                    v1PayFieldSignals,
                    v1PayJsonTextSignal,
                  );
                },
              }))}
            />
          ),
        )}
      </div>
    </div>
  );
};

const V2Trials: React.FC = () => {
  return (
    <div className="px-4 pb-4 h-full flex flex-col gap-2 overflow-y-scroll">
      <Group>PG 결제 UI</Group>
      <div className="grid sm:grid-cols-2 gap-2">
        {trialData.filter((item) => "v2-load-payment-ui" in item).map(
          (item, index) => (
            <LoadUiPreset
              key={index}
              icon={item.icon}
              handler={() => {
                trialModalOpenSignal.value = false;
                appModeSignal.value = {
                  sdkVersion: "2.0.0",
                  fn: "v2-load-payment-ui",
                };
                v2LoadPaymentUiFieldSignals.paymentId.valueSignal.value =
                  v2LoadPaymentUiFields.paymentId.input.generate();
                const fields = Object.entries(item["v2-load-payment-ui"].field);
                applyFieldsToSignals(
                  fields,
                  v2LoadPaymentUiFieldSignals,
                  v2LoadPaymentUiJsonTextSignal,
                );
              }}
            >
              {item.label}
            </LoadUiPreset>
          ),
        )}
      </div>
      <Group>결제</Group>
      <div className="grid sm:grid-cols-2 gap-2">
        {trialData.filter((item) => "v2-pay" in item).map(
          (item, index) => (
            <PayPreset
              key={index}
              name={item.label}
              icon={item.icon}
              cases={Object.entries(item["v2-pay"].case).map((
                [label, caseFields],
              ) => ({
                label,
                handler() {
                  trialModalOpenSignal.value = false;
                  appModeSignal.value = { sdkVersion: "2.0.0", fn: "v2-pay" };
                  v2PayFieldSignals.paymentId.valueSignal.value = v2PayFields
                    .paymentId.input.generate();
                  const fields = [
                    ...Object.entries(item["v2-pay"].field),
                    ...Object.entries(caseFields),
                  ];
                  applyFieldsToSignals(
                    fields,
                    v2PayFieldSignals,
                    v2PayJsonTextSignal,
                  );
                },
              }))}
            />
          ),
        )}
      </div>
    </div>
  );
};

const VersionToggle: React.FC = () => {
  const trialVersion = trialVersionSignal.value;
  const toggle = () => {
    trialVersionSignal.value = trialVersionSignal.value === "v1" ? "v2" : "v1";
  };
  const selected = "rounded-[4px] bg-orange-500 flex-1 text-white px-[12px]";
  const notSelected = "rounded-[4px] flex-1 px-[8px]";
  return (
    <div
      className="bg-slate-100 border-slate-300 leading-[2] text-[12px] text-slate-500 p-[1px] border inline-flex cursor-pointer select-none rounded-[6px] text-center font-bold"
      onClick={toggle}
    >
      <div className={trialVersion === "v1" ? selected : notSelected}>V1</div>
      <div className={trialVersion === "v2" ? selected : notSelected}>V2</div>
    </div>
  );
};

interface GrpupProps {
  children?: React.ReactNode;
}
const Group: React.FC<GrpupProps> = ({ children }) => {
  return <div className="sticky top-0 bg-white">{children}</div>;
};

interface SingularPresetProps {
  icon: string;
  children: React.ReactNode;
  buttonChildren: React.ReactNode;
  handler: () => void;
}
const SingularPreset: React.FC<SingularPresetProps> = (
  { icon, children, buttonChildren, handler },
) => {
  return (
    <div className="p-4 flex gap-2 items-center text-sm break-all rounded bg-slate-100">
      <img className="h-8" src={`/pg/${icon}.png`} />
      <span className="flex-1 text-lg">
        {children}
      </span>
      <button
        className="basis-1/2 flex gap-2 text-slate-800 text-[1.05rem] px-4 py-2 rounded bg-white shadow hover:translate-x-0.5 transition-transform cursor-pointer"
        onClick={handler}
      >
        {buttonChildren}
      </button>
    </div>
  );
};

interface CertPresetProps {
  icon: string;
  children: React.ReactNode;
  handler: () => void;
}
const CertPreset: React.FC<CertPresetProps> = (
  { icon, children, handler },
) => {
  return (
    <SingularPreset
      icon={icon}
      buttonChildren={<span>👤 본인인증</span>}
      handler={handler}
    >
      {children}
    </SingularPreset>
  );
};

interface LoadUiPresetProps {
  icon: string;
  children: React.ReactNode;
  handler: () => void;
}
const LoadUiPreset: React.FC<LoadUiPresetProps> = (
  { icon, children, handler },
) => {
  return (
    <SingularPreset
      icon={icon}
      buttonChildren={<span>⬇️ UI 불러오기</span>}
      handler={handler}
    >
      {children}
    </SingularPreset>
  );
};

interface PayPresetProps {
  name: string;
  icon: string;
  cases: {
    label: string;
    handler: () => void;
  }[];
}
const PayPreset: React.FC<PayPresetProps> = (
  { name, icon, cases },
) => {
  return (
    <div className="px-4 py-4 flex flex-col gap-4 items-stretch text-sm break-all rounded bg-slate-100">
      <div className="flex gap-2">
        <img className="h-8" src={`/pg/${icon}.png`} />
        <span className="text-lg">{name}</span>
      </div>
      <div className="flex flex-col items-stretch gap-1.5">
        {cases.map(({ label, handler }, i) => (
          <button
            key={i}
            className="flex gap-2 text-slate-800 text-[1.05rem] px-4 py-2 rounded bg-white shadow hover:translate-x-0.5 transition-transform cursor-pointer"
            onClick={handler}
          >
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
