import { useState, useEffect } from "react";
import type { Transaction } from "@/types";
import { TransactionService } from "@/services";

/**
 * Hook for managing parking transactions
 * Provides real-time updates via polling
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = () => {
      const data = TransactionService.getAll();
      setTransactions(data);
    };

    loadTransactions();
    const interval = setInterval(loadTransactions, 1000);

    return () => clearInterval(interval);
  }, []);

  const addTransaction = (transaction: Transaction) => {
    const updated = [...transactions, transaction];
    setTransactions(updated);
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    setTransactions(updated);
  };

  return { transactions, addTransaction, updateTransaction };
}
