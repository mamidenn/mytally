import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import useSwr, { useSWRConfig } from "swr";

export interface Tally {
  id: string;
  count: number;
  lastUpdate: Date;
}

export const useTally = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { data: tally } = useSwr<Tally>(id ? "api/tally/" + id : null, (uri) =>
    fetch(uri).then((res) => res.json())
  );
  const onReconnecting = useRef((error?: Error | undefined) => {});
  const onReconnected = useRef(() => {});
  const [pusher, setPusher] = useState<Pusher>();
  const [socketId, setSocketId] = useState<string>();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    pusher.connection.bind("connected", () => {
      setSocketId(pusher.connection.socket_id);
    });
    setPusher(pusher);

    return () => {
      pusher.disconnect();
    };
  }, []);

  useEffect(() => {
    if (pusher && id) {
      const channel = pusher.subscribe(`tally-${id}`);
      channel.bind("update", (t: Tally) => {
        if (tally && tally?.lastUpdate < t.lastUpdate) {
          mutate("api/tally/" + id, t, false);
        }
      });
    }
  }, [pusher, id, tally, mutate]);

  const increment = async () => {
    if (tally) {
      mutate("api/tally/" + id, { ...tally, count: tally.count + 1 }, false);
      fetch(`api/tally/${id}/increment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socketId: socketId }),
      });
    }
  };

  const decrement = async () => {
    if (tally && tally.count > 0) {
      mutate("api/tally/" + id, { ...tally, count: tally.count - 1 }, false);
      fetch(`api/tally/${id}/decrement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ socketId: socketId }),
      });
    }
  };

  const reset = async () => {
    mutate("api/tally/" + id, { ...tally, count: 0 }, false);
    fetch(`api/tally/${id}/reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socketId: socketId }),
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
