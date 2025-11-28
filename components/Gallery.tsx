import React from 'react';
import { HistoryItem } from '../types';
import { Download, Clock } from 'lucide-react';

interface GalleryProps {
  history: HistoryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-12">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Clock size={20} />
        历史记录
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
        {history.map((item) => (
          <div key={item.id} className="snap-start shrink-0 w-64 bg-white rounded-xl shadow-md overflow-hidden group">
            <div className="relative aspect-[3/4]">
              <img src={item.resultImage} alt="Result" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a 
                    href={item.resultImage} 
                    download={`tryon-${item.timestamp}.png`}
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors"
                    title="下载结果"
                  >
                    <Download size={20} />
                  </a>
              </div>
            </div>
            <div className="p-3 flex gap-2 border-t border-gray-100 bg-gray-50">
                <img src={item.personImage} alt="Person" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                <img src={item.clothingImage} alt="Clothes" className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
                <div className="ml-auto text-xs text-gray-400 self-center">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
