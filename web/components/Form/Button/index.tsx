const Button = ({ children, ...rest }) => {
  return (
    <button
      type="button"
      {...rest}
      className={`
         rounded px-6 py-4 w-full
         ${rest.className}
     `}
    >
      {children}
    </button>
  );
};

export default Button;
