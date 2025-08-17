import React, { createContext, useContext, ReactNode } from 'react';
import CustomAlert from './CustomAlert';
import { useAlert } from '../hooks/useAlert';

interface AlertContextType {
  showAlert: (config: any) => void;
  hideAlert: () => void;
  showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
  showError: (title: string, message: string, onConfirm?: () => void) => void;
  showWarning: (title: string, message: string, onConfirm?: () => void) => void;
  showInfo: (title: string, message: string, onConfirm?: () => void) => void;
  showLogout: (onConfirm?: () => void, onCancel?: () => void) => void;
  showConfirmation: (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
  theme?: 'dark' | 'light';
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children, theme = 'dark' }) => {
  const alertMethods = useAlert();

  return (
    <AlertContext.Provider value={alertMethods}>
      {children}
      {alertMethods.alertConfig && (
        <CustomAlert
          visible={alertMethods.isVisible}
          onClose={alertMethods.hideAlert}
          theme={theme}
          {...alertMethods.alertConfig}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};
