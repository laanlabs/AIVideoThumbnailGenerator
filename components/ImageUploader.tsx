
import React, { useRef, useEffect } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  currentImage: string | null;
  label?: string;
  description?: string;
  onClear?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  currentImage, 
  label = "Upload original thumbnail", 
  description = "PNG, JPG or WebP (Max 5MB)",
  onClear
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            onImageSelect(blob, reader.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {!currentImage ? (
        <div 
          ref={containerRef}
          onClick={triggerInput}
          onPaste={handlePaste}
          tabIndex={0}
          className="aspect-video w-full border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-sky-500 hover:bg-slate-800/50 focus:outline-none focus:border-sky-500 focus:bg-slate-800/50 transition-all group"
        >
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-400 group-hover:text-sky-400"></i>
          </div>
          <p className="text-base font-medium text-slate-300 px-4 text-center">{label}</p>
          <div className="flex flex-col items-center mt-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{description}</p>
            <p className="text-[10px] text-sky-500/60 font-bold mt-1 uppercase tracking-tighter">Click or Paste (Ctrl+V)</p>
          </div>
        </div>
      ) : (
        <div 
          className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-700 bg-black"
          onPaste={handlePaste}
          tabIndex={0}
        >
          <img 
            src={currentImage} 
            alt="Uploaded preview" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              onClick={triggerInput}
              className="bg-white text-slate-900 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-sky-100 transition"
            >
              <i className="fa-solid fa-rotate"></i>
              <span>Change</span>
            </button>
            {onClear && (
              <button 
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center space-x-2 hover:bg-red-600 transition"
              >
                <i className="fa-solid fa-trash"></i>
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
