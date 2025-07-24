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

    // Trap focus within modal
    const modal = document.querySelector('[role="dialog"]');
    const focusableElements = modal?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);

    // Focus first element
    firstElement?.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        style={{ zIndex: 9998 }}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all duration-300 ease-out scale-100 opacity-100"
          role="dialog"
          aria-modal="true"
          aria-labelledby="banana-guide-title"
          aria-describedby="banana-guide-description"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <h2 
              id="banana-guide-title" 
              className="text-xl font-bold text-deep-brown flex items-center gap-2"
            >
              🍌 Banana Size Guide
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-banana-yellow focus:ring-offset-2 transition-colors duration-200"
              aria-label="Close banana size guide"
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <div 
              id="banana-guide-description" 
              className="space-y-1 mb-6"
            >
              <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <span className="text-deep-brown font-medium">Small banana</span>
                <span className="font-semibold text-deep-brown tabular-nums">80-100g</span>
              </div>
              
              <div className="flex justify-between items-center py-3 px-4 bg-banana-yellow/20 rounded-lg border-2 border-banana-yellow/30">
                <span className="text-deep-brown font-semibold">Medium banana</span>
                <span className="font-bold text-deep-brown tabular-nums">120g (default)</span>
              </div>
              
              <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <span className="text-deep-brown font-medium">Large banana</span>
                <span className="font-semibold text-deep-brown tabular-nums">140-160g</span>
              </div>
              
              <div className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                <span className="text-deep-brown font-medium">Extra large banana</span>
                <span className="font-semibold text-deep-brown tabular-nums">180g+</span>
              </div>
            </div>

            {/* Tip */}
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0" role="img" aria-label="Light bulb">💡</span>
                <div>
                  <h3 className="font-semibold text-deep-brown text-sm mb-1">Pro Tip</h3>
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
              className="w-full bg-banana-yellow hover:bg-banana-yellow/90 focus:bg-banana-yellow/90 text-deep-brown font-semibold py-3 px-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-banana-yellow focus:ring-offset-2"
              type="button"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};