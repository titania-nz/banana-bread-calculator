import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BananaSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BananaSizeGuide: React.FC<BananaSizeGuideProps> = ({ isOpen, onClose }) => {
  // Handle escape key and body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 10000
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banana-guide-title"
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '448px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '24px', 
          borderBottom: '1px solid #f3f4f6' 
        }}>
          <h2 
            id="banana-guide-title" 
            style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#6F4E37',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🍌 Banana Size Guide
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close banana size guide"
            type="button"
          >
            <X style={{ width: '20px', height: '20px', color: '#6b7280' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 16px', 
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6F4E37', fontWeight: '500' }}>Small banana</span>
              <span style={{ fontWeight: '600', color: '#6F4E37' }}>80-100g</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 16px', 
              backgroundColor: 'rgba(255, 212, 92, 0.2)',
              borderRadius: '8px',
              border: '2px solid rgba(255, 212, 92, 0.3)',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6F4E37', fontWeight: '600' }}>Medium banana</span>
              <span style={{ fontWeight: 'bold', color: '#6F4E37' }}>120g (default)</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 16px', 
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ color: '#6F4E37', fontWeight: '500' }}>Large banana</span>
              <span style={{ fontWeight: '600', color: '#6F4E37' }}>140-160g</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '12px 16px', 
              borderRadius: '8px'
            }}>
              <span style={{ color: '#6F4E37', fontWeight: '500' }}>Extra large banana</span>
              <span style={{ fontWeight: '600', color: '#6F4E37' }}>180g+</span>
            </div>
          </div>

          {/* Tip */}
          <div style={{ 
            backgroundColor: '#fefce8', 
            borderRadius: '12px', 
            padding: '16px', 
            border: '1px solid #fde047',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>💡</span>
              <div>
                <h3 style={{ fontWeight: '600', color: '#6F4E37', fontSize: '14px', margin: '0 0 4px 0' }}>Tip</h3>
                <p style={{ fontSize: '14px', color: '#6F4E37', lineHeight: '1.5', margin: 0 }}>
                  Weigh your bananas for the most accurate recipe scaling. The calculator assumes 120g per banana by default.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              backgroundColor: '#FFD45C',
              color: '#6F4E37',
              fontWeight: '600',
              padding: '12px 16px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 212, 92, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFD45C';
            }}
            type="button"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};