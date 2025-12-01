import type { Transaction, VehicleType } from "@/types";
import { TARIF } from "@/constants";
import { StorageService } from "./storage.service";

const STORAGE_KEY = "parkir_transactions";

/**
 * Transaction Service
 * Handles all business logic related to parking transactions
 */

export class TransactionService {
  static getAll(): Transaction[] {
    return StorageService.get<Transaction[]>(STORAGE_KEY, []);
  }

  static getById(id: string): Transaction | undefined {
    const transactions = this.getAll();
    return transactions.find((t) => t.id === id);
  }

  static create(platNomor: string, jenis: VehicleType): Transaction {
    const transactions = this.getAll();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      plat_nomor: platNomor,
      jenis,
      waktu_masuk: Date.now(),
      waktu_keluar: null,
      biaya: 0,
      status: "PARKIR",
    };

    transactions.push(newTransaction);
    StorageService.set(STORAGE_KEY, transactions);
    return newTransaction;
  }

  static complete(id: string): Transaction | null {
    const transactions = this.getAll();
    const transaction = transactions.find((t) => t.id === id);

    if (!transaction) return null;

    const waktuKeluar = Date.now();
    const durasi = Math.ceil((waktuKeluar - transaction.waktu_masuk) / 3600000);
    const biaya = durasi * TARIF[transaction.jenis];

    transaction.waktu_keluar = waktuKeluar;
    transaction.biaya = biaya;
    transaction.status = "SELESAI";

    StorageService.set(STORAGE_KEY, transactions);
    return transaction;
  }

  static delete(id: string): boolean {
    const transactions = this.getAll();
    const filtered = transactions.filter((t) => t.id !== id);

    if (filtered.length === transactions.length) return false;

    StorageService.set(STORAGE_KEY, filtered);
    return true;
  }

  static getActive(): Transaction[] {
    return this.getAll().filter((t) => t.status === "PARKIR");
  }

  static getCompleted(): Transaction[] {
    return this.getAll().filter((t) => t.status === "SELESAI");
  }
}
