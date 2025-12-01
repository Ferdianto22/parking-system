import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface WorkingQRScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
}

export function WorkingQRScanner({ onScan, isActive }: WorkingQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!isActive) {
      setScanning(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Delay camera stop to avoid race condition
      setTimeout(() => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }, 100);
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 1280, height: 720 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScanning(true);
          scanQRCode();
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Cannot access camera: " + err);
      }
    };

    const scanQRCode = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas || !scanning) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log("✅ QR FOUND:", code.data);
        setScanCount((prev) => prev + 1);
        onScan(code.data);
        return;
      }

      animationRef.current = requestAnimationFrame(scanQRCode);
    };

    startCamera();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, onScan, scanning]);

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} className="w-full h-full object-cover" />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 border-4 border-green-500/50 m-8" />
      <div className="absolute bottom-4 left-4 right-4 bg-blue-600 text-white p-3 rounded text-center">
        📸 Scanning... {scanCount > 0 && `(${scanCount} attempts)`}
      </div>
    </div>
  );
}
