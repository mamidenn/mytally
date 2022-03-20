import classNames from "classnames";
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { v4 as uuid } from "uuid";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const Toast: FC<ToastProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div
      className={classNames(
        "shadow-lg ring-1 ring-gray-900/5 flex bg-white dark:bg-gray-800 text-black dark:text-white mt-2 opacity-0 transition-opacity max-w-md",
        {
          "opacity-100": mounted,
        }
      )}
    >
      <div className="p-4">{props.children}</div>
      <div
        className={classNames("w-4", {
          "bg-green-500": props.type === "info" || props.type === undefined,
          "bg-orange-500": props.type === "warning",
          "bg-red-500": props.type === "error",
        })}
      ></div>
    </div>
  );
};

interface ToastProps {
  id?: string;
  duration?: number;
  children: ReactNode;
  type?: "info" | "warning" | "error";
}

interface ContextProps {
  showToast: (toast: ToastProps) => string;
  dismissToast: (id: string) => void;
}

export const Toasts: FC = (props) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    if (toasts.length > 0) {
      const addedToast = toasts[toasts.length - 1];
      const addedId = addedToast.id;
      if (addedToast.duration) {
        delay(addedToast.duration).then(() =>
          setToasts((toasts) => toasts.filter((t) => t.id !== addedId))
        );
      }
    }
  }, [toasts]);

  const showToast = useCallback((toast: ToastProps) => {
    const newToast = { ...toast, id: uuid() };
    setToasts((toasts) => [...toasts, newToast]);
    return newToast.id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      <ToastContext.Provider
        value={{
          showToast,
          dismissToast,
        }}
      >
        {props.children}
      </ToastContext.Provider>
      <div className="fixed bottom-0 right-0 m-4 z-50 flex flex-col items-end">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
      </div>
    </>
  );
};

export const ToastContext = createContext({} as ContextProps);
