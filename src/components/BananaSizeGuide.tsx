import React from 'react';
import { X } from 'lucide-react';

interface BananaSizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BananaSizeGuide: React.FC<BananaSizeGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banana-guide-title"
    >
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="banana-guide-title" className="text-xl font-bold text-deep-brown">
            🍌 Banana Size Guide
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close banana size guide"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2">
            <span className="text-deep-brown">Small banana</span>
            <span className="font-medium text-deep-brown">80-100g</span>
          </div>
          
          <div className="flex justify-between items-center py-2 bg-banana-yellow bg-opacity-20 rounded-lg px-3">
            <span className="text-deep-brown font-medium">Medium banana</span>
            <span className="font-bold text-deep-brown">120g (default)</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-deep-brown">Large banana</span>
            <span className="font-medium text-deep-brown">140-160g</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-deep-brown">Extra large banana</span>
            <span className="font-medium text-deep-brown">180g+</span>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm text-deep-brown leading-relaxed">
                <strong>Tip:</strong> Weigh your bananas for the most accurate recipe scaling. The calculator assumes 120g per banana by default.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};