import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {Fragment} from "react";
import Header from '../components/Header';
import Background from "../components/Background";

function MyApp({ Component, pageProps }: AppProps) {
  return <Fragment>
    <Background>
      <Header />
      <Component {...pageProps} />
    </Background>
  </Fragment>
}

export default MyApp
