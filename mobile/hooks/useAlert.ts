import { useState, useCallback } from 'react';
import { ReactNode } from 'react';

interface AlertConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'logout';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
  icon?: ReactNode;
}

export const useAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertConfig(config);
    setIsVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setAlertConfig(null), 200);
  }, []);

  const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'success',
      confirmText: 'Great!',
      onConfirm,
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'error',
      confirmText: 'Try Again',
      onConfirm,
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'warning',
      confirmText: 'Understood',
      onConfirm,
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, onConfirm?: () => void) => {
    showAlert({
      title,
      message,
      type: 'info',
      confirmText: 'Got it',
      onConfirm,
    });
  }, [showAlert]);

  const showLogout = useCallback((onConfirm?: () => void, onCancel?: () => void) => {
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout from your account?',
      type: 'logout',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm,
      onCancel,
    });
  }, [showAlert]);

  const showConfirmation = useCallback((
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    showAlert({
      title,
      message,
      type: 'warning',
      confirmText,
      cancelText,
      showCancel: true,
      onConfirm,
      onCancel,
    });
  }, [showAlert]);

  return {
    alertConfig,
    isVisible,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLogout,
    showConfirmation,
  };
};
