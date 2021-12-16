import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toasts } from "../components/Toasts";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Toasts>
      <div className="text-black bg-white dark:text-white dark:bg-black">
        <Component {...pageProps} />
      </div>
    </Toasts>
  );
}

export default MyApp;
