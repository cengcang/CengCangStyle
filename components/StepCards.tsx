import React from 'react';
import { User, Shirt, Wand2 } from 'lucide-react';
import { AppStep } from '../types';

interface StepCardsProps {
  currentStep: AppStep;
  personImage: string | null;
  clothingImage: string | null;
  resultImage: string | null;
}

const Card: React.FC<{
  active: boolean;
  completed: boolean;
  image: string | null;
  icon: React.ReactNode;
  label: string;
  rotate: string;
  zIndex: number;
}> = ({ active, completed, image, icon, label, rotate, zIndex }) => {
  return (
    <div 
      className={`
        relative w-28 h-40 md:w-36 md:h-52 rounded-2xl shadow-xl transition-all duration-500 ease-in-out border-4
        ${active ? 'scale-110 border-blue-500 z-50' : 'border-white/50 opacity-80 hover:opacity-100'}
        ${completed ? 'border-green-400' : ''}
        bg-white overflow-hidden
      `}
      style={{ 
        transform: active ? 'rotate(0deg) translateY(-10px)' : `${rotate} translateY(0px)`,
        zIndex: active ? 50 : zIndex
      }}
    >
      {image ? (
        <img src={image} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          {icon}
          <span className="text-xs mt-2 font-medium">{label}</span>
        </div>
      )}
      
      {/* Status Badge */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-1 text-center">
        <p className="text-[10px] md:text-xs text-white font-bold">{label}</p>
      </div>
    </div>
  );
};

export const StepCards: React.FC<StepCardsProps> = ({ currentStep, personImage, clothingImage, resultImage }) => {
  return (
    <div className="flex justify-center items-center py-8 relative h-64">
      {/* Connecting Line */}
      <div className="absolute h-1 bg-gray-300/50 w-2/3 top-1/2 -translate-y-1/2 rounded-full z-0" />
      
      <div className="flex gap-4 md:gap-12 items-center z-10">
        <Card 
          active={currentStep === AppStep.SELECT_PERSON}
          completed={!!personImage}
          image={personImage}
          icon={<User size={32} />}
          label="1. 选择人物"
          rotate="-rotate-6"
          zIndex={10}
        />
        
        <Card 
          active={currentStep === AppStep.SELECT_CLOTHES}
          completed={!!clothingImage}
          image={clothingImage}
          icon={<Shirt size={32} />}
          label="2. 选择衣物"
          rotate="rotate-3"
          zIndex={20}
        />
        
        <Card 
          active={currentStep === AppStep.RESULT}
          completed={!!resultImage}
          image={resultImage}
          icon={<Wand2 size={32} />}
          label="3. 生成效果"
          rotate="rotate-12"
          zIndex={30}
        />
      </div>
    </div>
  );
};
