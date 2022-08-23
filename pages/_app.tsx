import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Fragment } from "react";
import Header from '../components/Header';
import Head from "next/head";
import { Box } from "@mui/material";
import { DefaultSeo } from "next-seo";
import Cloudn from "../public/OpenGraph.png";
import Cloudn_1600x630 from "../public/OpenGraph-1200x630.png";

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Fragment>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <DefaultSeo
          title="Cloudn"
          description="Your quickest way to check the weather."
          canonical="https://www.cloudn.vercel.app/"
          openGraph={{
            url: 'https://www.cloudn.vercel.app',
            title: 'Cloudn',
            description: 'Your quickest way to check the weather.',
            images: [
              {
                url: Cloudn_1600x630.src,
                width: 1200,
                height: 630,
                alt: 'Cloudn alt image',
                type: 'image/jpeg',
              },
              {
                url: Cloudn.src,
                width: 900,
                height: 800,
                alt: 'Cloudn alt image',
                type: 'image/jpeg',
              },
            ],
            site_name: 'Cloudn',
          }}
          additionalLinkTags={[
            {
              rel: 'icon',
              href: '/favicon.ico',
            },
            {
              rel: 'apple-touch-icon',
              href: '/touch-icon-ipad.jpg',
              sizes: '76x76'
            }
          ]}
        />
      </Head>
      <Box className="backdrop-blur-sm" sx={{ width: "100%", height: "100%", position: "absolute" }}></Box>
      <Header />
      <DeblurWrapper>
        <Component {...pageProps} />
      </DeblurWrapper>
    </Fragment>
  );
}

const BlurFilter = () => {
  return <Box className="backdrop-blur-sm" sx={{ width: "100%", height: "100%", position: "absolute" }} />;
}

const DeblurWrapper = (props: any) => {
  return (
    <Box className="backdrop-blur-none">
      {props.children}
    </Box>
  )
}

export default MyApp
