import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import { useField } from '@unform/core';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Toggle: React.FC<Props> = ({ name, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>();
  const { fieldName, registerField, defaultValue = false } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref: HTMLInputElement) => {
        return ref.checked;
      },
      clearValue: (ref: HTMLInputElement) => {
        ref.checked = false;
      },
      setValue: (ref: HTMLInputElement, value: boolean) => {
        ref.checked = value;
      },
    });
  }, [defaultValue, fieldName, registerField]);

  return (
      <>
        <input
          defaultChecked={defaultValue}
          ref={ref => {
            inputRef.current = ref as HTMLInputElement;
          }}
          value="1"
          type="checkbox"
          id={fieldName}
          {...rest}
        />
      </>
  );
};

export default Toggle;
