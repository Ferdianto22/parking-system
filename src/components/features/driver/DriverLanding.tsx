import { useState } from "react";
import { Car, Bike, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { VehicleType, NavigationProps } from "@/types";
import { tambahKendaraan } from "@/services/parkir.service";

export function DriverLanding({ onNavigate }: NavigationProps) {
  const [jenis, setJenis] = useState<VehicleType>("Motor");
  const [platNomor, setPlatNomor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAmbilTiket = async () => {
    const normalizedPlate = platNomor.trim().toUpperCase();

    if (!normalizedPlate) {
      alert("Mohon masukkan plat nomor!");
      return;
    }

    // Validate plate format (basic Indonesian format)
    const plateRegex = /^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{1,3}$/;
    if (!plateRegex.test(normalizedPlate)) {
      alert("Format plat nomor tidak valid! Contoh: B 1234 XYZ");
      return;
    }

    setLoading(true);

    try {
      // Create new transaction in Supabase
      const kendaraan = await tambahKendaraan({
        plat: normalizedPlate,
        jenis: jenis,
      });

      // Navigate to ticket page with vehicle UUID
      onNavigate("ticket", kendaraan.id);
    } catch (error: any) {
      console.error("Error creating ticket:", error);
      alert(error.message || "Gagal membuat tiket. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600 text-white mb-4">
            <Car className="w-10 h-10" />
          </div>
          <h1 className="text-indigo-600">QRPark</h1>
          <p className="text-muted-foreground">Sistem Parkir Digital</p>
        </div>

        <div className="space-y-3">
          <Label>Pilih Jenis Kendaraan</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant={jenis === "Motor" ? "default" : "outline"}
              className="h-24 flex-col gap-2"
              onClick={() => setJenis("Motor")}
            >
              <Bike className="w-8 h-8" />
              <span>Motor</span>
            </Button>
            <Button
              type="button"
              variant={jenis === "Mobil" ? "default" : "outline"}
              className="h-24 flex-col gap-2"
              onClick={() => setJenis("Mobil")}
            >
              <Car className="w-8 h-8" />
              <span>Mobil</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="plat">Plat Nomor</Label>
          <Input
            id="plat"
            placeholder="Contoh: B 1234 XYZ"
            value={platNomor}
            onChange={(e) => setPlatNomor(e.target.value)}
            className="h-14 text-center uppercase"
            maxLength={15}
          />
        </div>

        <Button
          onClick={handleAmbilTiket}
          className="w-full h-16"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            "AMBIL TIKET"
          )}
        </Button>

        <div className="text-center pt-4">
          <a
            href="#/admin/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Area Admin →
          </a>
        </div>
      </Card>
    </div>
  );
}
