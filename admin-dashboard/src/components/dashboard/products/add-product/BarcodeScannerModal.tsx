"use client";

import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, BrowserCodeReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { X, Camera, RefreshCw } from "lucide-react";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScannerReady, setIsScannerReady] = useState(false);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const hints = new Map();
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.QR_CODE,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    const reader = new BrowserMultiFormatReader(hints);
    readerRef.current = reader;

    const startScanning = async () => {
      try {
        const videoInputDevices = await BrowserCodeReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          setError("No camera found on this device.");
          return;
        }

        // Camera selection: Priority list
        // 1. Devices with 'back', 'rear', or 'environment' in label
        // 2. The last device in the list (most common for back camera on smartphones)
        // 3. Fallback to first device
        let selectedDeviceId = videoInputDevices[0].deviceId;
        const backCamera = videoInputDevices.find((device: any) => 
          device.label?.toLowerCase().includes('back') || 
          device.label?.toLowerCase().includes('rear') ||
          device.label?.toLowerCase().includes('environment')
        );

        if (backCamera) {
          selectedDeviceId = backCamera.deviceId;
        } else if (videoInputDevices.length > 1) {
          selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
        }

        setError(null);
        setIsScannerReady(true);

        // @zxing/browser API: reader.decodeFromVideoDevice(deviceId, videoElement, callback)
        await reader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              onScan(result.getText());
            }
          }
        );
      } catch (err) {
        console.error("Scanner start error:", err);
        setError("Failed to access camera. Please check permissions.");
      }
    };

    startScanning();

    return () => {
      if (readerRef.current) {
        try {
          // stopContinuousDecode is the standard for @zxing/browser to stop the video stream
          if (typeof (readerRef.current as any).stopContinuousDecode === 'function') {
            (readerRef.current as any).stopContinuousDecode();
          } else if (typeof (readerRef.current as any).reset === 'function') {
            (readerRef.current as any).reset();
          }
        } catch (e) {
          console.warn("Scanner cleanup warning:", e);
        }
      }
      // Definitive cleanup for browser streams
      BrowserCodeReader.releaseAllStreams();
    };
  }, [isOpen, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Scan Barcode</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-100 shadow-inner">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 border-[40px] border-black/40" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-emerald-500 rounded-lg">
                <div className="absolute inset-0 animate-pulse bg-emerald-500/10" />
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-500 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-500 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-500 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-500 rounded-br-sm" />
              </div>
            </div>

            {!isScannerReady && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-400" />
                <p className="text-sm font-medium">Initializing camera...</p>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 text-white p-6 text-center">
                <p className="text-sm font-bold text-red-400 mb-2">Error</p>
                <p className="text-xs text-slate-300">{error}</p>
                <button 
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-xs text-slate-500 text-center font-medium">
              Position the barcode within the frame to scan it automatically. Works with EAN, UPC, and Code 128.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
