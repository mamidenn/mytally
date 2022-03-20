import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import useSwr, { useSWRConfig } from "swr";
import axios from "axios";

export interface Tally {
  id: string;
  count: number;
  lastUpdate: Date;
}

export const useTally = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { data: tally } = useSwr<Tally>(
    id ? "api/tally/" + id : null,
    async (uri) => (await axios.get(uri)).data
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

  const increment = () => {
    if (tally) {
      mutate("api/tally/" + id, { ...tally, count: tally.count + 1 }, false);
      axios.post(`api/tally/${id}/increment`, { socketId: socketId });
    }
  };

  const decrement = () => {
    if (tally && tally.count > 0) {
      mutate("api/tally/" + id, { ...tally, count: tally.count - 1 }, false);
      axios.post(`api/tally/${id}/decrement`, { socketId: socketId });
    }
  };

  const reset = () => {
    mutate("api/tally/" + id, { ...tally, count: 0 }, false);
    axios.post(`api/tally/${id}/reset`, { socketId: socketId });
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
