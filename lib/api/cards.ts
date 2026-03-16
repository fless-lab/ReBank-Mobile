import { getDb, saveDb, BankCard } from '../mockDb';

export const CardsService = {
  async getCards(): Promise<BankCard[]> {
    const db = await getDb();
    return db.cards;
  },

  async getCardDetails(cardId: string): Promise<BankCard | null> {
    const db = await getDb();
    return db.cards.find(c => c.id === cardId) || null;
  },

  async toggleCardLock(cardId: string): Promise<BankCard> {
    const db = await getDb();
    const card = db.cards.find(c => c.id === cardId);
    if (!card) throw new Error('Card not found');
    card.isLocked = !card.isLocked;
    await saveDb(db);
    return card;
  },
};
