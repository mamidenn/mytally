import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toasts } from "../components/Toasts";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Toasts>
      <Component {...pageProps} />
    </Toasts>
  );
}

export default MyApp;
