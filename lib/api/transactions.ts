import { getDb, saveDb, Transaction } from '../mockDb';

export const TransactionsService = {
  async getBalance() {
    const db = await getDb();
    return db.balance;
  },

  async getRecentTransactions(limit = 15): Promise<Transaction[]> {
    const db = await getDb();
    return db.transactions.slice(0, limit);
  },

  async getTransactionDetails(id: string): Promise<Transaction | null> {
    const db = await getDb();
    return db.transactions.find(tx => tx.id === id) || null;
  },

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    const db = await getDb();
    return db.transactions.filter(tx => tx.category === category);
  },
};
