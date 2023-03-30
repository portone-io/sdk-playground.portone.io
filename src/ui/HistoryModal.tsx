import { signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";
import { AppMode, appModeSignal } from "../state/app";

import {
  fields as v1CertFields,
  fieldSignals as v1CertFieldSignals,
} from "../state/v1-cert";
import {
  fields as v1PayFields,
  fieldSignals as v1PayFieldSignals,
} from "../state/v1-pay";
import {
  fields as v2PayFields,
  fieldSignals as v2PayFieldSignals,
} from "../state/v2-pay";

// expand 가 존재하고 하나가 열려있을때 다른 패널을닫혀야함.
import { HistoryField, HistoryItem, SaveMode } from "../state/saveHistory";
import Expand from "./Expand";
import { Fields, FieldSignals } from "../state/fields";

export const HistoryModalOpenSignal = signal(false);

function getFieldsAndSignals(mode: SaveMode): [Fields, FieldSignals] {
  if (mode === "v1-pay") {
    return [v1PayFields, v1PayFieldSignals];
  }

  if (mode === "v1-cert") {
    return [v1CertFields, v1CertFieldSignals];
  }

  if (mode === "v2-pay") {
    return [v2PayFields, v2PayFieldSignals];
  }

  return [v1PayFields, v1PayFieldSignals];
}

function apply(
  fields: Fields,
  targetFieldSignals: FieldSignals,
  historyField: HistoryField,
) {
  Object.entries(fields).forEach(([key, field]) => {
    if (
      field.input.type === "object" && typeof historyField[key]
          .value === "object"
    ) {
      const fieldSignals = targetFieldSignals[key].valueSignal
        .value as FieldSignals;

      const innerHistoryField: HistoryField = historyField[key]
        .value as HistoryField;

      targetFieldSignals[key].enabledSignal.value = historyField[key].enable;
      apply(field.input.fields, fieldSignals, innerHistoryField);
    } else {
      targetFieldSignals[key].enabledSignal.value = historyField[key]?.enable ||
        false;
      targetFieldSignals[key].valueSignal.value = historyField[key]?.value;
    }

    return;
  });
}

function fillInputs(historyItem: HistoryItem) {
  const mode = historyItem.mode;
  if (mode === "v1-pay") {
    appModeSignal.value = {
      sdkVersion: historyItem.sdkVersion,
      function: "pay",
    };
    apply(v1PayFields, v1PayFieldSignals, historyItem.fields);
  }

  if (mode === "v1-cert") {
    appModeSignal.value = {
      sdkVersion: historyItem.sdkVersion,
      function: "cert",
    } as AppMode;
    apply(v1CertFields, v1CertFieldSignals, historyItem.fields);
  }

  appModeSignal.value = {
    sdkVersion: "2.0.0",
    function: "pay",
  };
  apply(v2PayFields, v2PayFieldSignals, historyItem.fields);
}

const HistoryModal: React.FC = () => {
  const open = HistoryModalOpenSignal.value;
  const list = localStorage.getItem("history");
  const historyList: HistoryItem[] = list === null ? [] : JSON.parse(list);
  console.log(historyList);

  const onClickApplyHistory = (index: number) => {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      const historyItem = historyList[index];
      fillInputs(historyItem);
    };
  };

  const onClickExpand = () => {
    console.log("expand!");
  };

  return (
    <Modal
      open={open}
      title="입력 이력 불러오기"
      description="적용 하기 버튼을 클릭하면 해당 입력 이력을 불러와서 자동으로 채워줍니다."
      onClose={() => HistoryModalOpenSignal.value = false}
    >
      <div className="px-4 pb-4 h-full flex flex-col gap-2 overflow-y-scroll">
        {historyList.map((historyItem, index) => (
          <Expand
            title={historyItem.name}
            isOpen={true}
            onClickApply={onClickApplyHistory(index)}
            onClickExpand={onClickExpand}
          >
            <HistoryContent
              mode={historyItem.mode}
              historyFields={historyItem.fields}
            />
          </Expand>
        ))}
      </div>
    </Modal>
  );
};

export default HistoryModal;

export interface HistoryContentProps {
  mode: SaveMode;
  historyFields: HistoryField;
}

const HistoryContent: React.FC<HistoryContentProps> = (
  { mode, historyFields },
) => {
  const [fields, fieldSignals] = getFieldsAndSignals(mode);
  console.log(historyFields);

  return (
    <div>
      {historyFields && Object.entries(historyFields).map(
        ([key, field]) => {
          if (typeof field?.value === "object") {
            return <div>test</div>;
          }

          return <div>{fields[key].label} : {field?.value}</div>;
        },
      )}
      test
    </div>
  );
};
