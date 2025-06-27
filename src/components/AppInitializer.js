import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from '../store/slices/authSlice';

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  const { isInitialized } = useSelector(state => state.masterData);

  useEffect(() => {
    // Initialize app when component mounts
    dispatch(initializeApp());
  }, [dispatch]);

  // Show loading while initializing
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid rgb(52, 152, 219)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', margin: 0 }}>Initializing application...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return children;
};

export default AppInitializer; 