import { getDb, saveDb } from '../mockDb';

export const TransfersService = {
  /** Send money to a contact / friend */
  async sendToFriend(amount: number, recipientName: string) {
    const db = await getDb();
    if (db.balance < amount) throw new Error('Insufficient funds.');

    db.balance -= amount;
    db.accounts[0].balance -= amount; // deduct from checking

    const tx = {
      id: `tx_${Date.now()}`,
      title: `Transfer to ${recipientName}`,
      date: new Date().toISOString(),
      amount: -amount,
      icon: 'account-arrow-right' as string,
      category: 'transfer' as const,
      recipient: recipientName,
      status: 'completed' as const,
    };
    db.transactions.unshift(tx);
    await saveDb(db);
    return { success: true, transaction: tx };
  },

  /** Move money between own accounts */
  async betweenAccounts(fromId: string, toId: string, amount: number) {
    const db = await getDb();
    const from = db.accounts.find(a => a.id === fromId);
    const to = db.accounts.find(a => a.id === toId);
    if (!from || !to) throw new Error('Account not found.');
    if (from.balance < amount) throw new Error('Insufficient funds in source account.');

    from.balance -= amount;
    to.balance += amount;
    // update total balance (sum of all accounts)
    db.balance = db.accounts.reduce((s, a) => s + a.balance, 0);

    const tx = {
      id: `tx_${Date.now()}`,
      title: `${from.name} → ${to.name}`,
      date: new Date().toISOString(),
      amount: -amount,
      icon: 'swap-horizontal' as string,
      category: 'transfer' as const,
      recipient: to.name,
      status: 'completed' as const,
    };
    db.transactions.unshift(tx);
    await saveDb(db);
    return { success: true, transaction: tx };
  },

  /** Pay a bill */
  async payBill(billerId: string) {
    const db = await getDb();
    const biller = db.billers.find(b => b.id === billerId);
    if (!biller) throw new Error('Biller not found.');
    if (db.balance < biller.amount) throw new Error('Insufficient funds.');

    db.balance -= biller.amount;
    db.accounts[0].balance -= biller.amount;
    biller.lastPaid = new Date().toISOString();

    const tx = {
      id: `tx_${Date.now()}`,
      title: biller.name,
      date: new Date().toISOString(),
      amount: -biller.amount,
      icon: biller.icon,
      category: 'bill' as const,
      recipient: biller.name,
      status: 'completed' as const,
    };
    db.transactions.unshift(tx);
    await saveDb(db);
    return { success: true, transaction: tx, amountPaid: biller.amount };
  },

  /** International transfer with mock fees */
  async internationalTransfer(amount: number, recipientName: string, country: string) {
    const db = await getDb();
    const fee = Math.round(amount * 0.025 * 100) / 100; // 2.5% fee
    const total = amount + fee;
    if (db.balance < total) throw new Error('Insufficient funds (including fees).');

    db.balance -= total;
    db.accounts[0].balance -= total;

    const tx = {
      id: `tx_${Date.now()}`,
      title: `International: ${country}`,
      date: new Date().toISOString(),
      amount: -total,
      icon: 'earth' as string,
      category: 'international' as const,
      recipient: recipientName,
      status: 'completed' as const,
    };
    db.transactions.unshift(tx);
    await saveDb(db);
    return { success: true, transaction: tx, fee, exchangeRate: 0.92 };
  },
};
