import { supabase } from "../lib/supabase";

export interface KendaraanInput {
  plat: string;
  jenis: "Motor" | "Mobil";
}

export interface KendaraanAktif {
  id: string; // UUID
  plat_nomor: string;
  jenis: string;
  jam_masuk: string;
  status: string;
  created_at?: string;
}

export interface TransaksiData {
  id: string; // UUID
  id_kendaraan: string; // UUID
  plat_nomor: string;
  jenis: string;
  jam_masuk: string;
  jam_keluar: string;
  total_menit: number; // Actual column name in database
  total_bayar: number;
  created_at?: string;
}

// 1. Incoming Vehicle Input
export async function tambahKendaraan({ plat, jenis }: KendaraanInput) {
  // Check for duplicate active parking
  const { data: existing, error: checkError } = await supabase
    .from("kendaraan_aktif")
    .select("*")
    .eq("plat_nomor", plat)
    .eq("status", "PARKIR")
    .maybeSingle();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking duplicate:", checkError);
    throw checkError;
  }

  if (existing) {
    throw new Error(`Plat nomor ${plat} masih parkir! Tidak bisa parkir 2x.`);
  }

  const { data, error } = await supabase
    .from("kendaraan_aktif")
    .insert([
      {
        plat_nomor: plat,
        jenis: jenis,
        status: "PARKIR",
      },
    ])
    .select();

  if (error) {
    console.error("Gagal input:", error);
    throw error;
  }

  return data[0];
}

// 2. Get Data (Dashboard) - Active vehicles
export async function getKendaraanAktif() {
  const { data, error } = await supabase
    .from("kendaraan_aktif")
    .select("*")
    .eq("status", "PARKIR")
    .order("jam_masuk", { ascending: false });

  if (error) throw error;
  return data as KendaraanAktif[];
}

// 3. Get completed transactions for today
export async function getTransaksiHariIni() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .gte("jam_keluar", todayISO)
    .order("jam_keluar", { ascending: false });

  if (error) throw error;
  return data as TransaksiData[];
}

// 4. Get vehicle by ID (UUID)
export async function getKendaraanById(id: string) {
  console.log("getKendaraanById called with ID:", id);

  const { data, error } = await supabase
    .from("kendaraan_aktif")
    .select("*")
    .eq("id", id)
    .eq("status", "PARKIR")
    .single();

  console.log("Query result:", { data, error });

  if (error) {
    console.error("Database error:", error);
    if (error.code === "PGRST116") {
      throw new Error("Tiket tidak ditemukan atau sudah selesai");
    }
    throw error;
  }

  return data as KendaraanAktif;
}

// 4b. Get vehicle by Plate Number (for exit gate)
export async function getKendaraanByPlat(platNomor: string) {
  const normalizedPlate = platNomor.trim().toUpperCase();

  const { data, error } = await supabase
    .from("kendaraan_aktif")
    .select("*")
    .eq("plat_nomor", normalizedPlate)
    .eq("status", "PARKIR")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error(
        `Plat nomor ${normalizedPlate} tidak ditemukan atau sudah keluar parkir`
      );
    }
    throw error;
  }

  return data as KendaraanAktif;
}

// 5. Out Vehicle - Process payment and exit
export async function keluarParkir(id: string, tarifPerJam: number) {
  // 1. Get vehicle data
  const { data: kendaraan, error: errFetch } = await supabase
    .from("kendaraan_aktif")
    .select("*")
    .eq("id", id)
    .eq("status", "PARKIR")
    .single();

  if (errFetch) {
    if (errFetch.code === "PGRST116") {
      throw new Error("Tiket tidak ditemukan atau sudah selesai dibayar");
    }
    throw errFetch;
  }

  const jamMasuk = new Date(kendaraan.jam_masuk);
  const jamKeluar = new Date();

  // Calculate duration (in minutes)
  const diffMs = jamKeluar.getTime() - jamMasuk.getTime();
  const totalMenit = Math.floor(diffMs / 60000);

  // Calculate fee (round up per hour, minimum 1 hour)
  const jamTerhitung = Math.max(1, Math.ceil(totalMenit / 60));
  const totalBayar = jamTerhitung * tarifPerJam;

  console.log("Parking duration:", {
    jamMasuk,
    jamKeluar,
    diffMs,
    totalMenit,
    jamTerhitung,
    totalBayar,
  });

  // 2. Save to Transaction table (History)
  const { error: errInsert } = await supabase.from("transaksi").insert({
    id_kendaraan: kendaraan.id,
    plat_nomor: kendaraan.plat_nomor,
    jenis: kendaraan.jenis,
    jam_masuk: kendaraan.jam_masuk,
    jam_keluar: jamKeluar.toISOString(),
    total_menit: totalMenit, // Actual column name in database
    total_bayar: totalBayar,
  });

  if (errInsert) throw errInsert;

  // 3. Update vehicle status to KELUAR
  const { error: errUpdate } = await supabase
    .from("kendaraan_aktif")
    .update({ status: "KELUAR" })
    .eq("id", id);

  if (errUpdate) throw errUpdate;

  return { totalBayar, totalMenit, jamTerhitung };
}
