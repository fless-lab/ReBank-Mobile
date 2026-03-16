import { getDb, Contact } from '../mockDb';

export const ContactsService = {
  async getContacts(): Promise<Contact[]> {
    const db = await getDb();
    return db.contacts;
  },

  async getContactByEmail(email: string): Promise<Contact | null> {
    const db = await getDb();
    return db.contacts.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getContactById(id: string): Promise<Contact | null> {
    const db = await getDb();
    return db.contacts.find(c => c.id === id) || null;
  },
};
