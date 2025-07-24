import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from './ui/dialog';

const sizeData = [
  { bananas: 1, weight: 120 },
  { bananas: 2, weight: 240 },
  { bananas: 3, weight: 360 },
  { bananas: 4, weight: 480 },
  { bananas: 5, weight: 600 },
  { bananas: 6, weight: 720 },
  { bananas: 7, weight: 840 },
  { bananas: 8, weight: 960 },
  { bananas: 9, weight: 1080 },
  { bananas: 10, weight: 1200 }
];

export const BananaSizesDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger className="help-link">🔍 Banana sizes</DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Banana Weights</DialogTitle>
        </DialogHeader>
        <p className="mb-4 text-sm text-gray-600">
          A medium banana is about 120g. Here is a quick reference for converting bananas to weight.
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="border-b px-2 py-1 text-left">Bananas</th>
              <th className="border-b px-2 py-1 text-left">Mashed weight (g)</th>
            </tr>
          </thead>
          <tbody>
            {sizeData.map((row) => (
              <tr key={row.bananas}>
                <td className="border-b px-2 py-1">{row.bananas}</td>
                <td className="border-b px-2 py-1">{row.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
};
