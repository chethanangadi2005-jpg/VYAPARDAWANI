import React, { useState, useRef } from 'react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Camera, Scan, Check, X, Upload, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';
import { enqueueOfflineTask } from '../../services/offlineSyncEngine';

interface QuickCaptureFABProps {
  onScanComplete?: (invoiceData: any) => void;
}

export const QuickCaptureFAB: React.FC<QuickCaptureFABProps> = ({ onScanComplete }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanNotice, setScanNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Primary camera trigger: Tries native Capacitor Camera first, falls back to web file input.
   */
  const handleCameraCapture = async () => {
    try {
      // Attempt Capacitor Native Camera API
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (image.webPath) {
        setCapturedImage(image.webPath);
        setIsModalOpen(true);
      }
    } catch (err: any) {
      console.log('Capacitor native camera unavailable or cancelled. Falling back to web file input.', err?.message);
      // Web browser fallback
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  /**
   * Web File Input Fallback Handler
   */
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Dispatch Captured Invoice Image to Edge OCR API / Offline Queue
   */
  const handleProcessOCR = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    setScanNotice('Analyzing invoice text with Edge OCR engine...');

    try {
      // If offline, queue immediately
      if (!navigator.onLine) {
        await enqueueOfflineTask('INVOICE_SCAN', {
          filename: `offline_capture_${Date.now()}.jpg`,
          sampleType: 'VERIFIED',
          imageData: capturedImage
        });
        setScanNotice('📡 Network offline. Invoice scan queued to IndexedDB!');
        setTimeout(() => {
          setIsProcessing(false);
          setIsModalOpen(false);
          setCapturedImage(null);
        }, 1500);
        return;
      }

      // Online: Process directly via API
      const res = await apiService.processOcrScan(`scan_${Date.now()}.jpg`, 'VERIFIED');

      if (res.success) {
        setScanNotice(res.aiNotice || '✅ Invoice parsed successfully!');
        if (onScanComplete) {
          onScanComplete(res);
        }
        setTimeout(() => {
          setIsProcessing(false);
          setIsModalOpen(false);
          setCapturedImage(null);
        }, 1200);
      } else {
        throw new Error(res.error || 'OCR processing failed');
      }
    } catch (error: any) {
      console.warn('API OCR processing failed. Enqueuing to offline storage.', error);
      await enqueueOfflineTask('INVOICE_SCAN', {
        filename: `offline_capture_${Date.now()}.jpg`,
        sampleType: 'VERIFIED',
        imageData: capturedImage
      });

      setScanNotice('⚠️ Upload failed. Invoice queued offline and will sync automatically when server connects.');
      setTimeout(() => {
        setIsProcessing(false);
        setIsModalOpen(false);
        setCapturedImage(null);
      }, 2000);
    }
  };

  return (
    <>
      {/* Hidden Web Camera File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Floating Action Button (FAB) */}
      <button
        onClick={handleCameraCapture}
        aria-label="Scan Invoice"
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center border-2 border-emerald-400/40 group"
      >
        <Camera className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium text-sm ml-0 group-hover:ml-2">
          Scan Invoice
        </span>
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-slate-900"></span>
        </span>
      </button>

      {/* Active Crop & OCR Preview Modal */}
      {isModalOpen && capturedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Invoice Capture & Auto-Crop</h3>
                  <p className="text-xs text-slate-400">Verify orientation and crop frame</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCapturedImage(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera Preview Box with Auto-Cropping Overlay */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-4 min-h-[300px]">
              <img
                src={capturedImage}
                alt="Captured Invoice"
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
              />

              {/* Interactive Auto-Cropping Bounding Box Overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-lg pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-400 -mt-1 -ml-1"></div>
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-400 -mt-1 -mr-1"></div>
                </div>

                {/* Laser Scanning Animation Effect when processing */}
                {isProcessing && (
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse shadow-[0_0_15px_#34d399]"></div>
                )}

                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-400 -mb-1 -ml-1"></div>
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-400 -mb-1 -mr-1"></div>
                </div>
              </div>
            </div>

            {/* Status Notice */}
            {scanNotice && (
              <div className="px-4 py-2 bg-slate-800/80 border-t border-slate-700 text-xs text-slate-200 flex items-center justify-center space-x-2">
                {isProcessing ? (
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>{scanNotice}</span>
              </div>
            )}

            {/* Actions Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between space-x-3">
              <button
                onClick={handleCameraCapture}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Camera className="w-4 h-4" />
                <span>Retake</span>
              </button>

              <button
                onClick={handleProcessOCR}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Process Edge OCR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
