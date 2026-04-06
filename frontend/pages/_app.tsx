import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import '@/pages/globals.css';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>PropAI | AI-Powered Property Platform</title>
        <meta name="description" content="Find your dream home with the help of artificial intelligence." />
      </Head>
      <div className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          <Component {...pageProps} />
        </main>
        <ChatBot />
      </div>
    </>
  );
}
