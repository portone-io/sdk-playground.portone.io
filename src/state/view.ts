import persisted, { prefix } from "./persisted";

const Tab = {
	parameter: "parameter",
	example: "example",
} as const;
export type Tab = (typeof Tab)[keyof typeof Tab];
export type TabDirection = "left" | "right";
type TabState = {
	[key in TabDirection]: Tab;
};

export const selectedTabSignal = persisted<TabState>(
	localStorage,
	`${prefix}.selectedTab`,
	{
		left: Tab.parameter,
		right: Tab.example,
	},
);
