import { useState, useCallback } from 'react';

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
    details: null,
    itemName: null,
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to proceed?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        variant: options.variant || 'danger',
        details: options.details || null,
        itemName: options.itemName || null,
        onConfirm: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  const showDeleteConfirm = useCallback((itemName, itemType = 'item') => {
    return showConfirm({
      title: `Delete ${itemType}`,
      message: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      itemName
    });
  }, [showConfirm]);

  const showUpdateConfirm = useCallback((itemName, itemType = 'item') => {
    return showConfirm({
      title: `Update ${itemType}`,
      message: `Are you sure you want to update this ${itemType}?`,
      confirmText: 'Update',
      cancelText: 'Cancel',
      variant: 'secondary',
      itemName
    });
  }, [showConfirm]);

  const closeConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    confirmState,
    showConfirm,
    showDeleteConfirm,
    showUpdateConfirm,
    closeConfirm
  };
}; 