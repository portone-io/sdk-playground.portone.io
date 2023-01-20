import * as React from "react";
import { SdkVersion, sdkVersions, sdkVersionSignal } from "./state/app";

const App: React.FC = () => {
  return (
    <div className="container mt-2 mb-80 m-auto">
      <h1 className="flex place-content-between">
        <span>PortOne 결제 테스트</span>
        <button>테스트!</button>
      </h1>
      <label>
        JS SDK 버전
        <select
          onChange={(e) => {
            const sdkVersion = e.target.value as SdkVersion;
            sdkVersionSignal.value = sdkVersion;
          }}
        >
          {sdkVersions.map((v) => (
            <option key={v} value={v} selected={v === sdkVersionSignal.value}>
              {v}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default App;
