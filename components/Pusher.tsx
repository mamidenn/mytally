import Push from "pusher-js";
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ToastContext } from "./Toasts";

interface ContextProps {
  pusher?: Push;
  socketId?: string;
}

export const Pusher: FC = (props) => {
  const [pusher, setPusher] = useState<Push>();
  const [socketId, setSocketId] = useState<string>();
  const { showToast, dismissToast } = useContext(ToastContext);
  const reconnectingToastId = useRef("");

  useEffect(() => {
    const pusher = new Push(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
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
    if (!pusher) return;
    pusher.connection.bind("connected", () => {
      dismissToast(reconnectingToastId.current);
      showToast({ children: "Reconnected!", duration: 5000 });
    });
    pusher.connection.bind("connecting", () => {
      reconnectingToastId.current = showToast({
        children: "Reconnecting...",
        type: "warning",
      });
    });
  }, [pusher, showToast, dismissToast]);

  return (
    <PusherContext.Provider
      value={{
        pusher,
        socketId,
      }}
    >
      {props.children}
    </PusherContext.Provider>
  );
};

export const PusherContext = createContext({} as ContextProps);
