import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface SimpleQRScannerProps {
  onScan: (data: string) => void;
  isActive: boolean;
}

export function SimpleQRScanner({ onScan, isActive }: SimpleQRScannerProps) {
  const [scanCount, setScanCount] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string>("");
  const isStartingRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
      isStartingRef.current = false;
      return;
    }

    if (isStartingRef.current || scannerRef.current?.isScanning) {
      console.log("⚠️ Scanner already running");
      return;
    }

    const startScanner = async () => {
      try {
        isStartingRef.current = true;
        console.log("🚀 Starting HTML5 QR Scanner...");

        await new Promise((resolve) => setTimeout(resolve, 100));

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 30, // Scan 30 times per second
            qrbox: 250, // Scanning box size
            aspectRatio: 1.0,
            disableFlip: false,
          },
          (decodedText) => {
            console.log("✅ QR Code scanned:", decodedText);
            setScanCount((prev) => prev + 1);

            scanner.stop().then(() => {
              onScan(decodedText);
            });
          },
          () => {
            // Error callback - called every frame when no QR found
            // Don't log to avoid spam
          }
        );

        console.log("✅ Scanner started successfully");
        setError("");
        isStartingRef.current = false;
      } catch (err: any) {
        console.error("❌ Scanner error:", err);
        setError(err.message || "Failed to start scanner");
        isStartingRef.current = false;
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isActive, onScan]);

  return (
    <div className="relative w-full h-full">
      <div id="qr-reader" className="w-full h-full"></div>
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded z-10">
          ❌ {error}
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 bg-blue-500 text-white p-3 rounded text-center z-10">
        📸 Arahkan QR code ke kotak hijau
        {scanCount > 0 && <span className="ml-2">• Scans: {scanCount}</span>}
      </div>
    </div>
  );
}
