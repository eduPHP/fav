import { ButtonHTMLAttributes, ReactChildren } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button = ({ children, loading, ...rest }: ButtonProps) => {
  return (
    <button
      type="button"
      {...rest}
      disabled={loading}
      className={`
         rounded px-6 py-4 w-full text-gray-200
         focus:outline-none focus:ring-4 focus:ring-gray-400
         ${rest.className}
         ${loading && 'flex justify-center'}
     `}
    >
      {loading ? (
        <svg
          className={`w-6 h-6 fill-current animate-spin`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M493.815 70.629c-11.001-1.003-20.73 7.102-21.733 18.102l-2.65 29.069C424.473 47.194 346.429 0 256 0 158.719 0 72.988 55.522 30.43 138.854c-5.024 9.837-1.122 21.884 8.715 26.908 9.839 5.024 21.884 1.123 26.908-8.715C102.07 86.523 174.397 40 256 40c74.377 0 141.499 38.731 179.953 99.408l-28.517-20.367c-8.989-6.419-21.48-4.337-27.899 4.651-6.419 8.989-4.337 21.479 4.651 27.899l86.475 61.761c12.674 9.035 30.155.764 31.541-14.459l9.711-106.53c1.004-11.001-7.1-20.731-18.1-21.734zM472.855 346.238c-9.838-5.023-21.884-1.122-26.908 8.715C409.93 425.477 337.603 472 256 472c-74.377 0-141.499-38.731-179.953-99.408l28.517 20.367c8.989 6.419 21.479 4.337 27.899-4.651 6.419-8.989 4.337-21.479-4.651-27.899l-86.475-61.761c-12.519-8.944-30.141-.921-31.541 14.459L.085 419.637c-1.003 11 7.102 20.73 18.101 21.733 11.014 1.001 20.731-7.112 21.733-18.102l2.65-29.069C87.527 464.806 165.571 512 256 512c97.281 0 183.012-55.522 225.57-138.854 5.024-9.837 1.122-21.884-8.715-26.908z" />
        </svg>
      ) : (
        <>{children}</>
      )}
    </button>
  );
};

export default Button;
