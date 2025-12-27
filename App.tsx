
import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StylePicker from './components/StylePicker';
import { ThumbnailStyle, GeneratedVariation } from './types';
import { STYLE_CONFIGS } from './constants';
import { generateThumbnailVariation } from './services/geminiService';

const App: React.FC = () => {
  // Input State
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [subjectMime, setSubjectMime] = useState<string>('');
  const [refImage, setRefImage] = useState<string | null>(null);
  const [refMimeType, setRefMimeType] = useState<string>('');
  
  // Content State
  const [thumbnailText, setThumbnailText] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<ThumbnailStyle>(ThumbnailStyle.CINEMATIC);

  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<GeneratedVariation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubjectSelect = (file: File, dataUrl: string) => {
    setSubjectImage(dataUrl);
    setSubjectMime(file.type);
    setError(null);
  };

  const handleRefSelect = (file: File, dataUrl: string) => {
    setRefImage(dataUrl);
    setRefMimeType(file.type);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!subjectImage) {
      setError("Please upload a subject image first.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    const config = STYLE_CONFIGS.find(c => c.id === selectedStyle);
    if (!config) return;

    try {
      const resultUrl = await generateThumbnailVariation(
        subjectImage, 
        subjectMime, 
        refImage,
        refMimeType,
        thumbnailText,
        videoDescription,
        config.promptSuffix
      );
      
      const newVariation: GeneratedVariation = {
        id: Date.now().toString(),
        url: resultUrl,
        style: selectedStyle,
        timestamp: Date.now()
      };

      setVariations(prev => [newVariation, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Generation failed. Try a smaller image or different style.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail-${name}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500/30">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Editor Controls */}
          <div className="lg:col-span-7 space-y-6">
            <section className="space-y-2 mb-8">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                Thumbnail <span className="gradient-text">Studio</span>
              </h1>
              <p className="text-slate-400">Craft viral thumbnails with high-end AI composition.</p>
            </section>

            {/* Step 1: Subjects */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">1</span>
                <h2 className="text-lg font-bold">Subject Image</h2>
              </div>
              <p className="text-sm text-slate-500">Upload the person or object you want to feature. We'll handle the background removal.</p>
              <ImageUploader 
                onImageSelect={handleSubjectSelect} 
                currentImage={subjectImage}
                label="Drop subject image here"
                description="PNG, JPG (Person, Product, etc.)"
              />
            </div>

            {/* Step 2: Content & Copy */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">2</span>
                <h2 className="text-lg font-bold">Video Content</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Display Text</label>
                  <input 
                    type="text"
                    value={thumbnailText}
                    onChange={(e) => setThumbnailText(e.target.value)}
                    placeholder="e.g. 10x YOUR PROFIT!"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Video Description / Context</label>
                  <textarea 
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Explain what the video is about to help the AI design a relevant background..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition h-24 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Style Direction */}
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">3</span>
                <h2 className="text-lg font-bold">Style Configuration</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Manual Style Ref</label>
                  <ImageUploader 
                    onImageSelect={handleRefSelect} 
                    currentImage={refImage}
                    label="Clone a professional style"
                    description="Paste reference image"
                    onClear={() => { setRefImage(null); setRefMimeType(''); }}
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Preset Presets</label>
                  <StylePicker 
                    selectedStyle={selectedStyle} 
                    onStyleSelect={setSelectedStyle} 
                  />
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={!subjectImage || isGenerating}
                className={`w-full py-5 rounded-3xl font-black text-xl flex items-center justify-center space-x-4 transition-all ${
                  !subjectImage || isGenerating
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:shadow-2xl hover:shadow-sky-500/20 hover:-translate-y-1 active:scale-[0.98]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Building Thumbnail...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Render Thumbnail</span>
                  </>
                )}
              </button>
              {error && (
                <p className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center justify-center">
                  <i className="fa-solid fa-circle-exclamation mr-3 text-lg"></i>
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Preview & History */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <i className="fa-solid fa-layer-group text-sky-400 mr-3"></i>
                  Rendered Results
                </h2>
                <span className="text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg text-slate-400">{variations.length}</span>
              </div>

              {variations.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-600 border border-dashed border-slate-800 rounded-3xl p-10 text-center">
                  <div className="w-20 h-20 bg-slate-800/30 rounded-full flex items-center justify-center mb-6 border border-slate-800/50">
                    <i className="fa-solid fa-sparkles text-3xl opacity-20"></i>
                  </div>
                  <h3 className="text-slate-300 font-bold mb-2">No thumbnails rendered yet</h3>
                  <p className="text-sm">Configure your subjects and style on the left to start building.</p>
                </div>
              ) : (
                <div className="space-y-8 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar pb-10">
                  {variations.map((v) => (
                    <div key={v.id} className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 ring-1 ring-white/5 shadow-2xl transition-all hover:ring-sky-500/50">
                      <img src={v.url} alt="Rendered Variation" className="w-full aspect-video object-cover" />
                      
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                          onClick={() => downloadImage(v.url, v.style)}
                          className="p-2 bg-white text-slate-900 rounded-lg shadow-xl hover:bg-sky-50 transition"
                          title="Download HD"
                        >
                          <i className="fa-solid fa-download"></i>
                        </button>
                      </div>

                      <div className="p-4 bg-slate-900/80 backdrop-blur-sm flex justify-between items-center border-t border-slate-800">
                        <div className="flex items-center space-x-2">
                           <span className="bg-sky-500/10 text-sky-400 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-sky-500/20">
                            {STYLE_CONFIGS.find(c => c.id === v.style)?.label}
                          </span>
                          <span className="text-[10px] text-slate-500">{new Date(v.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <button 
                          onClick={() => {
                            const newTab = window.open();
                            newTab?.document.write(`
                              <body style="margin:0; background:#020617; display:flex; align-items:center; justify-content:center; height: 100vh;">
                                <img src="${v.url}" style="max-width:90%; max-height:90%; border-radius: 12px; box-shadow: 0 40px 100px -20px rgba(0,0,0,1);">
                              </body>
                            `);
                          }}
                          className="text-xs text-slate-400 hover:text-white transition flex items-center"
                        >
                          Expand <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-900 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Created for Creators &bull; Powered by <span className="font-semibold text-slate-300">Gemini 2.5 Flash Image</span>
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />
    </div>
  );
};

export default App;
