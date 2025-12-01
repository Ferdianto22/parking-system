/**
 * Helper functions for the parking system
 */

/**
 * Clear all parking data (for testing/reset)
 */
export function clearAllParkingData(): void {
  if (
    confirm("Hapus semua data parkir? Tindakan ini tidak dapat dibatalkan!")
  ) {
    localStorage.removeItem("parkir_transactions");
    window.location.reload();
  }
}

/**
 * Get parking statistics
 */
export function getParkingStats() {
  const transactions = JSON.parse(
    localStorage.getItem("parkir_transactions") || "[]"
  );

  const active = transactions.filter((t: any) => t.status === "PARKIR");
  const completed = transactions.filter((t: any) => t.status === "SELESAI");
  const totalRevenue = completed.reduce(
    (sum: number, t: any) => sum + t.biaya,
    0
  );

  return {
    active: active.length,
    completed: completed.length,
    totalRevenue,
    allTransactions: transactions,
  };
}

/**
 * Export parking data as JSON
 */
export function exportParkingData(): void {
  const data = localStorage.getItem("parkir_transactions") || "[]";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `parking-data-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
