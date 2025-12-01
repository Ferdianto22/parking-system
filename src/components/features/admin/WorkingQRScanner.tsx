import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface WorkingQRScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
}

export function WorkingQRScanner({ onScan, isActive }: WorkingQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanCount, setScanCount] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      hasStartedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setTimeout(() => {
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }, 200);
      return;
    }

    if (hasStartedRef.current) {
      console.log("Camera already started");
      return;
    }

    hasStartedRef.current = true;

    const startCamera = async () => {
      try {
        console.log("Starting camera...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (!videoRef.current) return;

        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            console.log("Camera started, beginning scan");
            scanQRCode();
          });
        };
      } catch (err) {
        console.error("Camera error:", err);
        hasStartedRef.current = false;
      }
    };

    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current || !hasStartedRef.current) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx || video.videoWidth === 0) {
        animationRef.current = requestAnimationFrame(scanQRCode);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        console.log("✅ QR FOUND:", code.data);
        setScanCount((prev) => prev + 1);
        hasStartedRef.current = false;
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
  }, [isActive, onScan]);

  return (
    <div className="relative w-full bg-black" style={{ height: "400px" }}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute inset-0 border-4 border-green-500/50 m-8 pointer-events-none rounded-lg" />
      <div className="absolute bottom-4 left-4 right-4 bg-blue-600/90 text-white px-3 py-2 rounded text-center text-sm">
        📸 Arahkan QR ke kotak hijau {scanCount > 0 && `• ${scanCount} deteksi`}
      </div>
    </div>
  );
}
