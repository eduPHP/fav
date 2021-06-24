import React, { createContext, useCallback, useContext, useState } from 'react';
import DialogModal from '@components/DialogModal';

export interface DialogMessage {
  type?: 'success' | 'danger' | 'info';
  title: string;
  description?: string;
  options?: {
    cancel?: string;
    confirm?: string;
  };
  action: CallableFunction;
}

interface DialogContextInterface {
  dialog: DialogMessage;
  showDialog(message: DialogMessage): void;
  closeDialog(): void;
}

const DialogContext = createContext<DialogContextInterface>(
  {} as DialogContextInterface,
);

export const DialogProvider: React.FC = ({ children }) => {
  const [dialog, setDialog] = useState<DialogMessage | null>(null);

  const showDialog = useCallback(
    ({ type, title, description, action, options = null }: DialogMessage) => {
      const newDialog = {
        type,
        title,
        description,
        options,
        action,
      };

      setDialog(newDialog);
    },
    [setDialog],
  );
  const closeDialog = useCallback(() => {
    setDialog(null);
  }, [setDialog]);

  return (
    <DialogContext.Provider value={{ dialog, showDialog, closeDialog }}>
      {children}
      {dialog && <DialogModal />}
    </DialogContext.Provider>
  );
};

export function useDialog() {
  return useContext(DialogContext);
}
