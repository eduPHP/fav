import '../styles/globals.css';
import AppProvider from '../hooks';
import { Header } from '../components/Header';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className="relative h-screen text-gray-300">
        <Header />
        <div className="container p-6 max-w-[50rem] mx-auto">
          <Component {...pageProps} />
        </div>
      </div>
    </AppProvider>
  )
}

export default MyApp;
