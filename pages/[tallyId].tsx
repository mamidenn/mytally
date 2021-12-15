import {
  mdiAlertCircle,
  mdiDotsHorizontal,
  mdiExportVariant,
  mdiMinus,
  mdiPlus,
  mdiRotateLeft,
} from "@mdi/js";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTally } from "../hooks/useTally";
import TallyCounter from "../components/TallyCounter";
import Button from "../components/Button";
import Icon from "@mdi/react";
import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContext } from "../components/Toasts";

const Error: FC = () => {
  return (
    <>
      <Icon path={mdiAlertCircle} size={5} className="m-8 text-red-500" />
      Sorry, this Tally doesn&apos;t exist.
    </>
  );
};

const Tally: FC = () => {
  const router = useRouter();
  const tallyId = router.query.tallyId as string | undefined;
  const shareLink = `${process.env.NEXT_PUBLIC_PUBLIC_URL}${tallyId}`;
  const { tally, increment, decrement, reset, onReconnecting, onReconnected } =
    useTally(tallyId);
  const [advanced, setAdvanced] = useState(false);
  const { showToast, dismissToast } = useContext(ToastContext);
  const [disabled, setDisabled] = useState(false);
  const reconnectingToastId = useRef("");

  useEffect(() => {
    onReconnecting.current = () => {
      setDisabled(true);
      reconnectingToastId.current = showToast({
        children: "Reconnecting...",
        type: "warning",
      });
    };
    onReconnected.current = () => {
      setDisabled(false);
      dismissToast(reconnectingToastId.current);
      showToast({ children: "Reconnected!", duration: 5000 });
    };
  }, [showToast, dismissToast, onReconnected, onReconnecting]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow-xl ring-1 ring-gray-900/5 rounded-lg pb-12 pt-4 px-8 w-80">
        {tallyId && !tallyId.match("^[a-zA-Z0-9]{1,16}$") ? (
          <Error />
        ) : (
          <>
            <TallyCounter
              tally={tally?.count}
              disabled={disabled}
              onClick={increment}
              className="text-emerald-500"
            />
            <div className="flex items-center">
              <div className="flex relative">
                <Button
                  className={classNames(
                    "transition bg-emerald-500 text-white dark:text-black rounded-full absolute m-1",
                    {
                      "-translate-x-24": advanced,
                      "opacity-0": !advanced,
                    }
                  )}
                  size="md"
                  onClick={decrement}
                  disabled={disabled}
                >
                  <Icon path={mdiMinus} size={1.5} />
                </Button>
                <Button
                  className={classNames(
                    "transition bg-emerald-500 text-white dark:text-black rounded-full absolute m-1",
                    {
                      "-translate-x-12": advanced,
                      "opacity-0": !advanced,
                    }
                  )}
                  size="md"
                  onClick={reset}
                  disabled={disabled}
                >
                  <Icon path={mdiRotateLeft} size={1.5} />
                </Button>
                <Button
                  className="text-emerald-500 rounded-full z-10 m-1"
                  size="flat"
                  onClick={() => setAdvanced((advanced) => !advanced)}
                >
                  <Icon path={mdiDotsHorizontal} size={1.5} />
                </Button>
              </div>
              <Button
                className="bg-emerald-500 text-white dark:text-black rounded-full m-2"
                size="lg"
                onClick={() => {
                  increment();
                  setAdvanced(false);
                }}
                disabled={disabled}
              >
                <Icon path={mdiPlus} size={3} />
              </Button>
              <CopyToClipboard
                text={shareLink}
                onCopy={() => {
                  showToast({
                    children:
                      "I copied the link to this Tally to your clipboard. Go ahead and share it with your team.",
                    duration: 5000,
                  });
                }}
              >
                <Button
                  className="rounded-full m-1 text-emerald-500"
                  size="flat"
                >
                  <Icon path={mdiExportVariant} size={1.5} />
                </Button>
              </CopyToClipboard>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Tally;
