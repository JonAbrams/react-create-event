import { useEffect } from "react";

export type RCEvent<T, R> = {
  readonly fire: (details: T) => R[];
  readonly useListen: (
    listener: (details: T) => R,
    dependencies?: any[]
  ) => void;
  readonly listen: (listener: (details: T) => R) => void;
  readonly unlisten: (listener: (details: T) => R) => void;
};

export function createEvent<T = void, R = void>(): RCEvent<T, R> {
  type Listener = (details: T) => R;
  const listeners = new Set<Listener>();

  const fire = (details: T): R[] => {
    return Array.from(listeners).map((listener) => listener(details));
  };

  function listen(listener: Listener) {
    listeners.add(listener);
  }

  function unlisten(listener: Listener) {
    listeners.delete(listener);
  }

  function useListen(listener: Listener, dependencies?: any[]) {
    useEffect(() => {
      listen(listener);
      return () => unlisten(listener);
    }, dependencies);
  }

  return { fire, useListen, listen, unlisten } as const;
}
