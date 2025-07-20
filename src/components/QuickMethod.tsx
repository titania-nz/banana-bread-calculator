import React from 'react';

interface QuickMethodProps {
  bakingInfo: {
    temp: string;
    time: string;
  };
}

export const QuickMethod: React.FC<QuickMethodProps> = ({ bakingInfo }) => {
  const steps = [
    `Preheat oven to ${bakingInfo.temp}`,
    'Mash bananas, mix with wet ingredients',
    'Combine dry ingredients separately',
    'Mix wet and dry until just combined',
    `Pour into greased pan, bake ${bakingInfo.time}`,
    'Cool before removing from pan'
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-base font-bold text-deep-brown mb-4">Quick Method</h2>
      
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start">
            <span className="text-muted-foreground mr-2 text-xs font-normal min-w-[16px]">{index + 1}.</span>
            <span className="text-muted-foreground text-xs leading-relaxed flex-1 font-light">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};