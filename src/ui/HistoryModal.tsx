import { signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";
import { AppMode, appModeSignal } from "../state/app";

import {
  fields as v1CertFields,
  fieldSignals as v1CertFieldSignals,
  userCodeSignal as v1CertUserCodeSignal,
} from "../state/v1-cert";
import {
  fields as v1PayFields,
  fieldSignals as v1PayFieldSignals,
  userCodeSignal as v1PayUserCodeSignal,
} from "../state/v1-pay";
import {
  fields as v2PayFields,
  fieldSignals as v2PayFieldSignals,
} from "../state/v2-pay";

import { HistoryField, HistoryItem, LOCAL_STORAGE_HISTORY, SaveMode } from "../state/saveHistory";
import CollapseHistoryItem from "./CollapseHistoryItem";
import { Fields, FieldSignals } from "../state/fields";

function getFields(mode: SaveMode): Fields {
  if (mode === "v1-pay") {
    return v1PayFields;
  }

  if (mode === "v1-cert") {
    return v1CertFields;
  }
  return v2PayFields;
}

function applyHistoryFields(
  fields: Fields,
  targetFieldSignals: FieldSignals,
  historyField: HistoryField
) {
  Object.entries(fields).forEach(([key, field]) => {
    if (
      field.input.type === "object" &&
      typeof historyField[key].value === "object"
    ) {
      const fieldSignals = targetFieldSignals[key].valueSignal
        .value as FieldSignals;

      const innerHistoryField: HistoryField = historyField[key]
        .value as HistoryField;

      targetFieldSignals[key].enabledSignal.value = historyField[key].enable;
      applyHistoryFields(field.input.fields, fieldSignals, innerHistoryField);
    } else {
      targetFieldSignals[key].enabledSignal.value =
        historyField[key]?.enable || false;
      targetFieldSignals[key].valueSignal.value = historyField[key]?.value;
    }
    return;
  });
}

function fillInputs(historyItem: HistoryItem) {
  HistoryModalOpenSignal.value = false;
  const mode = historyItem.mode;
  if (mode === "v1-pay") {
    appModeSignal.value = {
      sdkVersion: historyItem.sdkVersion,
      fn: "v1-pay",
    };
    v1PayUserCodeSignal.value = historyItem.userCode || "";
    applyHistoryFields(v1PayFields, v1PayFieldSignals, historyItem.fields);
    return;
  }

  if (mode === "v1-cert") {
    appModeSignal.value = {
      sdkVersion: historyItem.sdkVersion,
      fn: "v1-cert",
    } 
    v1CertUserCodeSignal.value = historyItem.userCode || "";
    applyHistoryFields(v1CertFields, v1CertFieldSignals, historyItem.fields);
    return;
  }

  appModeSignal.value = {
    sdkVersion: "2.0.0",
    fn: "v1-pay",
  };
  applyHistoryFields(v2PayFields, v2PayFieldSignals, historyItem.fields);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export const HistoryModalOpenSignal = signal(false);
const expandItemIndex = signal(-1);

const HistoryModal: React.FC = () => {
  const open = HistoryModalOpenSignal.value;
  const list = localStorage.getItem(LOCAL_STORAGE_HISTORY);
  const historyList: HistoryItem[] = list === null ? [] : JSON.parse(list);

  const onClickApplyHistory = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const historyItem = historyList[index];
    fillInputs(historyItem);
  };

  const onClickExpand = (index: number) => {
    index === expandItemIndex.value
      ? (expandItemIndex.value = -1)
      : (expandItemIndex.value = index);
  };

  return (
    <Modal
      open={open}
      title="입력 이력 불러오기"
      description="적용 하기 버튼을 클릭하면 해당 입력 이력을 불러와서 자동으로 채워줍니다."
      onClose={() => (HistoryModalOpenSignal.value = false)}
    >
      <div className="px-4 pb-4 h-full flex flex-col gap-2 overflow-y-scroll">
        {historyList.map((historyItem, index) => (
          <CollapseHistoryItem
            title={historyItem.name}
            isOpen={expandItemIndex.value === index}
            onClickApply={(e) => onClickApplyHistory(e, index)}
            onClickExpand={() => onClickExpand(index)}
            date={formatDate(new Date(historyItem.createAt))}
            mode={historyItem.mode}
          >
            <HistoryContent mode={historyItem.mode} historyItem={historyItem} />
          </CollapseHistoryItem>
        ))}
      </div>
    </Modal>
  );
};

export default HistoryModal;

export interface HistoryContentProps {
  mode: SaveMode;
  historyItem: HistoryItem;
}

const HistoryContent: React.FC<HistoryContentProps> = ({
  mode,
  historyItem,
}) => {
  return (
    <div>
      {mode !== "v2-pay" && (
        <div className="ml-2">
          <span className="bg-gray-100 px-2 mr-1">가맹점 식별 코드 :</span>
          {historyItem.userCode}
        </div>
      )}
      <HistoryFieldItem
        mode={mode}
        historyField={historyItem.fields}
        fieldsForLabel={getFields(mode)}
      />
    </div>
  );
};

export interface HistoryFieldItemProps {
  mode: SaveMode;
  historyField: HistoryField;
  fieldsForLabel: Fields;
}

const HistoryFieldItem: React.FC<HistoryFieldItemProps> = ({
  mode,
  historyField,
  fieldsForLabel,
}) => {
  return (
    <div className="ml-2">
      {historyField &&
        Object.entries(historyField).map(([key, field]) => {
          const fieldForLabel = fieldsForLabel[key];

          if (
            fieldForLabel.input.type === "object" &&
            typeof field?.value === "object"
          ) {
            return (
              <div className="my-1">
                <span className="bg-gray-100 px-2 py-1 mr-1">
                  {fieldForLabel.label} :
                </span>
                <HistoryFieldItem
                  mode={mode}
                  historyField={field?.value}
                  fieldsForLabel={fieldForLabel.input.fields}
                />
              </div>
            );
          }
          return (
            <div className="my-1">
              <span className="bg-gray-100 px-2 mr-1">
                {fieldForLabel.label} :
              </span>
              {typeof field?.value !== "object" && field?.value}
            </div>
          );
        })}
    </div>
  );
};
