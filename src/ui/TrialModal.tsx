import { signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";
import { appModeSignal } from "../state/app";
import {
  accountSignals as v1CertAccountSignals,
  fields as v1CertFields,
  fieldSignals as v1CertFieldSignals,
} from "../state/v1-cert";
import {
  accountSignals as v1PayAccountSignals,
  fields as v1PayFields,
  fieldSignals as v1PayFieldSignals,
} from "../state/v1-pay";
import {
  accountSignals as v1LoadUiAccountSignals,
  fields as v1LoadUiFields,
  fieldSignals as v1LoadUiFieldSignals,
  uiTypeSignal as v1LoadUiUiTypeSignal,
} from "../state/v1-load-ui";
import _trialData from "./trial.yaml";

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
}
const trialData = _trialData as TrialDataItem[];

export const trialModalOpenSignal = signal(false);
const TrialModal: React.FC = () => {
  const open = trialModalOpenSignal.value;
  return (
    <Modal
      open={open}
      title="체험하기"
      description="원하는 항목을 선택하면 입력칸이 자동으로 채워집니다"
      onClose={() => trialModalOpenSignal.value = false}
    >
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
                  v1CertFieldSignals.merchant_uid.valueSignal.value =
                    v1CertFields.merchant_uid.input.generate();
                  const fields = Object.entries(item["v1-cert"].field);
                  for (const [field, value] of fields) {
                    v1CertFieldSignals[field].enabledSignal.value = true;
                    v1CertFieldSignals[field].valueSignal.value = value;
                  }
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
                  for (const [field, value] of fields) {
                    v1LoadUiFieldSignals[field].enabledSignal.value = true;
                    v1LoadUiFieldSignals[field].valueSignal.value = value;
                  }
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
                    v1PayFieldSignals.merchant_uid.valueSignal.value =
                      v1PayFields.merchant_uid.input.generate();
                    const fields = [
                      ...Object.entries(item["v1-pay"].field),
                      ...Object.entries(caseFields),
                    ];
                    for (const [field, value] of fields) {
                      v1PayFieldSignals[field].enabledSignal.value = true;
                      v1PayFieldSignals[field].valueSignal.value = value;
                    }
                  },
                }))}
              />
            ),
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TrialModal;

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
