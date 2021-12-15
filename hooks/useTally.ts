import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import useSwr from "swr";
import { v4 as uuid } from "uuid";

export interface Tally {
  id: string;
  count: number;
  lastUpdate: Date;
}

export const useTally = (id: string | undefined) => {
  const { data: remoteTally } = useSwr<Tally>("api/tally/" + id, (uri) =>
    id ? fetch(uri).then((res) => res.json()) : Promise.reject()
  );
  const [tally, setTally] = useState<Tally>();
  const onReconnecting = useRef((error?: Error | undefined) => {});
  const onReconnected = useRef(() => {});
  const [pusher, setPusher] = useState<Pusher>();
  const clientId = useRef(uuid());

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
      channel.bind("update", (t: Tally & { clientId: string }) => {
        if (
          t.clientId !== clientId.current &&
          tally &&
          tally?.lastUpdate < t.lastUpdate
        ) {
          setTally(t);
        }
      });
    }
  }, [pusher, id, tally]);

  useEffect(() => {
    setTally(remoteTally);
  }, [remoteTally]);

  const increment = async () => {
    setTally((t) => t && { ...t, count: t.count + 1 });
    fetch(`api/tally/${id}/increment`, {
      method: "POST",
      body: JSON.stringify({ clientId: clientId.current }),
    });
  };

  const decrement = async () => {
    setTally((t) => t && { ...t, count: Math.max(0, t.count - 1) });
    fetch(`api/tally/${id}/decrement`, {
      method: "POST",
      body: JSON.stringify({ clientId: clientId.current }),
    });
  };

  const reset = async () => {
    setTally((t) => t && { ...t, count: 0 });
    fetch(`api/tally/${id}/reset`, {
      method: "POST",
      body: JSON.stringify({ clientId: clientId.current }),
    });
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
