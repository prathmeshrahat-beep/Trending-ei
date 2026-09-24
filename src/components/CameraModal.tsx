import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, Zap, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (base64Image: string) => void;
  preferredFacingMode?: 'environment' | 'user';
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  preferredFacingMode = 'environment',
}) => {
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>(preferredFacingMode);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Start camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    stopCamera();
    setError(null);
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check torch capability
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.() as any;
      if (capabilities && 'torch' in capabilities) {
        setHasTorch(true);
      } else {
        setHasTorch(false);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera permission was denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device detected on this system.');
      } else {
        setError(err.message || 'Unable to access camera.');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setTorchOn(false);
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const toggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  const toggleTorch = async () => {
    if (!stream || !hasTorch) return;
    try {
      const track = stream.getVideoTracks()[0];
      const nextTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchOn(nextTorch);
    } catch (e) {
      console.warn('Could not toggle flash/torch', e);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1624] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f18] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-sm text-slate-100">
              {capturedImage ? 'Review Chart Photo' : 'Capture Chart Photo'}
            </h3>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview */}
        <div className="relative flex-1 bg-black min-h-[340px] flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="p-6 text-center max-w-sm">
              <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{error}</p>
              <button
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
              >
                Retry Camera
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured chart"
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
              <div className="absolute top-3 left-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs px-2.5 py-1 rounded-md font-medium backdrop-blur-sm">
                IMAGE READY
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Chart Alignment Frame Overlay */}
              <div className="absolute inset-8 border border-emerald-500/30 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                </div>
                <div className="text-center">
                  <span className="text-[11px] text-emerald-400/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                    Align Candlestick Chart / Monitor Screen
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#0a0f18] border-t border-slate-800 flex items-center justify-around">
          {capturedImage ? (
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={handleRetake}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retake
              </button>
              <button
                onClick={handleConfirmPhoto}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950 transition-all"
              >
                <Check className="w-4 h-4" />
                Use Photo
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full px-6">
              {/* Torch button */}
              <button
                onClick={toggleTorch}
                disabled={!hasTorch}
                className={`p-3 rounded-full transition-colors ${
                  torchOn
                    ? 'bg-amber-500 text-black'
                    : hasTorch
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                }`}
                title="Toggle Flashlight"
              >
                <Zap className="w-5 h-5" />
              </button>

              {/* Shutter capture button */}
              <button
                onClick={takeSnapshot}
                disabled={Boolean(error)}
                className="p-1.5 rounded-full border-4 border-white/30 hover:border-white transition-all transform active:scale-95 disabled:opacity-50"
                title="Take Photo"
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-black/10" />
                </div>
              </button>

              {/* Switch camera button */}
              <button
                onClick={toggleCamera}
                disabled={Boolean(error)}
                className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                title="Switch Front/Back Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
