const Button = ({ children, ...rest }) => {
  return (
    <button
      type="button"
      {...rest}
      className={`
         rounded px-6 py-4 w-full text-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-500
         ${rest.className}
     `}
    >
      {children}
    </button>
  );
};

export default Button;
