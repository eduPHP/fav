import '../styles/globals.css';
import AppProvider from '../hooks';
import { Header } from '../components/Header';

function MyApp({ Component, pageProps }) {
  return <AppProvider>
    <Header />
    <div className="container p-6 max-w-[50rem] mx-auto">
      <Component {...pageProps} />
    </div>
  </AppProvider>;
}

export default MyApp;
