import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Fragment, useEffect} from "react";
import Header from '../components/Header';
import Background from "../components/Background";

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {

    // Service Worker
    if("serviceWorker" in navigator) {
      window.addEventListener("load", function() {
        navigator.serviceWorker.register("/sw.js").then(
            function(registration) {
              console.log("Service Worker registration success");
            },
            function (err) {
              console.log("Service Worker registration failed:", err);
            }
        )
      })
    }

  }, []);



  return <Fragment>
    <Background>
      <Header />
      <Component {...pageProps} />
    </Background>
  </Fragment>
}

export default MyApp
