import clsx from "clsx";
import type React from "react";

interface Tab {
	key: string;
	title: React.ReactNode;
	visible?: boolean;
	children: React.ReactNode;
}

interface TabProps {
	selectedTab: string;
	onSelect: (key: string) => void;
	tabs: Tab[];
}

export default function Tabs({ tabs, selectedTab, onSelect }: TabProps) {
	return (
		<div>
			<ul className="flex">
				{tabs.map((tab) => {
					if (tab.visible === false) {
						return;
					}

					const isSelected = tab.key === selectedTab;

					function onClick() {
						if (!isSelected) {
							onSelect(tab.key);
						}
					}

					return (
						<li
							key={tab.key}
							className={clsx(
								"border-r px-4 py-2 text-sm shrink text-ellipsis overflow-hidden whitespace-nowrap text-slate hover:bg-slate-100",
								{
									"bg-slate-100": isSelected,
									"cursor-pointer": !isSelected,
								},
							)}
							onClick={onClick}
							onKeyDown={onClick}
						>
							{tab.title}
						</li>
					);
				})}
			</ul>

			{tabs.map((tab) => {
				if (tab.visible === false) {
					return;
				}

				const isSelected = tab.key === selectedTab;

				return <div key={tab.key}>{isSelected && tab.children}</div>;
			})}
		</div>
	);
}
