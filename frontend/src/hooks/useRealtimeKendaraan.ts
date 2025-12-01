import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useRealtimeKendaraan(fetchDataKembali: () => void) {
  useEffect(() => {
    // Create channel subscription
    const channel = supabase
      .channel("realtime-parkir")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "kendaraan_aktif",
        },
        (payload) => {
          console.log("Ada perubahan data kendaraan_aktif:", payload);
          // Call refresh data function
          fetchDataKembali();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transaksi",
        },
        (payload) => {
          console.log("Ada perubahan data transaksi:", payload);
          // Call refresh data function
          fetchDataKembali();
        }
      )
      .subscribe();

    // Cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDataKembali]);
}
