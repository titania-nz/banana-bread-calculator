import React from 'react';

interface BakingInfoProps {
  bakingInfo: {
    panSize: string;
    temp: string;
    time: string;
    batterWeight: string;
  };
}

export const BakingInfo: React.FC<BakingInfoProps> = ({ bakingInfo }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-base font-bold text-deep-brown mb-4">Baking Info</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
          <span className="text-muted-foreground text-sm">Pan size</span>
          <span className="font-medium text-deep-brown text-sm">{bakingInfo.panSize}</span>
        </div>
        
        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
          <span className="text-muted-foreground text-sm">Temperature</span>
          <span className="font-medium text-deep-brown text-sm">{bakingInfo.temp}</span>
        </div>
        
        <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
          <span className="text-muted-foreground text-sm">Time</span>
          <span className="font-medium text-deep-brown text-sm">{bakingInfo.time}</span>
        </div>
        
        <div className="flex justify-between items-center py-1">
          <span className="text-muted-foreground text-sm">Batter weight</span>
          <span className="font-medium text-deep-brown text-sm">{bakingInfo.batterWeight}</span>
        </div>
      </div>
    </div>
  );
};