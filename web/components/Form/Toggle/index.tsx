import React, {
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useField } from '@unform/core';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Toggle: React.FC<Props> = ({ name, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>();
  const { fieldName, registerField, defaultValue = false } = useField(name);
  const [checked, setChecked] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref: HTMLInputElement) => {
        return checked;
      },
      clearValue: (ref: HTMLInputElement) => {
        ref.checked = checked;
      },
      setValue: (ref: HTMLInputElement, value: boolean) => {
        ref.checked = checked;
        console.log(value);
      },
    });
  }, [defaultValue, fieldName, registerField, checked]);

  const toggleChecked = useCallback(() => {
    setChecked(!checked);
  }, [setChecked, inputRef, checked]);

  return (
    <div className="flex justify-between items-center">
      <div
        className={`w-14 h-8 flex items-center
           focus-within:ring-4 focus-within:ring-gray-400
           rounded-full p-1 duration-300 ease-in-out
           ${checked ? 'bg-green-500' : 'bg-gray-500'}
           `}
      >
        <div
          className={`bg-gray-600 w-6 h-6 rounded-full
           shadow-md transform duration-300 ease-in-out
           ${checked ? 'translate-x-6' : ''}
           `}
        />
        <input
          className="opacity-0"
          checked={checked}
          onChange={toggleChecked}
          ref={ref => {
            inputRef.current = ref as HTMLInputElement;
          }}
          value="1"
          type="checkbox"
          id={fieldName}
          {...rest}
        />
      </div>
    </div>
  );
};

export default Toggle;
