import React from 'react';

import { AuthProvider } from './auth';
import { ToastsProvider } from './toasts';

const AppProvider: React.FC = ({ children }) => (
  // <AuthProvider>
    <ToastsProvider>{children}</ToastsProvider>
  // </AuthProvider>
);

export default AppProvider;
