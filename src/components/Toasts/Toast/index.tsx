import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { ToastMessage, useToast } from '@hooks/toasts';

interface ToastProps {
  toast: ToastMessage;
}

const icons = {
  info: <FiInfo className="mt-1 mr-3" size={36} />,
  error: <FiAlertCircle className="mt-1 mr-3" size={36} />,
  success: <FiCheckCircle className="mt-1 mr-3" size={36} />,
};
const toastTypeVariation = {
  info: 'bg-blue-200 text-blue-600',
  success: 'bg-green-200 text-green-600',
  error: 'bg-red-200 text-red-600',
};

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <div
      className={`${toastTypeVariation[toast.type]}
       w-96 p-4 pr-5 rounded shadow flex items-center relative
       transform transition ease-in-out duration-500
       `}
      key={toast.id}
    >
      {icons[toast.type || 'info']}
      <div className="flex-1">
        <strong>{toast.title}</strong>
        {toast.description && (
          <p
            className="mt-1 text-sm leading-6 opacity-80 border-0 bg-transparent"
            dangerouslySetInnerHTML={{ __html: toast.description }}
          />
        )}
      </div>
      <button
        className="absolute right-3 top-5 opacity-60"
        type="button"
        onClick={() => removeToast(toast.id)}
      >
        <FiXCircle size={18} />
      </button>
    </div>
  );
};

export default Toast;
