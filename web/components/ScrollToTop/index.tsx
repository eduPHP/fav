import { useCallback, useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisible);
    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <button
        onClick={handleScrollToTop}
        type="button"
        className={`
         z-20 fixed text-white right-6 md:right-20 shadow-lg
         focus:outline-none focus:ring-gray-200 focus:ring-1
         bottom-8 bg-gray-500 rounded p-3 cursor-pointer
         transition hover:opacity-60
         ${visible ? 'opacity-40' : 'opacity-0'}
         `}
      >
        <svg
          className="fill-current w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 286.054 286.054"
        >
          <path d="M47.95 164.364c-7.625 12.837-1.386 23.34 13.856 23.34h36.526v80.453c0 9.887 8.01 17.896 17.878 17.896h53.635c9.869 0 17.878-8.009 17.878-17.896v-80.453h36.517c15.241 0 21.481-10.495 13.856-23.34l-81.212-83.233c-11.04-11.031-17.101-10.62-27.72 0-.002 0-81.214 83.233-81.214 83.233zM286.054 26.808v-8.939c0-9.878-8.01-17.869-17.878-17.869H17.878C8.01-.001 0 7.991 0 17.868v8.939c0 9.869 8.01 17.878 17.878 17.878h250.297c9.869.001 17.879-8.009 17.879-17.877z" />
        </svg>
      </button>
    </>
  );
}
