import type * as React from "react";
import Header from "./Header";
import { waitingSignal } from "./state/app";
import { pgUiModalOpenSignal } from "./state/v1-load-ui";
import Modal from "./ui/Modal";
import Mode from "./ui/mode/Mode";

const App: React.FC = () => {
  return (
    <div className="container px-4 my-4 m-auto flex flex-col">
      <Header />
      <Mode />
      <PgUiModal />
    </div>
  );
};
export default App;

const PgUiModal = () => {
  const open = pgUiModalOpenSignal.value;
  return (
    <Modal
      open={open}
      title="PG UI 영역"
      description="PG사 전용 UI가 여기에 그려집니다."
      onClose={() => {
        waitingSignal.value = false;
        pgUiModalOpenSignal.value = false;
      }}
    >
      <div className="p-4">
        <div className="portone-ui-container" />
      </div>
    </Modal>
  );
};
