import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlertContainer = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return '#d4edda';
      case 'error': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'info': return '#d1ecf1';
      default: return '#d4edda';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'success': return '#c3e6cb';
      case 'error': return '#f5c6cb';
      case 'warning': return '#ffeaa7';
      case 'info': return '#bee5eb';
      default: return '#c3e6cb';
    }
  }};
  border-radius: 8px;
  padding: 16px 20px;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-in-out;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
`;

const IconContainer = styled.div`
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#155724';
    }
  }};
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const AlertTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#155724';
    }
  }};
  margin-bottom: 4px;
`;

const AlertMessage = styled.div`
  font-size: 13px;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#155724';
    }
  }};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => {
    switch (props.type) {
      case 'success': return '#155724';
      case 'error': return '#721c24';
      case 'warning': return '#856404';
      case 'info': return '#0c5460';
      default: return '#155724';
    }
  }};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info': return '#17a2b8';
      default: return '#28a745';
    }
  }};
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
  border-radius: 0 0 8px 8px;
`;

const CustomAlert = ({ 
  type = 'success', 
  title, 
  message, 
  duration = 5000, 
  onClose, 
  isVisible = true 
}) => {
  const [progress, setProgress] = useState(100);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + duration;

      const updateProgress = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const newProgress = (remaining / duration) * 100;
        
        if (newProgress <= 0) {
          handleClose();
        } else {
          setProgress(newProgress);
          requestAnimationFrame(updateProgress);
        }
      };

      requestAnimationFrame(updateProgress);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FaCheckCircle />;
      case 'error': return <FaExclamationCircle />;
      case 'warning': return <FaExclamationTriangle />;
      case 'info': return <FaInfoCircle />;
      default: return <FaCheckCircle />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      default: return 'Success';
    }
  };

  return (
    <AlertContainer type={type} isVisible={!isClosing}>
      <IconContainer type={type}>
        {getIcon()}
      </IconContainer>
      <ContentContainer>
        <AlertTitle type={type}>{getTitle()}</AlertTitle>
        <AlertMessage type={type}>{message}</AlertMessage>
      </ContentContainer>
      <CloseButton type={type} onClick={handleClose}>
        <FaTimes />
      </CloseButton>
      {duration > 0 && <ProgressBar type={type} progress={progress} />}
    </AlertContainer>
  );
};

// Alert Manager Component
const AlertManager = () => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    const id = Date.now() + Math.random();
    const newAlert = { ...alert, id };
    setAlerts(prev => [...prev, newAlert]);
    return id;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Expose methods globally
  if (typeof window !== 'undefined') {
    window.showAlert = addAlert;
    window.removeAlert = removeAlert;
  }

  return (
    <AlertOverlay>
      {alerts.map(alert => (
        <CustomAlert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </AlertOverlay>
  );
};

// Utility functions
export const showAlert = (type, message, title = null, duration = 5000) => {
  if (typeof window !== 'undefined' && window.showAlert) {
    return window.showAlert({ type, message, title, duration });
  }
};

export const showSuccess = (message, title = null, duration = 5000) => {
  return showAlert('success', message, title, duration);
};

export const showError = (message, title = null, duration = 5000) => {
  return showAlert('error', message, title, duration);
};

export const showWarning = (message, title = null, duration = 5000) => {
  return showAlert('warning', message, title, duration);
};

export const showInfo = (message, title = null, duration = 5000) => {
  return showAlert('info', message, title, duration);
};

export { AlertManager };
export default CustomAlert; 