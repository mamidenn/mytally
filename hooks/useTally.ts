import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import useSwr from "swr";

Pusher.logToConsole = true;

export interface Tally {
  id: string;
  count: number;
  lastUpdate: Date;
}

export const useTally = (id: string) => {
  const { data: remoteTally } = useSwr<Tally>(`api/tally/${id}`, (uri) =>
    fetch(uri).then((res) => res.json())
  );
  const [tally, setTally] = useState<Tally>();
  const onReconnecting = useRef((error?: Error | undefined) => {});
  const onReconnected = useRef(() => {});
  const [pusher, setPusher] = useState<Pusher>();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    setPusher(pusher);

    return () => {
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pusher && id) {
      const channel = pusher.subscribe(`tally-${id}`);
      channel.bind("update", (tally: Tally) => {
        setTally(tally);
      });
    }
  }, [pusher, id]);

  useEffect(() => {
    setTally(remoteTally);
  }, [remoteTally]);

  const increment = async () => {
    setTally((t) => t && { ...t, count: t.count + 1 });
    fetch(`api/tally/${id}/increment`, { method: "POST" });
  };

  const decrement = async () => {
    setTally((t) => t && { ...t, count: Math.max(0, t.count - 1) });
    fetch(`api/tally/${id}/decrement`, { method: "POST" });
  };

  const reset = async () => {
    setTally((t) => t && { ...t, count: 0 });
    fetch(`api/tally/${id}/reset`, { method: "POST" });
  };

  return {
    tally,
    increment,
    decrement,
    reset,
    onReconnecting,
    onReconnected,
  };
};
