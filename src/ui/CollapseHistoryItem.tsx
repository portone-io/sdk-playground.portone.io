import { signal } from "@preact/signals";
import { SaveMode } from "../state/saveHistory";

export interface ExpandProps {
  isOpen?: boolean;
  onClickExpand?: () => void;
  onClickApply: (e: React.MouseEvent) => void;
  title?: string;
  mode: SaveMode;
  children?: React.ReactNode;
  date?: string;
}

const CollapseHistoryItem: React.FC<ExpandProps> = ({
  isOpen = false,
  onClickExpand,
  onClickApply,
  title,
  children,
  date,
  mode,
}) => {
  return (
    <div className="border-solid border-2 border-gray-100  rounded-sm">
      <div
        className=" flex items-center p-1 justify-between"
        onClick={onClickExpand}
      >
        <div>
          <span className="mr-2">{title}</span>
          <span className="text-xs text-gray-500 bg-red-100 p-1 rounded-md">
            {mode}
          </span>
        </div>
        <div className="sm:flex sm:flex-row sm:items-center flex flex-col-reverse">
          <span className="text-gray-400 text-xs mr-4">{date}</span>
          <button
            className="my-1 px-2 rounded font-bold text-red-100 bg-red-600"
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
