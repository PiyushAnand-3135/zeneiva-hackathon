"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AlertCircle, User, Flame, Video, Camera, CameraOff } from 'lucide-react';

// Mock data for demonstration
const mockStudents = [
  { name: 'John Doe', time: '10:30 AM' },
  { name: 'Jane Smith', time: '10:40 AM' },
  { name: 'Mike Johnson', time: '10:45 AM' },
];

function App() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setHasCamera(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      toast.error('Unable to access camera. Please check permissions.');
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setHasCamera(false);
    }
  };

  // Simulate motion detection
  const detectMotion = () => {
    if (!canvasRef.current || !videoRef.current || !isMonitoring) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Draw current video frame to canvas
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);

    // Simulate person detection (random intervals)
    if (Math.random() < 0.3) { // 30% chance of detection
      const student = mockStudents[Math.floor(Math.random() * mockStudents.length)];
      toast.success(
        `Student Detected: ${student.name}`,
        {
          icon: <User className="w-5 h-5" />,
          duration: 3000,
        }
      );
    }
  };

  useEffect(() => {
    let detectionInterval: number;

    if (isMonitoring) {
      startCamera();
      detectionInterval = window.setInterval(detectMotion, 2000);
    } else {
      stopCamera();
    }

    return () => {
      clearInterval(detectionInterval);
      stopCamera();
    };
  }, [isMonitoring]);

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              AI Detection System
            </h1>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isMonitoring
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Video Feed */}
            <div className="bg-gray-800 rounded-lg p-4 aspect-video relative">
              {isMonitoring ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded"
                  />
                  <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    className="hidden"
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <div className={`flex items-center ${
                  hasCamera ? 'text-green-500' : 'text-red-500'
                }`}>
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    hasCamera ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {hasCamera ? 'Camera Active' : 'Camera Offline'}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                {hasCamera ? (
                  <Camera className="w-6 h-6 text-green-500" />
                ) : (
                  <CameraOff className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>

            {/* Status Panel */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">System Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Student Detection</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isMonitoring && hasCamera ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isMonitoring && hasCamera ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-blue-500" />
                    <span>Camera Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    hasCamera ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hasCamera ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
                    <span>Alert System</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isMonitoring ? 'Ready' : 'Standby'}
                  </span>
                </div>
              </div>

              {!hasCamera && isMonitoring && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Camera Access Required</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        Please allow camera access in your browser to enable detection features.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;