import { getDb, Biller } from '../mockDb';

export const BillersService = {
  async getBillers(): Promise<Biller[]> {
    const db = await getDb();
    return db.billers;
  },

  async getBillerById(id: string): Promise<Biller | null> {
    const db = await getDb();
    return db.billers.find(b => b.id === id) || null;
  },
};
