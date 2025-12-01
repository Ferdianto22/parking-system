import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Download, Clock, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { NavigationProps } from "@/types";
import { useDuration } from "@/hooks";
import {
  getKendaraanById,
  type KendaraanAktif,
} from "@/services/parkir.service";

interface DriverTicketProps extends NavigationProps {
  ticketId: string;
}

export function DriverTicket({ ticketId, onNavigate }: DriverTicketProps) {
  const [kendaraan, setKendaraan] = useState<KendaraanAktif | null>(null);
  const [loading, setLoading] = useState(true);
  const duration = useDuration(
    kendaraan?.jam_masuk ? new Date(kendaraan.jam_masuk).getTime() : Date.now()
  );

  useEffect(() => {
    const loadKendaraan = async () => {
      try {
        console.log("Loading ticket with ID:", ticketId);

        if (!ticketId || ticketId.trim() === "") {
          console.error("Invalid ticket ID:", ticketId);
          setKendaraan(null);
          setLoading(false);
          return;
        }

        console.log("Fetching vehicle with UUID:", ticketId);
        const data = await getKendaraanById(ticketId);
        console.log("Vehicle data loaded:", data);
        setKendaraan(data);
      } catch (error: any) {
        console.error("Error loading vehicle:", error);
        console.error("Error message:", error.message);
        setKendaraan(null);
      } finally {
        setLoading(false);
      }
    };

    loadKendaraan();
    // Refresh every 5 seconds to update status
    const interval = setInterval(loadKendaraan, 5000);

    return () => clearInterval(interval);
  }, [ticketId]);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Memuat tiket...</p>
        </Card>
      </div>
    );
  }

  if (!kendaraan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Tiket tidak ditemukan atau sudah selesai
          </p>
          <Button onClick={() => onNavigate("driver")} className="mt-4">
            Kembali
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-green-600">Tiket Berhasil Dibuat!</h2>
          <p className="text-muted-foreground">
            Simpan QR Code ini untuk keluar parkir
          </p>
        </div>

        <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <QRCodeSVG value={ticketId} size={200} level="H" />
        </div>

        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Plat Nomor:</span>
            <span className="tracking-wider">{kendaraan.plat_nomor}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Jenis:</span>
            <Badge variant="secondary" className="gap-1">
              <Car className="w-4 h-4" />
              {kendaraan.jenis}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Jam Masuk:</span>
            <span>
              {new Date(kendaraan.jam_masuk).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}{" "}
              WIB
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Durasi:
            </span>
            <span className="tabular-nums text-indigo-600">{duration}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Tiket
          </Button>

          <Button
            onClick={() => onNavigate("driver")}
            variant="ghost"
            className="w-full"
          >
            Kembali ke Beranda
          </Button>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">ID: {ticketId}</p>
        </div>
      </Card>
    </div>
  );
}
