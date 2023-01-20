import { signal } from "@preact/signals";

export type SdkVersion = (typeof sdkVersions)[number];
export const sdkVersions = [
  "1.1.7",
  "1.1.8",
  "1.2.0",
  "1.2.1",
] as const;
export const sdkVersionSignal = signal<SdkVersion>("1.1.7");
