import * as React from "react";

export interface ResetProps {
  resetFn: () => void;
}
const Reset: React.FC<ResetProps> = ({ resetFn }) => {
  const [checkPhase, setCheckPhase] = React.useState(false);
  const gotoCheckPhase = () => setCheckPhase(true);
  const gotoInitialPhase = () => setCheckPhase(false);
  const doReset = () => (resetFn(), gotoInitialPhase());
  return (
    <div className="text-sm">
      {checkPhase
        ? (
          <span className="inline-flex gap-2 px-2 py-1 rounded bg-red-100">
            <span className="text-red-600">입력된 내용을 전부 지울까요?</span>
            <button onClick={doReset}>✅</button>
            <button onClick={gotoInitialPhase}>❌</button>
          </span>
        )
        : (
          <button
            className="my-1 px-2 rounded font-bold text-red-100 bg-red-600"
            onClick={gotoCheckPhase}
          >
            초기화
          </button>
        )}
    </div>
  );
};
export default Reset;
