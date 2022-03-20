import { useContext, useEffect, useRef } from "react";
import useSwr, { useSWRConfig } from "swr";
import axios from "axios";
import { PusherContext } from "../components/Pusher";

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
  const { pusher, socketId } = useContext(PusherContext);

  useEffect(() => {
    if (!pusher) return;
    pusher.connection.bind("connected", onReconnected.current);
    pusher.connection.bind("connecting", onReconnecting.current);
  }, [pusher]);

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
