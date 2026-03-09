import { useState } from 'react';

export const useModals = () => {
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  return {
    showDestinationModal,
    setShowDestinationModal,
    showConfirmationModal,
    setShowConfirmationModal,
    showPassengerModal,
    setShowPassengerModal,
    showDepartPicker,
    setShowDepartPicker,
    showReturnPicker,
    setShowReturnPicker
  };
};