import React from 'react';
import { X } from 'lucide-react';

interface BananaSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BananaSizeModal: React.FC<BananaSizeModalProps> = ({ isOpen, onClose }) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banana-size-title"
    >
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="banana-size-title" className="text-xl font-bold text-deep-brown flex items-center gap-2">
            🍌 Banana Size Guide
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close banana size guide"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-deep-brown">Small banana</span>
              <span className="text-gray-600 font-mono text-sm">80-100g</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100 bg-soft-yellow -mx-6 px-6 rounded-lg">
              <span className="font-medium text-deep-brown">Medium banana</span>
              <span className="font-mono font-semibold text-deep-brown text-sm">120g (default)</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-deep-brown">Large banana</span>
              <span className="text-gray-600 font-mono text-sm">140-160g</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="font-medium text-deep-brown">Extra large banana</span>
              <span className="text-gray-600 font-mono text-sm">180g+</span>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="mt-6 p-4 bg-soft-yellow rounded-lg border border-banana-yellow">
            <p className="text-sm leading-relaxed text-deep-brown">
              <span className="font-semibold">💡 Tip:</span> Weigh your bananas for the most accurate recipe scaling. 
              The calculator assumes 120g per banana by default.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};