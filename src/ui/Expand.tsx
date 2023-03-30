import { signal } from "@preact/signals";

// expand 가 존재하고 하나가 열려있을때 다른 패널을닫혀야함.
//적용 하기 버튼을 클릭 하면 해당 값의 인덱스에 있는 데이터를 가지고 적용을 해야함.

import { HistoryItem } from "../state/saveHistory";

export const HistoryModalOpenSignal = signal(false);

export interface ExpandProps {
  isOpen?: boolean;
  onClickExpand?: () => void;
  onClickApply: (e: React.MouseEvent) => void;
  title?: string;

  children?: React.ReactNode;
}

const Expand: React.FC<ExpandProps> = (
  { isOpen = false, onClickExpand, onClickApply, title, children },
) => {
  const open = HistoryModalOpenSignal.value;
  const list = localStorage.getItem("history");

  return (
    <div>
      <div className="flex justify-between" onClick={onClickExpand}>
        <div>
          <span>{title}</span>
        </div>
        <button
          onClick={onClickApply}
        >
          적용하기
        </button>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default Expand;
