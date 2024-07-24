import persisted, { prefix } from "./persisted";

const Tab = {
	parameter: "parameter",
	example: "example",
} as const;
export type Tab = (typeof Tab)[keyof typeof Tab];

export const selectedTabSignal = persisted<Tab>(
	localStorage,
	`${prefix}.selectedTab`,
	"example",
);
