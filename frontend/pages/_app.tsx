import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '@/pages/globals.css';
import Layout from '@/components/Layout';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>PropAI | AI-Powered Property Platform</title>
        <meta name="description" content="Find your dream home with the help of artificial intelligence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={inter.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}
