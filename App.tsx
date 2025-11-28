import React, { useState } from 'react';
import { StepCards } from './components/StepCards';
import { Controls } from './components/Controls';
import { Gallery } from './components/Gallery';
import { AppStep, LoadingState, HistoryItem } from './types';
import { generateClothingFromText, generateTryOnResult } from './services/geminiService';
import { ShoppingBag } from 'lucide-react';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SELECT_PERSON);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State for images (Base64 strings)
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handlePersonSelect = (base64: string) => {
    setPersonImage(base64);
    // Auto advance to next step after a short delay for visual feedback
    setTimeout(() => setCurrentStep(AppStep.SELECT_CLOTHES), 300);
  };

  const handleClothingSelect = (base64: string) => {
    setClothingImage(base64);
  };

  const handleGenerateClothing = async (prompt: string) => {
    setLoadingState('generating_clothes');
    setErrorMsg(null);
    try {
      const generatedImage = await generateClothingFromText(prompt);
      setClothingImage(generatedImage);
    } catch (error) {
      console.error(error);
      setErrorMsg("生成衣物失败，请重试或检查描述。");
    } finally {
      setLoadingState('idle');
    }
  };

  const handleGenerateResult = async () => {
    if (!personImage || !clothingImage) return;

    setLoadingState('generating_tryon');
    setErrorMsg(null);
    try {
      const result = await generateTryOnResult(personImage, clothingImage);
      setResultImage(result);
      setCurrentStep(AppStep.RESULT);
      
      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        personImage,
        clothingImage,
        resultImage: result,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (error) {
      console.error(error);
      setErrorMsg("试穿生成失败，请稍后重试。");
    } finally {
      setLoadingState('idle');
    }
  };

  const resetApp = () => {
    setPersonImage(null);
    setClothingImage(null);
    setResultImage(null);
    setCurrentStep(AppStep.SELECT_PERSON);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <header className="pt-8 px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight flex items-center justify-center gap-3">
          <ShoppingBag className="text-purple-600" size={40} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            NanoStyle
          </span>
        </h1>
        <p className="mt-2 text-gray-500 font-medium">AI 驱动的虚拟试衣间</p>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        {/* Error Toast */}
        {errorMsg && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 text-red-700 rounded-xl flex items-center justify-center text-sm shadow-sm animate-bounce">
            {errorMsg}
          </div>
        )}

        {/* Top Step Visualization */}
        <StepCards 
          currentStep={currentStep}
          personImage={personImage}
          clothingImage={clothingImage}
          resultImage={resultImage}
        />

        {/* Main Controls */}
        <Controls 
          currentStep={currentStep}
          onPersonSelect={handlePersonSelect}
          onClothingSelect={handleClothingSelect}
          onGenerateClothing={handleGenerateClothing}
          onGenerateResult={handleGenerateResult}
          onReset={resetApp}
          loadingState={loadingState}
          personImage={personImage}
          clothingImage={clothingImage}
        />

        {/* Gallery */}
        <Gallery history={history} />
      </main>
      
      {/* Loading Overlay (Optional for full screen block) */}
      {(loadingState === 'generating_tryon' || loadingState === 'generating_clothes') && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center pointer-events-none">
           {/* Visual loading indicator handled inside buttons, but this prevents interaction */}
        </div>
      )}
    </div>
  );
};

export default App;
