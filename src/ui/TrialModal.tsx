import { signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";

export const trialModalOpenSignal = signal(true);
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
          <PresetButton pg="inicis">이니시스</PresetButton>
          <PresetButton pg="danal">다날</PresetButton>
        </div>
        <Group>결제</Group>
        <div className="grid sm:grid-cols-2 gap-2">
          <PresetList
            pg="inicis"
            methods={[
              "card",
              "trans",
              "vbank",
              "phone",
              "cultureland",
            ]}
          />
          <PresetList
            pg="kcp"
            methods={[
              "card",
              "trans",
              "vbank",
              "phone",
              "cultureland",
            ]}
          />
          <PresetList
            pg="nice"
            methods={[
              "card",
              "trans",
              "vbank",
            ]}
          />
          <PresetList
            pg="kicc"
            methods={[
              "card",
              "trans",
              "vbank",
              "phone",
            ]}
          />
          <PresetList
            pg="danal"
            methods={[
              "card",
              "phone",
            ]}
          />
          <PresetList
            pg="settle"
            methods={[
              "card",
              "trans",
              "vbank",
              "phone",
            ]}
          />
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

type PayMethod =
  | "card"
  | "trans"
  | "vbank"
  | "phone"
  | "cultureland";

interface PresetButtonProps {
  pg: string;
  children: React.ReactNode;
}
const PresetButton: React.FC<PresetButtonProps> = (
  { pg, children },
) => {
  return (
    <div className="p-4 flex gap-2 items-center text-sm break-all rounded bg-slate-100">
      <img className="h-8" src={`/pg/${pg}.png`} />
      <span className="flex-1 text-lg">
        {children}
      </span>
      <button className="basis-1/2 flex gap-2 text-slate-800 text-[1.05rem] px-4 py-2 rounded bg-white shadow hover:translate-x-0.5 transition-transform cursor-pointer">
        <span>👤</span>
        <span>본인인증</span>
      </button>
    </div>
  );
};

const pgNames: Record<string, string> = {
  inicis: "이니시스",
  kcp: "KCP",
  nice: "나이스페이먼츠",
  kicc: "KICC",
  danal: "다날",
  settle: "헥토파이낸셜",
};

const payMethodEmojis: Record<PayMethod, string> = {
  card: "💳",
  trans: "🏧",
  vbank: "🏦",
  phone: "📱",
  cultureland: "💸",
};

const payMethodNames: Record<PayMethod, string> = {
  card: "카드결제",
  trans: "계좌이체",
  vbank: "가상계좌 이체",
  phone: "휴대폰 소액결제",
  cultureland: "문화상품권",
};

interface PresetListProps {
  pg: string;
  methods: PayMethod[];
}
const PresetList: React.FC<PresetListProps> = (
  { pg, methods },
) => {
  return (
    <div className="px-4 py-4 flex flex-col gap-4 items-stretch text-sm break-all rounded bg-slate-100">
      <div className="flex gap-2">
        <img className="h-8" src={`/pg/${pg}.png`} />
        <span className="text-lg">{pgNames[pg]}</span>
      </div>
      <div className="flex flex-col items-stretch gap-1.5">
        {methods.map((method) => (
          <button
            key={method}
            className="flex gap-2 text-slate-800 text-[1.05rem] px-4 py-2 rounded bg-white shadow hover:translate-x-0.5 transition-transform cursor-pointer"
          >
            <span>{payMethodEmojis[method]}</span>
            <span>{payMethodNames[method]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
