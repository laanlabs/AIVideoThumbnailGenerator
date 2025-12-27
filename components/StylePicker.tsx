
import React from 'react';
import { ThumbnailStyle } from '../types';
import { STYLE_CONFIGS } from '../constants';

interface StylePickerProps {
  selectedStyle: ThumbnailStyle;
  onStyleSelect: (style: ThumbnailStyle) => void;
}

const StylePicker: React.FC<StylePickerProps> = ({ selectedStyle, onStyleSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {STYLE_CONFIGS.map((style) => (
        <button
          key={style.id}
          onClick={() => onStyleSelect(style.id)}
          className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
            selectedStyle === style.id
              ? 'border-sky-500 bg-sky-500/10 text-sky-400'
              : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:bg-slate-800'
          }`}
        >
          <i className={`fa-solid ${style.icon} text-xl mb-2`}></i>
          <span className="text-xs font-bold uppercase tracking-wider">{style.label}</span>
        </button>
      ))}
    </div>
  );
};

export default StylePicker;
