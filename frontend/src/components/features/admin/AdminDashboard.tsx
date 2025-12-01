import { useState, useEffect, useCallback } from "react";
import {
  Car,
  DollarSign,
  QrCode,
  ArrowLeft,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { NavigationProps } from "@/types";
import { formatDuration } from "@/hooks";
import {
  getKendaraanAktif,
  getTransaksiHariIni,
  type KendaraanAktif,
  type TransaksiData,
} from "@/services/parkir.service";
import { AuthService } from "@/services/auth.service";
import useRealtimeKendaraan from "@/hooks/useRealtimeKendaraan";

export function AdminDashboard({ onNavigate }: NavigationProps) {
  const [activeVehicles, setActiveVehicles] = useState<KendaraanAktif[]>([]);
  const [completedToday, setCompletedToday] = useState<TransaksiData[]>([]);
  const [durations, setDurations] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [active, completed] = await Promise.all([
        getKendaraanAktif(),
        getTransaksiHariIni(),
      ]);
      setActiveVehicles(active);
      setCompletedToday(completed);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Setup realtime updates
  useRealtimeKendaraan(loadData);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDurations: { [key: number]: string } = {};

      activeVehicles.forEach((v) => {
        const jamMasuk = new Date(v.jam_masuk).getTime();
        newDurations[v.id] = formatDuration(jamMasuk);
      });

      setDurations(newDurations);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeVehicles]);

  const totalRevenue = completedToday.reduce(
    (sum, t) => sum + t.total_bayar,
    0
  );
  const totalVehicles = activeVehicles.length;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-indigo-600">Dashboard Admin</h1>
            <p className="text-muted-foreground">Monitor parkir real-time</p>
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
            >
              Logout
            </Button>
            <Button onClick={() => onNavigate("driver")} variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Kendaraan Parkir</p>
                <h2 className="mt-2">{totalVehicles}</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Pendapatan Hari Ini</p>
                <h2 className="mt-2">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Total Transaksi</p>
                <h2 className="mt-2">{completedToday.length}</h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Kendaraan Aktif</h3>
              <p className="text-muted-foreground">
                Update otomatis setiap detik
              </p>
            </div>
            <Button onClick={() => onNavigate("scanner")}>
              <QrCode className="w-4 h-4 mr-2" />
              Buka Scanner
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plat Nomor</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : activeVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      Tidak ada kendaraan parkir saat ini
                    </TableCell>
                  </TableRow>
                ) : (
                  activeVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="tracking-wider">
                        {vehicle.plat_nomor}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vehicle.jenis}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(vehicle.jam_masuk).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        WIB
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {durations[vehicle.id] || "0j 0m"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{vehicle.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6">
            <h3>Riwayat Hari Ini</h3>
            <p className="text-muted-foreground">
              Transaksi yang sudah selesai
            </p>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plat Nomor</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Jam Keluar</TableHead>
                  <TableHead>Biaya</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : completedToday.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      Belum ada transaksi hari ini
                    </TableCell>
                  </TableRow>
                ) : (
                  completedToday.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="tracking-wider">
                        {transaction.plat_nomor}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.jenis}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.jam_keluar).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}{" "}
                        WIB
                      </TableCell>
                      <TableCell>
                        Rp {transaction.total_bayar.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">SELESAI</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
