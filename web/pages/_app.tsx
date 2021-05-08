import '../styles/globals.css';
import AppProvider from '../hooks';
import { Header } from '../components/Header';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className="relative h-screen text-gray-300 flex flex-col">
        <Header />
        <div className="container p-6 max-w-[50rem] mx-auto flex-1">
          <Component {...pageProps} />
        </div>
        <div className="w-full min-h-[4rem] mt-6 bg-green-800 flex items-center justify-center gap-1 text-sm">
          made with <span className="text-red-600">❤</span> by
          <Link href="https://rdo.blog.br">
            <a className="text-blue-300">edu@rdo</a>
          </Link>
        </div>
      </div>
    </AppProvider>
  );
}

export default MyApp;
