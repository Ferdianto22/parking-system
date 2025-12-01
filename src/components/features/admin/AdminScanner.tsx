import { useState, useRef, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Camera,
  DollarSign,
  Clock,
  Car,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { NavigationProps } from "@/types";
import { TARIF } from "@/constants";
import {
  getKendaraanById,
  getKendaraanByPlat,
  keluarParkir,
  getKendaraanAktif,
  type KendaraanAktif,
} from "@/services/parkir.service";
import { AuthService } from "@/services/auth.service";

export function AdminScanner({ onNavigate }: NavigationProps) {
  const [platInput, setPlatInput] = useState("");
  const [kendaraan, setKendaraan] = useState<KendaraanAktif | null>(null);
  const [duration, setDuration] = useState("");
  const [totalBiaya, setTotalBiaya] = useState(0);
  const [jamTerhitung, setJamTerhitung] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeVehicles, setActiveVehicles] = useState<KendaraanAktif[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const loadActiveVehicles = useCallback(async () => {
    try {
      const vehicles = await getKendaraanAktif();
      setActiveVehicles(vehicles);
    } catch (error) {
      console.error("Error loading active vehicles:", error);
    }
  }, []);

  useEffect(() => {
    loadActiveVehicles();
    const interval = setInterval(loadActiveVehicles, 5000);
    return () => clearInterval(interval);
  }, [loadActiveVehicles]);

  const handleManualInput = async () => {
    const trimmedPlat = platInput.trim().toUpperCase();

    if (!trimmedPlat) {
      alert("Mohon masukkan plat nomor!");
      return;
    }

    // Validate plate format
    const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/;
    if (!plateRegex.test(trimmedPlat)) {
      alert(
        "Format plat nomor tidak valid!\n\nContoh format yang benar:\n• B 1234 XYZ\n• B1234XYZ\n• DK 5678 AB"
      );
      return;
    }

    setLoading(true);

    try {
      const found = await getKendaraanByPlat(trimmedPlat);

      const now = Date.now();
      const jamMasuk = new Date(found.jam_masuk).getTime();
      const diff = now - jamMasuk;

      // Calculate duration
      const totalMinutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const durationStr = `${hours}j ${minutes}m`;

      // Calculate fee (minimum 1 hour)
      const billableHours = Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
      const biaya =
        billableHours * (TARIF[found.jenis as keyof typeof TARIF] || 0);

      setKendaraan(found);
      setDuration(durationStr);
      setTotalBiaya(biaya);
      setJamTerhitung(billableHours);
      setShowSuccess(false);
    } catch (error: any) {
      console.error("Error finding vehicle:", error);
      alert(error.message || "Plat nomor tidak ditemukan");
      setPlatInput("");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!kendaraan) return;

    setLoading(true);

    try {
      const tarif = TARIF[kendaraan.jenis as keyof typeof TARIF] || 0;
      await keluarParkir(kendaraan.id, tarif);

      setShowSuccess(true);

      setTimeout(() => {
        setKendaraan(null);
        setPlatInput("");
        setDuration("");
        setTotalBiaya(0);
        setJamTerhitung(0);
        setShowSuccess(false);
        loadActiveVehicles(); // Refresh the list
      }, 3000);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      alert(error.message || "Gagal memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");

      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Browser tidak mendukung akses kamera. Gunakan browser modern seperti Chrome atau Firefox."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      console.log("Camera access granted:", stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to load and play
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current
            ?.play()
            .then(() => {
              console.log("Video playing");
              setCameraActive(true);
            })
            .catch((playErr) => {
              console.error("Error playing video:", playErr);
              alert("Gagal memutar video kamera: " + playErr.message);
            });
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);

      let errorMessage = "Tidak dapat mengakses kamera.\n\n";

      // Provide specific error messages
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage +=
          "❌ Izin kamera ditolak!\n\n" +
          "Cara mengizinkan:\n" +
          "1. Klik ikon kunci/kamera di address bar\n" +
          "2. Pilih 'Allow' untuk kamera\n" +
          "3. Refresh halaman\n" +
          "4. Klik 'Aktifkan Kamera' lagi";
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        errorMessage +=
          "❌ Kamera tidak ditemukan!\n\n" +
          "Pastikan:\n" +
          "1. Kamera terpasang dengan benar\n" +
          "2. Kamera tidak digunakan aplikasi lain\n" +
          "3. Driver kamera terinstall";
      } else if (
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        errorMessage +=
          "❌ Kamera sedang digunakan!\n\n" +
          "Tutup aplikasi lain yang menggunakan kamera:\n" +
          "- Zoom, Teams, Skype\n" +
          "- Browser tab lain\n" +
          "- Aplikasi kamera lainnya";
      } else if (err.name === "OverconstrainedError") {
        errorMessage +=
          "❌ Kamera tidak mendukung resolusi yang diminta!\n\n" +
          "Coba gunakan kamera lain atau gunakan input manual.";
      } else if (err.name === "SecurityError") {
        errorMessage +=
          "❌ Akses kamera diblokir karena alasan keamanan!\n\n" +
          "Pastikan:\n" +
          "1. Menggunakan HTTPS atau localhost\n" +
          "2. Browser mendukung akses kamera";
      } else {
        errorMessage += "Error: " + err.message;
      }

      errorMessage +=
        "\n\n💡 Gunakan input plat nomor manual sebagai alternatif.";

      alert(errorMessage);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-indigo-600">Gate Keluar</h1>
            <p className="text-muted-foreground">
              Scan QR Code atau input manual
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (confirm("Apakah Anda yakin ingin logout?")) {
                  AuthService.logout();
                  onNavigate("driver");
                }
              }}
              variant="outline"
              size="sm"
            >
              Logout
            </Button>
            <Button onClick={() => onNavigate("admin")} variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div>
              <h3>Scanner QR Code</h3>
              <p className="text-muted-foreground">Scan tiket pengendara</p>
            </div>

            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-4 border-white/30 m-8 rounded-lg" />
                </>
              ) : (
                <div className="text-center text-white/60 p-8">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p>Kamera belum aktif</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {!cameraActive ? (
                <Button onClick={startCamera} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Aktifkan Kamera
                </Button>
              ) : (
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  className="w-full"
                >
                  Matikan Kamera
                </Button>
              )}
            </div>

            <div className="pt-4 border-t space-y-3">
              <Label htmlFor="platNomor">Atau Input Plat Nomor Manual</Label>
              <div className="flex gap-2">
                <Input
                  id="platNomor"
                  placeholder="Contoh: B 1234 XYZ"
                  value={platInput}
                  onChange={(e) => setPlatInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleManualInput()}
                  className="font-mono text-center tracking-wider"
                  maxLength={15}
                />
                <Button onClick={handleManualInput} disabled={loading}>
                  {loading ? "Mencari..." : "Cari"}
                </Button>
              </div>
              <div className="text-xs space-y-1">
                <p className="text-green-600 font-medium">
                  ✅ Masukkan PLAT NOMOR kendaraan yang akan keluar
                </p>
                <p className="text-muted-foreground">
                  💡 Format: B 1234 XYZ atau B1234XYZ
                </p>
                <p className="text-muted-foreground">
                  💡 Atau pilih dari daftar kendaraan aktif di bawah
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h3>Detail Transaksi</h3>
              <p className="text-muted-foreground">Informasi pembayaran</p>
            </div>

            {showSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-green-600">Pembayaran Berhasil!</h2>
                <p className="text-muted-foreground">
                  Gate akan terbuka otomatis
                </p>
              </div>
            ) : kendaraan ? (
              <>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Plat Nomor:</span>
                    <span className="tracking-wider">
                      {kendaraan.plat_nomor}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Jenis:</span>
                    <Badge variant="outline" className="gap-1">
                      <Car className="w-4 h-4" />
                      {kendaraan.jenis}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Jam Masuk:</span>
                    <span>
                      {new Date(kendaraan.jam_masuk).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      WIB
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Durasi:
                    </span>
                    <span>{duration}</span>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Total Biaya:</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      <span className="text-indigo-600">
                        Rp {totalBiaya.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Tarif {kendaraan.jenis}: Rp{" "}
                    {TARIF[kendaraan.jenis].toLocaleString("id-ID")}/jam ×{" "}
                    {jamTerhitung} jam
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full h-16"
                  size="lg"
                  disabled={loading}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  BAYAR & BUKA GATE
                </Button>
              </>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Scan QR Code atau input ID tiket</p>
                <p className="mt-2">untuk melihat detail transaksi</p>
              </div>
            )}
          </Card>
        </div>

        <Alert>
          <AlertDescription>
            💡 <strong>Tips:</strong> Masukkan plat nomor kendaraan yang akan
            keluar, atau klik tombol "Gunakan Plat Ini" pada daftar kendaraan
            aktif di bawah.
          </AlertDescription>
        </Alert>

        {/* Active Vehicles Panel */}
        <Card className="p-4 bg-gray-50">
          <details open>
            <summary className="cursor-pointer text-sm font-medium mb-2">
              🚗 Kendaraan Aktif di Parkir
            </summary>
            <div className="space-y-2 mt-3">
              {activeVehicles.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Tidak ada kendaraan parkir. Buat tiket dulu di halaman driver.
                </p>
              ) : (
                activeVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 bg-white rounded border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium tracking-wider text-lg">
                        {v.plat_nomor}
                      </span>
                      <Badge variant="outline">{v.jenis}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Masuk:{" "}
                      {new Date(v.jam_masuk).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="w-full mt-2"
                      onClick={async () => {
                        setPlatInput(v.plat_nomor);
                        setLoading(true);

                        try {
                          const found = await getKendaraanByPlat(v.plat_nomor);

                          const now = Date.now();
                          const jamMasuk = new Date(found.jam_masuk).getTime();
                          const diff = now - jamMasuk;
                          const totalMinutes = Math.floor(diff / (1000 * 60));
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          const durationStr = `${hours}j ${minutes}m`;
                          const billableHours = Math.max(
                            1,
                            Math.ceil(diff / (1000 * 60 * 60))
                          );
                          const biaya =
                            billableHours *
                            (TARIF[found.jenis as keyof typeof TARIF] || 0);

                          setKendaraan(found);
                          setDuration(durationStr);
                          setTotalBiaya(biaya);
                          setJamTerhitung(billableHours);
                          setShowSuccess(false);
                        } catch (error) {
                          console.error("Error loading vehicle:", error);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Gunakan Plat Ini
                    </Button>
                  </div>
                ))
              )}
            </div>
          </details>
        </Card>
      </div>
    </div>
  );
}
