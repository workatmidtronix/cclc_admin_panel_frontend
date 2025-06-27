import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExclamationTriangle, FaTimes, FaCheck, FaTimes as FaX } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ConfirmDialog = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
  animation: ${slideIn} 0.3s ease-out;
`;

const Header = styled.div`
  padding: 24px 30px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 15px;
  background: #fff5f5;
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fecaca;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Icon = styled(FaExclamationTriangle)`
  color: #dc2626;
  font-size: 20px;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const Body = styled.div`
  padding: 24px 30px;
`;

const Message = styled.p`
  margin: 0 0 20px 0;
  color: #374151;
  font-size: 15px;
  line-height: 1.5;
`;

const Details = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #1f2937;
  font-size: 14px;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 30px 24px;
  border-top: 1px solid #e9ecef;
  background: #f9fafb;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  
  ${props => props.variant === 'danger' ? `
    background: #dc2626;
    color: white;
    
    &:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  ` : props.variant === 'secondary' ? `
    background: #6b7280;
    color: white;
    
    &:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
    color: #6b7280;
  }
`;

const CustomConfirm = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  details = null,
  itemName = null
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay onClick={handleClose}>
      <ConfirmDialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <IconContainer>
            <Icon />
          </IconContainer>
          <HeaderContent>
            <Title>{title}</Title>
            <Subtitle>This action cannot be undone</Subtitle>
          </HeaderContent>
          <CloseButton onClick={handleClose}>
            <FaX size={16} />
          </CloseButton>
        </Header>
        
        <Body>
          <Message>{message}</Message>
          
          {details && (
            <Details>
              {Object.entries(details).map(([key, value]) => (
                <DetailItem key={key}>
                  <DetailLabel>{key}:</DetailLabel>
                  <DetailValue>{value}</DetailValue>
                </DetailItem>
              ))}
            </Details>
          )}
          
          {itemName && (
            <Details>
              <DetailItem>
                <DetailLabel>Item to delete:</DetailLabel>
                <DetailValue>{itemName}</DetailValue>
              </DetailItem>
            </Details>
          )}
        </Body>
        
        <ButtonGroup>
          <Button onClick={handleClose}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </ButtonGroup>
      </ConfirmDialog>
    </Overlay>
  );
};

// Utility function to show confirmation dialog
export const showConfirm = (options) => {
  return new Promise((resolve) => {
    const {
      title = 'Confirm Action',
      message = 'Are you sure you want to proceed?',
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'danger',
      details = null,
      itemName = null
    } = options;

    // Create a temporary div to render the component
    const div = document.createElement('div');
    document.body.appendChild(div);

    const handleClose = () => {
      document.body.removeChild(div);
      resolve(false);
    };

    const handleConfirm = () => {
      document.body.removeChild(div);
      resolve(true);
    };

    // Import React and render the component
    import('react').then((React) => {
      import('react-dom').then((ReactDOM) => {
        ReactDOM.render(
          React.createElement(CustomConfirm, {
            isOpen: true,
            onClose: handleClose,
            onConfirm: handleConfirm,
            title,
            message,
            confirmText,
            cancelText,
            variant,
            details,
            itemName
          }),
          div
        );
      });
    });
  });
};

// Specific confirmation functions
export const showDeleteConfirm = (itemName, itemType = 'item') => {
  return showConfirm({
    title: `Delete ${itemType}`,
    message: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'danger',
    itemName
  });
};

export const showUpdateConfirm = (itemName, itemType = 'item') => {
  return showConfirm({
    title: `Update ${itemType}`,
    message: `Are you sure you want to update this ${itemType}?`,
    confirmText: 'Update',
    cancelText: 'Cancel',
    variant: 'secondary',
    itemName
  });
};

export default CustomConfirm; 