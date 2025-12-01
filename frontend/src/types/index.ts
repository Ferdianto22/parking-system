export type View = "driver" | "ticket" | "admin" | "scanner" | "login";

export type VehicleType = "Motor" | "Mobil";

export type TransactionStatus = "PARKIR" | "SELESAI";

export interface Transaction {
  id: string;
  plat_nomor: string;
  jenis: VehicleType;
  waktu_masuk: number;
  waktu_keluar: number | null;
  biaya: number;
  status: TransactionStatus;
}

export interface NavigationProps {
  onNavigate: (view: View, id?: string) => void;
}
