import React from 'react';

import { ToastsProvider } from './toasts';
import { DialogProvider } from './dialog';

const AppProvider: React.FC = ({ children }) => (
  <DialogProvider>
    <ToastsProvider>
      {children}
    </ToastsProvider>
  </DialogProvider>
);

export default AppProvider;
