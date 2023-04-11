import { signal } from "@preact/signals";
import { SaveMode } from "../state/history";

export interface ExpandProps {
  isOpen?: boolean;
  onClickExpand?: () => void;
  onClickApply: (e: React.MouseEvent) => void;
  mode: SaveMode;
  children?: React.ReactNode;
  date?: string;
}

const CollapseHistoryItem: React.FC<ExpandProps> = ({
  isOpen = false,
  onClickExpand,
  onClickApply,
  children,
  date,
  mode,
}) => {
  return (
    <div className="border-solid border-2 border-gray-100  rounded-sm">
      <div
        className="flex items-center p-1 justify-between"
        onClick={onClickExpand}
      >
        <div>
          <span className="sm:p-1 text-xs text-gray-500 bg-red-100 px-1 rounded-md mr-4">
            {mode}
          </span>
          <span className="sm:my-3 text-gray-400  mr-1 text-xs">{date}</span>
        </div>
        <div className="sm:flex sm:flex-row sm:items-center">
          <button
            className="sm:text-base my-1 px-2 rounded text-red-100 font-bold bg-red-600 text-xs "
            onClick={onClickApply}
          >
            적용하기
          </button>
        </div>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default CollapseHistoryItem;
