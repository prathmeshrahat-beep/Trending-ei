import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, MessageSquare, Download, Share2 } from 'lucide-react';

interface PhotoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle?: string;
  onSendToChat?: (imageBase64: string) => void;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageTitle = 'फोटो व्यूअर (Photo View)',
  onSendToChat,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="h-14 px-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-200 truncate">{imageTitle}</span>
          <span className="text-[11px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="ज़ूम इन (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="ज़ूम आउट (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="घुमाएँ (Rotate)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
            title="बंद करें (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Display */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center p-4 select-none cursor-grab active:cursor-grabbing"
        onDoubleClick={handleReset}
      >
        <img
          src={imageUrl}
          alt={imageTitle}
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.15s ease-out',
            maxHeight: '82vh',
            maxWidth: '92vw',
          }}
          className="object-contain rounded-lg shadow-2xl shadow-cyan-950/50"
        />
      </div>

      {/* Bottom Bar with Actions */}
      <div className="h-16 px-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between shrink-0">
        <span className="text-xs text-slate-400">
          डबल-क्लिक से रीसेट करें • ज़ूम इन/आउट उपलब्ध है
        </span>

        {onSendToChat && (
          <button
            onClick={() => {
              onSendToChat(imageUrl);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>चैट में विश्लेषण करें</span>
          </button>
        )}
      </div>
    </div>
  );
};
