import { signal } from "@preact/signals";

export const pgUiModalOpenSignal = signal(false);

export const pgUiModalUiTypeSignal = signal<string | null>(null);
