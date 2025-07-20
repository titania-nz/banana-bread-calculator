import React from 'react';
import { Lightbulb } from 'lucide-react';

export const ProTip: React.FC = () => {
  return (
    <div className="bg-yellow-100 rounded-2xl border border-yellow-200 p-4 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <span className="text-sm">💡</span>
        </div>
        <div>
          <h4 className="font-medium text-deep-brown mb-1 text-sm">Pro Tip</h4>
          <p className="text-xs text-deep-brown leading-relaxed font-light">
            The more brown spots on your bananas, the sweeter your bread will be! Try mixing different add-ins for unique flavor combinations.
          </p>
        </div>
      </div>
    </div>
  );
};