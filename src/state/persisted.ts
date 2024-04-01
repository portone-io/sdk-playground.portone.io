import { effect, Signal, signal } from "@preact/signals";

// sp는 sdk-playground의 이니셜
// 하위호환 깰 때마다 숫자 1씩 올리기
export const prefix = "sp0";

const disposeFnMap = new Map<string, () => void>();
const registry = new FinalizationRegistry<string>((key) => {
  disposeFnMap.get(key)?.();
  disposeFnMap.delete(key);
});

export default function persisted<T>(
  storage: Storage,
  key: string,
  value: T,
): Signal<T> {
  const item = storage.getItem(key);
  const s = signal(item == null ? value : JSON.parse(item));
  const disposeFn = effect(() => {
    const value = s.value;
    storage.setItem(key, JSON.stringify(value));
  });
  disposeFnMap.set(key, disposeFn);
  registry.register(s, key);
  return s;
}
