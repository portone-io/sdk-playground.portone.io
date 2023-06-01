import { signal } from "@preact/signals";
import * as React from "react";
import Modal from "./Modal";
import { appModeSignal } from "../state/app";
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
  fields as v1LoadUiFields,
  fieldSignals as v1LoadUiFieldSignals,
  uiTypeSignal as v1LoadUiUiTypeSignal,
  userCodeSignal as v1LoadUiUserCodeSignal,
} from "../state/v1-load-ui";

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
          <CertPreset icon="inicis" handler={fillInicisCert}>
            이니시스
          </CertPreset>
        </div>
        <Group>PG 제공 UI</Group>
        <div className="grid sm:grid-cols-2 gap-2">
          <LoadUiPreset icon="paypal" handler={fillPaypalLoadUi}>
            페이팔 SPB
          </LoadUiPreset>
        </div>
        <Group>결제</Group>
        <div className="grid sm:grid-cols-2 gap-2">
          {payPresets.map((preset, index) => (
            <PayPreset key={index} {...preset} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default TrialModal;

function fillMerchantUid(mode: "v1-cert" | "v1-pay" | "v1-load-ui") {
  if (mode === "v1-cert") {
    v1CertFieldSignals.merchant_uid.valueSignal.value = v1CertFields
      .merchant_uid.input.generate();
  } else if (mode === "v1-pay") {
    v1PayFieldSignals.merchant_uid.valueSignal.value = v1PayFields
      .merchant_uid.input.generate();
  } else if (mode === "v1-load-ui") {
    v1LoadUiFieldSignals.merchant_uid.valueSignal.value = v1LoadUiFields
      .merchant_uid.input.generate();
  }
}

function fillInicisCert() {
  trialModalOpenSignal.value = false;
  appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-cert" };
  v1CertUserCodeSignal.value = "imp29272276";
  v1CertFieldSignals.pg.enabledSignal.value = true;
  v1CertFieldSignals.pg.valueSignal.value = "inicis_unified";
  fillMerchantUid("v1-cert");
}

function fillPaypalLoadUi() {
  trialModalOpenSignal.value = false;
  appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-load-ui" };
  v1LoadUiUserCodeSignal.value = "imp14397622";
  v1LoadUiUiTypeSignal.value = "paypal-spb";
  v1LoadUiFieldSignals.pg.enabledSignal.value = true;
  v1LoadUiFieldSignals.pg.valueSignal.value = "paypal_v2";
  v1LoadUiFieldSignals.pay_method.valueSignal.value = "paypal";
  v1LoadUiFieldSignals.name.enabledSignal.value = true;
  v1LoadUiFieldSignals.name.valueSignal.value = "테스트 결제";
  v1LoadUiFieldSignals.amount.valueSignal.value = 1;
  v1LoadUiFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
  fillMerchantUid("v1-load-ui");
}

interface PayPreset {
  name: string;
  icon: string;
  methods: PayMethod[];
  handler: (method: PayMethod) => void;
}
const payPresets = [
  {
    name: "이니시스",
    icon: "inicis",
    methods: [
      "card",
      "trans",
      "vbank",
      "phone",
      "cultureland",
      "smartculture",
      "happymoney",
      "booknlife",
    ],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "html5_inicis";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
        v1PayFieldSignals.buyer_email.enabledSignal.value = true;
        v1PayFieldSignals.buyer_email.valueSignal.value = "buyer@example.com";
      }
    },
  },
  {
    name: "KCP",
    icon: "kcp",
    methods: ["card", "trans", "vbank", "phone", "cultureland"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "kcp";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "나이스페이먼츠",
    icon: "nice",
    methods: ["card", "trans", "vbank"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "nice";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "KICC",
    icon: "kicc",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "kicc";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "다날",
    icon: "danal",
    methods: ["card", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      if (method === "card") {
        v1PayFieldSignals.pg.valueSignal.value = "danal_tpay";
      } else {
        v1PayFieldSignals.pg.valueSignal.value = "danal";
      }
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
  {
    name: "헥토파이낸셜",
    icon: "settle",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "settle";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "스마트로",
    icon: "smartro",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "smartro";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "블루월넛",
    icon: "bluewalnut",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "bluewalnut";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      v1PayFieldSignals.buyer_name.enabledSignal.value = true;
      v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
    },
  },
  {
    name: "KSNET",
    icon: "ksnet",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "ksnet";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      v1PayFieldSignals.buyer_name.enabledSignal.value = true;
      v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
    },
  },
  {
    name: "토스페이먼츠 (신)",
    icon: "toss",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "tosspayments";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "trans") {
        v1PayFieldSignals.buyer_email.enabledSignal.value = true;
        v1PayFieldSignals.buyer_email.valueSignal.value = "buyer@example.com";
      }
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "토스페이먼츠 (구)",
    icon: "toss",
    methods: ["card", "trans", "vbank", "phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "uplus";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "trans") {
        v1PayFieldSignals.buyer_email.enabledSignal.value = true;
        v1PayFieldSignals.buyer_email.valueSignal.value = "buyer@example.com";
      }
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "키움페이",
    icon: "daou",
    methods: ["card", "trans", "vbank"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "daou";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      if (method === "vbank") {
        v1PayFieldSignals.buyer_name.enabledSignal.value = true;
        v1PayFieldSignals.buyer_name.valueSignal.value = "포트원";
      }
    },
  },
  {
    name: "모빌리언스",
    icon: "inicis",
    methods: ["phone"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "mobilians";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
  {
    name: "엑심베이",
    icon: "eximbay",
    methods: ["card"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "eximbay";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
  {
    name: "페이먼트월",
    icon: "paymentwall",
    methods: ["card"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "paymentwall";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 1000;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
      v1PayFieldSignals.buyer_email.enabledSignal.value = true;
      v1PayFieldSignals.buyer_email.valueSignal.value = "buyer@example.com";
    },
  },
  {
    name: "카카오페이",
    icon: "kakao",
    methods: ["card"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "kakaopay";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
  {
    name: "토스페이",
    icon: "toss",
    methods: ["card"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "tosspay";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
  {
    name: "페이코",
    icon: "payco",
    methods: ["card"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "payco";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
  {
    name: "스마일페이",
    icon: "smilepay",
    methods: ["card"],
    handler(method) {
      trialModalOpenSignal.value = false;
      appModeSignal.value = { sdkVersion: "1.3.0", fn: "v1-pay" };
      v1PayUserCodeSignal.value = "imp14397622";
      v1PayFieldSignals.pg.enabledSignal.value = true;
      v1PayFieldSignals.pg.valueSignal.value = "smilepay";
      v1PayFieldSignals.pay_method.valueSignal.value = method;
      fillMerchantUid("v1-pay");
      v1PayFieldSignals.name.enabledSignal.value = true;
      v1PayFieldSignals.name.valueSignal.value = "테스트 결제";
      v1PayFieldSignals.amount.valueSignal.value = 100;
      v1PayFieldSignals.buyer_tel.valueSignal.value = "010-0000-0000";
    },
  },
] satisfies PayPreset[];

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
      buttonChildren={
        <>
          <span>👤</span>
          <span>본인인증</span>
        </>
      }
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
      buttonChildren={
        <>
          <span>⬇️</span>
          <span>UI 불러오기</span>
        </>
      }
      handler={handler}
    >
      {children}
    </SingularPreset>
  );
};

type PayMethod =
  | "card"
  | "trans"
  | "vbank"
  | "phone"
  | "cultureland"
  | "smartculture"
  | "happymoney"
  | "booknlife";

interface PayPresetProps {
  name: string;
  icon: string;
  methods: PayMethod[];
  handler: (method: PayMethod) => void;
}
const PayPreset: React.FC<PayPresetProps> = (
  { name, icon, methods, handler },
) => {
  return (
    <div className="px-4 py-4 flex flex-col gap-4 items-stretch text-sm break-all rounded bg-slate-100">
      <div className="flex gap-2">
        <img className="h-8" src={`/pg/${icon}.png`} />
        <span className="text-lg">{name}</span>
      </div>
      <div className="flex flex-col items-stretch gap-1.5">
        {methods.map((method) => (
          <button
            key={method}
            className="flex gap-2 text-slate-800 text-[1.05rem] px-4 py-2 rounded bg-white shadow hover:translate-x-0.5 transition-transform cursor-pointer"
            onClick={() => handler(method)}
          >
            <span>{payMethodEmojis[method]}</span>
            <span>{payMethodNames[method]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const payMethodEmojis: Record<PayMethod, string> = {
  card: "💳",
  trans: "🏧",
  vbank: "🏦",
  phone: "📱",
  cultureland: "💸",
  smartculture: "💸",
  happymoney: "💸",
  booknlife: "💸",
};

const payMethodNames: Record<PayMethod, string> = {
  card: "카드결제",
  trans: "계좌이체",
  vbank: "가상계좌 이체",
  phone: "휴대폰 소액결제",
  cultureland: "문화상품권",
  smartculture: "스마트문상",
  happymoney: "해피머니",
  booknlife: "도서문화상품권",
};
