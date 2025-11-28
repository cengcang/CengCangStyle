import React, { useRef, useState } from 'react';
import { Upload, Sparkles, Image as ImageIcon, ArrowRight, RotateCcw } from 'lucide-react';
import { AppStep, PresetImage, LoadingState } from '../types';
import { PRESET_PEOPLE, PRESET_CLOTHES } from '../constants';
import { fileToBase64, urlToBase64 } from '../utils/imageUtils';

interface ControlsProps {
  currentStep: AppStep;
  onPersonSelect: (base64: string) => void;
  onClothingSelect: (base64: string) => void;
  onGenerateClothing: (prompt: string) => void;
  onGenerateResult: () => void;
  onReset: () => void;
  loadingState: LoadingState;
  personImage: string | null;
  clothingImage: string | null;
}

export const Controls: React.FC<ControlsProps> = ({
  currentStep,
  onPersonSelect,
  onClothingSelect,
  onGenerateClothing,
  onGenerateResult,
  onReset,
  loadingState,
  personImage,
  clothingImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clothingPrompt, setClothingPrompt] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      if (currentStep === AppStep.SELECT_PERSON) {
        onPersonSelect(base64);
      } else if (currentStep === AppStep.SELECT_CLOTHES) {
        onClothingSelect(base64);
      }
    }
  };

  const handlePresetClick = async (preset: PresetImage) => {
    // In a real app, these URLs might be pre-converted or handled via proxy to avoid CORS.
    // For this demo, we attempt to fetch.
    try {
        // If it's a direct browser usable URL, we might need to handle it differently
        // But for consistency with the API, we want base64.
        // NOTE: This might fail if the preset URL doesn't allow CORS.
        // Fallback: Just pass the URL if you were handling logic differently, 
        // but here we strictly convert to base64 for the API.
        const base64 = await urlToBase64(preset.url);
        if (currentStep === AppStep.SELECT_PERSON) {
            onPersonSelect(base64);
        } else {
            onClothingSelect(base64);
        }
    } catch (e) {
        alert("无法加载该预设图片 (CORS限制)。请尝试上传本地图片。");
    }
  };

  const isProcessing = loadingState !== 'idle' && loadingState !== 'error';

  if (currentStep === AppStep.RESULT) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur rounded-3xl shadow-sm max-w-2xl mx-auto mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">生成完成!</h2>
        <p className="text-gray-600 mb-8 text-center">您的专属AI换装照已生成。可以保存到相册或重新尝试。</p>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          <RotateCcw size={20} />
          再试一次
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl shadow-sm p-6 max-w-4xl mx-auto mt-6 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {currentStep === AppStep.SELECT_PERSON ? <UserIcon /> : <ShirtIcon />}
          {currentStep === AppStep.SELECT_PERSON ? '第一步：选择模特' : '第二步：选择衣物'}
        </h2>
        
        {/* Step Navigation helper */}
        {currentStep === AppStep.SELECT_CLOTHES && personImage && (
             <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                <span className="font-semibold">已选模特</span>
                <img src={personImage} alt="selected" className="w-6 h-6 rounded-full object-cover border border-gray-300"/>
             </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Presets & Upload */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">从预设选择</p>
          <div className="grid grid-cols-3 gap-3">
            {(currentStep === AppStep.SELECT_PERSON ? PRESET_PEOPLE : PRESET_CLOTHES).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                className="relative group aspect-[3/4] rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 focus:outline-none transition-all"
              >
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
            ))}
            
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center aspect-[3/4] rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-400 hover:text-blue-500"
            >
              <Upload size={24} />
              <span className="text-xs mt-2 font-medium">上传照片</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Right: AI Generation or Prompt */}
        <div className="flex flex-col h-full bg-gray-50 rounded-2xl p-6 border border-gray-100">
           {currentStep === AppStep.SELECT_CLOTHES ? (
             <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Sparkles className="text-purple-500" size={18} />
                    AI 生成衣物
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">描述你想要的衣服，NanoBanana 帮你生成。</p>
                </div>
                
                <textarea
                  className="w-full flex-1 p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none text-sm"
                  placeholder="例如：一件红色的丝绸晚礼服，露肩设计..."
                  value={clothingPrompt}
                  onChange={(e) => setClothingPrompt(e.target.value)}
                />

                <button
                  disabled={!clothingPrompt.trim() || isProcessing}
                  onClick={() => onGenerateClothing(clothingPrompt)}
                  className={`mt-4 w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                    ${!clothingPrompt.trim() || isProcessing 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200'
                    }`}
                >
                  {loadingState === 'generating_clothes' ? (
                    <span className="animate-pulse">正在编织衣物...</span>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      生成衣物
                    </>
                  )}
                </button>
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8">
               <ImageIcon size={48} className="mb-4 opacity-50" />
               <p className="text-sm">请先选择一张清晰的人物全身或半身照片，确保面部清晰可见。</p>
             </div>
           )}
        </div>
      </div>

      {/* Action Footer */}
      {(currentStep === AppStep.SELECT_PERSON && personImage) && (
        <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
             <button
                onClick={() => onPersonSelect(personImage)} // Re-triggers next step logic in parent if needed, effectively "Confirm"
                className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                下一步
                <ArrowRight size={18} />
              </button>
        </div>
      )}
      
      {(currentStep === AppStep.SELECT_CLOTHES && clothingImage) && (
         <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
             <button
                disabled={isProcessing}
                onClick={onGenerateResult}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                {loadingState === 'generating_tryon' ? 'AI 正在试穿...' : '开始换装'}
                {!isProcessing && <Sparkles size={18} />}
              </button>
        </div>
      )}
    </div>
  );
};

const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)

const ShirtIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
)
