# react-create-event

A simple library to send events between React components.

Features:

- Fire events from anywhere.
- Listen to events inside of components using the event's `useListen` hook.
- Supports TypeScript, but it is not required.
- Can create events that include details from the sender.
- Can create events that include results from listeners.

## Install

```
npm install react-create-event
```

## Usage (Basic Case)

Create the event, and and export it (it's recommended to create them in one file):

```ts
// File: events.ts | events.js
import { createEvent } from "react-create-event";

export const hitEvent = createEvent();
```

Fires the event:

```jsx
import { hitEvent } from "../events";

export function Hitter() {
  return <button onClick={() => hitEvent.fire()}>Hit</button>;
}
```

Listen for the event:

```jsx
import { hitEvent } from "../events";

export function HitCounter() {
  const [count, setCount] = useState(0);

  hitEvent.useListen(() => {
    setCount((c) => c + 1);
  });

  return <div>Count: {count}</div>;
}
```

## Usage (Advanced Case)

```ts
import { createEvent } from "react-create-event";

export interface Coordinates {
  x: number;
  y: number;
}

// First type is the "details" sent with each event.
// Second type is the return type, returned by each listener.
export const torpedoEvent = createEvent<Coordinates, boolean | void>();
```

Fire the event:

```jsx
import { torpedoEvent } from "../events";

export function TorpedoLauncher() {
  const [hitCount, setHitCount] = useState(0);
  const fireTorpedo = useCallback(() => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    const results = torpedoEvent.fire({ x, y });
    const hits = results.filter((r) => r).length;
    setHitCount((hC) => hC + hits);
  }, []);

  return <>
    <button onClick={fireTorpedo}>FIRE TORPEDO!</button>
    <div>Successful hits so far: {hitCount}</button>
  </>;
}
```

Listen for the event:

```jsx
import { torpedoEvent, type Coordinates } from "../events";

export function Ship({ x, y }: Coordinates) {
  const [hitCount, setHitCount] = useState(0);

  torpedoEvent.useListen(
    (details: Coordinates) => {
      if (details.x === x && details.y === y) {
        setHitCount((hC) => hC + 1);
        return true;
      }
    },
    [x, y] // hook dependencies
  );

  return <div>Times this ship was hit: {hitCount}</div>;
}
```

## Created by

Copyright [Jon Abrams (2024)](https://threads.net/@jon.abrams)
