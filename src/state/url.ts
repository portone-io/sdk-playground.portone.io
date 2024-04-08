import { computed } from "@preact/signals";
import type { ReadonlySignal, Signal } from "@preact/signals";

export type UrlSignal = ReadonlySignal<URL | undefined>;
export function createUrlSignal(urlTextSignal: Signal<string>): UrlSignal {
  return computed(() => {
    const urlText = urlTextSignal.value;
    try {
      return new URL(urlText);
    } catch {
      return;
    }
  });
}
