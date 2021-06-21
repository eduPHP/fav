import '../styles/globals.css';
import AppProvider from '../hooks';
import { Header } from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <div className="relative h-screen text-gray-300 flex flex-col">
        <Header />
        <div className="container p-6 max-w-[50rem] mx-auto flex-1">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default MyApp;
