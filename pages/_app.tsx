import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toasts } from "../components/Toasts";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Toasts>
      <div className="text-black bg-gray-50 dark:text-white dark:bg-gray-900">
        <Component {...pageProps} />
      </div>
    </Toasts>
  );
}

export default MyApp;
