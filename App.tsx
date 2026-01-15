import React, { useState, useRef, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { editImageWithGemini } from './services/geminiService';
import { ProcessedImage, GenerationState, PresetPrompt } from './types';

const App: React.FC = () => {
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    status: 'idle',
  });
  
  // Ref for the result section to scroll to
  const resultRef = useRef<HTMLDivElement>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setProcessedImage({
      originalData: base64,
      generatedData: null,
      mimeType,
    });
    setState({ isLoading: false, error: null, status: 'idle' });
  };

  const handleGenerate = async () => {
    if (!processedImage?.originalData) return;
    if (!prompt.trim()) {
      setState(prev => ({ ...prev, error: "Please enter instructions first." }));
      return;
    }

    setState({ isLoading: true, error: null, status: 'processing' });
    
    try {
      const generatedImageBase64 = await editImageWithGemini(
        processedImage.originalData,
        processedImage.mimeType,
        prompt
      );

      setProcessedImage(prev => prev ? { ...prev, generatedData: generatedImageBase64 } : null);
      setState({ isLoading: false, error: null, status: 'complete' });
    } catch (error: any) {
      setState({ isLoading: false, error: error.message, status: 'error' });
    }
  };

  const handleReset = () => {
    setProcessedImage(null);
    setPrompt('');
    setState({ isLoading: false, error: null, status: 'idle' });
  };

  // Auto-scroll to result when complete
  useEffect(() => {
    if (state.status === 'complete' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.status]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">Studio<span className="text-blue-400">AI</span> Nuriddin</span>
          </div>
          <div className="text-sm text-gray-400 hidden sm:block">Powered by Gemini 2.5</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!processedImage ? (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                Transform photos with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Words</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg mx-auto">
                Remove backgrounds, clean up products, or completely reimagine scenes just by typing what you want.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800">
              <ImageUploader onImageSelected={handleImageSelected} />
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Try editing:</span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Product Shots</span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Portraits</span>
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">Background Removal</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center">
                <button 
                  onClick={handleReset}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Upload
                </button>
             </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg relative group">
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-xs font-semibold px-2 py-1 rounded text-white z-10">Original</div>
                  <img 
                    src={`data:${processedImage.mimeType};base64,${processedImage.originalData}`} 
                    alt="Original" 
                    className="w-full h-auto object-contain max-h-[500px] bg-gray-950/50"
                  />
                </div>

                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-lg space-y-4">
                  <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                      Instructions
                    </label>
                    <textarea
                      id="prompt"
                      rows={4}
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Describe how you want to change the image..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setPrompt(PresetPrompt.REMOVE_BG)}
                        className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 px-3 py-2 rounded-lg transition-all"
                      >
                        Remove Background
                      </button>
                      <button 
                         onClick={() => setPrompt(PresetPrompt.CLEAN_UP)}
                         className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 px-3 py-2 rounded-lg transition-all"
                      >
                        Clean Up
                      </button>
                       <button 
                         onClick={() => setPrompt(PresetPrompt.OFFICE_PORTRAIT)}
                         className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-gray-300 px-3 py-2 rounded-lg transition-all"
                      >
                        Office Portrait (Tajikistan)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={state.isLoading || !prompt.trim()}
                    className={`
                      w-full py-3 px-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2
                      transition-all duration-200
                      ${state.isLoading || !prompt.trim()
                        ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transform hover:-translate-y-0.5 shadow-blue-900/20'
                      }
                    `}
                  >
                    {state.isLoading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        Generate Edit
                      </>
                    )}
                  </button>

                  {state.error && (
                    <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200 text-sm flex items-start gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {state.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Output Section */}
              <div className="flex flex-col h-full">
                <div 
                  ref={resultRef}
                  className={`
                    relative flex-1 bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-lg min-h-[400px] flex flex-col items-center justify-center
                    ${!processedImage.generatedData && !state.isLoading ? 'border-dashed border-gray-700' : ''}
                  `}
                >
                   {state.isLoading && (
                     <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-20 flex items-center justify-center">
                       <LoadingSpinner />
                     </div>
                   )}

                   {processedImage.generatedData ? (
                     <>
                        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded text-white z-10 shadow-lg">
                          Generated Result
                        </div>
                        <img 
                          src={processedImage.generatedData} 
                          alt="Generated" 
                          className="w-full h-auto object-contain max-h-[600px] animate-fade-in"
                        />
                        <a 
                          href={processedImage.generatedData} 
                          download="studio-ai-edit.png"
                          className="absolute bottom-4 right-4 bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold shadow-xl transition-colors flex items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </a>
                     </>
                   ) : (
                     !state.isLoading && (
                       <div className="text-center p-8 opacity-50">
                         <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                         </div>
                         <p className="text-gray-400 text-lg">Your result will appear here</p>
                       </div>
                     )
                   )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;