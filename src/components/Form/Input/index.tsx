import React, {
  useRef,
  useEffect,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import { useField } from '@unform/core';

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  focused?: boolean;
}

export default function Input({ name, focused, ...rest }: InputProps) {
  const inputRef = useRef(null);

  const {
    fieldName,
    defaultValue,
    registerField,
    error,
    clearError,
  } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
    if (focused) {
      inputRef.current.focus();
    }
  }, [fieldName, registerField, focused]);

  return (
    <>
      <input
        id={fieldName}
        ref={inputRef}
        onChange={clearError}
        defaultValue={defaultValue}
        {...rest}
        className={`
           ${rest.className}
           rounded px-4 py-4 w-full
           focus:outline-none
           focus:ring-4
           focus:ring-gray-400
           ${error ? 'bg-red-300 text-gray-600' : 'text-gray-100 bg-gray-500'}
       `}
      />
      {error && <span className="text-red-300 mt-1 block">{error}</span>}
    </>
  );
}
