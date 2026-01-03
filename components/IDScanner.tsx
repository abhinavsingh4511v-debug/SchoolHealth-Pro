
import React, { useRef, useEffect, useState } from 'react';
import { Student } from '../types';

interface IDScannerProps {
  students: Student[];
  onScanSuccess: (student: Student) => void;
  onClose: () => void;
}

const IDScanner: React.FC<IDScannerProps> = ({ students, onScanSuccess, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
        setError("Could not access camera. Please check permissions.");
      }
    }

    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = () => {
    if (students.length === 0) {
      setError("No students in database to scan.");
      return;
    }
    
    setIsScanning(true);
    // Simulate a short delay for "processing"
    setTimeout(() => {
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      onScanSuccess(randomStudent);
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn border border-white/20">
        <div className="p-6 border-b flex justify-between items-center bg-gray-900 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📷</span>
            <div>
              <h3 className="text-lg font-bold">Student ID Scanner</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Clinic Check-in Mode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-xl">✕</button>
        </div>

        <div className="relative aspect-square bg-black overflow-hidden group">
          {hasPermission === false ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
              <span className="text-4xl mb-4">🚫</span>
              <p className="font-bold text-lg">{error}</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-white text-black rounded-xl font-bold"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Scanning Overlay UI */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                  
                  {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scanLine"></div>
                  )}
                </div>
              </div>

              {isScanning && (
                <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                  <div className="bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse">
                    <span className="w-4 h-4 bg-blue-600 rounded-full animate-ping"></span>
                    <p className="font-black text-blue-600 uppercase tracking-tighter">Recognizing ID...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-8 space-y-4">
          <p className="text-sm text-gray-500 text-center font-medium">
            Position the Student ID barcode within the frame to automatically retrieve health records.
          </p>
          
          {hasPermission && (
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <span>🔍</span> Detect Student ID
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors"
              >
                Cancel Scanning
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          from { top: 0; }
          to { top: 100%; }
        }
        .animate-scanLine {
          animation: scanLine 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default IDScanner;
