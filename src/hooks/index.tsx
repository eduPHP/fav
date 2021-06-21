import React from 'react';

import { ToastsProvider } from './toasts';
import { DialogProvider } from './dialog';
import { AuthProvider } from './auth';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <DialogProvider>
      <ToastsProvider>{children}</ToastsProvider>
    </DialogProvider>
  </AuthProvider>
);

export default AppProvider;
