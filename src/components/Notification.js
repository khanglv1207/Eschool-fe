import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const Notification = ({ type, message, onClose, visible }) => {
  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationTriangle />;
      default:
        return null;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '16px',
      fontWeight: '600',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out',
      maxWidth: '400px',
      wordWrap: 'break-word'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white'
        };
      case 'error':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
          color: 'white'
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div style={getStyles()}>
      {getIcon()}
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          marginLeft: 'auto',
          padding: '0',
          fontSize: '16px',
          opacity: 0.8,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.8'}
      >
        <FaTimes />
      </button>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification; 