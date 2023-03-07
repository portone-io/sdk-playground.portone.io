import { signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";

export const trialModalOpenSignal = signal(false);
const TrialModal: React.FC = () => {
  const open = trialModalOpenSignal.value;
  return (
    <Modal open={open} title="체험하기">
      <PresetButton pg="inicis">KG 이니시스</PresetButton>
      <PresetButton pg="kakao">카카오페이</PresetButton>
      <PresetButton pg="kcp">KCP</PresetButton>
      <PresetButton pg="danal">다날</PresetButton>
    </Modal>
  );
};

export default TrialModal;

interface PresetButtonProps {
  pg: string;
  children?: React.ReactNode;
}
const PresetButton: React.FC<PresetButtonProps> = ({ pg, children }) => {
  return (
    <button className="p-2 flex flex-col gap-2 items-center justify-center text-sm break-all rounded bg-slate-100">
      <img src={`/pg/${pg}.png`} />
      {children}
    </button>
  );
};
