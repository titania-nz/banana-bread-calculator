import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BananaSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BananaSizeGuide: React.FC<BananaSizeGuideProps> = ({ isOpen, onClose }) => {
  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = originalStyle;
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
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        zIndex: 10000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banana-guide-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 
            id="banana-guide-title" 
            className="text-xl font-bold text-deep-brown flex items-center gap-2"
          >
            🍌 Banana Size Guide
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-banana-yellow focus:ring-offset-2"
            aria-label="Close banana size guide"
            type="button"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
              <span className="text-deep-brown font-medium">Small banana</span>
              <span className="font-semibold text-deep-brown">80-100g</span>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 bg-banana-yellow/20 rounded-lg border-2 border-banana-yellow/30">
              <span className="text-deep-brown font-semibold">Medium banana</span>
              <span className="font-bold text-deep-brown">120g (default)</span>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
              <span className="text-deep-brown font-medium">Large banana</span>
              <span className="font-semibold text-deep-brown">140-160g</span>
            </div>
            
            <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
              <span className="text-deep-brown font-medium">Extra large banana</span>
              <span className="font-semibold text-deep-brown">180g+</span>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <h3 className="font-semibold text-deep-brown text-sm mb-1">Tip</h3>
                <p className="text-sm text-deep-brown leading-relaxed">
                  Weigh your bananas for the most accurate recipe scaling. The calculator assumes 120g per banana by default.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full bg-banana-yellow hover:bg-banana-yellow/90 text-deep-brown font-semibold py-3 px-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-banana-yellow focus:ring-offset-2"
            type="button"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};